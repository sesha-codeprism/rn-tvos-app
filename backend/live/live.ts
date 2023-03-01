import { find } from "lodash";
import { NativeModules } from "react-native";
import { config } from "../../src/config/config";
import { lang } from "../../src/config/constants";
import { findChannelByStationId, massageLiveFeed } from "../../src/utils/assetUtils";
import { SourceType } from "../../src/utils/common";
import { convertISOStringToTimeStamp } from "../../src/utils/dataUtils";
import DateUtils from "../../src/utils/dateUtils";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { getIdFromURI } from "../../src/utils/helpers";
import { buildNowNextMap, createLiveShowcardModel, getChannelMap, makeSlabUrl, updateVariant } from "../../src/utils/live/LiveUtils";
import { getDiscoveryFeedItems } from "../discovery/discovery";
import { GET } from "../utils/common/cloud";
import { parseUri } from "../utils/url/urlUtil";
// const getChannelMap = async (id: string, params: Object) => {
//   const res = {
//     name: "live/channelMap",
//     count: 20,
//     response: [1, 2, 3],
//   };
//   return res;
// };

const getCatchUp = async (id: string, params: Object) => {
  const res = {
    name: "live/getCatchUp",
    count: 20,
    response: [1, 2, 3],
  };
  return res;
};

const getMyChannels = async (id: string, params?: any) => {
  if (!GLOBALS.currentSlots && !GLOBALS.channelMap) {
    console.log("Required data not available to get channels");
    return undefined;
  }
  const sourceType = SourceType.LIVE;
  const genrePivot: any = [];
  const myStationsList: any = [];
  const skip = 0, top = 16;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + '/my-stations';
  const channelResponse = await GET({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  const myStationsSlice = channelResponse.data.Stations.slice(skip, skip + top);
  myStationsSlice.map((station: any) => GLOBALS.nowNextMap[station.StationId]?.now)
  myStationsSlice.forEach((station: any) => {
    const stationId: string = station?.StationId
    const channelInfo = findChannelByStationId(stationId, undefined, false, GLOBALS.channelMap);
    if (channelInfo && channelInfo.channel) {
      const myStationModel = createLiveShowcardModel(channelInfo.channel, GLOBALS.channelMap, GLOBALS.nowNextMap, "myStations", { $top: 16 });
      const genresList = myStationModel?.Genres;
      if (genresList && genrePivot.length > 0) {
        const localizedGenres = genresList.map(function (g: any) {
          return {
            Name: (find(genrePivot, function (p) {
              return p.Id.indexOf(g.Id) > -1
            }) || g).Name,
            Id: g.Id
          }
        });
        myStationModel["Genres"] = localizedGenres;
      }
      myStationsList.push(myStationModel);
    }
  });
  const massagedData = massageLiveFeed(myStationsList, sourceType, "onNow")
  return massagedData;
}

const getPlayableChannels = async (id: string, params: any) => {
  const { genre } = params;
  if (!GLOBALS.nowNextMap) {
    console.warn("No current information to showcase");
    return undefined
  }
  const nowNextScheduleMap = GLOBALS.nowNextMap;
  let filterdNowNextScheduleMap: any = {};

  //Genre based content
  if (genre) {
    const filteredKeys = Object.keys(nowNextScheduleMap).filter((key) => nowNextScheduleMap[key].now);
    filteredKeys.map((key: any) => filterdNowNextScheduleMap[key] = nowNextScheduleMap[key])
  } else {
    filterdNowNextScheduleMap = nowNextScheduleMap
  }
  //TODO: Removing this code for now.. check and re-enable it lateron..
  // if (!filterdNowNextScheduleMap || !filterSearchItems || !nowNextScheduleMap) {
  //   return;
  // }
  //@ts-ignore
  const variantData = updateVariant(GLOBALS.channelMap, filterdNowNextScheduleMap, {}, 0, 0, genre);
  return massageLiveFeed(variantData, SourceType.LIVE, "onNow");


}

export const getPlayableMovieChannels = async (id: string, params?: any) => {
  const currentSlots = GLOBALS.currentSlots;
  if (!currentSlots) {
    console.warn("No current slots");
    return undefined
  }
  const genre = id.split("/").pop();
  const genreFilteredSchedules = genre ? currentSlots?.filter((schedule: any) => {
    return schedule.Genres?.some((genres: any) => genres.Name === genre)
  }) : currentSlots;
  const massagedData = massageLiveFeed(genreFilteredSchedules, SourceType.LIVE);
  return massagedData
}

export const gethubRestartTvShowcards = async (id: string, params: any) => {
  const day = new Date().toISOString().split("T")[0];
  const channelMapId = GLOBALS.userAccountInfo?.ChannelMapId;
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.scheduleCache || '') + `catchup-data-${day}/channelmap-hub-Popularity-${channelMapId}.gz`;
  const response = await GET({
    url: uri,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  const type: SourceType = SourceType.CATCHUP;
  const nowMilliseconds = new Date().getTime();
  const recentlyAiredItems = find(response.data, function (slot: any) {
    const slotStartTimeMilliseconds = convertISOStringToTimeStamp(
      slot.StartTime
    );
    const slotEndTimeMilliseconds = convertISOStringToTimeStamp(
      slot.EndTime
    );
    return (
      slotStartTimeMilliseconds <= nowMilliseconds &&
      nowMilliseconds < slotEndTimeMilliseconds
    );
  });
  const validCatchupStations: string[] = GLOBALS.channelMap?.getValidCatchupStationIds();
  const newItems = recentlyAiredItems?.Schedules?.filter((item: any) => {
    if (
      item.StationId &&
      validCatchupStations?.includes(item.StationId)
    ) {
      item["channel"] =
        (item.StationId &&
          findChannelByStationId(
            item.StationId,
            undefined,
            undefined,
            GLOBALS.channelMap
          ).channel) ||
        undefined;
      return item;
    }
  });
  const massagedData = massageLiveFeed(newItems || [], type);
  return massagedData
}

export const getChannelRights = async (id?: string, params?: any) => {
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + '/rights/live/channel-map';
  try {
    const response = await GET({
      url: uri,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      },
    });
    return response;
  } catch (e) {
    console.error("Cannot getChannelRights due to ", e);
    return undefined;
  }

}

export const getLiveTrends = async (id: string, params: any) => {
  if (!GLOBALS.currentSlots && !GLOBALS.channelMap) {
    console.log("Required information not available");
    return undefined;
  }
  const sourceType = SourceType.LIVE;
  //TODO: filterSearchItems & genrePivot should be re-written
  console.log("ID", id);
  const genrePivot: any = [];
  const paramsObject = {
    id: getIdFromURI(id) || 'trending',
    $top: config.defaultFeedItemsCount,
    $skip: config.defaultSkip,
    $groups: GLOBALS.store?.rightsGroupIds,
    //@ts-ignore
    $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
    storeId: DefaultStore.Id,
    isTrending: true
  };
  const trendingStationIds = await getDiscoveryFeedItems("", paramsObject);
  if (!GLOBALS.nowNextMap || !trendingStationIds) {
    return;
  }
  const newTrendingList: any = [];
  const stationIds = trendingStationIds;
  for (let stationId of stationIds) {
    stationId = stationId.StationId
    const channelInfo = findChannelByStationId(stationId, undefined, false, GLOBALS.channelMap);
    if (channelInfo && channelInfo.channel) {
      const newTrendingModel = createLiveShowcardModel(channelInfo.channel, GLOBALS.channelMap, GLOBALS.nowNextMap, "trending", { $top: 16 });
      const genresList = newTrendingModel?.Genres;
      if (genresList && genrePivot.length > 0) {
        const localizedGenres = genresList.map(function (g: any) {
          return {
            Name: (find(genrePivot, function (p) {
              return p.Id.indexOf(g.Id) > -1
            }) || g).Name,
            Id: g.Id
          }
        });
        newTrendingModel["Genres"] = localizedGenres;
      }
      newTrendingList.push(newTrendingModel);
    }
  }
  const massagedData = massageLiveFeed(newTrendingList, sourceType)
  return massagedData;
}

const getFavoriteChannels = async (params?: any) => {
  const uri: string = parseUri(
    GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr || ""
  );
};

export const registerLiveUdls = () => {
  const BASE = "live";

  const liveUdls = [
    // { prefix: BASE + "/channelMap/", getter: getChannelMap },
    { prefix: BASE + "/catchup/", getter: getCatchUp },
    { prefix: BASE + "/feeds/playableChannels", getter: getPlayableChannels },
    { prefix: BASE + "/myStations/", getter: getMyChannels },
    { prefix: BASE + '/feeds/playableChannels/Movie', getter: getPlayableMovieChannels },
    { prefix: BASE + '/feeds/hubRestartTvShowcards', getter: gethubRestartTvShowcards },
    { prefix: BASE + '/feeds/trending/', getter: getLiveTrends },
    { prefix: BASE + '/channelRights/', getter: getChannelRights }
  ];
  return liveUdls;
};
