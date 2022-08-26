import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Dimensions } from "react-native";
import SettingsLandingScreen from "../../views/app/settings_screens/settings_landingScreen";
import AccountSettingsScreen from "../../views/app/settings_screens/account_settings";
import ParentalControllScreen from "../../views/app/settings_screens/parental_controll/parental_controll.screen";
import ContentLockPinScreen from "../../views/app/settings_screens/parental_controll/content_lock_pin.screen";
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
import { enableScreens } from "react-native-screens";
import { AppNavigator } from "./MainStack.Navigator";
import AudioScreen from "../../views/app/settings_screens/audio/audio.screen";
import AudioLanguageScreen from "../../views/app/settings_screens/audio/audio_language.screen";
import DescriptiveAudioScreen from "../../views/app/settings_screens/audio/descriptive_audio.screen";
import SystemSettingsScreen from "../../views/app/settings_screens/system/system.screen";
import SystemInformationScreen from "../../views/app/settings_screens/system/system_info.screen";
import DvrSettingsScreen from "../../views/app/settings_screens/dvr/dvr.screen";
import StopRecordingScreen from "../../views/app/settings_screens/dvr/stop_recording.screen";
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
  SystemInformation: "system_info",
  DVRSettings: "dvr_settings",
  StopRecording: "stop_recording",
};

enableScreens();
enableScreens();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
export const SettingsNavigator: React.FunctionComponent<RouterOutletProps> = (
  props
) => {
  // const isDrawerOpen = useDrawerStatus() === "open";

  // const backAction = () => {
  //   console.log("Capturing hadware back presses");
  //   return true;
  // };
  // useEffect(() => {
  //   if (isDrawerOpen) {
  //     TVMenuControl.enableTVMenuKey();
  //     BackHandler.addEventListener("hardwareBackPress", backAction);
  //   } else {
  //     TVMenuControl.disableTVMenuKey();
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  //   }
  // }, [isDrawerOpen]);
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
          name={Routes.SystemInformation}
          component={SystemInformationScreen}
        />
        <Stack.Screen name={Routes.DVRSettings} component={DvrSettingsScreen} />
        <Stack.Screen
          name={Routes.StopRecording}
          component={StopRecordingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
