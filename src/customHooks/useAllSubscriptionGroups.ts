import React from 'react';
import { getDataFromUDL, getMassagedData } from '../../backend';

const getAllSubscriptionGroups = async () => {
    const udlParams = "udl://dvrproxy/get-scheduled-subscription-groups/";
    const data = await getDataFromUDL(udlParams);
    const massagedData = getMassagedData(udlParams, data);
    return massagedData
}