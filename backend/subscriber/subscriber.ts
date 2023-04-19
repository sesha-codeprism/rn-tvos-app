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
        'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
    },
  });

  return response;
};
export const deleteDeviceById = async (id: string) => {
//   fetch("https://ottapp-appgw-client-a.dev.mr.tv3cloud.com/S1/subscriber/devices-byid/99ecfca2-a5c9-9ecf-ca2a-5c99ecfca2a5", {
//   "headers": {
//     "accept": "text/plain, */*; q=0.01",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//     "authorization": "OAUTH2 access_token=\"AuthToken1vVTZjqs4EP2a8NLqiM1gP-SBkI2kG7KQTidvBpyEYDCxTbavv6aV1kijuSONdHskV9kUx8dyHVd5TZaTKiW9o5S16FhexxypwQm959Whxlzeuxm5dEvelRcrpazJuikrFUQLhGgI_9tGIcXv8C3wL1x6JCUW3VtJBcN1l_GDil6FcqauAzV9uTwjlczlXS1TivOy_V_hkvSqT7HMIuOwOMqP5pWmBXQOOKj88evsnaVvG3_XPBJ7EcZzoS0JpmXvLfgYBgMtJhWuZJD1MrLHDZXagFzylMT3mvQ2JPGPnJXkGVSo9BXCxNKRmbwaCAPLsbNXy9oTbCdqqXlpypovuppjgbOuJEIaHVtnjaSMFe3dFdnXSWtB-L8DRwTLhpMxZ02tkLbuuDaE2nPjf7nymCsC0TMgNG2zY_YN3VIeKnNt5SwXKd9a-2UoM59ry4IGQi3Q0W3otFHLMVyoeZSyK8m-0ye-89cxffkVM_5Z4DJPORNsL5_P4Fti2Ers_EZizqiSmKUvOCvz6ieIG5XTP83LasKxZD_GWzMuMX25Ml7slRj_0zEvJa7w4c9nSzSJSHme_CTzi1K5LWTNa-SR8fyBZc6qdyyKnoWgYSOEdBMA4JjA0KHpWtBx1Ps3kGPawIAOdIEDdMt11GSbCo1cR3cBsBEEwHQRMqEqEmRYCOgt1tRdbXirc05EVPUMxQVtXe3WfK5Km2TPoAtUUQEteiY8ZgWpVvmhUh3XJ1zGx6ZMap5Xsods3x1AAB196Lmmql7kAc9x7OFwaNp9E7muPxj4dl-L5sOlF0fLVTAOvXi9HPaW7_q6nPQNQpdQ3He3t-liclWta3pSRb1NFl4-nrunRzmyos3uEk62KAzg6ILitKxW4jEHuzNYBPsQ2f2Dc37jfnGbgmo2YxSNaGCQibso8Cwk9805GFy42O68aXWZR2s98c6TSdQ2nPQkDyx80KkzdT93InSmRvTmfc53u8Rr1nRN6wDJe8IV9LOiYn0-0m39aMUODiPKByl5N5ojmZToNOnfceTGj-vueOqfEZrV1-aikJ-zjVlA39y6fJxWq7miGgBaWaV7nC7mV3IJojgreFzV4Fo07mHWdrt6fw9v6_E6WBN6cqLxPiyWuA5X2xWT1umG6d68j-qDz_esaDbHtkcurjJ4mNOPUt1rNAWzYXhlg-g9uHasgRq_AA\"",
//     "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "x-clientconfig": "f=16;t=2",
//     "x-tv3-profiles": "18b42f82-9b14-4c32-8b9c-deccb91eb5c5",
//     "x-tv3-transactionid": "4fcfa22cf4fbeafdb9c9b4f900dbb54933f019a9-6-1681802414049",
//     "cookie": "redirect_uri=https%3A%2F%2Freachclient.dev.mr.tv3cloud.com%2F%23settings%239p47tyn6908; oauth=refresh_token=0.AVAAHn5axl-Zm0mNpVaHTbXXyWbw77LR4C1Hrs-VWmlB5CW2AC4.AgABAAEAAAD--DLA3VO7QrddgJg7WevrAgDs_wUA9P8DowuCmFqgURZO9JHBOIdXdbDf-XOakpgKsBxqyrsihs8RznjhEjLdileNWB9McEIFfVSudUSl31g_jEBnxG2XXfmLmg7gnychxrYy52q4_PEFpAb8exqNn5sKMyBhwTSDlLgTP7rYLisltPPPTMdaZVvjwmjiFYyZeOvBQQM4blORKKcjnfQf0q1S11SCV9pNZ7c-_Oww7o52gOJHup9kava4f1QGSx_GbZoy8K6cW8HRfTMqUYEfWFM3QDy1F287XLW3ruciMIDUyXkX9H2JDZj3I5W7P2LWoLah4tYwueLXzwrOex28knDeimjyUh0XstKSAPMLoncCZMbOuTAuq_TBBLcgZ-eEZlL8Qxio0LoQ-n3uhAjl5eEQypDo8nocMiF24eLeszq7DgdfonfAyOQ6Ewh6tHjMDJGm_cK8oLgb6RXnBIySzwD1TpxRvWc8t49xLtXigKORB2evtPMJcb2gOFBjLaXswCQucqvIetslo5BajBF5KuVNJ_HprO2xZiwNdeq0IVMnpJ9MNVRj4lSBWliw2_IgInHS2BsXnKvrrYnkwOOKcUHBFg00kDpvktt8B79EyzmKEQyuHhAVbgqHLcELOAPNRHtEr_Jv170CdEGQG7HYoSBPpJYli9hf1vCuSahJvskmxbe54GBKhINvOWTwz5I8vOTojg_I_khMwOld0h4MceZPjmlq8zbMC7qt_ABzIAxiNKAzn6XprwLwFdcR28ctcF-EaOClbJPDErblf31CLsPwjc2GJtM086PH715iy2DzEIGoTcXuG35q30bNIxg4gfRXqjRP4DknZn4FCNRcA4cp_T3t-_h4mW4C7NrXoxuu3iJ6hnUTaEDwRgnXRBOSpVbsUpCTiX6-7DHNslUYvEZlpV4rQIlbVIAAaRq7YO4_nDtSmUZ5_MvW0GfsyS32zfP_m_P8HXRJdszWyfsZM_WkfU4KNR0-4FRPfl9vyhbZtfkLbqRCBuCA4fMT-xv-O_rq2QlfcgoDQKH4PKUJLYX8jVLnPqikZKlVPE5lhshJIKlJFPZajHyKb_WAJ6F0Z6OybMQbNGnSrnICPIKMTaXWrFFvm7kaKA-oAJc1uZ3YAuBDpds5Fv9Jmb-5YZUjAh8dUPQWWEHVJlLu8rZhfRJKoHbcSYWlWc2JunkPU11j1nPNX3LHqB_oZRw33PLiYRqtA9TbeLn3ssk_2bjbrOEYdsjfa9WnbtPhMI-EwCd0KWEcQ7BMXTg8XDxlv6xvp8nzM40Iwyb3zvjJriY2KcPIFjsDJxlBJCg3s7hKiEVF4cDJLaxw7cG0l3JLnYG4uiT5AczyTCVsHtI5S8NlykmU1eWKnIgB; access-token=AuthToken1vVTZjqs4EP2a8NLqiM1gP-SBkI2kG7KQTidvBpyEYDCxTbavv6aV1kijuSONdHskV9kUx8dyHVd5TZaTKiW9o5S16FhexxypwQm959Whxlzeuxm5dEvelRcrpazJuikrFUQLhGgI_9tGIcXv8C3wL1x6JCUW3VtJBcN1l_GDil6FcqauAzV9uTwjlczlXS1TivOy_V_hkvSqT7HMIuOwOMqP5pWmBXQOOKj88evsnaVvG3_XPBJ7EcZzoS0JpmXvLfgYBgMtJhWuZJD1MrLHDZXagFzylMT3mvQ2JPGPnJXkGVSo9BXCxNKRmbwaCAPLsbNXy9oTbCdqqXlpypovuppjgbOuJEIaHVtnjaSMFe3dFdnXSWtB-L8DRwTLhpMxZ02tkLbuuDaE2nPjf7nymCsC0TMgNG2zY_YN3VIeKnNt5SwXKd9a-2UoM59ry4IGQi3Q0W3otFHLMVyoeZSyK8m-0ye-89cxffkVM_5Z4DJPORNsL5_P4Fti2Ers_EZizqiSmKUvOCvz6ieIG5XTP83LasKxZD_GWzMuMX25Ml7slRj_0zEvJa7w4c9nSzSJSHme_CTzi1K5LWTNa-SR8fyBZc6qdyyKnoWgYSOEdBMA4JjA0KHpWtBx1Ps3kGPawIAOdIEDdMt11GSbCo1cR3cBsBEEwHQRMqEqEmRYCOgt1tRdbXirc05EVPUMxQVtXe3WfK5Km2TPoAtUUQEteiY8ZgWpVvmhUh3XJ1zGx6ZMap5Xsods3x1AAB196Lmmql7kAc9x7OFwaNp9E7muPxj4dl-L5sOlF0fLVTAOvXi9HPaW7_q6nPQNQpdQ3He3t-liclWta3pSRb1NFl4-nrunRzmyos3uEk62KAzg6ILitKxW4jEHuzNYBPsQ2f2Dc37jfnGbgmo2YxSNaGCQibso8Cwk9805GFy42O68aXWZR2s98c6TSdQ2nPQkDyx80KkzdT93InSmRvTmfc53u8Rr1nRN6wDJe8IV9LOiYn0-0m39aMUODiPKByl5N5ojmZToNOnfceTGj-vueOqfEZrV1-aikJ-zjVlA39y6fJxWq7miGgBaWaV7nC7mV3IJojgreFzV4Fo07mHWdrt6fw9v6_E6WBN6cqLxPiyWuA5X2xWT1umG6d68j-qDz_esaDbHtkcurjJ4mNOPUt1rNAWzYXhlg-g9uHasgRq_AA",
//     "Referer": "https://reachclient.dev.mr.tv3cloud.com/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "DELETE"
// });
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    `/devices-byid/${id}`;
  const response = await DELETE({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
        'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
        'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
    },
  });
  return response;
}

export const purchaseItem = async (offerId: string, offerPrice: number) => {
  const { accessToken } = GLOBALS.store!;
  //@ts-ignore
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services.subscriber || '') + `/v2/purchases?deviceType=${MFGlobalsConfig.deviceType}&storeId=${DefaultStore.Id}`;
  const response = await POST({
    url: url,
    params: {
      offerId,
      offerPrice,
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
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

export const getDevices = async (id?: string, params?: any) => {
  const { accessToken } = GLOBALS.store!;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || '') + `/device`;
  const response = await GET({
    url: url,
    params: {
      storeId: DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
      'x-tv3-profiles': GLOBALS.userProfile?.Name?.toLocaleLowerCase() === 'default' ? '' : GLOBALS.userProfile?.Id
    },
  });
  return response.data
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
