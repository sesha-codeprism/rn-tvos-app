import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "../../views/auth/Login.screen";
import HomeScreen from "../../views/app/Home.screen";
import SplashScreen from "../../views/auth/Splash.screen";
import GuideScreen from "../../views/app/Guide.screen";
import SearchScreen from "../../views/search.screen";
import TestScreen from "../../views/app/ShowcaseApp/Test.screen";
import ShortCodeScreen from "../../views/auth/Shortcode.screen";
import CreateProfileScreen from "../../views/app/profile_screens/Create.profile.screen";
import ProfileScreen from "../../views/app/profile_screens/Profile.screen";
import ChooseProfileScreen from "../../views/app/profile_screens/Choose.profile";
import ProfilePersonalizationScreen from "../../views/app/profile_screens/Profile.personalization";
import ProfileFinalisationScreen from "../../views/app/profile_screens/Profile.Finalise";
import WhoIsWatchingScreen from "../../views/app/WhoIsWatching.screen";
import { BackHandler, Dimensions, TVMenuControl } from "react-native";
import SettingsLandingScreen from "../../views/app/settings_screens/settings_landingScreen";
import AccountSettingsScreen from "../../views/app/settings_screens/account_settings";
import ParentalControllScreen from "../../views/app/settings_screens/parental_controll/parental_controll.screen";
import ContentLockPinScreen from "../../views/app/settings_screens/parental_controll/content_lock_pin.screen";
import ContentLockScreen from "../../views/app/settings_screens/parental_controll/content_lock.screen";
import UnratedContentScreen from "../../views/app/settings_screens/parental_controll/unrated_content.screen";
import AdultLockScreen from "../../views/app/settings_screens/parental_controll/adult_lock.screen";
import { GLOBALS } from "../../utils/globals";
import { getStore } from "../../utils/helpers";
import RatingScreen from "../../views/app/settings_screens/parental_controll/rating.screen";
// import TVMenuControl from "react-native";
import { useDrawerStatus } from "@react-navigation/drawer";

interface RouterOutletProps {}
const { width, height } = Dimensions.get("window");

export const Routes = {
  Splash: "splash",
  Login: "login",
  Home: "home",
  Guide: "guide",
  Search: "search",
  Test: "test",
  ShortCode: "shortCode",
  Profile: "profile",
  CreateProfile: "create_profile",
  ChooseProfile: "choose_profile",
  PersonlizeProfile: "personalize_profile",
  ProfileFinalise: "finalize_profile",
  WhoIsWatching: "WhoIsWatchingScreen",
  Drawer: "drawer",
  App: "app",
  Settings: "settings",
  AccountsSettings: "accounts_screen",
  ParentalControll: "parental_controll",
  ContentLockPin: "content_lock_pin",
  ContentLock: "content_lock",
  Rating: "ratings",
  UnratedContent: "unrated_content",
  AdultLock: "adult_lock",
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export const SettingsNavigator: React.FunctionComponent<RouterOutletProps> = (
  props
) => {
  const isDrawerOpen = useDrawerStatus() === "open";

  const backAction = () => {
    console.log("Capturing hadware back presses");
    return null;
  };
  useEffect(() => {
    console.log("isDrawerOpen", isDrawerOpen);
    if (isDrawerOpen) {
      TVMenuControl.enableTVMenuKey();
      BackHandler.addEventListener("hardwareBackPress", backAction);
    } else {
      TVMenuControl.disableTVMenuKey();
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    }
  }, [isDrawerOpen]);
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={Routes.Settings}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_left",
          animationTypeForReplace: "push",
          gestureEnabled: false,
          // presentation:'modal'
        }}
        // screenListeners={{
        //   beforeRemove: (e: any) => {
        //     // Prevent default action
        //     console.log('removing/ closing drawer')
        //     e.preventDefault();
        //   },
        // }}
      >
        <Stack.Screen
          name={Routes.Settings}
          component={SettingsLandingScreen}
        />
        <Stack.Screen
          name={Routes.AccountsSettings}
          component={AccountSettingsScreen}
        />
        <Stack.Screen
          name={Routes.ParentalControll}
          component={ParentalControllScreen}
        />
        <Stack.Screen
          name={Routes.ContentLockPin}
          component={ContentLockPinScreen}
        />
        <Stack.Screen name={Routes.ContentLock} component={ContentLockScreen} />
        <Stack.Screen name={Routes.Rating} component={RatingScreen} />
        {/* <Stack.Screen name={Routes.TvRating} component={TvRatingScreen} /> */}
        <Stack.Screen
          name={Routes.UnratedContent}
          component={UnratedContentScreen}
        />
        <Stack.Screen name={Routes.AdultLock} component={AdultLockScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export const AppNavigator: React.FunctionComponent<RouterOutletProps> = (
  props
) => {
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
      <Stack.Screen name={Routes.Test} component={TestScreen} />
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

interface RouterOutletProps {
  isAuthorized: boolean;
}

const RouterOutlet: React.FunctionComponent<RouterOutletProps> = (
  routerProps: RouterOutletProps
) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="app"
        // backBehavior={''}
        detachInactiveScreens
        drawerContent={(props) => (
          <SettingsNavigator
            {...props}
            isAuthorized={routerProps.isAuthorized}
          />
        )}
        // drawerContent={(props) => <SettingsLandingScreen />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: "37%",
            height: "100%",
            // display:'flex',
            backgroundColor: "#00030E",
          },
          drawerType: "front",
          drawerPosition: "right",
          swipeEnabled: false,
          // swipeEnabled: false,
          // gestureEnabled:false,
          // gestureHandlerProps:{
          //   ge
          // }
        }}
        useLegacyImplementation={false}
        defaultStatus="closed"
      >
        <Drawer.Screen name={Routes.App} component={AppNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RouterOutlet;
