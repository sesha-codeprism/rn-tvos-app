import { GLOBALS } from "../../src/utils/globals";
import { GET } from "../utils/common/cloud";


export const DVRPROXY_URL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr;



export const getViewableSubscriptionStems = async (uri: string, params: any) => {
    const url = `${DVRPROXY_URL}/v1/subscription-groups`;
    const response = await GET({
        url,
        params: params,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
        },
    })
    return response;
}


export const registerDVRProxyUdls = () => {
    const BASE = 'dvrproxy';
    const dvrProxyUdls = [
        { prefix: BASE + '/viewable-subscription-items/', getter: getViewableSubscriptionStems }
    ];
    return dvrProxyUdls;
}