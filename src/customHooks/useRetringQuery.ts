import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query"
import { appUIDefinition } from "../config/constants";

export function useRetringQuery(queryKey: any, queryFn: any, options: any) {

    // const [count, setCount] = useState(0);
    return useQuery(
        queryKey,
        queryFn,
        {
            refetchInterval(data, query) {
                const { NextCheckInterval = 4, AccessToken, MaxRetryTime } = data || {};
                if(AccessToken){
                    return Infinity;
                }else {
                    // setCount(count + 1);
                    return NextCheckInterval * 1000;
                }
            },
            ...options,
        }
    );
}