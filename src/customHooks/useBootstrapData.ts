import { useEffect, useState } from "react";
import { useQuery } from "react-query"
import { getBootStrap } from '../../backend/authentication/authentication';
import { MFGlobalsConfig } from "../../backend/configs/globals";
import { parseUri } from "../../backend/utils/url/urlUtil";
import { GLOBALS, landingInfo } from "../utils/globals";
import useLanding from "./useLandingData";

const useBootstrap = () => {
    const landingData = useLanding();
    const [bootstrapUrl, setBootstrapUrl] = useState("");
    const [boothStrapDataLoadStatus, setboothStrapDataLoadStatus] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const bootstrapResults = useQuery(['bootstrap', bootstrapUrl, token], getBootStrap, {
        cacheTime: Infinity,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (GLOBALS.store) {
            /** If localstore has some data.. parse and proceed to home; */
            if (GLOBALS.store.accessToken && GLOBALS.store.refreshToken) {
                !token && setToken(GLOBALS.store.accessToken);
                if (landingData?.isSuccess) {
                    const { sts = MFGlobalsConfig.environment.stsUrl} = landingData.data?.data || {};
                    MFGlobalsConfig.setters.setStsUrl(sts);
                    if (sts) {
                        const url: string = parseUri(sts) + "/bootstrap";
                        !bootstrapUrl && setBootstrapUrl(url);
                        if (bootstrapUrl && bootstrapResults.isSuccess) {
                            setboothStrapDataLoadStatus("NAVIGATEINNTOAPP");
                        } else {
                            setboothStrapDataLoadStatus("WAIT");
                        }
                    } else {
                        console.error('Yikes! This should not happen');
                    }
                } else {
                    setboothStrapDataLoadStatus("WAIT");
                }
            } else {
                setboothStrapDataLoadStatus("NOTOKEN");
            }
        } else {
            if(GLOBALS.store === null){
                setboothStrapDataLoadStatus("STORENOTLOADED");
            }else {
                setboothStrapDataLoadStatus("NOSTORE");
            }
        }
    }, [GLOBALS.store, landingData?.isSuccess, bootstrapUrl, token, bootstrapResults.isSuccess, GLOBALS?.store?.accessToken])

    return [boothStrapDataLoadStatus, bootstrapUrl, token,  bootstrapResults]
};

export default useBootstrap;