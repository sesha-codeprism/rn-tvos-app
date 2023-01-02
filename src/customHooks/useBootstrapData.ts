import { useEffect, useState } from "react";
import { useQuery } from "react-query"
import { getBootStrap } from '../../backend/authentication/authentication';
import { MFGlobalsConfig } from "../../backend/configs/globals";
import { parseUri } from "../../backend/utils/url/urlUtil";
import { GLOBALS, landingInfo } from "../utils/globals";
import useLanding from "./useLandingData";

const useBootstrap = (accessToken: string | null = null, refreshToken: string | null = null) => {
    const landingData = useLanding(GLOBALS.store?.MFGlobalsConfig.url);
    const [bootstrapUrl, setBootstrapUrl] = useState("");
    const [bootStrapDataLoadStatus, setbootStrapDataLoadStatus] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const bootstrapResults = useQuery(['bootstrap', bootstrapUrl, token], getBootStrap, {
        cacheTime: Infinity,
        staleTime: Infinity,
        retry: false
    });

    useEffect(() => {
        if (GLOBALS.store) {
            /** If localstore has some data.. parse and proceed to home; */
            if ((GLOBALS.store.accessToken || accessToken) && (GLOBALS.store.refreshToken || refreshToken)) {
                !token && setToken(GLOBALS.store.accessToken || accessToken);
                if (landingData?.isSuccess) {
                    const { sts = MFGlobalsConfig.stsUrl } = landingData.data?.data || {};
                    MFGlobalsConfig.stsUrl = sts;
                    if (sts) {
                        const url: string = parseUri(sts) + "/bootstrap";
                        !bootstrapUrl && setBootstrapUrl(url);
                        if (bootstrapUrl && bootstrapResults.isSuccess) {
                            setbootStrapDataLoadStatus("NAVIGATEINNTOAPP");
                        } else if (bootstrapUrl && bootstrapResults.isError) {
                            const { error: { response: { data, status } = {} } = {} } = bootstrapResults;
                            if (data === "Device not provisioned." && status === 401) {
                                setbootStrapDataLoadStatus("NAVIGATETOSHORTCODE");
                            }
                        } else {
                            setbootStrapDataLoadStatus("WAIT");
                        }
                    } else {
                        console.error('Yikes! This should not happen');
                    }
                } else {
                    setbootStrapDataLoadStatus("WAIT");
                }
            } else {
                setbootStrapDataLoadStatus("NOTOKEN");
            }
        } else {
            if (GLOBALS.store === null) {
                setbootStrapDataLoadStatus("STORENOTLOADED");
            } else {
                setbootStrapDataLoadStatus("NOSTORE");
            }
        }
    }, [GLOBALS.store, landingData?.isSuccess, bootstrapUrl, token, bootstrapResults.isSuccess, bootstrapResults.isError, GLOBALS?.store?.accessToken])

    useEffect(() => {
        if (!token || (accessToken && token !== accessToken)) {
            setToken(accessToken);
        }
    }, [accessToken]);


    return [bootStrapDataLoadStatus, bootstrapUrl, token, bootstrapResults]
};

export default useBootstrap;