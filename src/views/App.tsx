import React, { useEffect, useState } from "react";
import RouterOutlet from "../config/navigation/RouterOutlet";
import { GlobalContext } from "../contexts/globalContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { initUIDef } from "../utils/uidefinition";
import { UserProfile } from "../@types/UserProfile";
import { GLOBALS } from "../utils/globals";
import "react-native-gesture-handler";
import { initializeAnalyticsService } from "../utils/analytics/analytics";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface AppProps {}

const App: React.FunctionComponent<AppProps> = (props) => {
  const queryClient = new QueryClient();
  const [userProfile, setUserProfile] = useState({});
  const [onScreenLanguage, setOnScreenLanguage] = useState(
    GLOBALS.store.settings.display.onScreenLanguage
  );
  const [enableRTL, shouldEnableRTL] = useState(GLOBALS.enableRTL);
  async function getLandingData() {
    initUIDef();
  }

  useEffect(() => {
    getLandingData();
    initializeAnalyticsService();
  }, []);

  const updateProfile = (userProfile: UserProfile) => {
    if (userProfile) {
      setUserProfile(userProfile);
    }
  };

  const updateLanguage = (language: any) => {
    setOnScreenLanguage(language);
  };

  const updateRTLStatus = (rtlStatus: boolean) => {
    shouldEnableRTL(rtlStatus);
  };

  const appSettings = {
    userProfile,
    setUserProfile,
    onScreenLanguage,
    setOnScreenLanguage,
    enableRTL,
    shouldEnableRTL,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={appSettings}>
        <RouterOutlet
          isAuthorized={
            GLOBALS.store.accessToken !== null &&
            GLOBALS.store.refreshToken !== null
          }
        />
      </GlobalContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
