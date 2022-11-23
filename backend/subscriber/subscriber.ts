import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals";
import { DELETE, GET, POST, PUT } from "../utils/common/cloud";
import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
export type PinType = "adult" | "parentalcontrol" | "purchase";

const getProgramPlayActions = async (id: string, params: Object) => {
  const res = {
    name: "subscriber/getProgramPlayActions",
    count: 20,
    response: [1, 2, 3],
  };
  return res;
};

const getSimilarPrograms = async (id: string, params: Object) => {
  const res = {
    name: "subscriber/getSimilarPrograms",
    count: 20,
    response: [1, 2, 3],
  };
  return res;
};

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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      $lang: lang,
      storeId: DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
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
        Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
      },
      params: { PasscodeType, Passcode: pin },
    });
    return response;
  } catch (error) {
    console.log("error in createPasscodes", error);
  }
  //   fetch("https://ottapp-appgw-client-a.dev.mr.tv3cloud.com/S1/subscriber/v2/passcodes/parentalcontrol", {
  //   "headers": {
  //     "accept": "text/plain, */*; q=0.01",
  //     "accept-language": "en-US,en;q=0.9,fr;q=0.8,fr-FR;q=0.7,ar;q=0.6,zh-CN;q=0.5,zh-TW;q=0.4,zh;q=0.3,ar-SA;q=0.2,pt-BR;q=0.1,pt;q=0.1,ru-RU;q=0.1,ru;q=0.1,he-IL;q=0.1,he;q=0.1,es-ES;q=0.1,es;q=0.1,it-IT;q=0.1,it;q=0.1,th-TH;q=0.1,th;q=0.1,de-DE;q=0.1,de;q=0.1,ja-JP;q=0.1,ja;q=0.1,ko-KR;q=0.1,ko;q=0.1,tr-TR;q=0.1,tr;q=0.1,cs-CZ;q=0.1,cs;q=0.1,fa-IR;q=0.1,fa;q=0.1,hu-HU;q=0.1,hu;q=0.1,nl-NL;q=0.1,nl;q=0.1,pl-PL;q=0.1,pl;q=0.1,sk-SK;q=0.1,sk;q=0.1,uk-UA;q=0.1,uk;q=0.1,ug-CN;q=0.1,ug;q=0.1,vi-VN;q=0.1,vi;q=0.1,ro-RO;q=0.1,ro;q=0.1,ms-MY;q=0.1,ms;q=0.1,el-GR;q=0.1,el;q=0.1,da-DK;q=0.1,da;q=0.1,sv-SE;q=0.1,sv;q=0.1,fi-FI;q=0.1,fi;q=0.1",
  //     "authorization": "OAUTH2 access_token=\"AuthToken1rVTfj6o4FP5rhpebMdAfFB54QGDEUVHRUceXDUIVBFqmBR3862-ZzN1NNns32WSTnnJ6-p3Tnu8D3C4rKEupk7dtI5-g-wRe1BC06gt2aRLR9qOM3ka1GLU3mFa8y0YprxVEm0rZUfG3RNnK3-EH4F-4NKd1IkefdSV50oy4uKjoXaoJ6DpWj6-pyChri7ZXblolRT3ss6Smjgxuq_p2MN38j0jki0yyOZrM_NdquahSsrlyu91Fi8J1Xa7FNKlqZz7dBVNf21KWsHaaORk9J13Vaj69FSnd9g119vTk5YLX9DuoUOmzYdBzpoPTM8gw1IlpP0PdABhYytXcNOXdV7lE3gtWU8ZZ-YT0S50U1dC4qvR1zJuk4l9QLzRpO0EngneNgiHdJMiytO-s_9LsRKgC0jEsCyDjCYyxqXgc28qgsiFiWDaxjCGCkQW_HKJDHQ97BNjI0pUDoGlqblXxO81-USb_5OwfpayLVHDJz-234L_EtAYxzd-IKXhFHUGT7AdnVf9jWP7f1WV3kqkoTlRobtfmXBSPpC04WySydGwb20jHxAI2IBAAYBBELMUGwhBgGyJEALINGxq6DTA2CFCkmRDrCNvqcKybOlBsKt4siG2iA0MRblpYCz6bQlC5ZI5hmhgAlWJpnuq0pdl30IDEUMFlQ0XScrHlJWWb4sLUh-dR0W7zrj41omCtYyOP-Ba2TD1wCVAy2S52TRMFQQDQGNiEeL7vobG2XAWxu13Gm-kkcrdvceCsrkjJqbh4HHtvN8jvnfbpIz6Ny32MNvlFdxks68vwGiTK9uGiF7sDC8X7o0zArfGD9Hp2w0f0mPXmO1EQa2q-h_BuJjvM9x9Gyiuv6pcXCF7h58SPgzZSF387IPE2Xm_jexy5-Xqt8mZlNHkEM3WXs7zs7Zqr2DJSS37U5cKNRX_w5mOwxosPZhrhmkSyfOPzRV_cwvgQJpfVBg2NnKtDvA2KREj6rtadX5a-Gc5ru5tuQpmfkjZ9iemr38Pd7NjA1RS5x_cypmc4g4vxcJHh1zLQ4m9e9vKx2mebj5qt5vmuCcx7cxJHRJnuZQ2RDL6-XC15TZcxKY8xbrzTIwiX56Ue9ebjTK_X9SvdsUj1vw5V1Wu_v2Tg_gR9NX4C\"",
  //     "content-type": "application/json",
  //     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": "\"macOS\"",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-site",
  //     "x-clientconfig": "f=16;t=2",
  //     "x-tv3-profiles": "08a4636d-636a-4946-b7ca-828603917138",
  //     "x-tv3-transactionid": "6692f8defbb43a1752bf53b29903906c46e9fae2-18-1665137322939"
  //   },
  //   "referrer": "https://reachclient.dev.mr.tv3cloud.com/",
  //   "body": "{\"PasscodeType\":\"parentalcontrol\",\"Passcode\":\"20cc2b28323fb39d3f3a55e8e347dc343e0391c71138d5ccdca56d093109be73\"}",
  //   "method": "PUT",
  //   "mode": "cors",
  //   "credentials": "include"
  // });
};
export const changePasscodes = async (PasscodeType: PinType, pin: string) => {
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber || "") +
    `/v2/passcodes/${PasscodeType}`;
  const response = await PUT({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
    },
    params: { PasscodeType, Passcode: pin },
  });
  return response;
};
export const deleteDevice = async () => {
  const { accessToken } = GLOBALS.store;
  const url: string = parseUri(
    `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.subscriber}devices-byid/${GLOBALS.deviceInfo.deviceId}`
  );
  const response = await DELETE({
    url: url,
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  });
  return response;
};

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
  ];
  return subscriberUdls;
};
