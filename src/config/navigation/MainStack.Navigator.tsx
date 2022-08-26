import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { GLOBALS } from "../../utils/globals";
import { getStore } from "../../utils/helpers";
import GuideScreen from "../../views/app/Guide.screen";
import HomeScreen from "../../views/app/Home.screen";
import ChooseProfileScreen from "../../views/app/profile_screens/Choose.profile";
import CreateProfileScreen from "../../views/app/profile_screens/Create.profile.screen";
import ProfileFinalisationScreen from "../../views/app/profile_screens/Profile.Finalise";
import ProfilePersonalizationScreen from "../../views/app/profile_screens/Profile.personalization";
import ProfileScreen from "../../views/app/profile_screens/Profile.screen";
import WhoIsWatchingScreen from "../../views/app/WhoIsWatching.screen";
import LoginScreen from "../../views/auth/Login.screen";
import ShortCodeScreen from "../../views/auth/Shortcode.screen";
import SplashScreen from "../../views/auth/Splash.screen";
import SearchScreen from "../../views/search.screen";
import { Routes, SettingsNavigator } from "./RouterOutlet";

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FunctionComponent = (props) => {
  const setStore = () => {
    try {
      // Attempt to load local store
      var store = getStore();
      console.log("Store", store);
    } catch (e) {
      console.log("Some error", e);
    }
    if (store) {
      GLOBALS.store = JSON.parse(store);
      console.log("Settings store successful", GLOBALS.store);
      const isLoggedIn =
        GLOBALS.store.accessToken !== null &&
        GLOBALS.store.refreshToken !== null;
      setIsSignedIn(isLoggedIn);
    }
  };
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  useEffect(() => {
    setStore();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name={Routes.Splash} component={SplashScreen} />
      <Stack.Screen
        name={Routes.WhoIsWatching}
        component={WhoIsWatchingScreen}
      />
      <Stack.Screen name={Routes.Login} component={LoginScreen} />
      <Stack.Screen name={Routes.ShortCode} component={ShortCodeScreen} />

      <Stack.Screen name={Routes.Home} component={HomeScreen} />
      <Stack.Screen name={Routes.Guide} component={GuideScreen} />
      <Stack.Screen name={Routes.Search} component={SearchScreen} />
      {/* <Stack.Screen name={Routes.Test} component={TestScreen} /> */}
      <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
      <Stack.Screen
        name={Routes.CreateProfile}
        component={CreateProfileScreen}
      />
      <Stack.Screen
        name={Routes.ChooseProfile}
        component={ChooseProfileScreen}
      />
      <Stack.Screen
        name={Routes.PersonlizeProfile}
        component={ProfilePersonalizationScreen}
      />
      <Stack.Screen
        name={Routes.ProfileFinalise}
        component={ProfileFinalisationScreen}
      />
      {/* {isSignedIn ? <></> : <></>} */}
    </Stack.Navigator>
  );
};
