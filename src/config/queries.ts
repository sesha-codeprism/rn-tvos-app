import { useQueries, useQuery, useQueryClient } from "react-query";
import { getDataFromUDL } from "../../backend";
import { getAllSubscriberProfiles } from "../../backend/subscriber/subscriber";
import { parseUdl, UdlProviders } from "../../backend/udl/provider";
import { FeedItem, HubsResponse } from "../@types/HubsResponse";
import { SourceType } from "../utils/common";
import { DefaultStore, massageDiscoveryFeed } from "../utils/DiscoveryUtils";
import { GLOBALS } from "../utils/globals";
import { massageSubscriberFeed } from "../utils/Subscriber.utils";
import { appUIDefinition, lang, pivots } from "./constants";

const queryClient = useQueryClient()
export interface QueryResponse {
    data: any;
    isError: boolean;
    isLoading: boolean;
    error: any;
    refetch: any;
    isSuccess: boolean;
}

export const getHubs = async () => {
    const data = await getDataFromUDL(
        `udl://discovery/hubs?rightIds=${GLOBALS.store.rightsGroupIds}&storeId=${DefaultStore.Id}&pivots=${pivots}&lang=${lang}`
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

export function getDataForUDL(query: string, pageNo: number = 0) {
    return useQuery(query, () => { return getUDLData(query, pageNo) }, { staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime, keepPreviousData: true });
}

export function getAllHubs(): any {
    return useQuery('get-hubs', getHubs, { staleTime: appUIDefinition.config.queryStaleTime, cacheTime: appUIDefinition.config.queryCacheTime });
}

const getUDLData = async (uri: string, pageNo: number = 0) => {
    try {
        const udlID = parseUdl(uri);
        if (udlID!.id in UdlProviders) {
            try {
                const data = await getDataFromUDL(uri);
                if (data) {
                    if (udlID!.id.split("/")[0] === 'discovery') {
                        const massagedData = massageDiscoveryFeed(data.data, SourceType.VOD);
                        console.log("massageDiscoveryFeed for", uri, "is", massagedData);
                        return massagedData;
                    } else {
                        const massagedData = massageSubscriberFeed(data.data, "", SourceType.VOD);
                        console.log("massageSubscriberFeed for", uri, "is", massagedData);

                        return massagedData;
                    }
                } else {
                    return undefined
                }

            } catch (e) {
                console.log("Cannot get data for UDL", udlID)
            }
        } else {
            console.log(uri, "has no providers set ");
        }
    } catch (e) {
        console.log("Couldn't get data for UDL", uri, "due to", e);
        return undefined;
    }
}

export function getAllFeedDataForFeed(feed: FeedItem) {
    return useQueries(
        feed.Feeds.map(element => {
            return {
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
