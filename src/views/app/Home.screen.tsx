import React, { useState, useEffect } from "react";
import { View, ImageBackground, ScrollView, ViewComponent } from "react-native";
import { debounceTime, enableRTL } from "../../config/constants";
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
import { AppImages } from "../../assets/images";
import { screenHeight, screenWidth } from "../../utils/dimensions";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const HomeScreen: React.FunctionComponent<Props> = (props: Props) => {
  const [backgroundURI, setBackgroundURI] = useState(
    require("../../assets/images/onboarding_1280x752_landscape.jpg")
  );

  let timeOut: any = null;

  const [feeds, setFeeds] = useState<FeedItem>();
  const [hubs, setHubs] = useState(Array<FeedItem>());
  const [index, setIndex] = useState(0);
  const [showPopup, togglePopup] = useState(false);
  const [feedItem, setFeedItem] = useState<Feed>();
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();

  const { data, isLoading } = getAllHubs();
  props.navigation.addListener("focus", () => {
    console.log("focused");
  });

  props.navigation.addListener("blur", () => {
    console.log("blurred");
  });

  const onFeedFocus = (event: SubscriberFeed) => {
    console.log(event);
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      if (event != null) {
        setCurrentFeed(event);
        // if (event.image16x9PosterURL != undefined) {
        //   setBackgroundURI({
        //     uri: event.image16x9PosterURL.uri,
        //   });
        // } else {
        //   setBackgroundURI({
        //     uri: "https://picsum.photos/500/150/",
        //   });
        // }
        // if (event.CatalogInfo) {
        //   setShowTitle(event.title),
        //     event.CatalogInfo.Description &&
        //       setShowDescription(event.CatalogInfo.Description);
        // } else {
        //   setShowTitle(event.title),
        //     event.metadataLine2 && setShowDescription(event.metadataLine2);
        // }
      }
    }, debounceTime);
  };

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
                  setFeeds(hubs[event]);
                }}
              />
              <View style={HomeScreenStyles.posterViewContainerStyles}>
                {currentFeed && (
                  <>
                    <View style={HomeScreenStyles.posterImageContainerStyles}>
                      {currentFeed.image16x9PosterURL !== undefined ? (
                        <FastImage
                          source={{ uri: currentFeed.image16x9PosterURL.uri }}
                          style={HomeScreenStyles.posterImageStyles}
                        />
                      ) : (
                        <FastImage
                          source={{ uri: AppImages.tvshowPlaceholder }}
                          style={HomeScreenStyles.posterImageStyles}
                        />
                      )}
                    </View>
                    <View style={HomeScreenStyles.postContentContainerStyles}>
                      <MFText
                        shouldRenderText
                        displayText={currentFeed.title}
                        textStyle={HomeScreenStyles.titleTextStyle}
                      />
                      <View
                        style={
                          HomeScreenStyles.posterContainerDescriptionStyles
                        }
                      >
                        <MFText
                          shouldRenderText
                          displayText={
                            currentFeed.CatalogInfo
                              ? currentFeed.CatalogInfo.Description
                              : currentFeed.metadataLine2
                          }
                          textStyle={[HomeScreenStyles.subtitleText]}
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>
              <View style={HomeScreenStyles.contentContainer}>
                {!isLoading && (
                  <MFSwim feeds={feeds} index={index} onFocus={onFeedFocus} />
                )}
              </View>
              {isLoading && <MFLoader transparent={true} />}
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
