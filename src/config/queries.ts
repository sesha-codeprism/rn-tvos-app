import { Query, RefetchOptions, RefetchQueryFilters, useQueries, useQuery } from "react-query";
import { getDataFromUDL } from "../../backend";
import { getAllSubscriberProfiles } from "../../backend/subscriber/subscriber";
import { parseUdl, UdlProviders } from "../../backend/udl/provider";
import { FeedItem, HubsResponse } from "../@types/HubsResponse";
import { SourceType } from "../utils/common";
import { DefaultStore, massageDiscoveryFeed } from "../utils/DiscoveryUtils";
import { GLOBALS } from "../utils/globals";
import { massageSubscriberFeed } from "../utils/Subscriber.utils";
import { lang, pivots } from "./constants";

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
    // const { isLoading, isError, data, error, refetch, isSuccess } = ;
    // const getProfilesResponse: QueryResponse = {
    //     data,
    //     isError,
    //     isLoading,
    //     error,
    //     refetch,
    //     isSuccess,
    // };
    return useQuery(query, getAllUserProfiles, { staleTime: 36000, cacheTime: 36000 });
}

// export const getAllHubs = async () => {
//     const query = 'get-hubs';
//     const { isLoading, isError, data, error, refetch, isSuccess } = useQuery(query, getHubs);
//     const getHubsResponse: QueryResponse = { data, isError, isLoading, error, refetch, isSuccess };
//     return getHubsResponse;
// }

export function getDataForUDL(query: string, pageNo: number = 0) {
    return useQuery(query, () => { return getUDLData(query, pageNo) }, { cacheTime: 86400, staleTime: 86400, keepPreviousData: true });
}

export function getAllHubs(): any {
    return useQuery('get-hubs', getHubs, { staleTime: 36000, cacheTime: 36000 });
}

const getUDLData = async (uri: string, pageNo: number = 0) => {
    try {
        const udlID = parseUdl(uri);
        if (udlID!.id in UdlProviders) {
            try {
                const data = await getDataFromUDL(uri);
                // console.log(uri, data);
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
                cacheTime: 86400,
                staleTime: 86400
            }
        }),
    )

}