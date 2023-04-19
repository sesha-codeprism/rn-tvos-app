//@ts-nocheck
import { GET } from "../utils/common/cloud";
import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals";
import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { gethubRestartTvShowcards } from "../live/live";
import { massageDiscoveryFeed, massageSubscriptionPackagePivots } from "../../src/utils/assetUtils";
import { SourceType } from "../../src/utils/common";
import { FeedContents } from "../../src/components/MFSwimLane";


/** Note: Discovery calls don't require AUTH token */

/** URL Endpoint for all Discovery calls */
// export const DISCOVERY_URL =
//   GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery;

const versionString = "/v4/";

// export const GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery = 'https://ottapp-appgw-client-a.dev.mr.tv3cloud.com/S1/discovery';

/** API call to get all Hubs data */
export const getHubs = async (id: string, params: any) => {
  const { rightIds, storeId, pivots, lang = GLOBALS.store?.onScreenLanguage?.languageCode } = params;
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || "") +
    "/v3/hubs";
  const response = await GET({
    url: url,
    params: {
      $groups: rightIds,
      storeId: storeId,
      $lang: lang,
      pivots: pivots,
    },
  });
  return response;
};


export const getStoresOfZones = async ({ queryKey }: any) => {
  const [, discoveryUrl] = queryKey;
  const url: string =
    parseUri(
      discoveryUrl
    ) +
    "/v3/" +
    "stores";

  return await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds!,
      storeId: DefaultStore.Id,
      //@ts-ignore
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
    },
  });
};


export const getMovies = async (id?: string, params?: any) => {
  const { parentalrating, rating, pivots } = params;
  // const pivots = `LicenseWindow|New|Language|${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'}`;
  const url: string =
    parseUri(
      GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery ||
      "https://appgw-client-a.dev.mr.tv3cloud.com/S1/discovery"
    ) + "/v4/feeds/movies/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
      parentalrating: parentalrating,
      rating: rating,
    },
  });
  return response;

  //   const res = {
  //     name: "discovery/getMovies",
  //     count: 20,
  //     response: [1, 2, 3],
  //   };
  //   return res;
};
export const getTVShows = async (id?: string, params?: any) => {
  const { OfferType, pivots } = params;
  // const pivots = `LicenseWindow|New|Language|${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'}`;
  const url: string =
    parseUri(
      GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery ||
      "https://appgw-client-a.dev.mr.tv3cloud.com/S1/discovery"
    ) +
    versionString +
    "feeds/tvshows/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
      OfferType: OfferType,
    },
  });
  return response;
};
const getPackages = async (id: string, params: Object) => {
  const pivots = `Language|${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'}`;
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery || "") + versionString + "feeds/packages/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
    },
  });
  return response;
};

export const getPackageDetails = async (id: string, params: any) => {
  const { accessToken }
    = GLOBALS.store!;
  const { packageId, $groups, $lang, storeId } = params;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || "") + `/v3/packages/${packageId}`;
  const response = await GET({
    url: url,
    params: {
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      $lang: $lang || lang,
      storeId: storeId || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`
    },
  }); ``
  return response;
}
const getmoviesandtvshowsByLicenseWindow = async (
  id: string,
  params: Object
) => {
  const pivots = `Language| ${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'} `;
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery || "") + versionString + "moviesandtvshows/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
    },
  });
  return response;
};

const getMoviesAndTV = async (id: string, params: any) => {
  const pivots = `Language | ${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'} `;
  const { orderBy } = params;
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery || "") +
    versionString +
    "feeds/moviesandtvshows/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
      orderBy: orderBy,
    },
  });
  return response;
};

/** API call to get all subscriptions */
const discoverSubscriptions = async (
  id: string,
  params: any,
  $skip: number = 0,
  $top: number = 10
) => {
  const pivots = `Language | ${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'} `;
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery || "") + versionString + "feeds/subscriptions/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: 16,
      $skip: 0,
    },
  });
  return response;
};

const getPayPerView = async (id: string, params: any) => {
  const pivots = `Language | ${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'} `;
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery || "") + versionString + "feeds/payperview/items";
  const response = await GET({
    url: url,
    params: {
      $groups: GLOBALS.store?.rightsGroupIds,
      storeId: DefaultStore.Id,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      pivots: pivots,
      $top: params?.$top || 16,
      $skip: params?.$skip || 0,
    },
  });
  return response;
};

export const getStoresList = async () => {
  const pivots = `Language | ${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'} `;
  const rightIds = GLOBALS.store?.rightsGroupIds;
  const STORE_TYPE = "HubsAndFeeds";
  const defaultMainStore = "HubsAndFeeds-Main";
  const url: string =
    parseUri(
      GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL || ""
    ) + "/v3/stores";
  const response = await GET({
    url: url,
    params: {
      pivots: pivots,
      $groups: rightIds,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      storeId: DefaultStore.Id,
    },
  });
  return response.data;
};

export const getFeedByID = async (id: string) => {
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery || "") + `/ v3 / programs / ${id} `;
  const response = await GET({
    url: uri,

    headers: {
      Authorization: `OAUTH2 access_token = "${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};

export const getDiscoveryCategoryItems = async (id: string, params: any) => {
  const {$groups, $skip, $top, Id, storeId} = params;
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}v4/categories/${Id}/items`;
  const response = await GET({
    url: url,
    params: {
      $top: $top,
      $skip: $skip,
      $groups: $groups,
      $lang: GLOBALS.store?.onScreenLanguage?.languageCode || lang,
      storeId: storeId || DefaultStore.Id,
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};

export const getDiscoveryFeedItems = async (id: string, params: any) => {
  const { isTrending } = params || false;
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}v4/feeds/${params.id}/items`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  if (isTrending) {
    const trendingStations = response.data.Items;
    if (!trendingStations || !trendingStations.length) {
      return
    }
    const recentlyAired = await gethubRestartTvShowcards("", {});
    if (recentlyAired) {
      const current = new Date();
      const nextSlot = current.setMinutes(current.getMinutes() + 30);
      const nextSlotString = new Date(nextSlot).toISOString();

      return recentlyAired
        .find((slot: any) => slot.StartTime <= nextSlotString && slot.EndTime >= nextSlotString)
        ?.Schedules.filter((t: any) => trendingStations.indexOf(t.StationId) !== -1)
    }
    return recentlyAired
  } else {
    return response;
  }
}

export const getDiscoverCategoryItemPivots = async (
  id: string,
  params: any
) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}v4/categories/${params.id}/subcategories`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};

export const getDiscoveryLibraryItems = async (id: string, params: any) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}v3/libraries/complete/items`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};

export const getDiscoveryLibrariesCompletePivots = async (
  id: string,
  params: any
) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}v3/libraries/complete/pivots`;
  const response = await GET({
    url: url,
    params: {},
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};

const getDiscoveryLibrariesPivotCategories = async (
  id: string,
  params: any
) => {
  const feed = GLOBALS.selectedFeed;
  const { $skip, $top, $lang, $groups, storeId, $stations, $countPerStation, pivots, pivotGroup } = params;
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery}/v3/libraries/complete/pivot-items`;
  const response = await GET({
    url: url,
    params: {
      pivotGroup: pivotGroup,
      pivots: pivots + ($lang?.short || lang.short),
      $itemsPerRow: $countPerStation,
      $skip: $skip || 0,
      $top: $top || 30,
      $lang: $lang || lang,
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      storeId: storeId || DefaultStore.Id

    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  const type: SourceType = SourceType.VOD;
  let feedContents: any[] = [];
  for (let category of response?.data) {
      const categoryItem = {
          FeedType: feed.FeedType,
          Id: category.Id,
          Name: category.Name,
          HasMore: (category?.HasMore && category.HasMore) || false,
          NavigationTargetUri: feed?.NavigationTargetUri || "",
          NavigationTargetVisibility: feed?.NavigationTargetVisibility,
          Uri: feed.Uri,
          pivotGroup: feed.pivotGroup,
      };
      feedContents.push(
          new FeedContents(
              categoryItem,
              massageDiscoveryFeed(category, type)
          )
      );
  }  
  return feedContents;
};

const getDiscoverLibraryItemPivots = async (id: string, params: any) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery}/v3/libraries/complete/pivots`;
  const response = await GET({
    url: url,
    params: {},
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};

const getDiscoveryLibraryPackages = async (id: string, params: any) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery}/v3/libraries/Collections/items`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response;
};


const getDiscoveryProgramDetailsById = async (itemID: string, params: any) => {
  const { id } = params;
  const url = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discoverySSL || '') + `/v3/programs/${id}`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
    },

  });
  return response;
}

const getDiscoverySeriesDetailsByID = async (itemID: string, params: any) => {
  const { id } = params;
  const url = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discoverySSL || '') + `/v3/series/${id}`;
  const response = await GET({
    url: url,
    params: params,
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
    },

  });
  return response;


}

const getDiscoveryProgramSchedules = async (itemId: string, params: any) => {
  const { id } = params;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discoverySSL || '') + `/v3/programs/${id}/schedules`;
  try {
    const response = await GET({
      url: url,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
      },
    })
    return response;
  } catch (e) {
    console.error("Cannot getDiscoveryProgramSchedules due to", e);
    return undefined;
  }
}

const getDiscoverySeriesSchedules = async (ItemID: string, params: any) => {
  const { id } = params;
  const url: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discoverySSL || '') + `/v3/series/${id}/schedules`;
  try {
    const response = await GET({
      url: url,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
      },
    })
    return response;
  } catch (e) {
    console.error("Cannot getDiscoveryProgramSchedules due to", e);
    return undefined;
  }

}

export const getDiscoveryCollectionItems = async (id: string, params: any) => {
  const uri: any = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + `/v3/libraries/Collections/items`;
  try {
    const response = await GET({
      url: uri,
      params: params,
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
      },
    })
    return response;
  } catch (e) {
    console.error("Cannot getDiscoveryCollectionItems due to", e);
    return undefined;
  }
}

export const getPackageTitles = async (id: string, params: any) => {
  const { accessToken } = GLOBALS.store!;
  const { $skip, $top, $lang, $groups, storeId, packageId } = params;
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + `/v3/packages/${packageId}/titles`;
  const response = await GET({
    url: uri,
    params: {
      $skip: $skip || 0,
      $top: $top || 25,
      $lang: $lang || lang,
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      storeId: storeId || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  });
  return response;
}
export const getSubscriptionPackageCategories = async (id: string, params: any) => {  
  const Id = GLOBALS.selectedFeed.Id;
  const { accessToken } = GLOBALS.store!;
  const { $skip, $top, $lang, $groups, storeId } = params;
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + `/v3/subscription-packages/${Id}/categories`
  const response = await GET({
    url: uri,
    params: {
      $skip: $skip || 0,
      $top: $top || 30,
      $lang: $lang || lang,
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      storeId: storeId || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  });
  const pivots = massageSubscriptionPackagePivots(response.data);
  return ({ data: pivots});
}

export const getSubscriptionPackageItems = async (id: string, params: any) => {  
  let uri: string;
  const { Id, categoryId } = GLOBALS.selectedFeed;
  const { accessToken } = GLOBALS.store!;
  const { $skip, $top, $lang, $groups, storeId } = params;
  if(Id && categoryId ){
    uri = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + `/v3/subscription-packages/${Id}/categories/${categoryId}/items`
  }else{    
    uri = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + `/v3/subscription-packages/${Id}/items`;
  }
  const type: SourceType = SourceType.PACKAGE;
  const response = await GET({
    url: uri,
    params: {
      $skip: $skip || 0,
      $top: $top || 100,
      $lang: $lang || lang,
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      storeId: storeId || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  }); 
  return response;
}

export const getPackageItems = async (id: string, params: any) => {
  const { accessToken } = GLOBALS.store!;
  const { $skip, $top, $lang, $groups, storeId, packageId, categoryId } = params;
  const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.discovery || '') + packageId && categoryId ? `/v3/subscription-packages/${packageId}/categories/${categoryId}/items` : `/v3/packages/${packageId}/titles`;
  const response = await GET({
    url: uri,
    params: {
      $skip: $skip || 0,
      $top: $top || 25,
      $lang: $lang || lang,
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      storeId: storeId || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${accessToken}"`,
    },
  });
  return response;
}

export const getDiscoveryFeeds = async (id?: string, params?: any) => {
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.discoverySSL}v4/feeds/${id}/items`;
  const response = await GET({
    url: url,
    params: {
      $top: 16,
      $groups: GLOBALS.store?.rightsGroupIds,
      $lang: lang,
      storeId: DefaultStore?.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  return response
}

export const getPromotionalCategories = async (id?: string, params?: any) => {  
  const feed = GLOBALS.selectedFeed;
  const { $skip, $top, $lang, $groups, storeId, $countPerStation} = params;
  const url = `${GLOBALS.bootstrapSelectors?.ServiceMap?.Services?.discovery}/v3/categories/${params.id}/subcategories-items`;
  const response = await GET({
    url: url,
    params: {
      $itemsPerRow: $countPerStation,
      $skip: $skip || 0,
      $top: $top || 30,
      $lang: $lang || lang,
      $groups: $groups || GLOBALS.store?.rightsGroupIds,
      storeId: storeId || DefaultStore.Id
    },
    headers: {
      Authorization: `OAUTH2 access_token="${GLOBALS.store?.accessToken}"`,
    },
  });
  const type: SourceType = SourceType.VOD;
  let feedContents: any[] = [];
  for (let category of response?.data) {
      const categoryItem = {
          FeedType: feed.FeedType,
          Id: category.Id,
          Name: category.Name,
          HasMore: (category?.HasMore && category.HasMore) || false,
          NavigationTargetUri: feed?.NavigationTargetUri || "",
          NavigationTargetVisibility: feed?.NavigationTargetVisibility,
          Uri: feed.Uri,
          pivotGroup: feed.pivotGroup,
      };
      feedContents.push(
          new FeedContents(
              categoryItem,
              massageDiscoveryFeed(category, type)
          )
      );
  }  
  return feedContents;
}

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
    { prefix: BASE + "/categories/items", getter: getDiscoveryCategoryItems },
    {
      prefix: BASE + "/categories/items/pivots=true",
      getter: getDiscoverCategoryItemPivots,
    },
    {
      prefix: BASE + "/librariespivotcategories/items/",
      getter: getDiscoveryLibrariesPivotCategories,
    },
    {
      prefix: BASE + "/libraryprograms/complete",
      getter: getDiscoveryLibraryItems,
    },
    {
      prefix: BASE + "/libraryprograms/complete/pivots=true",
      getter: getDiscoverLibraryItemPivots,
    },
    {
      prefix: BASE + "libraryprograms/collections/packages",
      getDiscoveryLibraryPackages,
    },   
    {
      prefix: BASE + "/subscriptionPackage/items",
      getter: getSubscriptionPackageItems,
    },
    {
      prefix: BASE + "/subscriptionPackage/items/pivots=true",
      getter: getSubscriptionPackageCategories,
    },
    {
      prefix: BASE + '/programs/',
      getter: getDiscoveryProgramDetailsById
    },
    {
      prefix: BASE + '/series/',
      getter: getDiscoverySeriesDetailsByID
    },
    { prefix: BASE + '/programSchedules/', getter: getDiscoveryProgramSchedules },
    { prefix: BASE + '/seriesSchedules/', getter: getDiscoverySeriesSchedules },
    { prefix: BASE + '/libraryprograms/collections/packages/', getter: getDiscoveryCollectionItems },
    { prefix: BASE + '/getpackageDetails/', getter: getPackageDetails },
    { prefix: BASE + "/getPackageTitles/", getter: getPackageTitles },
    { prefix: BASE + '/getPackageItems/', getter: getPackageItems },
    { prefix: BASE + '/feeds', getter: getDiscoveryFeeds },
    { prefix: BASE + '/promotionalcategories/items/', getter: getPromotionalCategories }
  ];
  return discoveryUdls;
};
