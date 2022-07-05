import React, { useState, useEffect } from "react";
import { View, ImageBackground } from "react-native";
import { enableRTL } from "../../config/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS } from "../../utils/globals";
import { HomeScreenStyles } from "./Homescreen.styles";
import FastImage from "react-native-fast-image";
import MFText from "../../components/MFText";
import { Feed, FeedItem } from "../../@types/HubsResponse";
import MFMenu from "../../components/MFMenu/MFMenu";
import MFLoader from "../../components/MFLoader";
import { AppStrings } from "../../config/strings";
import MFPopup from "../../components/MFPopup";
import MFSwim from "../../components/MFSwim";
import { getAllHubs } from "../../config/queries";
import LinearGradient from "react-native-linear-gradient";
import { AppImages } from "../../assets/images";
import { screenHeight, screenWidth } from "../../utils/dimensions";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const HomeScreen: React.FunctionComponent<Props> = (props: Props) => {
  const [backgroundURI, setBackgroundURI] = useState(
    require("../../assets/images/onboarding_1280x752_landscape.jpg")
  );

  const [showTitle, setShowTitle] = useState("");
  const [showDescription, setShowDescription] = useState("");
  const [feeds, setFeeds] = useState<FeedItem>();
  const [hubs, setHubs] = useState(Array<FeedItem>());
  const [index, setIndex] = useState(0);
  const [showPopup, togglePopup] = useState(false);
  const [feedItem, setFeedItem] = useState<Feed>();

  const { data, isLoading } = getAllHubs();
  props.navigation.addListener("focus", () => {
    console.log("focused");
  });

  props.navigation.addListener("blur", () => {
    console.log("blurred");
  });

  const setHubsData = () => {
    if (data && hubs.length <= 0) {
      console.log("hubsQuery.data.data", data.data);
      const hubsResponse: Array<FeedItem> = data.data;
      const replace_hub: Array<FeedItem> = hubsResponse.filter(
        (e) => e.Name === "{profile_name}"
      );
      if (replace_hub.length > 0) {
        if (GLOBALS.userProfile) {
          /** If the value of @param GLOBALS.userProfile * is not  null or  undefined */
          if (GLOBALS.userProfile.Name?.toLowerCase() === "default") {
            /** If default profile is used to login to the app..replace `${profile_name}` with "You"*/
            replace_hub[0].Name = AppStrings.str_hub_name_you;
          } else {
            /** If user created profile is chosen to login, replace with profile name */
            replace_hub[0].Name =
              GLOBALS.userProfile.Name || AppStrings.str_hub_name_you;
          }
        } else {
          /** If there's no @param GLOBALS.UserProfile set*/
          replace_hub[0].Name = AppStrings.str_hub_name_you;
        }
      } else {
        console.log("No hub to replace");
      }
      setHubs(hubsResponse);
      setFeeds(hubsResponse[index]);
    }
  };

  useEffect(() => {}, []);

  setHubsData();

  return (
    <View style={HomeScreenStyles.container}>
      <ImageBackground
        source={AppImages.landing_background}
        style={{ height: screenHeight, width: screenWidth }}
      >
        <ImageBackground
          source={AppImages.bottomGradient}
          style={{ width: screenWidth, height: screenHeight }}
        >
          <ImageBackground
            source={AppImages.topGradient}
            style={{ width: screenWidth, height: screenHeight }}
          >
            <>
              <MFMenu
                navigation={props.navigation}
                enableRTL={enableRTL}
                hubList={hubs}
                onPress={(event) => {
                  // setIndex(event);
                  setFeeds(hubs[event]);
                  // setHubsData();
                }}
              />
              <View>
                {showDescription != "" && (
                  <View style={HomeScreenStyles.posterViewContainerStyles}>
                    <View style={HomeScreenStyles.posterImageContainerStyles}>
                      <FastImage
                        source={backgroundURI}
                        style={HomeScreenStyles.posterImageStyles}
                      />
                    </View>
                    <View style={HomeScreenStyles.postContentContainerStyles}>
                      <MFText
                        shouldRenderText
                        displayText={showTitle}
                        textStyle={HomeScreenStyles.titleTextStyle}
                      />
                      <View
                        style={
                          HomeScreenStyles.posterContainerDescriptionStyles
                        }
                      >
                        <MFText
                          shouldRenderText
                          displayText={showDescription}
                          textStyle={[HomeScreenStyles.subtitleText]}
                        />
                      </View>
                    </View>
                  </View>
                )}
                <View style={HomeScreenStyles.contentContainer}>
                  {!isLoading && <MFSwim feeds={feeds} index={index} />}
                </View>
              </View>
              {isLoading && (
                // <ActivityIndicator size="large" />
                <MFLoader transparent={true} />
              )}
              {showPopup ? (
                <MFPopup
                  buttons={[
                    {
                      title: "Done",
                      onPress: () => {
                        togglePopup(false);
                      },
                    },
                  ]}
                  description={`Uri - ${feedItem?.Uri}
            ShowcardAspectRatio - ${feedItem?.ShowcardAspectRatio}
            NavigationTargetUri - ${feedItem?.NavigationTargetUri}
            NavigationTargetText - ${feedItem?.NavigationTargetText}
            NavigationTargetVisibility ${feedItem?.NavigationTargetVisibility}
            Layout ${feedItem?.Layout}
            IsStacked - ${feedItem?.IsStacked}
            DefaultSortType - ${feedItem?.DefaultSortType}`}
                />
              ) : undefined}
            </>
          </ImageBackground>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;
