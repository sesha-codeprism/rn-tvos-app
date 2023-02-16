import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { GET } from "../utils/common/cloud";
import { parseUri } from "../utils/url/urlUtil";


export const DVRPROXY_URL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr;



export const getViewableSubscriptionStems = async (uri: string, params: any) => {
    const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr}v1/subscription-groups/`;
    const paramsObject = {
        "$type-filter": "all",
        "$state-filter": "viewable",
        "$orderby": "startdate",
        "$lang": lang,
        "storeId": DefaultStore.Id
    }
    const response = await GET({
        url,
        params: paramsObject,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    })
    let data = response.data;
    const viewableItems = data.SubscriptionGroups.filter((element: any) => element.SubscriptionItems.length > 0);
    data.SubscriptionGroups = viewableItems;
    return { data: data };
}

export const getScheduledSubscriptionGroups = async (uri: string, params: any) => {
    const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr}v1/subscription-groups/`;
    const paramsObject = {
        "$type-filter": "all",
        "$state-filter": "scheduled",
        "$orderby": "startdate",
        "$lang": lang,
        "storeId": DefaultStore.Id
    }
    const response = await GET({
        url,
        params: paramsObject,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    })
    return response;
}

export const getAllSubscriptionGroups = async (uri: string, params: any) => {
    const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr}v1/subscription-groups/`;
    const paramsObject = {
        "$type-filter": params?.type || "all",
        "$state-filter": params?.state || "viewable-scheduled-failed",
        "$orderby": params?.orderBy || "startdate",
        "$lang": lang,
        "storeId": DefaultStore.Id
    }
    const response = await GET({
        url,
        params: paramsObject,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    })
    return response;
}

export const getDVRRecorders = async (id: string, params: any) => {
    const { storeId } = params || DefaultStore?.Id;
    const uri: string = parseUri(GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr || '') + '/v1/subscriber-recorders';
    const response = await GET({
        url: uri,
        params: {
            storeId: storeId
        },
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    })
    return response;
}


export const registerDVRProxyUdls = () => {
    const BASE = 'dvrproxy';
    const dvrProxyUdls = [
        { prefix: BASE + '/viewable-subscription-items/', getter: getViewableSubscriptionStems },
        { prefix: BASE + '/get-scheduled-subscription-groups/', getter: getScheduledSubscriptionGroups },
        { prefix: BASE + '/get-all-subscriptionGroups/', getter: getAllSubscriptionGroups },
        { prefix: BASE + '/get-dvr-recorders/', getter: getDVRRecorders }
    ];
    return dvrProxyUdls;
} 