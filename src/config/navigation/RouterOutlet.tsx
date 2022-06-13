import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
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
import MFSideMenu from "../../components/MFSideMenu";
import { Dimensions } from "react-native";
import SettingsLandingScreen from "../../views/app/settings_screens/settings_landingScreen";
import AccountSettingsScreen from "../../views/app/settings_screens/account_settings";
import ParentalControllScreen from "../../views/app/settings_screens/parental_controll/parental_controll.screen";

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
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const isAuthorized = true;

export const SettingsNavigator: React.FunctionComponent<RouterOutletProps> = (
  props
) => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={Routes.Settings}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_left",
          animationTypeForReplace:'push'
        }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export const AppNavigator: React.FunctionComponent<RouterOutletProps> = (
  props
) => {
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.Splash} component={SplashScreen} />
      {isAuthorized ? (
        <>
          <Stack.Screen
            name={Routes.WhoIsWatching}
            component={WhoIsWatchingScreen}
          />
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
        </>
      ) : (
        <>
          <Stack.Screen name={Routes.Login} component={LoginScreen} />
          <Stack.Screen name={Routes.ShortCode} component={ShortCodeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
const RouterOutlet: React.FunctionComponent<RouterOutletProps> = (props) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="app"
        drawerContent={(props) => <SettingsNavigator {...props} />}
        // drawerContent={(props) => <SettingsLandingScreen />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: width * 0.4,
            backgroundColor: "transparent",
          },
          drawerType: "front",
          drawerPosition: "right",
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
