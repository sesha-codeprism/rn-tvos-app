import React from 'react';
import { getDataFromUDL, getMassagedData } from '../../../../backend';
import { getItemId } from '../../../utils/dataUtils';
import { DefaultStore } from '../../../utils/DiscoveryUtils';
import { GLOBALS } from '../../../utils/globals';

const getSimilarItemsForFeed = async (assetData: any, feed: any) => {
    if (!assetData) {
        console.log("No asset data to make api call..");
        return undefined;
    }
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${assetData.pivots}&id=${id}&itemType=${assetData.contentTypeEnum}`;
    const udlParam = "udl://subscriber/similarprograms/" + params;
    const data = await getDataFromUDL(udlParam);
    const massagedData = getMassagedData(
        "udl://subscriber/similarprograms/",
        data
    );
    // setSimilarData(massagedData);
    return massagedData;
};
const useSimilarItems = (assetData: any, feed: any) => {

}