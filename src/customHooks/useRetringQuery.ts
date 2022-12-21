import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query"
import { appUIDefinition } from "../config/constants";

export function useRetringQuery(queryKey: any, queryFn: any, options: any) {

    const [count, setCount ] = useState(0);
    return useQuery(
        queryKey,
        queryFn,
        {
            refetchInterval(data, query) {
                const { NextCheckInterval, AccessToken, MaxRetryTime } = data || {};
                if (!AccessToken && count < MaxRetryTime) {
                    return NextCheckInterval * 1000;
                    setCount(count + 1);
                } else {
                    // no refetch required
                    return Infinity;
                }
            },
            ...options,
        }
    );
}