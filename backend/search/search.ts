import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { GET } from "../utils/common/cloud";
import { parseUri } from "../utils/url/urlUtil";


export interface SearchParam {
    searchString: string;
    $skip: number;
    $top: number;
    searchLive: boolean;
    mediaTypes?: string;
  }

  const searchItems = async (params: SearchParam) => {
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
  export const registerSearchUdls = () => {
    const BASE = "search";
  
    const searchUdls = [
        { prefix: BASE + "/view-all/", getter: searchItems },

    ];
 return searchUdls;
  };