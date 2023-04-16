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

const searchItems = async (id: string, params: any) => {
  console.log("searchItems", id, params);
  const url: string =
    parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.search || "") +
    "/v4/search/items";
  const response = await GET({
    url: url,
    params: params,
    headers: {
      authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
    },
  });
  return response;
};
export const registerSearchUdls = () => {
  const BASE = "search";

  const searchUdls = [{ prefix: BASE + "/view-all/", getter: searchItems }];
  return searchUdls;
};
