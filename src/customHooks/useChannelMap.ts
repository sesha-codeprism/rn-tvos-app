import { useEffect, useState } from "react"
interface ChannelMapProps { }

const useChannelMap = (params?: ChannelMapProps) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    // Refetch timer duration in milliseconds
    const [intervalTimer, setIntervalTimer] = useState(120000); // 2 mins timeout for testing
    // const [intervalTimer, setIntervalTimer] = useState(10800000); // 3*(1000*60 * 60)
}