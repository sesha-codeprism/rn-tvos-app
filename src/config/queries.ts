import { useQueries, useQuery, useQueryClient } from "react-query";
import { getDataFromUDL, getMassagedData } from "../../backend";
import { getAllSubscriberProfiles } from "../../backend/subscriber/subscriber";
import { parseUdl, UdlProviders } from "../../backend/udl/provider";
import { FeedItem, HubsResponse } from "../@types/HubsResponse";
import { DefaultStore } from "../utils/DiscoveryUtils";
import { GLOBALS } from "../utils/globals";
import { appUIDefinition, lang, pivots } from "./constants";

export const queryClient = useQueryClient()
export const appQueryCache = queryClient.getQueryCache();
export interface QueryResponse {
    data: any;
    isError: boolean;
    isLoading: boolean;
    error: any;
    refetch: any;
    isSuccess: boolean;
}


export const getHubs = async () => {
    const pivots = `Language|${GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split('-')?.[0] || 'en'}`;
    const data = await getDataFromUDL(
        `udl://discovery/hubs?rightIds=${GLOBALS.store?.rightsGroupIds}&storeId=${DefaultStore.Id}&pivots=${pivots}&lang=${GLOBALS.store?.onScreenLanguage?.languageCode || lang}`
    );
    const response: HubsResponse = data;
    return response;
};

const getAllUserProfiles = async () => {
    const data = await getAllSubscriberProfiles();
    return data;

}

export function getProfiles() {
    const query = 'get-profiles';
    return useQuery(query, getAllUserProfiles, { staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime });
}

export function getDataForUDL(query: string, pageNo: number = 0, shouldMassageData: boolean = true, shouldSendParams: boolean = true) {
    return useQuery(query, () => { return getUDLData(query, pageNo, shouldMassageData,) }, {
        staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime, keepPreviousData: true, retry: 10
    });
}

export function getAllHubs(): any {
    return useQuery('get-hubs', getHubs, { staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime });
}

const getUDLData = async (uri: string, pageNo: number = 0, shouldMassageData: boolean = true, shouldSendParams: boolean = true) => {
    try {
        const udlID = parseUdl(uri);
        if (udlID!.id in UdlProviders) {
            try {
                const data = await getDataFromUDL(uri, shouldSendParams);
                if (data) {
                    if (shouldMassageData) {
                        return getMassagedData(uri, data);
                    } else {
                        return data;
                    }
                } else {
                    return undefined
                }

            } catch (e) {
                console.log("Cannot get data for UDL", udlID, 'due to', e)
            }
        } else {
            console.log(uri, "has no providers set ");
        }
    } catch (e) {
        console.log("Couldn't get data for UDL", uri, "due to", e);
        return undefined;
    }
}

export function getAllFeedDataForFeed(feed: FeedItem, nowNextMap: any, currentSlots: any, channelRights: any) {
    return useQueries(
        feed.Feeds.map(element => {
            return element.Uri.toLowerCase().includes('live') ? {
                queryKey: ['feed', element.Uri],
                queryFn: () => getUDLData(element.Uri),
                staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime,
                enabled: !!nowNextMap && currentSlots && !!channelRights
            } : element.Uri.toLowerCase().includes('dvr') ? {
                queryKey: ['feed', element.Uri],
                queryFn: () => getUDLData(element.Uri),
                staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime,
                enabled: !!GLOBALS.allSubscriptionGroups

            } : {
                queryKey: ['feed', element.Uri],
                queryFn: () => getUDLData(element.Uri),
                staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime
            }
        }),
    )

}

/** Function to reset React-Query Caches */
export const resetCaches = () => {
    /** Invalidate caches as invalidation would refetch some APIs.. */
    queryClient.invalidateQueries();
    /** Clear out the complete Query and Mutation caches */
    queryClient.clear()
}


export const resetSpecificQuery = async (key: any) => {
    queryClient.invalidateQueries({ queryKey: key }).then(() => {
        console.log('Invalidated', key, "query");
    });
}

export const invalidateQueryBasedOnSpecificKeys = (firstKey: string, secondKey: string) => {
    queryClient
        .invalidateQueries({
            predicate: (query) =>
                query.queryKey[0] === firstKey &&
                //@ts-ignore
                query.queryKey[1] === secondKey,
        })
        .then(() => {
            console.log("Update done");
        })
        .catch((e: any) => console.log("Cannot find Query call", firstKey, secondKey, "due to", e));

}