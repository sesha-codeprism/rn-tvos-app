import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getDataFromUDL } from '../../backend';
import { defaultQueryOptions } from '../config/constants';
import { GLOBALS } from '../utils/globals';

const getChannelRights = async () => {
    try {
        const udl = 'udl://live/channelRights/';
        const response = await getDataFromUDL(udl);
        GLOBALS.channelRights = response?.data;
        return response?.data;
    } catch (e) {
        console.error("Cannot get channelrights due to", e);
        return null;
    }
}

export default function useChannelRights() {
    return useQuery(['udl://live/channelRights/'], getChannelRights, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors && !!GLOBALS.store?.accessToken })
}
