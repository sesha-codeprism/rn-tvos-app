import { find } from "lodash";
import { NativeModules } from "react-native";
import { mapQueryStatusFilter } from "react-query/types/core/utils";
import { config } from "../../src/config/config";
import { lang } from "../../src/config/constants";
import { findChannelByStationId, massageLiveFeed } from "../../src/utils/assetUtils";
import { SourceType } from "../../src/utils/common";
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
  return new Promise(async (resolve, reject) => {

    if (!GLOBALS.currentSlots) {
      console.warn("No current slots")
      return undefined
    }

    const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + '/my-stations';
    const channelResponse = await GET({
      url: url,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      },
    });
    const sourceType = SourceType.LIVE;
    //TODO: filterSearchItems & genrePivot should be re-written
    const filterSearchItems = undefined;
    const genrePivot: any = [];
    const myStationsList: any = [];
    const skip = 0, top = 16;
    return NativeModules.MKGuideBridgeManager.getChannelMapInfo(async (result: any) => {
      const channelRights = await getChannelRights();
      const memoizedChannelMap = getChannelMap(result, channelRights?.data, DefaultStore.Id, "en-US");
      const nowNextSchedules = buildNowNextMap(GLOBALS.currentSlots, memoizedChannelMap);
      const myStationsSlice = channelResponse.data.Stations.slice(skip, skip + top);
      myStationsSlice.map((station: any) => nowNextSchedules[station.StationId]?.now)
      myStationsSlice.forEach((station: any) => {
        const stationId: string = station?.StationId
        const channelInfo = findChannelByStationId(stationId, undefined, false, memoizedChannelMap);
        if (channelInfo && channelInfo.channel) {
          const myStationModel = createLiveShowcardModel(channelInfo.channel, memoizedChannelMap, nowNextSchedules, "myStations", { $top: 16 });
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
      resolve(massagedData);
      return massagedData;
    })
  })
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
  const massagedData = massageLiveFeed(response.data, SourceType.LIVE);
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
  return new Promise(async (resolve, reject) => {

    if (!GLOBALS.currentSlots) {
      console.warn("No current slots")
      return undefined
    }
    const sourceType = SourceType.LIVE;
    //TODO: filterSearchItems & genrePivot should be re-written
    console.log("ID", id);
    const genrePivot: any = [];
    const params = {
      id: getIdFromURI(id) || 'trending',
      $top: config.defaultFeedItemsCount,
      $skip: config.defaultSkip,
      $groups: GLOBALS.store?.rightsGroupIds,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
      isTrending: true
    };
    return NativeModules.MKGuideBridgeManager.getChannelMapInfo(async (result: any) => {
      const channelRights = await getChannelRights();
      const memoizedChannelMap = getChannelMap(result, channelRights?.data, DefaultStore.Id, "en-US");
      const nowNextScheduleMap = buildNowNextMap(GLOBALS.currentSlots, memoizedChannelMap);
      const trendingStationIds = await getDiscoveryFeedItems("", params);
      if (!nowNextScheduleMap || !trendingStationIds) {
        return;
      }
      const newTrendingList: any = [];
      const stationIds = trendingStationIds;
      for (let stationId of stationIds) {
        stationId = stationId.StationId
        const channelInfo = findChannelByStationId(stationId, undefined, false, memoizedChannelMap);
        if (channelInfo && channelInfo.channel) {
          const newTrendingModel = createLiveShowcardModel(channelInfo.channel, memoizedChannelMap, nowNextScheduleMap, "trending", { $top: 16 });
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
      console.log("newTrendingList", newTrendingList)
      const massagedData = massageLiveFeed(newTrendingList, sourceType)
      console.log("After massaging", massagedData, "is returned")
      resolve(massagedData)
      return massagedData;
    })
  })

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
