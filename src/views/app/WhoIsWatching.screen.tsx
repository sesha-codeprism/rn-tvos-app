import { ImageBackground, Alert, View } from "react-native";
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
import { MFProfileStyle } from "../../config/styles/MFProfileStyles";
import MFText from "../../components/MFText";
import MFUserProfile from "../../components/MFUserProfile";

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}

const WhoIsWatchingScreen: React.FunctionComponent<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<any>("");
  const [userProfiles, setProfiles] = useState(Array<UserProfile>());
  const [showWhoIsWatching, setShowWhoIsWatching] = useState(false);
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
      setProfiles(profiles);
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
                console.log(
                  "We were able to find the profile from Async store",
                  userProfile
                );
                currentContext.setUserProfile(userProfile[0]);
                GLOBALS.userProfile = userProfile[0];
                setLoading(false);
                props.navigation.replace(Routes.Home);
              } else {
                /** The last selected profile is not available in getProfile data
                 * Navigating to who's watching page.
                 */
                setLoading(false);
                setShowWhoIsWatching(true);
                // props.navigation.navigate(Routes.Profile, {
                //   whoIsWatching: true,
                // });
              }
            } else {
              /**
               * No recent userprofile in Local Storage.
               * Navigating to who's watching page.
               */
              setLoading(false);
              setShowWhoIsWatching(true);
              // props.navigation.navigate(Routes.Profile, {
              //   whoIsWatching: true,
              // });
            }
          } else if (profiles.length === 1) {
            /**
             * User has single profile, selecting the profile and proceeding to Home page.
             */
            currentContext.setUserProfile(profiles[0]);
            GLOBALS.userProfile = profiles[0];
            GLOBALS.store.userProfile = GLOBALS.userProfile;
            updateStore(GLOBALS.store);
            setLoading(false);
            props.navigation.replace(Routes.Home);
          }
        } else {
          currentContext.setUserProfile(defaultProfile[0]);
          GLOBALS.userProfile = defaultProfile[0];
          setLoading(false);
          props.navigation.replace(Routes.Home);
        }
      } else {
        /**
         * Value of @identityAssigned isn't true.. No practical purpose of taking Profile values.. just login directly with default profile
         *
         */
        currentContext.setUserProfile(defaultProfile[0]);
        GLOBALS.userProfile = defaultProfile[0];
        setLoading(false);
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
  const onFocus = (event: any, index: number) => {
    setFocused(index);
  };
  return (
    <>
      {showWhoIsWatching ? (
        <View
          style={[
            MFProfileStyle.container,
            // {
            //   alignItems: "center",
            //   alignContent: "center",
            //   justifyContent: "center",
            //   display: "flex",
            // },
          ]}
        >
          <View
            style={{
              // width: 399,
              height: 48,
              // marginTop: 233,
              alignSelf: "center",
              marginBottom: 127,
            }}
          >
            <MFText
              shouldRenderText={true}
              displayText={`Who's Watching?`}
              textStyle={{
                fontSize: 48,
                fontWeight: "600",
                letterSpacing: 0,
                lineHeight: 48,
                textAlign: "center",
                color: "#EEEEEE",
              }}
            />
          </View>
          <View
            style={{
              width: "100%",
              // height: "100%",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
              // flexWrap: "wrap",
            }}
          >
            {userProfiles.map((item, index) => {
              return item.UserCreated ? (
                <View style={{ marginBottom: 120 }} key={`Index${index}`}>
                  <MFUserProfile
                    userProfile={item}
                    navigation={props.navigation}
                    // onBlur={(e) => {
                    //   onBlur(e, index);
                    // }}
                    onFocus={(e) => {
                      onFocus(e, index);
                    }}
                  />
                </View>
              ) : (
                <View />
              );
            })}
            {userProfiles.length < 8 ? (
            <View style={{ marginBottom: 120 }}>
              <MFUserProfile navigation={props.navigation} />
            </View>
          ) : undefined}
          </View>
        </View>
      ) : (
        <ImageBackground
          source={require("../../assets/images/onboarding_1280x752_landscape.jpg")}
          imageStyle={HomeScreenStyles.imageBackGroundStyles}
          style={{ ...HomeScreenStyles.container, justifyContent: "center" }}
        >
          {loading && <MFLoader transparent={true} />}
        </ImageBackground>
      )}
    </>
  );
};
export default WhoIsWatchingScreen;
