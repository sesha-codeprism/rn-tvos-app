import { lang } from "../../src/config/constants";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { GET } from "../utils/common/cloud";


export const DVRPROXY_URL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr;



export const getViewableSubscriptionStems = async (uri: string, params: any) => {
    const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr}v1/subscription-groups/`;
    const paramsObject = {
        "$type-filter": "all",
        "$state-filter": "viewable-scheduled-failed",
        "$orderby": "startdate",
        //TODO: Fix this language hardcoding
        "$lang": "en-US",
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

export const getScheduledSubscriptionGroups = async (uri: string, params: any) => {
    const url = `${GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr}v1/subscription-groups/`;
    const paramsObject = {
        "$type-filter": "all",
        "$state-filter": "scheduled",
        "$orderby": "startdate",
        //TODO: Fix this language hardcoding
        "$lang": "en-US",
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
        "$state-filter": params?.state || "viewable-scheduled",
        "$orderby": params?.orderBy || "startdate",
        //TODO: Fix this language hardcoding
        "$lang": "en-US",
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


export const registerDVRProxyUdls = () => {
    const BASE = 'dvrproxy';
    const dvrProxyUdls = [
        { prefix: BASE + '/viewable-subscription-items/', getter: getViewableSubscriptionStems },
        { prefix: BASE + '/get-scheduled-subscription-groups/', getter: getScheduledSubscriptionGroups },
        { prefix: BASE + '/get-all-subscriptionGroups/', getter: getAllSubscriptionGroups }
    ];
    return dvrProxyUdls;
}