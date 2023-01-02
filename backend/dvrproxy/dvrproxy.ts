import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { GET } from "../utils/common/cloud";


export const DVRPROXY_URL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr;



export const getViewableSubscriptionStems = async (uri: string, params: any) => {
    const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr}v1/subscription-groups/`;
    const paramsObject = {
        "$type-filter": "all",
        "$state-filter": "viewable-scheduled",
        "$orderby": "startdate",
        "$lang": "en-US",
        "storeId": DefaultStore.Id
    }
    const response = await GET({
        url,
        params: paramsObject,
        headers: {
            //TODO: Fix this hardcoding token issue.. Need to read from the bootstrap derived token
            Authorization: `OAUTH2 access_token="AuthToken1lVFRb9sgGPw18VssAwbDgx_cNGmzOGu0Nm33NGH40tDaxgW7jffrR6JUk6ZV2iQEp-O-A90VgzbQKsj3fd_5CSkmeBGWg3o07VMnXT_GGt7ixsX9G1G1HXSsbBMk0dL7Adwfg773n-mPwt86tYdG-vjQ1N7KLrbuKbDvPmw4SWg4TpvR0PamHwNUtTTN8b6VzfG75Yzc8rvVy4_VfjMmNUF63Gq98OvNYlPx59dHVd6_lvrL9-gbyLrJy-X9fHkZ3UEr236pcw07OdR9dAlvRsHd2EH-ANVs72wDZzKo1DSFJBVE7aaV4CgBKqckEcATDrSKCqXscLLz4PfSh8ykk89D7KWZpEkD2sgX054yCKanF7ce3L8NLED2g4MrZ4cuTGAuMopFdDb4nwiuXDDwOeKco5DrBUYZypgIiBIm0iOFBKOUBZARllB-FBHOExEVdW3fQX8E53NZ138vszHKWW93_bnyjzr5sU72SZ3O1pD7ofLKmQpcVAz93jrzU_bGtmvpX3LCEywo4ghhwjCmHKWMMsxCHZkgLJofOuPA37Q5YhnOMBUJi2YuhAf6TDIiaCBXMF4NRgeKhUZpNcUqlaFhlU4lk3IqFBYsFTxEAdH1upjdXheYsnxeltn71_LyevO0eizsBO8A2Yvnh4ebALvDbUVXWAxdN2-2a7ndToj-BQ"`,
        },
    })
    return response;
}


export const registerDVRProxyUdls = () => {
    const BASE = 'dvrproxy';
    const dvrProxyUdls = [
        { prefix: BASE + '/viewable-subscription-items/', getter: getViewableSubscriptionStems }
    ];
    return dvrProxyUdls;
}