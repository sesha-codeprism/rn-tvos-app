import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import AccountSettingsScreen from "../../views/app/settings_screens/account_settings";
import ClosedCaptionScreen from "../../views/app/settings_screens/display/ closed_caption.screen";
import DiaplayScreen from "../../views/app/settings_screens/display/display.screen";
import OnScreenLanguageScreen from "../../views/app/settings_screens/display/on_screen_language.screen";
import SubtitleLanguageScreen from "../../views/app/settings_screens/display/subtitle_language.screen";
import VideoQualityScreen from "../../views/app/settings_screens/display/video_quality.screen";
import AdultLockScreen from "../../views/app/settings_screens/parental_controll/adult_lock.screen";
import ContentLockScreen from "../../views/app/settings_screens/parental_controll/content_lock.screen";
import ContentLockPinScreen from "../../views/app/settings_screens/parental_controll/pin_lock.screen";
import ParentalControllScreen from "../../views/app/settings_screens/parental_controll/parental_controll.screen";
import PurchaseLockScreen from "../../views/app/settings_screens/parental_controll/purchase_lock.screen";
import RatingScreen from "../../views/app/settings_screens/parental_controll/rating.screen";
import UnratedContentScreen from "../../views/app/settings_screens/parental_controll/unrated_content.screen";
import SettingsLandingScreen from "../../views/app/settings_screens/settings_landingScreen";
import { Routes } from "./RouterOutlet";

const Stack = createNativeStackNavigator();

export const SettingsNavigator: React.FunctionComponent = (props) => {
  const backAction = () => {
    console.log("Capturing hadware back presses");
    return true;
  };
  useEffect(() => {}, []);
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
        <Stack.Screen
          name={Routes.PinLock}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
