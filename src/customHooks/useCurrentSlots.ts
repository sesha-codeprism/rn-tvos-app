import React, { useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import { useQuery } from 'react-query';
import { GLOBALS } from '../utils/globals';

interface CurrentSlotsParams {

}
const useCurrentSlots = (params?: CurrentSlotsParams) => {
    // Refetch timer duration in milliseconds
    const [intervalTimer, setIntervalTimer] = useState(120000); // 2 mins timeout for testing
    // const [intervalTimer, setIntervalTimer] = useState(10800000); // 3*(1000*60 * 60)
    const getSlotsData = () => {
        return NativeModules.MKGuideBridgeManager.getCurrentSlots(true, (result: any) => {
            const data = JSON.parse(result);
            const finalData = data.map((element: CurrentSlotObject) => element);
            return finalData;
        });
    };


    const currentSlotsQuery = useQuery(['get-current-slots'], () => { getSlotsData() }, { refetchInterval: intervalTimer })

    useEffect(() => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        console.log("Fetched", currentSlotsQuery, "at", dateTime)
        //@ts-ignore
        GLOBALS.currentSlots = currentSlotsQuery.data;
        console.log(GLOBALS);
    }, [currentSlotsQuery.isSuccess, currentSlotsQuery.data])
    return currentSlotsQuery;
}

export default useCurrentSlots