import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getDataFromUDL } from '../../backend';
import { defaultQueryOptions } from '../config/constants';
import { GLOBALS } from '../utils/globals';

const useChannelRights = async () => {
    useEffect(() => {
        if (__DEV__) {
            console.log("UseEffect from useChannelRights");
        }
    }, [])
    const getChannelRights = async () => {
        try {
            const udl = 'udl://live/channelRights/';
            const response = await getDataFromUDL(udl);
            return response?.data;
        } catch (e) {
            console.error("Cannot get channelrights due to", e);
            return null;
        }
    }
    const { data: channelRights } = useQuery(['get-channel-rights'], getChannelRights, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors && !!GLOBALS.store?.accessToken });

    useEffect(() => {
        GLOBALS.channelRights = channelRights;
    }, [channelRights])
    return channelRights;
}

export default useChannelRights;