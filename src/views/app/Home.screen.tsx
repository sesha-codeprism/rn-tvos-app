import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  BackHandler,
  TVMenuControl,
  Dimensions,
  Text,
} from "react-native";
import { TVEventHandler, useTVEventHandler } from "react-native";

import { appUIDefinition, debounceTime } from "../../config/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS } from "../../utils/globals";
import { HomeScreenStyles } from "./Homescreen.styles";
import { Feed, FeedItem } from "../../@types/HubsResponse";
import MFMenu from "../../components/MFMenu/MFMenu";
import MFLoader from "../../components/MFLoader";
import { AppStrings } from "../../config/strings";
import MFPopup from "../../components/MFPopup";
import { getAllHubs } from "../../config/queries";
import { AppImages } from "../../assets/images";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
import MFMarquee from "../../components/MFMarquee";
import { MFDrawer } from "../../components/MFSideMenu/MFDrawer";
import MFSwim from "../../components/MFSwim";
import { service } from "../../utils/analytics/analytics";
import { Routes } from "../../config/navigation/RouterOutlet";
import { navigationAction } from "../../utils/analytics/consts";

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const { width, height } = Dimensions.get("window");
const HomeScreen: React.FunctionComponent<Props> = (props: Props) => {
  const [feeds, setFeeds] = useState<FeedItem>();
  const [hubs, setHubs] = useState(Array<FeedItem>());
  const [index, setIndex] = useState(0);
  const [showPopup, togglePopup] = useState(false);
  const [feedItem, setFeedItem] = useState<Feed>();
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const drawerRef: React.MutableRefObject<any> = useRef();
  const [lastEventType, setLastEventType] = React.useState("");
  const [open, setOpen] = useState(false);

  let feedTimeOut: any = null;
  let hubTimeOut: any = null;

  const { data, isLoading } = getAllHubs();
  props.navigation.addListener("focus", () => {
    console.log("focused");
  });

  props.navigation.addListener("blur", () => {
    console.log("blurred");
  });

  const onFeedFocus = (event: SubscriberFeed) => {
    clearTimeout(feedTimeOut);
    feedTimeOut = setTimeout(async () => {
      if (event != null) {
        setCurrentFeed(event);
      }
    }, debounceTime);
  };

  const setHubsData = async () => {
    if (data && hubs.length <= 0) {
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
            if (GLOBALS.userProfile.Name!.length > 10) {
              replace_hub[0].Name =
                GLOBALS.userProfile.Name!.substring(0, 9) + "..." ||
                AppStrings.str_hub_name_you;
            } else {
              replace_hub[0].Name =
                GLOBALS.userProfile.Name || AppStrings.str_hub_name_you;
            }
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
      GLOBALS.rootNavigation = props.navigation;
    }
  };

  const clearCurrentHub = (event: SubscriberFeed) => {
    setCurrentFeed(undefined);
  };

  const backAction = () => {
    if (open) {
      setOpen(false);
      drawerRef.current.close();
      return true;
    } else {
      console.log(
        props.navigation.getState(),
        props.navigation.getParent()?.getState()
      );
    }
  };

  const myTVEventHandler = (evt: any) => {
    setLastEventType(evt.eventType);
  };

  useTVEventHandler(myTVEventHandler);

  setHubsData();

  return (
    <View style={HomeScreenStyles.container} pointerEvents="box-none">
      <ImageBackground
        source={AppImages.landing_background}
        style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}
      >
        <ImageBackground
          source={AppImages.bottomGradient}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        >
          <ImageBackground
            source={AppImages.topGradient}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          >
            <>
              <MFMenu
                navigation={props.navigation}
                enableRTL={GLOBALS.enableRTL}
                hubList={hubs}
                onPress={(event) => {}}
                onFocus={(event) => {
                  if (hubTimeOut) {
                    clearInterval(hubTimeOut);
                  }
                  hubTimeOut = setTimeout(() => {
                    setFeeds(hubs[event]);
                  }, debounceTime);
                }}
                onPressSettings={() => {
                  setOpen(open);
                  drawerRef.current.open();
                  if (currentFeed) {
                    service?.addNavEventOnCurPageOpenOrClose(
                      {
                        navigation: {
                          params: {
                            feed: currentFeed,
                          },
                        },
                      },
                      Routes.Settings,
                      navigationAction.pageOpen
                    );
                  }
                }}
              />
              <View style={HomeScreenStyles.posterViewContainerStyles}>
                {currentFeed && appUIDefinition.config.enableMarquee && (
                  <MFMarquee
                    currentFeed={currentFeed}
                    rootContainerStyles={{
                      flexDirection: GLOBALS.enableRTL ? "row-reverse" : "row",
                      alignContent: "space-around",
                    }}
                  />
                )}
              </View>
              <Text style={{ color: "blue" }}>{lastEventType}</Text>
              <View style={HomeScreenStyles.contentContainer}>
                {!isLoading && (
                  <MFSwim
                    feeds={feeds}
                    index={index}
                    onFocus={onFeedFocus}
                    onListEmptyElementFocus={clearCurrentHub}
                    onListFooterElementFocus={clearCurrentHub}
                  />
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
      <MFDrawer
        ref={drawerRef}
        drawerPercentage={37}
        animationTime={200}
        overlay={false}
        opacity={1}
        open={open}
        animatedWidth={width * 0.37}
        closeOnPressBack={false}
        navigation={props.navigation}
        drawerContent={false}
      />
    </View>
  );
};

export default HomeScreen;
