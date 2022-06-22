import React, { useEffect, useState } from "react";
import RouterOutlet from "../config/navigation/RouterOutlet";
import { GlobalContext } from "../contexts/globalContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { initUIDef } from "../utils/uidefinition";
import { UserProfile } from "../@types/UserProfile";
import { GLOBALS } from "../utils/globals";

interface AppProps {}

const App: React.FunctionComponent<AppProps> = (props) => {
  const queryClient = new QueryClient();
  const [userProfile, setUserProfile] = useState({});

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

  const appSettings = {
    userProfile,
    setUserProfile,
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
