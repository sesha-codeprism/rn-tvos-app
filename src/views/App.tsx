import React, { useEffect, useState } from "react";
import RouterOutlet from "../config/navigation/RouterOutlet";
import { GlobalContext } from "../contexts/globalContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { initUIDef } from "../utils/uidefinition";
import { UserProfile } from "../@types/UserProfile";
import { GLOBALS } from "../utils/globals";
import "react-native-gesture-handler";
import { initializeAnalyticsService } from "../utils/analytics/analytics";

interface AppProps {}

const App: React.FunctionComponent<AppProps> = (props) => {
  const queryClient = new QueryClient();
  const [userProfile, setUserProfile] = useState({});
  const [onScreenLanguage, setOnScreenLanguage] = useState(
    GLOBALS.store?.settings?.display?.onScreenLanguage
  );
  const [enableRTL, shouldEnableRTL] = useState(GLOBALS.enableRTL);
  const [onDuplexMessageHandlers, addOnDuplexMessageHandlers] = useState([]);

  async function getLandingData() {
    initUIDef();
  }

  const duplexMessage = (message: any) => {
    onDuplexMessageHandlers?.forEach((fn: any) => {
      fn?.(message);
    });
  };

  const addDuplexMessageHandler = (handler: any) => {
    if(onDuplexMessageHandlers && onDuplexMessageHandlers.every((h: any) => h !== handler)) {
      addOnDuplexMessageHandlers([
        ...onDuplexMessageHandlers,
        handler,
      ]);
    }
  }
  const removeDuplexHandler = (handler: any) => {
    addOnDuplexMessageHandlers([...onDuplexMessageHandlers].filter((h: any) => h !== handler));
  }




  useEffect(() => {
    getLandingData();
    initializeAnalyticsService();
    if (__DEV__) {
      const date = new Date();
      console.log(
        `app-start-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      );
    }
    
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
    onDuplexMessageHandlers, // the current list of message handlers from various components thoguhout the application
    addDuplexMessageHandler, // Add Duplex message handler function from any component
    removeDuplexHandler,  // removes registered Duplex message handler function from any component
    duplexMessage, // root application duplex message handler which dispatches the message to individual component specific message handlers.
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={appSettings}>
        <RouterOutlet
          isAuthorized={
            GLOBALS.store?.accessToken !== null &&
            GLOBALS.store?.refreshToken !== null
          }
        />
      </GlobalContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
