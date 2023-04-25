import { uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getSubscriptiongroups } from '../../backend/dvrproxy/dvrproxy';
import { defaultQueryOptions } from '../config/constants';
import { queryClient } from '../config/queries';
import { GLOBALS } from '../utils/globals';
import { NativeModules } from 'react-native';


export const getAllSubscriptionGroups = async () => {
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
    NativeModules.MKGuideBridgeManager.setSubscriptionGroupResponse(allSubscriptionGroups);
    console.log("allSubscriptionGroups", allSubscriptionGroups)
    GLOBALS.allSubscriptionGroups = allSubscriptionGroups;
    return { allSubscriptions: viewable, viewableSubscriptions: GLOBALS.viewableSubscriptions, scheduledSubscriptions: GLOBALS.scheduledSubscriptions };
}

const useAllSubscriptionGroups = (globals: any) => {
    useEffect(() => {
        if (__DEV__) {
            console.log("UseEffect in allSubscriptionGroups")
        }
    }, [])

    const subscrptionGroups =
        useQuery(['dvr', 'get-all-subscriptionGroups'], getAllSubscriptionGroups, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors })
    useEffect(() => {
        if (!subscrptionGroups.data) {
            return;
        }
        queryClient.refetchQueries(["dvrfeed"]);
    }, [subscrptionGroups.data, subscrptionGroups.isSuccess, GLOBALS])
    return subscrptionGroups.data;
}

export default useAllSubscriptionGroups

// export default function useAllSubscriptionGroups() {
//     return useQuery(['feed', 'get-all-subscriptionGroups'], getAllSubscriptionGroups, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors })
// }

