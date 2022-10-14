import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals";
import { DELETE, GET, POST, PUT } from "../utils/common/cloud";
import { DefaultStore } from "../../src/utils/DiscoveryUtils";



export const sendAnalyticsReport = async (logs: any) => {
    const url: string | undefined = GLOBALS.bootstrapSelectors?.ServiceMap.Services.kafkaCollection;
    if (!url) {
        console.log("No URL, nothing to work on");
        return;
    }
    var response = await POST({
        url: `${url}RealTimeLogs`,
        params: logs,
        headers: {
            Authorization: `OAUTH2 access_token="${GLOBALS.store.accessToken}"`,
        },

    });
    return response;
}