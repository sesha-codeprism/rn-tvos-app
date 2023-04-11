//@ts-nocheck

import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals";
import { DELETE, GET, POST, PUT } from "../utils/common/cloud";
import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { MFGlobalsConfig } from "../configs/globals";
import { PinnedItemType } from "../../src/utils/pinnedItemType";
import { isFeatureAssigned } from "../../src/utils/helpers";
import { FeedType, NavigationTarget } from "../../src/utils/analytics/consts";
import { getUIdef } from "../../src/utils/uidefinition";
import { config } from "../../src/config/config";
import { SourceType } from "../../src/utils/common";
import { FeedContents } from "../../src/components/MFSwimLane";
import { massageDiscoveryFeed } from "../../src/utils/assetUtils";
export type PinType = "adult" | "parentalcontrol" | "purchase";
export interface SearchParam {
  searchString: string;
  $skip: number;
  $top: number;
  searchLive: boolean;
  mediaTypes?: string;
}

const browseGalleryConfig = getUIdef("BrowseGallery")?.config || {};
const browseCategoryConfig = getUIdef("BrowseCategory")?.config || {};


export const assetObject = {
  0: "programs",
  1: "season",
  2: "series",
  3: "series"
};

const getProgramPlayActions = async (itemID: string, params: any) => {
  const { id } = params;
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v4/programs/${id}/play-options/`;
  try {
    const response = await GET({
      url: uri,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
      },
    });
    return response;
  } catch (e) {
    console.error("Cannot getProgramPlayActions due to ", e);
    return undefined;
  }
};

const getSimilarPrograms = async (itemId: string, params: any) => {
  console.log(params)
  const { itemType, id } = params;
  //   const res = {
  //     name: "subscriber/getSimilarPrograms",
  //     count: 20,
  //     response: [1, 2, 3],
  //   };
  //   return res;
  // };
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v4/${(assetObject as any)[itemType || 0]
    }/${id}/similar-items/`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
}



const getYouMightLike = async (params: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/YouMightLike";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};
export const searchItems = async (params: SearchParam) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.search || "") +
    "/v4/search/items";
  const response = await GET({
    url: `${url}?partialName=${params.searchString}&storeId=${DefaultStore.Id
      }&$skip=${params.$skip}&$top=${params.$top}&searchLive=${params.searchLive
      }&$groups=${GLOBALS.bootstrapSelectors?.RightsGroupIds}&$lang=${GLOBALS.store!.onScreenLanguage?.languageCode || lang || "en-US"
      }`,
    headers: {
      authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  return response;
};

const getBookmarks = async (uri: string, params: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/Continue";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};

export const getSubscriberPins = async (params?: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/Pins";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};

const getReminders = async (params?: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/Reminders";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};
const getSubscriberSubscriptions = async (params?: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/BecauseYouWatched";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};

const getYouMightLikeByTaste = async (params?: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/YouMightLikeByTaste";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};
const getYouMightLikeBySpecificTaste = async (params?: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/YouMightLikeSpecificTaste";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};
const getLibrary = async (params?: any) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/libraries/Library";
  // "?types=Title,Catchup,Recording&atHome=true&$skip=0&$top=16&$lang=en-US&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};

const getLiveTrendingPrograms = async () => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/v4/feeds/live-trending-programs";
  const response = await GET({
    url: url,
    params: {
      types: "Title,Catchup,Recording",
      atHome: true,
      $skip: 0,
      $top: 16,
      $lang: GLOBALS.store!.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};

export const getAllSubscriberProfiles = async () => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/profiles";
  const response = await GET({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};


export const createUserProfile = async (
  name: string,
  image: any,
  optOutPersonalDataUse: boolean
) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    "/profiles";
  const response = await POST({
    url: url,
    params: {
      UserCreated: true,
      Name: name,
      Image: image,
      Images: [],
      AdditionalFields: { optOutPersonalDataUse: optOutPersonalDataUse },
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};
export const updateUserProfile = async (data: {
  Id?: string;
  Name?: string;
  Image?: any;
  AdditionalFields?: {
    optOutPersonalDataUse?: string;
    optOutPersonalDataUseDate?: string;
  };
}) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    `/profiles/${data.Id}`;
  // delete data.id;
  const response = await PUT({
    url: url,
    params: {
      ...data,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
};
export const deleteUserProfile = async (id: string) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    `/profiles/${id}`;
  const response = await DELETE({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });

  return response;
};
export const getPasscodes = async (PasscodeType: PinType) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    `/v2/passcodes/${PasscodeType}`;
  console.log("api url for passcode is", url);
  const response = await GET({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  return response;
};
export const createPasscodes = async (PasscodeType: PinType, pin: string) => {
  try {
    const url: string =
      parseUri(
        GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || ""
      ) + `/v2/passcodes/${PasscodeType}`;
    console.log("api url for passcode is", url);
    const response = await PUT({
      url: url,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      },
      params: { PasscodeType, Passcode: pin },
    });
    return response;
  } catch (error) {
    console.log("error in createPasscodes", error);
  }
};
export const changePasscodes = async (PasscodeType: PinType, pin: string) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    `/v2/passcodes/${PasscodeType}`;
  const response = await PUT({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
    params: { PasscodeType, Passcode: pin },
  });
  return response;
};
export const deleteDevice = async () => {
  const url: string = `${MFGlobalsConfig?.stsUrl}oauth/signout/liveid`;

  const response = await GET({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  return response;
};


export const getProgramSubscriberData = async (item: string, params: any) => {
  const { id } = params;
  const { accessToken } = GLOBALS.store!;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v4/programs/${id}/titles`
  try {
    const response = await GET({
      url: url,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${accessToken}"`,
        'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
      },
    });
    return response;
  } catch (e) {
    console.error("Cannot getProgramSubscriberData due to ", e);
    return undefined;
  }
}

export const getSeriesSubscriberData = async (item: string, params: any) => {
  const { id, storeId } = params;
  const { accessToken } = GLOBALS.store!;
  const isCatchUp = (isFeatureAssigned("catchupEnvironment") && isFeatureAssigned("catchup")) || false;
  const types = ["Title"];
  if (GLOBALS.userAccountInfo && GLOBALS.userAccountInfo.DvrCapability === "CloudDvr") {
    types.push("Recording");
  }
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v4/series/${id}`
  try {
    const response = await GET({
      url: url,
      params: {
        storeId: storeId,
        types: types.join(","),
        catchup: isCatchUp
      },
      headers: {
        Authorization: `OAUTH2 access_token="${accessToken}"`,
        'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
      },
    });
    return response;
  } catch (e) {
    console.error("Cannot getProgramSubscriberData due to ", e);
    return undefined;
  }
}

export const getAllPinnedItems = async (Id: string, ItemType: PinnedItemType, requestFlag?: boolean) => {
  const { accessToken } = GLOBALS.store!;
  //@ts-ignore
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + "/v4/pinned-items/?types=FavoriteChannel&$skip=0&$top=90&storeId=HubsAndFeeds-Main";
  const response = await GET({
    url: url,
    params: {
      storeId: DefaultStore.Id,
      Id: Id,
      // ItemType: ItemType
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
}

export const pinItem = async (Id: string, ItemType: PinnedItemType, requestFlag?: boolean) => {
  const { accessToken } = GLOBALS.store!;
  //@ts-ignore
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + "/v2/pinned-items/";
  const response = await POST({
    url: url,
    params: {
      storeId: DefaultStore.Id,
      Id: Id,
      ItemType: ItemType
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
}

export const unpinItem = async (Id: string, ItemType: PinnedItemType, requestFlag?: boolean) => {
  const { accessToken } = GLOBALS.store!;
  //@ts-ignore
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v2/pinned-items/${ItemType}/${Id}?storeId=${DefaultStore.Id}`;
  const response = await DELETE({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
}


export const getSeasonPlayOptions = async (iD: string, params: any) => {
  const { accessToken, rightsGroupIds } = GLOBALS.store! || undefined;
  const { seriesID, seasonID } = params;
  // const catchup =
  // (GLOBALS.bootstrapSelectors.hasFeature(state, "catchupEnvironment") &&
  //   bootstrapSelectors.hasFeature(state, "catchup")) ||
  // false;
  const isCatchUp = (isFeatureAssigned("catchupEnvironment") && isFeatureAssigned("catchup")) || false
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + `/v3/series/${seriesID}/seasons/${seasonID}/play-options`
  const types = ["Title"];
  //@ts-ignore
  if (GLOBALS.userAccountInfo && GLOBALS.userAccountInfo.DvrCapability === "CloudDvr") {
    types.push("Recording");
  }

  const response = await GET({
    url: url,
    params: {
      storeId: DefaultStore.Id,
      groups: rightsGroupIds,
      types: types.join(","),
      catchup: isCatchUp
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
}

export const getSeriesPlayOptions = async (id: string, params: any) => {
  const { accessToken, rightsGroupIds } = GLOBALS.store! || undefined;
  const { seriesID } = params;
  const isCatchUp = (isFeatureAssigned("catchupEnvironment") && isFeatureAssigned("catchup")) || false
  const types = ["Title"];
  //@ts-ignore
  if (GLOBALS.bootstrapSelectors && GLOBALS.bootstrapSelectors.DvrCapability === "CloudDvr") {
    types.push("Recording");
  }
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + `/v4/series/${seriesID}/play-options`
  const response = await GET({
    url: url,
    params: {
      storeId: DefaultStore.Id,
      groups: rightsGroupIds,
      types: types.join(","),
      catchup: isCatchUp
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response;
}

export const getUserAccount = async (id: string, params: any) => {
  const { accessToken } = GLOBALS.store!;
  const url = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + '/v2/account';
  const response = await GET({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  })
  return response;
}

export const getPackageActions = async (id: string, params: any) => {
  const { storeID, packageId } = params;
  const { accessToken } = GLOBALS.store!;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + `/v4/packages/${packageId}/actions?`;
  const response = await GET({
    url: url,
    params: {
      storeId: storeID || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response
}

export const getAllRecordingBookmarks = async (id?: string, params?: any) => {
  const { accessToken } = GLOBALS.store!;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriberbkmark || '') + `/v3/recordings/bookmarks?`;
  const response = await GET({
    url: url,
    params: {
      storeId: DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  return response.data
}

export const getDynamicFeeds = async (id?: string, params?: any) => {
  const { accessToken } = GLOBALS.store!;
  const { $skip, $top, Id } = params;
  let url, paramsObject;
  const libraryId = Id || id;
  if (id === "MixedRecommendations") {
    url =
      GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber + `${libraryId.toLowerCase()}`
    paramsObject = {
      ...params,
      $skip: $skip || 0,
      $top: $top || 16,
      $lang: lang
    }
  } else {
    url = GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber + `v4/libraries/${libraryId}`;
    let typesParam = params.types ? params.types.join(",") : "Title";
    if (params.libraryId === "Library" && storeId) {
      if (typesParam.includes("Title") && !typesParam.includes('PayPerView')) {
        typesParam += ", PayPerView";
      }
    }
    paramsObject = {
      ...params,
      types: typesParam,
      atHome: true,
      $skip: $skip || 0,
      $top: $top || 16,
      $lang: lang,
      storeId: DefaultStore.Id
    }
  }
  const response = await GET({
    url: url,
    params: paramsObject,
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? undefined : GLOBALS.userProfile?.Id
    },
  });
  const types =
    (config.hubs.feeds as any)[id] || config.hubs.feeds.default;
  const feedContent = response.data;
  const type: SourceType = SourceType.VOD;
  if (feedContent === undefined) {
    return null;
  }
  if (!id) {
    return new FeedContents(
      GLOBALS.selectedFeed,
      massageSubscriberFeed(feedContent, id, type)
    );
  }
  let feedContents: any[] = [];
  const libraryItemsObject: any = {};
  feedContent.LibraryItems.map((item: any) => {
    libraryItemsObject[item.Id] = item;
  });

  for (let category of feedContent.Libraries) {
    let libraryItems: ILibraryItem[] = [];

    for (const id of category.LibraryItems) {
      libraryItems.push(libraryItemsObject[id]);
    }

    category["NavigationTargetVisibility"] =
      NavigationTarget.CLIENT_DEFINED;

    if (!category.HasSubcategories) {
      category["NavigationTargetUri"] = "libraries";
      category["Uri"] =
        browseGalleryConfig.libraries.uri + category.Id;
      category["FeedType"] = FeedType.Custom;
    } else if (category.HasSubcategories) {
      category["FeedType"] = FeedType.Mixed;
      category["Uri"] =
        browseCategoryConfig.browsepromotionsCategory.uri +
        category.Id;
      category["NavigationTargetUri"] = GLOBALS.selectedFeed.NavigationTargetUri;
      category["NavigationTargetVisibility"] =
        NavigationTarget.SHOW_FEED_ALWAYS;
    } else {
      category["FeedType"] = FeedType.Dynamic;
    }

    feedContents.push(
      new FeedContents(
        category,
        massageDiscoveryFeed({ Items: libraryItems }, type)
      )
    );
  }
  if(Id){ 
    return {data : feedContents[0].items};
  }
  
  return feedContents;
}


export const registerSubscriberUdls = (params?: any) => {
  const BASE = "subscriber";

  const subscriberUdls = [
    { prefix: BASE + "/programplayactions/", getter: getProgramPlayActions },
    { prefix: BASE + "/similarprograms/", getter: getSimilarPrograms },
    { prefix: BASE + "/library/YouMightLike", getter: getYouMightLike },
    { prefix: BASE + "/library/Pins", getter: getSubscriberPins },
    { prefix: BASE + "/library/Reminders", getter: getReminders },
    {
      prefix: BASE + "/library/BecauseYouWatched",
      getter: getSubscriberSubscriptions,
    },
    {
      prefix: BASE + "/library/YouMightLikeByTaste",
      getter: getYouMightLikeByTaste,
    },
    {
      prefix: BASE + "/library/YouMightLikeSpecificTaste",
      getter: getYouMightLikeBySpecificTaste,
    },
    {
      prefix: BASE + "/library/Library",
      getter: getLibrary,
    },
    { prefix: BASE + "/library/Continue", getter: getBookmarks },
    {
      prefix: BASE + "/feeds/live-trending-programs",
      getter: getLiveTrendingPrograms,
    },
    {
      prefix: BASE + "/getProgramSubscriberData/",
      getter: getProgramSubscriberData
    },
    {
      prefix: BASE + "/getSeriesSubscriberData/",
      getter: getSeriesSubscriberData
    },
    {
      prefix: BASE + "/getAllPinnedItems/",
      getter: getAllPinnedItems
    },
    { prefix: BASE + "/getSeasonPlayOptions/", getter: getSeasonPlayOptions },
    { prefix: BASE + "/getSeriesPlayOptions", getter: getSeriesPlayOptions },
    { prefix: BASE + "/account/", getter: getUserAccount },
    { prefix: BASE + "/getPackageActions/", getter: getPackageActions },
    { prefix: BASE + "/libraries/dynamicFeeds", getter: getDynamicFeeds },
    { prefix: BASE + "/library", getter: getDynamicFeeds }
  ];
  return subscriberUdls;
};
