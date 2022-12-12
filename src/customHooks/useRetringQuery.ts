import React from "react";
import { useQuery, useQueryClient } from "react-query"
import { appUIDefinition } from "../config/constants";

export function useRetringQuery(queryKey: any, queryFn: any, options: any) {

    return useQuery(
        queryKey,
        queryFn,
        {
            refetchInterval(data, query) {
                const { NextCheckInterval, AccessToken } = data || {};
                if (!AccessToken) {
                    return NextCheckInterval * 1000;
                } else {
                    // no refetch requird
                    return Infinity;
                }
            },
            ...options,
        }
    );
}