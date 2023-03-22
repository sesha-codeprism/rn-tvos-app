import { find } from "lodash";
import { NativeModules } from "react-native";
import { FeedContents } from "../../src/components/MFSwimLane";
import { config } from "../../src/config/config";
import { lang } from "../../src/config/constants";
import { Layout } from "../../src/utils/analytics/consts";
import { findChannelByStationId, massageCatchupFeed, massageLiveFeed } from "../../src/utils/assetUtils";
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
  const massagedData = massageCatchupFeed(newItems || [], type);
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

export const getCatchupPivots = async (id?: string, params?: any) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}/v3/libraries/catchup/pivots`;
  const paramsObject = { ...params, $groups: GLOBALS.store?.rightsGroupIds, storeId: DefaultStore?.Id, $lang: lang }
  const response = await GET({
    url: url,
    params: paramsObject,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  return response;
}

export const getCatchupPivotItems = async (id?: string, params?: any) => {
  const pivots = await getCatchupPivots();
  const genre = getIdFromURI(id!);
  const pivoteCategory = pivots.data?.find((category: any) => category.Id === "Genre")
  const pivotId = pivoteCategory?.Pivots?.find((pivot: any) => pivot.Name === genre)
  const { $top, $skip } = params;
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}/v3/feeds/catchup/pivot-items`;
  const paramsObject = {
    ...params, $groups: GLOBALS.store?.rightsGroupIds, storeId: DefaultStore?.Id, $lang: lang, pivots: pivotId ? pivotId : "",
    $orderBy: config.defaultOrderBy,
    $top: $top || config.defaultFeedItemsCount,
    $skip: $skip || config.defaultSkip,
  }
  const response = await GET({
    url: url,
    params: paramsObject,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  const items = response.data;
  if (!items || !items.length) {
    return null;
  }
  const channelMap = GLOBALS.channelMap

  const sourceType = items?.length && items[0]?.SourceType || SourceType.CATCHUP;
  const feedContents: any = [];
  const nestedItem: any = {};
  const stationIds: string[] = [];
  items?.map((item: any) => {
    if (!stationIds.includes(item.StationId)) {
      stationIds.push(item.StationId);
    }

    item["channel"] =
      (item.StationId &&
        findChannelByStationId(
          item.StationId,
          undefined,
          undefined,
          channelMap
        ).channel) ||
      undefined;

    if (item.StationId in nestedItem) {
      nestedItem[item.StationId].push(item);
    } else {
      nestedItem[item.StationId] = [item];
    }
  });
  for (let id of stationIds) {
    let feeds: any = {};
    const { channel = undefined } =
      findChannelByStationId(id, undefined, undefined, channelMap) ||
      {};

    feeds = { ...channel };
    let name;
    if (channel?.Number) {
      name = channel?.Number;
    }
    if (name && channel?.CallLetters) {
      name += ` | ${channel?.CallLetters}`;
    } else {
      name = channel?.CallLetters;
    }
    if (name) {
      feeds["Name"] = name;
    }
    feeds["NavigationTargetVisibility"] =
      GLOBALS.selectedFeed?.NavigationTargetVisibility;
    feeds["ContextualNavigationTargetUri"] = "restartTvGallery";
    feeds["Layout"] = Layout.Gallery;

    feedContents.push(
      // {
      //   feed: feeds,
      //   items: massageCatchupFeed(nestedItem[id], sourceType)
      // }
      new FeedContents(feeds, massageCatchupFeed(nestedItem[id], sourceType))
    );
  }
  return feedContents;
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
    { prefix: BASE + '/channelRights/', getter: getChannelRights },
    { prefix: BASE + '/catchup/pivotitems/', getter: getCatchupPivotItems }
  ];
  return liveUdls;
};
