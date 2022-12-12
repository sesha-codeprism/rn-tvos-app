import { useEffect } from "react";
import { useQuery } from "react-query"
import { getLanding } from '../../backend/authentication/authentication';
import { MFGlobalsConfig } from "../../backend/configs/globals";
import { GLOBALS, landingInfo } from "../utils/globals";

const useLanding = () => {
    const landingResponse = useQuery(['landing', MFGlobalsConfig.environment.url], getLanding, {
        cacheTime: Infinity,
        staleTime: Infinity,
      });
      
      useEffect(() => {
        if(landingResponse.isSuccess && landingResponse.data?.data){
            const { tenant, version, sts = MFGlobalsConfig.environment.stsUrl, oauth } = landingResponse.data?.data || {};
            MFGlobalsConfig.setters.setStsUrl(sts);
            landingInfo.setOauth?.(oauth);
            landingInfo.setTenant?.(tenant);
            landingInfo.setVersion?.(version);
        }
      }, [landingResponse.isSuccess, landingResponse.data?.data]);

      return landingResponse;
  };

  export default useLanding;