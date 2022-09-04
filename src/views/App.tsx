import React, { useEffect, useState } from "react";
import RouterOutlet from "../config/navigation/RouterOutlet";
import { GlobalContext } from "../contexts/globalContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { initUIDef } from "../utils/uidefinition";
import { UserProfile } from "../@types/UserProfile";
import { GLOBALS } from "../utils/globals";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "../redux/store";

interface AppProps {}

const App: React.FunctionComponent<AppProps> = (props) => {
  const queryClient = new QueryClient();
  const [userProfile, setUserProfile] = useState({});
  const [onScreenLanguage, setOnScreenLanguage] = useState(
    GLOBALS.store.settings.display.onScreenLanguage
  );

  async function getLandingData() {
    // Initialize UIDef
    initUIDef();
  }

  useEffect(() => {
    getLandingData();
  }, []);

  const updateProfile = (userProfile: UserProfile) => {
    if (userProfile) {
      setUserProfile(userProfile);
    }
  };

  const updateLanguage = (language: string) => {
    setOnScreenLanguage(language);
  };

  const appSettings = {
    userProfile,
    setUserProfile,
    onScreenLanguage,
    setOnScreenLanguage,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GlobalContext.Provider value={appSettings}>
          <RouterOutlet
            isAuthorized={
              GLOBALS.store.accessToken !== null &&
              GLOBALS.store.refreshToken !== null
            }
          />
        </GlobalContext.Provider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
