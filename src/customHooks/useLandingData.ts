import { useEffect } from "react";
import { useQuery } from "react-query"
import { getLanding } from '../../backend/authentication/authentication';
import { MFGlobalsConfig } from "../../backend/configs/globals";
import { AppStrings } from "../config/strings";
import { GLOBALS, landingInfo } from "../utils/globals";
import { getBestSupportedLocaleID } from "../utils/splash/splash_utils";

const useLanding = () => {
  const landingResponse = useQuery(['landing', MFGlobalsConfig.environment.url], getLanding, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (landingResponse.isSuccess && landingResponse.data?.data) {
      const { tenant, version, sts = MFGlobalsConfig.environment.stsUrl, oauth, acceptLanguage } = landingResponse.data?.data || {};
      if (acceptLanguage) {
        const supportedLocale = getBestSupportedLocaleID(acceptLanguage);
        const firstLanguage = supportedLocale?.split("-")[0] || acceptLanguage.split(";")[0];

        const forRtl = acceptLanguage.split(";")[0];
        const [full, short, isRTL] = forRtl.split(",");

        const local = {
          title: AppStrings.str_settings_locales[supportedLocale] || "English (US)",
          languageCode: supportedLocale,
          short: firstLanguage,
          enableRTL: isRTL,
        };
        if(GLOBALS.store){
          GLOBALS.store.onScreenLanguage = local;
        }
      }
      MFGlobalsConfig.setters.setStsUrl(sts);
      landingInfo.setOauth?.(oauth);
      landingInfo.setTenant?.(tenant);
      landingInfo.setVersion?.(version);
    }
  }, [landingResponse.isSuccess, landingResponse.data?.data]);

  return landingResponse;
};

export default useLanding;