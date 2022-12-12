import { useQuery } from "react-query"
import { getShortCodeAuthenticate } from '../../backend/authentication/authentication';
import { appUIDefinition } from "../config/constants";
import { GLOBALS } from "../utils/globals";
import useLanding from "./useLandingData";
import { useRetringQuery } from "./useRetringQuery";

const useShortCode = () => {
    const landingResponse = useLanding();
    return useRetringQuery(['shotcode',landingResponse, GLOBALS.deviceInfo], getShortCodeAuthenticate, {
        cacheTime: appUIDefinition.config.queryCacheTime,
        staleTime: appUIDefinition.config.queryStaleTime,
      });
  };

  export default useShortCode;