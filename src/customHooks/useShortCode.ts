import { useEffect, useState } from "react";
import { useQuery } from "react-query"
import { getShortCodeAuthenticate } from '../../backend/authentication/authentication';
import { appUIDefinition } from "../config/constants";
import { GLOBALS } from "../utils/globals";
import useLanding from "./useLandingData";
import { useRetringQuery } from "./useRetringQuery";
import { MFGlobalsConfig } from "../../backend/configs/globals";

const useShortCode = (url: string) => {
  useEffect(() => {
    setLandingUrl(url);
  }, [url]);
  const [landingUrl, setLandingUrl] = useState(GLOBALS.store?.MFGlobalsConfig.url);

  const landingResponse = useLanding(landingUrl);
  return useRetringQuery(['shotcode', landingResponse, GLOBALS.deviceInfo], getShortCodeAuthenticate, {
    cacheTime: appUIDefinition.config.queryCacheTime,
    staleTime: appUIDefinition.config.queryStaleTime,
    enabled: !!GLOBALS.store && !!landingResponse
  });



};

export default useShortCode;