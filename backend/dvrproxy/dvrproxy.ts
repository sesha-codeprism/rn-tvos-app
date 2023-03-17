import { lang } from "../../src/config/constants";
import { appQueryCache, queryClient } from "../../src/config/queries";
import { massageDVRFeed } from "../../src/utils/assetUtils";
import { Definition, SourceType } from "../../src/utils/common";
import { findConflictedGroupBySeriesOrProgramId } from "../../src/utils/ConflictUtils";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";
import { GLOBALS } from "../../src/utils/globals";
import { GET, POST, PUT } from "../utils/common/cloud";
import { parseUri } from "../utils/url/urlUtil";


export const DVRPROXY_URL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr;



export const getViewableSubscriptionStems = async (uri: string, params: any) => {
    const subscriptionGroups = queryClient.getQueryData(['dvr', 'get-all-subscriptionGroups']);
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

export const getAllSubscriptionGroups = async (params: any) => {
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

export const getConflicts = async (conflictId: string) => {
    if (!GLOBALS.bootstrapSelectors) {
        return
    }
    const url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/subscription-items/${conflictId}/conflicts`
    const response = await GET({
        url: url,
        params: {
            storeId: DefaultStore.Id
        },
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        },
    });
    return response
}

export const submitSolutionForConflicts = async (conflictId: string, solution: string[]) => {
    if (!GLOBALS.bootstrapSelectors) {
        return
    }
    const url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/subscription-items/${conflictId}/conflict-solution`;

    const response = await PUT({
      url: url,
      params: {
        ...{
            "ScheduledSubscriptionItemIds": solution
        }
      },
      headers: {
        Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
      },
    });
    return response;
  };

  export  const forceResolveConflict = async (subscriptionGroup:any) => {
    if (!GLOBALS.bootstrapSelectors) {
        return
    }
    const [{ Definition: defination,  Id, SubscriptionItems}] = subscriptionGroup || {};
    if(defination === Definition.SERIES || defination === Definition.GENERIC_PROGRAM){
        const url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/subscriptions/${Id}/force-resolve-conflicts`;
        const response = await POST({
            url: url,
            headers: {
              Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
            },
          });
          return response;
    }else if(defination === Definition.SINGLE_PROGRAM || defination === Definition.SINGLE_TIME){
        //const [{SubscriptionId},...rest] = SubscriptionItems;
        const url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/subscriptions/${Id}/force-resolve-conflicts`;
        const response = await POST({
            url: url,
            headers: {
              Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
            },
          });
          return response;
    }
  }

  export const cancelRecordingFromConflictPopup = async (subscriptionGroup: any, ifSeries: boolean, ifSeriesNonConflicted: boolean) => {
    if (!GLOBALS.bootstrapSelectors) {
        return
    }
    let params = null;
    let url = null;
    const [{ Definition: defination,  Id, SubscriptionItems}] = subscriptionGroup || {};
    if(ifSeries && defination === Definition.SERIES || defination === Definition.GENERIC_PROGRAM){
        if(!ifSeriesNonConflicted){
            params =  {"SubscriptionIds":[Id],"SubscriptionItemIds":[]};  // cancels whole series
            url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/batch-cancel-request`;
            const response = await POST({
                url: url,
                params,
                headers: {
                  Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
                },
              });
              return response;
        }else {
            params =  {"SubscriptionIds":[Id],"SubscriptionItemIds":SubscriptionItems?.filter((si: any) => si.ItemState === 'Conflicts')?.map((si: any) => si?.Id)};  // cancels conflicted items
            url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/batch-cancel-request`;
            const response = await POST({
                url: url,
                params,
                headers: {
                  Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
                },
              });
              return response;
        }
    }else if(defination === Definition.SINGLE_PROGRAM || defination === Definition.SINGLE_TIME){
        if(SubscriptionItems.length > 0){
            params =  {"SubscriptionIds":[Id],"SubscriptionItemIds": [SubscriptionItems.map((si: any) => si?.Id)]};// cancel recording for programs
            url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/batch-cancel-request`;
            const response = await POST({
                url: url,
                params,
                headers: {
                  Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
                },
              });
              return response;
        }else if(SubscriptionItems.length === 0){
            params =  {"SubscriptionIds":[Id],"SubscriptionItemIds":[]};
            url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/batch-cancel-request`;
            const response = await POST({
                url: url,
                params,
                headers: {
                  Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`
                },
              });
              return response;
        }
    }
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


export const updateRecordingInBackend = async (subscriptionId: string, subscriptionSettings: any) => {
    if (!GLOBALS.bootstrapSelectors) {
        return;
    }
    const url = `${GLOBALS.bootstrapSelectors.ServiceMap.Services.dvr}v1/subscriptions/${subscriptionId}/settings`;
    const response = await PUT({
        url: url,
        params: subscriptionSettings,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store!.accessToken}"`,
        }
    });
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