import React from 'react';
import { NativeModules } from 'react-native';
import { useQuery } from 'react-query';
import { DefaultStore } from '../utils/DiscoveryUtils';
import { GLOBALS } from '../utils/globals';
import { buildNowNextMap, getChannelMap } from '../utils/live/LiveUtils';
import useChannelRights from './useChannelRights';

// const intervalTimer = 10800000; // 3*(1000*60 * 60)

const intervalTimer = 1800000; //30*(1000*60)
const getLiveData = async (channelRightsInfo: any) => {
    try {
        return new Promise(async (resolve, reject) => {
            return NativeModules.MKGuideBridgeManager.getCurrentSlots(
                true,
                (currentSlots: any) => {
                    const data = JSON.parse(currentSlots);
                    const parsedSlots = data.map((element: CurrentSlotObject) => element);
                    GLOBALS.currentSlots = parsedSlots;
                    NativeModules.MKGuideBridgeManager.getChannelMapInfo((channelMap: any) => {
                        const memoizedChannelMap = getChannelMap(channelMap, channelRightsInfo, DefaultStore.Id, "en-US");
                        GLOBALS.channelMap = memoizedChannelMap;
                        const nowNextSchedules = buildNowNextMap(GLOBALS.currentSlots, memoizedChannelMap);
                        GLOBALS.nowNextMap = nowNextSchedules;
                        const finalLiveData = { slots: parsedSlots, channelMap: memoizedChannelMap, nowNextSchedules: nowNextSchedules }
                        console.log("Finally done..", finalLiveData)
                        resolve(finalLiveData);
                    })
                }
            );
        })
    } catch (e) {
        console.log("Error in useLive", e)
    }
}

export default function useLiveData(channelMapInfo: any) {
    // const { data: channelMapInfo } = useChannelRights();
    // console.log("channelMapInfo in useLiveData", channelMapInfo)
    return useQuery(['get-live-data'], () => getLiveData(channelMapInfo), { refetchInterval: intervalTimer, enabled: !!GLOBALS.bootstrapSelectors?.ServiceMap.Services && !!channelMapInfo, refetchIntervalInBackground: true })
}

