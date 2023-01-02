import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals";
import { DELETE, GET, POST, PUT } from "../utils/common/cloud";
import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import axios from "axios";
import { MFGlobalsConfig } from "../configs/globals";
export type PinType = "adult" | "parentalcontrol" | "purchase";
export interface SearchParam {
  searchString: string;
  $skip: number;
  $top: number;
  searchLive: boolean;
  mediaTypes?: string;
}

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

const getSubscriberPins = async (params?: any) => {
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
  const { accessToken } = GLOBALS.store!;
  const url: string = parseUri(
    `${MFGlobalsConfig?.stsUrl}/oauth/signout/liveid`
  );

  const response = await DELETE({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  });
  return response;
};

export const getProgramSubscriberData = async (item: string, params: any) => {
  const { id } = params;
  const { accessToken } = GLOBALS.store!;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v4/programs/${id}/titles/`
  try {
    const response = await GET({
      url: url,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${accessToken}"`,
      },
    });
    return response;
  } catch (e) {
    console.error("Cannot getProgramSubscriberData due to ", e);
    return undefined;
  }
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
    }
  ];
  return subscriberUdls;
};
