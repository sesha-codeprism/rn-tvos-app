import { lang } from "../../src/config/constants";
import { appQueryCache, queryClient } from "../../src/config/queries";
import { massageDVRFeed } from "../../src/utils/assetUtils";
import { SourceType } from "../../src/utils/common";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { GET, POST } from "../utils/common/cloud";
import { parseUri } from "../utils/url/urlUtil";


export const DVRPROXY_URL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr;



export const getViewableSubscriptionStems = async (uri: string, params: any) => {
    const subscriptionGroups = queryClient.getQueryData(['feed', 'get-all-subscriptionGroups']);
    console.log("subscriptionGroups", subscriptionGroups)
    if (!subscriptionGroups) {
        console.error("No subscriptionGroups");
        return undefined
    }
    const channelMap = GLOBALS.channelMap;
    const type: SourceType = SourceType.DVR;
    //@ts-ignore
    return massageDVRFeed(subscriptionGroups.viewableSubscriptions, type, "", channelMap)
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
            storeId: storeId || DefaultStore.Id
        },
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    })
    return response;
}

export const saveRecordingToBackend = async (subcriptionsParams: any) => {
    if (!GLOBALS.bootstrapSelectors) {
        return
    }
    const url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/subscriptions`
    const response = await POST({
        url: url,
        params: subcriptionsParams,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    });
    return response
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