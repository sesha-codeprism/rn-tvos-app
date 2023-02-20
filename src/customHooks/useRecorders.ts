import React from 'react';
import { useQuery } from 'react-query';
import { getDataFromUDL } from '../../backend';
import { defaultQueryOptions } from '../config/constants';
import { GLOBALS } from '../utils/globals';

const getDVRRecorders = async () => {
    //get-dvr-recorders
    const udlParams = "udl://dvrproxy/get-dvr-recorders/";
    const data = await getDataFromUDL(udlParams);
    GLOBALS.recorders = { recorders: data.data };
    return data.data;
}

export default function useDVRRecorders() {
    return useQuery(['get-dvr-recorders'], getDVRRecorders, { ...defaultQueryOptions, enabled: !!GLOBALS.bootstrapSelectors })
}