import { cloneDeep, uniqBy } from 'lodash';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getDataFromUDL, getMassagedData } from '../../backend';
import { getSubscriptiongroups } from '../../backend/dvrproxy/dvrproxy';
import { defaultQueryOptions } from '../config/constants';
import { DvrItemState } from '../utils/common';
import { SubscriptionGroupsResponse } from '../utils/DVRUtils';
import { GLOBALS } from '../utils/globals';


// const usableSubscriptionGroup = [...data.data.SubscriptionGroups.filter((element: any) => element.SubscriptionItems.length > 0)];
// const viewableSubscriptionGroups = [...usableSubscriptionGroup.filter((e: any) => e.SubscriptionItems.filter((element: any) => element.ItemState === DvrItemState.RECORDED || element.ItemState === DvrItemState.RECORDING).length > 0)];
// const scheduledSubscriptionGroup = [...usableSubscriptionGroup.filter((e: any) => e.SubscriptionItems.filter((element: any) => element.ItemState === DvrItemState.SCHEDULED).length > 0)];


const useAllSubscriptionGroups = (globals: any) => {
    useEffect(() => {
        if (__DEV__) {
            console.log("UseEffect in allSubscriptionGroups")
        }
    }, [])
    const getAllSubscriptionGroups = async () => {
        const { data: viewable } = await getSubscriptiongroups('viewable');
        const { data: scheduled } = await getSubscriptiongroups('scheduled');
        GLOBALS.viewableSubscriptions = viewable;
        GLOBALS.scheduledSubscriptions = scheduled;
        console.log("viewable", viewable, "scheduled", scheduled);

        if (!viewable || !scheduled) {
            return;
        }

        viewable.SubscriptionGroups.forEach((viewableSubscriptionGroup: any) => {
            scheduled.SubscriptionGroups.forEach((scheduledSubscriptionGroup: any) => {
                if (viewableSubscriptionGroup.SubscriptionItems.length && scheduledSubscriptionGroup.SubscriptionItems.length) {
                    if (viewableSubscriptionGroup.Id === scheduledSubscriptionGroup.Id) {
                        viewableSubscriptionGroup.SubscriptionItems = uniqBy(
                            [
                                ...viewableSubscriptionGroup.SubscriptionItems,
                                ...scheduledSubscriptionGroup.SubscriptionItems,
                            ],
                            "Id"
                        ); // Merging items of subscriptionGroups
                    }
                }
            });
        });

       const allSubscriptionGroups = {
            ...(scheduled || {}),
            SubscriptionGroups: [
                ...((scheduled &&
                    scheduled.SubscriptionGroups) ||
                    []),
                ...((viewable &&
                    viewable.SubscriptionGroups) ||
                    []),
            ],
        };
        console.log("allSubscriptionGroups", allSubscriptionGroups)
        GLOBALS.allSubscriptionGroups = allSubscriptionGroups;
        return { allSubscriptions: viewable, viewableSubscriptions: GLOBALS.viewableSubscriptions, scheduledSubscriptions: GLOBALS.scheduledSubscriptions };
        // UDL to get all the subscription groups.. we'll refetch this later on when Duplex fires..
        // const udlParams = "udl://dvrproxy/get-all-subscriptionGroups";
        // const data = await getDataFromUDL(udlParams);
        // const groups = cloneDeep(data.data);

        // GLOBALS.rawSubscriptionGroupsResponse = cloneDeep(groups);

        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 1. ', GLOBALS.rawSubscriptionGroupsResponse);
        // // Map to contain IDs of empty groups. Not sure why backend sends this but need to handle this..
        // const objFilter: any = {};
        // // Generating a list of usable groups i.e., removing all empty groups (believed to be deleted recordings)
        // let feedContentlist =
        //     data.data &&
        //     data.data?.SubscriptionGroups?.filter((item: any) => {
        //         const { SubscriptionItems = [] } =
        //             item || {};
        //         // let id = SeriesId || SubscriptionItems[0]?.ProgramId;
        //         // if (objFilter[id] === undefined) {
        //         //     objFilter[id] = id;
        //         return SubscriptionItems.length > 0;
        //     });
        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 2. ', GLOBALS.rawSubscriptionGroupsResponse);
        // // Deep cloning to prevent unexpected changes to list
        // const usableGroups = cloneDeep(feedContentlist)
        // const response: SubscriptionGroupsResponse = groups;
        // response.SubscriptionGroups = usableGroups
        // // Deep cloning original list to filter out Viewable recordings..
        // const viewGroups = cloneDeep(data.data);
        // const viewableFilter = cloneDeep(feedContentlist);
        // const viewableSubscriptions: SubscriptionGroupsResponse = viewGroups;
        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 3. ', GLOBALS.rawSubscriptionGroupsResponse);
        // viewableSubscriptions.SubscriptionGroups = [...viewableFilter].filter((element) => element.SubscriptionItems[0]?.ItemState === DvrItemState.RECORDED || element.SubscriptionItems[0]?.ItemState === DvrItemState.RECORDING);
        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 4. ', GLOBALS.rawSubscriptionGroupsResponse);
        // // Deep cloning original list to filter out Scheduled recordings..
        // const scheduleGroups = cloneDeep(data.data)
        // const scheduledFilter = cloneDeep(feedContentlist);
        // const scheduledSubscriptions: SubscriptionGroupsResponse = scheduleGroups;
        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 5. ', GLOBALS.rawSubscriptionGroupsResponse);
        // scheduledSubscriptions.SubscriptionGroups = [...scheduledFilter].filter((element) => element.SubscriptionItems[0]?.ItemState === DvrItemState.SCHEDULED);
        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 6. ', GLOBALS.rawSubscriptionGroupsResponse);
        // GLOBALS.allSubscriptionGroups = response;
        // GLOBALS.viewableSubscriptions = viewableSubscriptions;
        // GLOBALS.scheduledSubscriptions = scheduledSubscriptions;
        // console.log('GLOBALS.rawSubscriptionGroupsResponse  >>>>>>>> 7. ', GLOBALS.rawSubscriptionGroupsResponse);
        // GLOBALS.subscriptionObservable.connect()
        // return { allSubscriptions: GLOBALS.rawSubscriptionGroupsResponse, viewableSubscriptions: undefined, scheduledSubscriptions: scheduledSubscriptions }
    }
    const subscrptionGroups =
        useQuery(['dvr', 'get-all-subscriptionGroups'], getAllSubscriptionGroups, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors })
    useEffect(() => {
        if (!subscrptionGroups.data) {
            return;
        }
    }, [subscrptionGroups.data, subscrptionGroups.isSuccess, GLOBALS])
    return subscrptionGroups.data;
}

export default useAllSubscriptionGroups

// export default function useAllSubscriptionGroups() {
//     return useQuery(['feed', 'get-all-subscriptionGroups'], getAllSubscriptionGroups, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors })
// }

