import React, { useEffect, useRef, useState } from "react";
import RouterOutlet from "../config/navigation/RouterOutlet";
import { GlobalContext } from "../contexts/globalContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { initUIDef } from "../utils/uidefinition";
import { UserProfile } from "../@types/UserProfile";
import { GLOBALS } from "../utils/globals";
import "react-native-gesture-handler";
import { initializeAnalyticsService } from "../utils/analytics/analytics";
import { MFDrawerContainer } from "./MFDrawersContainer";
import { initUdls } from "../../backend";
import ErrorBoundary from "react-native-error-boundary";
import ErrorFallbackComponent from "../components/ErroFallBackComponent";
import { queryClient } from "../config/queries";
import MFNotificationCard from "../components/MFNotification/MFNotificationCard";

interface AppProps { }

const App: React.FunctionComponent<AppProps> = (props) => {
  // const queryClient = new QueryClient();
  const [userProfile, setUserProfile] = useState({});
  const [onScreenLanguage, setOnScreenLanguage] = useState(
    GLOBALS.store?.settings?.display?.onScreenLanguage
  );
  const [enableRTL, shouldEnableRTL] = useState(GLOBALS.enableRTL);
  const duplexMessageHandleStack = useRef([() => { }]);

  async function getLandingData() {
    initUIDef();
    initUdls();
  }

  const duplexMessage = (message: any) => {
    duplexMessageHandleStack.current?.forEach((fn: any) => {
      fn?.(message);
    });
  };

  const addDuplexMessageHandler = (handler: any) => {
    if (
      duplexMessageHandleStack.current &&
      duplexMessageHandleStack.current?.every((h: any) => h !== handler)
    ) {
      duplexMessageHandleStack.current?.push(handler);
    }
  };
  const removeDuplexHandler = (handler: any) => {
    const indexOfHandler = duplexMessageHandleStack.current?.findIndex(
      (h: any) => h == handler
    );
    if (indexOfHandler > -1) {
      duplexMessageHandleStack.current?.splice(indexOfHandler, 1);
    }
  };

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

  const errorHandler = (error: Error, stackTrace: string) => {
    console.error("Something went wrong", error, "with stacktrace", stackTrace);
  };

  const appSettings = {
    userProfile,
    setUserProfile,
    onScreenLanguage,
    setOnScreenLanguage,
    enableRTL,
    shouldEnableRTL,
    onDuplexMessageHandlers: duplexMessage.current, // the current list of message handlers from various components thoguhout the application
    addDuplexMessageHandler, // Add Duplex message handler function from any component
    removeDuplexHandler, // removes registered Duplex message handler function from any component
    duplexMessage, // root application duplex message handler which dispatches the message to individual component specific message handlers.
  };

  return (

    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={appSettings}>
        <MFDrawerContainer />
        <ErrorBoundary
          onError={errorHandler}
          FallbackComponent={ErrorFallbackComponent}
        >
          <RouterOutlet
            isAuthorized={
              GLOBALS.store?.accessToken !== null &&
              GLOBALS.store?.refreshToken !== null
            }
          />
        
        </ErrorBoundary>
      </GlobalContext.Provider>
      {/* <MFNotificationCard
          duration={2000}
          iconName={"favorite_selected"}
          id={"11"}
          onCloseNotification={() => {
            console.log("Notification closed");
          }}
          containerStyle={{
            width: 700,
            height: 200,
            backgroundColor: "red",
            position: 'absolute',
            top: 100,
            right: 100,
            zIndex: 5
          }}
          iconStyle={{ width: 100, height: 100 }}
          title={"Title-Test Notification"}
          // subtitle={"Sub-title test Notification"}
          key={12345}
          
        /> */}
    </QueryClientProvider>

  );
};

export default App;
