import { useEffect, useState } from "react";
import { useQuery } from "react-query"
import { getLanding } from '../../backend/authentication/authentication';
import { MFGlobalsConfig } from "../../backend/configs/globals";
import { AppStrings } from "../config/strings";
import { GLOBALS, landingInfo } from "../utils/globals";
import { getBestSupportedLocaleID } from "../utils/splash/splash_utils";

const useLanding = (url: string) => {
  const [landingUrl, setLandingUrl] = useState(GLOBALS.store?.MFGlobalsConfig.url);
  const landingResponse = useQuery(['landing', landingUrl], getLanding, {
    cacheTime: Infinity,
    staleTime: Infinity,
    retry: 5,
    enabled: !!GLOBALS.store
  });

  useEffect(() => {
    setLandingUrl(url);
  }, [url]);

  useEffect(() => {
    if (landingResponse.isSuccess && landingResponse.data?.data) {
      const { tenant, version, sts = MFGlobalsConfig.stsUrl, oauth, acceptLanguage } = landingResponse.data?.data || {};
      if (acceptLanguage && GLOBALS.store.settings.display.onScreenLanguage.languageCode == "") {
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
        if (GLOBALS.store) {
          GLOBALS.store.onScreenLanguage = local;
          GLOBALS.store.settings.display.onScreenLanguage = local;
        }
      }
      MFGlobalsConfig.stsUrl = sts;
      landingInfo.setOauth?.(oauth);
      landingInfo.setTenant?.(tenant);
      landingInfo.setVersion?.(version);
    }
  }, [landingResponse.isSuccess, landingResponse.data?.data]);
  return landingResponse;
};

export default useLanding;