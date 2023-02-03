// @ts-nocheck
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsLandingScreen from "../../views/app/settings_screens/settings_landingScreen";
import AccountSettingsScreen from "../../views/app/settings_screens/account_settings";
import ParentalControllScreen from "../../views/app/settings_screens/parental_controll/parental_controll.screen";
import PinLockScreen from "../../views/app/settings_screens/parental_controll/pin_lock.screen";
import ContentLockScreen from "../../views/app/settings_screens/parental_controll/content_lock.screen";
import UnratedContentScreen from "../../views/app/settings_screens/parental_controll/unrated_content.screen";
import AdultLockScreen from "../../views/app/settings_screens/parental_controll/adult_lock.screen";
import RatingScreen from "../../views/app/settings_screens/parental_controll/rating.screen";
import DiaplayScreen from "../../views/app/settings_screens/display/display.screen";
import OnScreenLanguageScreen from "../../views/app/settings_screens/display/on_screen_language.screen";
import ClosedCaptionScreen from "../../views/app/settings_screens/display/ closed_caption.screen";
import PurchaseLockScreen from "../../views/app/settings_screens/parental_controll/purchase_lock.screen";
import VideoQualityScreen from "../../views/app/settings_screens/display/video_quality.screen";
import SubtitleLanguageScreen from "../../views/app/settings_screens/display/subtitle_language.screen";
import AudioScreen from "../../views/app/settings_screens/audio/audio.screen";
import AudioLanguageScreen from "../../views/app/settings_screens/audio/audio_language.screen";
import DescriptiveAudioScreen from "../../views/app/settings_screens/audio/descriptive_audio.screen";
import SystemSettingsScreen from "../../views/app/settings_screens/system/system.screen";
import SystemInformationScreen from "../../views/app/settings_screens/system/system_info.screen";
import DeveloperScreen from "../../views/app/settings_screens/developer/developer.screen";
import SelectServiceScreen from "../../views/app/settings_screens/developer/developer.selectservice";
import DeveloperUserInfoSettingsScreen from "../../views/app/settings_screens/developer/developer.userinfo";
import DeveloperCurrentStoreSettingsScreen from "../../views/app/settings_screens/developer/developer.currentstore";
import DeveloperLoggingLevelScreen from "../../views/app/settings_screens/developer/developer.logginglevel";
import DvrSettingsScreen from "../../views/app/settings_screens/dvr/dvr.screen";
import StopRecordingScreen from "../../views/app/settings_screens/dvr/stop_recording.screen";
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
import FossLicenseScreen from "../../views/app/settings_screens/system/foss_license";
import GalleryScreen from "../../views/app/BrowsePages/BrowseGallery/Browse.Gallery.Screen";
import RouteFallBackScreen from "../../views/app/Route.Fallback.screen";
import BrowseCategoryScreen from "../../views/app/BrowsePages/BrowseCategory/Browse.Category.screen";
import TestScreen from "../../views/app/test.screen";
import DetailsScreen from "../../views/app/details_pages/Details.Screen";
import useCurrentSlots from "../../customHooks/useCurrentSlots";
import EpisodeList from "../../views/app/details_pages/episode_list/EpisodeList";
import useChannelRights from "../../customHooks/useChannelRights";

interface RouterOutletProps {}

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
  PinLock: "pin_lock",
  ContentLock: "content_lock",
  Rating: "ratings",
  UnratedContent: "unrated_content",
  AdultLock: "adult_lock",
  Diaplay: "display",
  OnScreenLanguage: "on_screen_language",
  ClosedCaption: "closed_caption",
  PurchaseLock: "purchase_lock",
  VideoQuality: "video_quality",
  SubtitleLanguage: "subtitle_language",
  Audio: "audio",
  AudioLanguage: "audio_language",
  DescriptiveAudio: "descriptive_audio",
  SystemSettings: "system_settings",
  DeveloperSettings: "developer_settings",
  SelectServiceSettings: "developer_select_service_settings",
  DeveloperUserInfoSettingsScreen: "developer_user_info_settings",
  DeveloperCurrentStoreSettingsScreen: "developer_current_store_settings",
  DeveloperLoggingLevelScreen: "developer_logging_level",
  SystemInformation: "system_info",
  DVRSettings: "dvr_settings",
  StopRecording: "stop_recording",
  FOSSLicense: "foss_license",
  BrowseCategory: "BrowseCategory",
  BrowseGallery: "BrowseGallery",
  Details: "details",
  FallBack: "fallBack",
  EpisodeList: "EpisodeList",
};

const Stack = createNativeStackNavigator();
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
          animationTypeForReplace: "push",
          gestureEnabled: false,
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
        <Stack.Screen name={Routes.PinLock} component={PinLockScreen} />
        <Stack.Screen name={Routes.ContentLock} component={ContentLockScreen} />
        <Stack.Screen name={Routes.Rating} component={RatingScreen} />
        {/* <Stack.Screen name={Routes.TvRating} component={TvRatingScreen} /> */}
        <Stack.Screen
          name={Routes.UnratedContent}
          component={UnratedContentScreen}
        />
        <Stack.Screen name={Routes.AdultLock} component={AdultLockScreen} />
        <Stack.Screen name={Routes.Diaplay} component={DiaplayScreen} />
        <Stack.Screen
          name={Routes.OnScreenLanguage}
          component={OnScreenLanguageScreen}
        />
        <Stack.Screen
          name={Routes.ClosedCaption}
          component={ClosedCaptionScreen}
        />
        <Stack.Screen
          name={Routes.PurchaseLock}
          component={PurchaseLockScreen}
        />
        <Stack.Screen
          name={Routes.SubtitleLanguage}
          component={SubtitleLanguageScreen}
        />
        <Stack.Screen
          name={Routes.VideoQuality}
          component={VideoQualityScreen}
        />
        <Stack.Screen name={Routes.Audio} component={AudioScreen} />
        <Stack.Screen
          name={Routes.AudioLanguage}
          component={AudioLanguageScreen}
        />
        <Stack.Screen
          name={Routes.DescriptiveAudio}
          component={DescriptiveAudioScreen}
        />
        <Stack.Screen
          name={Routes.SystemSettings}
          component={SystemSettingsScreen}
        />
        <Stack.Screen
          name={Routes.DeveloperSettings}
          component={DeveloperScreen}
        />
        <Stack.Screen
          name={Routes.SelectServiceSettings}
          component={SelectServiceScreen}
        />
        <Stack.Screen
          name={Routes.DeveloperUserInfoSettingsScreen}
          component={DeveloperUserInfoSettingsScreen}
        />
        <Stack.Screen
          name={Routes.DeveloperCurrentStoreSettingsScreen}
          component={DeveloperCurrentStoreSettingsScreen}
        />
        <Stack.Screen
          name={Routes.DeveloperLoggingLevelScreen}
          component={DeveloperLoggingLevelScreen}
        />
        <Stack.Screen
          name={Routes.SystemInformation}
          component={SystemInformationScreen}
        />
        <Stack.Screen name={Routes.DVRSettings} component={DvrSettingsScreen} />
        <Stack.Screen
          name={Routes.StopRecording}
          component={StopRecordingScreen}
        />
        <Stack.Screen name={Routes.FOSSLicense} component={FossLicenseScreen} />
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
    } catch (e) {}
    if (store) {
      GLOBALS.store = store;
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
      <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
      <Stack.Screen
        name={Routes.CreateProfile}
        component={CreateProfileScreen}
      />
      <Stack.Screen name={Routes.Details} component={DetailsScreen} />
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
      <Stack.Screen
        name={Routes.BrowseGallery}
        component={GalleryScreen}
        options={{
          animation: "none",
        }}
      />
      <Stack.Screen
        name={Routes.BrowseCategory}
        component={BrowseCategoryScreen}
      />
      <Stack.Screen name={Routes.Test} component={TestScreen} />
      <Stack.Screen name={Routes.EpisodeList} component={EpisodeList} />
      <Stack.Screen name={Routes.FallBack} component={RouteFallBackScreen} />
    </Stack.Navigator>
  );
};

interface RouterOutletProps {
  isAuthorized: boolean;
}

const RouterOutlet: React.FunctionComponent<RouterOutletProps> = (
  routerProps: RouterOutletProps
) => {
  const slots = useCurrentSlots();
  const channelRights = useChannelRights();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="app"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name={Routes.App} component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RouterOutlet;
