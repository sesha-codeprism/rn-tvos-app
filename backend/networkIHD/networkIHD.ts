import { Protocol } from "../../src/config/config";
import { GLOBALS } from "../../src/utils/globals";
import { POST } from "../utils/common/cloud";

export const getNetworkIHD =  async ( params: any ) => {
    const{ connectionUrl, inHomeApiEndpoint } = params;
    const InHomeToken = GLOBALS.bootstrapSelectors?.InHomeToken;
    const AccountId = GLOBALS.bootstrapSelectors?.AccountId;
    const updatedInHomeApiEndpoint = inHomeApiEndpoint.replace("{accountId}",AccountId);
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${InHomeToken}`
    };
    const response = await POST({
        url: `${Protocol.https}://${connectionUrl}${updatedInHomeApiEndpoint}`,
        headers: headers
    });
    GLOBALS.networkIHD = response?.data;
    return response?.data;
}