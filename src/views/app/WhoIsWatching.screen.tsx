import { ImageBackground, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { HomeScreenStyles } from "./Homescreen.styles";
import { getAllSubscriberProfiles } from "../../../backend/subscriber/subscriber";
import { UserProfile } from "../../@types/UserProfile";
import { GlobalContext } from "../../contexts/globalContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import { Routes } from "../../config/navigation/RouterOutlet";
import MFLoader from "../../components/MFLoader";
import { GLOBALS } from "../../utils/globals";
import { isFeatureAssigned, updateStore } from "../../utils/helpers";

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}

const WhoIsWatchingScreen: React.FunctionComponent<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const currentContext: any = useContext(GlobalContext);

  const getProfiles = async () => {
    try {
      setLoading(true);
      const profileResponse = await getAllSubscriberProfiles();
      const profilesArray: Array<UserProfile> = profileResponse.data;
      const defaultProfile = profilesArray.filter(
        (profile) => profile.Name!.toLowerCase() === "default"
      );
      const identityAssigned: boolean = isFeatureAssigned("identity") || false;

      console.log("Identity assigned?:", identityAssigned);
      const profiles = profilesArray.filter((profile) => profile.UserCreated);
      if (identityAssigned) {
        /** * Only if  @identityAssigned is true, profile selection logic should be called for...*/
        /** Checking if user has profiles ? */
        if (profiles && profiles.length !== 0) {
          /** Checking if user has multiple profile */
          if (profiles.length > 1) {
            /** Checking for the last profile in Local Storage */
            if (GLOBALS.store.userProfile) {
              const userProfile = profiles.filter(
                (profile) => profile.Id === GLOBALS.store.userProfile?.Id
              );
              if (userProfile && userProfile.length) {
                /**  We were able to find the profile from Async store in GetProfiles data..
                 *  Setting GLOBALS store to value and proceeding to home
                 *  */
                console.log('We were able to find the profile from Async store', userProfile)
                currentContext.setUserProfile(userProfile[0]);
                GLOBALS.userProfile = userProfile[0];
                props.navigation.replace(Routes.Home);
              } else {
                /** The last selected profile is not available in getProfile data
                 * Navigating to who's watching page.
                 */
                props.navigation.navigate(Routes.Profile, {
                  whoIsWatching: true,
                });
              }
            } else {
              /**
               * No recent userprofile in Local Storage.
               * Navigating to who's watching page.
               */
              props.navigation.navigate(Routes.Profile, {
                whoIsWatching: true,
              });
            }
          } else if (profiles.length === 1) {
            /**
             * User has single profile, selecting the profile and proceeding to Home page.
             */
            currentContext.setUserProfile(profiles[0]);
            GLOBALS.userProfile = profiles[0];
            GLOBALS.store.userProfile = GLOBALS.userProfile;
            updateStore(JSON.stringify(GLOBALS.store));
            props.navigation.replace(Routes.Home);
          }
        } else {
          currentContext.setUserProfile(defaultProfile[0]);
          GLOBALS.userProfile = defaultProfile[0];
          props.navigation.replace(Routes.Home);
        }
      } else {
        /**
         * Value of @identityAssigned isn't true.. No practical purpose of taking Profile values.. just login directly with default profile
         *
         */
        currentContext.setUserProfile(defaultProfile[0]);
        GLOBALS.userProfile = defaultProfile[0];
        props.navigation.replace(Routes.Home);
      }
    } catch (error: any) {
      setLoading(false);
      //   props.navigation.replace(Routes.Home);
      Alert.alert(
        "OOPS ! Something went wrong",
        `${error.message ? error.message : "Please try again after some time."}`
      );
      console.log("error getting profile in splash", error);
    }
  };
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/onboarding_1280x752_landscape.jpg")}
      imageStyle={HomeScreenStyles.imageBackGroundStyles}
      style={{ ...HomeScreenStyles.container, justifyContent: "center" }}
    >
      {loading && <MFLoader transparent={true} />}
    </ImageBackground>
  );
};
export default WhoIsWatchingScreen;
