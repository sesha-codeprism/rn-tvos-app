import { GET } from "../utils/common/cloud";
import { MFGlobalsConfig } from "../configs/globals";
import { MFGlobals } from "../@types/globals";
import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals";
import { lang, pivots } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";


/** Note: Discovery calls don't require AUTH token */


/** URL Endpoint for all Discovery calls */
export const DISCOVERY_URL =
  GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery;

const versionString = "/v4/"

// export const DISCOVERY_URL = 'https://ottapp-appgw-client-a.dev.mr.tv3cloud.com/S1/discovery';

/** API call to get all Hubs data */
export const getHubs = async (id: string, params: any) => {
  const { rightIds, storeId, pivots, lang } = params;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + "/v3/hubs";
  const response = await GET({
    url: url,
    params: {
      $groups: rightIds,
      storeId: storeId,
      lang: lang,
      pivots: pivots,
    },
  });
  return response;
};
const getMovies = async (id: string, params: any) => {
  console.log("UDL: getMovies", id, params);
  const { parentalrating, pivots, rating } = params;

  const url: string =
    parseUri(DISCOVERY_URL || "") +
    "/v4/feeds/movies/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
      parentalrating: parentalrating,
      rating: rating
    }
  });
  return response;

  //   const res = {
  //     name: "discovery/getMovies",
  //     count: 20,
  //     response: [1, 2, 3],
  //   };
  //   return res;
};
const getTVShows = async (id: string, params: any) => {
  console.log("UDL: getTVShows", id, params);
  const { OfferType } = params;

  const url: string =
    parseUri(DISCOVERY_URL || "") + versionString + "feeds/tvshows/items"
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
      OfferType: OfferType
    }
  });
  return response;
};
const getPackages = async (id: string, params: Object) => {
  console.log("UDL: getPackages", id, params);
  const url: string =
    parseUri(DISCOVERY_URL || "") + versionString + "feeds/packages/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0
    }
  });
  return response;
};
const getmoviesandtvshowsByLicenseWindow = async (
  id: string,
  params: Object
) => {
  console.log("UDL: getMoviesAndTvshowsByLicenseWindows", id, params);
  const url: string =
    parseUri(DISCOVERY_URL || "") + versionString + "moviesandtvshows/items"
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0
    }
  });
  return response;
};

const getMoviesAndTV = async (id: string, params: any) => {
  console.log("UDL: getMovisAndTV", id, params);
  const { orderBy } = params;
  const url: string =
    parseUri(DISCOVERY_URL || "") + versionString + "feeds/moviesandtvshows/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
      orderBy: orderBy,
    }
  });
  return response;
};

/** API call to get all subscriptions */
const discoverSubscriptions = async (id: string, params: any, $skip: number = 0, $top: number = 10) => {
  console.log("UDL: getTVShows", id, params);
  const url: string =
    parseUri(DISCOVERY_URL || "") + versionString + "feeds/subscriptions/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0
    },

  });
  return response;
};

const getPayPerView = async () => {
  const url: string =
    parseUri(DISCOVERY_URL || "") + versionString + "feeds/payperview/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store.rightsGroupIds,
      storeId: DefaultStore.Id,
      lang: lang,
      pivots: pivots,
      $top: 16,
      $skip: 0
    }
  });
  return response;
};

export const getStoresList = async () => {
  const rightIds = GLOBALS.store.rightsGroupIds;
  const STORE_TYPE = "HubsAndFeeds";
  const defaultMainStore = "HubsAndFeeds-Main";
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL || '') + '/v3/stores';
  const response = await GET({
    url: url,
    params: {
      pivots: pivots,
      $groups: rightIds,
      $lang: lang,
      storeId: DefaultStore.Id

    }
  });
  return response.data;
}

export const getFeedByID = async (id: string) => {
  const uri: string = parseUri(DISCOVERY_URL || "") + `/v3/programs/${id}`;
  const response = await GET({
    url: uri,

    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
    },

  });
  return response;
};

export const registerDiscoveryUdls = () => {
  const BASE = "discovery";

  const discoveryUdls = [
    { prefix: BASE + "/hubs/", getter: getHubs },
    { prefix: BASE + "/feeds/movies/", getter: getMovies },
    { prefix: BASE + "/feeds/moviesandtvshows", getter: getMoviesAndTV },
    { prefix: BASE + "/feeds/subscriptions", getter: discoverSubscriptions },
    { prefix: BASE + "/feeds/payperview", getter: getPayPerView },
    { prefix: BASE + "/feeds/tvshows", getter: getTVShows },
    { prefix: BASE + "/feeds/packages", getter: getPackages },
    {
      prefix: BASE + "/moviesandtvshows?orderBy=LicenseWindowStartUtc",
      getter: getmoviesandtvshowsByLicenseWindow,
    },
  ];
  return discoveryUdls;
};
