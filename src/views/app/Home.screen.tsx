import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  TVMenuControl,
} from "react-native";
import { appUIDefinition, debounceTime } from "../../config/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS } from "../../utils/globals";
import { HomeScreenStyles } from "./Homescreen.styles";
import { FeedItem } from "../../@types/HubsResponse";
import MFMenu from "../../components/MFMenu/MFMenu";
import MFLoader from "../../components/MFLoader";
import { AppStrings } from "../../config/strings";
import { getAllHubs } from "../../config/queries";
import { AppImages } from "../../assets/images";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
import MFMarquee from "../../components/MFMarquee";
import { MFDrawer } from "../../components/MFSideMenu/MFDrawer";
import MFSwim from "../../components/MFSwim";
import { Routes } from "../../config/navigation/RouterOutlet";
import { Layout } from "../../utils/analytics/consts";
import { ItemShowType } from "../../utils/common";
import { SafeAreaView } from "react-native-safe-area-context";
interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const { width, height } = Dimensions.get("window");
const HomeScreen: React.FunctionComponent<HomeScreenProps> = (
  props: HomeScreenProps
) => {
  const [feeds, setFeeds] = useState<FeedItem>();
  const [hubs, setHubs] = useState(Array<FeedItem>());
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const [open, setOpen] = useState(false);
  const firstCardRef = useRef<TouchableOpacity>(null);
  const drawerRef: React.MutableRefObject<any> = useRef();

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
        if (GLOBALS.store!.userProfile) {
          /** If the value of @param GLOBALS.store!.userProfile * is not  null or  undefined */
          if (GLOBALS.store!.userProfile.Name?.toLowerCase() === "default") {
            /** If default profile is used to login to the app..replace `${profile_name}` with "You"*/
            replace_hub[0].Name = AppStrings.str_hub_name_you;
          } else {
            /** If user created profile is chosen to login, replace with profile name */
            if (GLOBALS.store!.userProfile.Name!.length > 10) {
              replace_hub[0].Name =
                GLOBALS.store!.userProfile.Name!.substring(0, 9) + "..." ||
                AppStrings.str_hub_name_you;
            } else {
              replace_hub[0].Name =
                GLOBALS.store!.userProfile.Name || AppStrings.str_hub_name_you;
            }
          }
        } else {
          /** If there's no @param GLOBALS.store!.userProfile set*/
          replace_hub[0].Name = AppStrings.str_hub_name_you;
        }
      } else {
        console.log("No hub to replace");
      }
      const applicationHub = hubsResponse.find(
        (element) => element?.IsApplicationHub
      );
      if (applicationHub) {
        const indexOfHub = hubsResponse.indexOf(applicationHub);
        hubsResponse.splice(indexOfHub, 1);
      }
      setHubs(hubsResponse);
      setFeeds(hubsResponse[0]);
      GLOBALS.rootNavigation = props.navigation;
    }
  };

  const updateRoute = (route: string, params: any) => {
    console.log("UpdateRoute", route, params);
    if (!route && !params) {
      console.log("No route info or params provided");
      return;
    }
    //@ts-ignore
    if (Routes[`${route}`] !== undefined) {
      /** Route info exists in our router.. so navigate to that route with passed params */
      //@ts-ignore
      props.navigation.navigate(Routes[`${route}`], params);
    } else {
      /** Current route not implemented yet.. So re-direct towards fallback page */
      props.navigation.navigate(Routes.FallBack, params);
    }
  };
  const onTapViewAll = (feed: any) => {
    const payload: any = {
      feed,
      title: feed.Name,
      navigationTargetUri: feed.NavigationTargetUri,
    };
    const navigationTargetUri =
      feed.NavigationTargetUri && feed.NavigationTargetUri.split("?")[0];
    const browseObject = () => {
      if (feed.Layout === Layout.Category || feed.HasSubcategories === true) {
        updateRoute("BrowseCategory", payload);
      } else if (
        !!feed?.ItemType &&
        feed?.ItemType === ItemShowType.SvodPackage
      ) {
        props.navigation.navigate("BrowseSubGallery", payload);
      } else {
        updateRoute("BrowseGallery", payload);
      }
    };

    const navigationTargetObject: any = {
      favorites: () => {
        updateRoute("Favorites", payload);
      },
      dvr: () => {
        updateRoute("DvrManager", payload);
      },
      liveTvGuide: () => {
        props.navigation.navigate("guide");
        /** Commenting out LiveTV view all.. we'll figure out the rest implement it  */
        // if (isDefaultSubscribedFilterEnabled) {
        //   payload["initialFilter"] = ["Subscribed"];
        // }
        // if (isDefaultPlayableOnThisDeviceFilterEnabled) {
        //   payload["initialFilter"] = ["Playable"];
        // }
        // if (feed.Name === "Favorite Channels") {
        //   payload["initialFilter"] = ["Favorites"];
        // }
        // const date = new Date();
        // const slot = utilities.date?.getSlot(date);
        // const dateStr = utilities.date?.formatUtcDateYearMonthDay(date);
        // props.setLiveCacheDate(dateStr);
        // props.setLiveCacheSlot(slot);
        // this.updateRoute("Live", payload);
        // this.props.getScheduleCache();
        // this.props.getCactchupData();
      },
      restartTv: () => {
        if (
          feed?.ContextualNavigationTargetUri &&
          feed.ContextualNavigationTargetUri === "restartTvGallery"
        ) {
          updateRoute("BrowseGallery", payload);
        } else {
          updateRoute("BrowseCategory", payload);
        }
      },
      browsepackages: () => {
        updateRoute("BrowseGallery", payload);
      },
      browserecommendations: () => {
        updateRoute("BrowseCategory", payload);
      },
      browsemovies: browseObject,
      browsetv: browseObject,
      browsemoviesandtv: browseObject,
      browsepromotions: browseObject,
      browsemixedrecommendations: browseObject,
      libraries: browseObject,
      continue: browseObject,
      browsepayperview: browseObject,
      browsetrending: browseObject,
      browsedvrtvshows: () => {
        updateRoute("BrowseGallery", payload);
      },
      browsedvrmovies: () => {
        updateRoute("BrowseGallery", payload);
      },
      browsesearch: browseObject,
    };
    navigationTargetObject[navigationTargetUri] &&
      navigationTargetObject[navigationTargetUri]();

    // props.navigation.navigate(Routes.Gallery, { feed: feed });
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
      // Open !true. So something is happening. Removed some console.log
    }
  };

  useEffect(() => {
    if (!open) {
      console.log("Drawer status (Hopefully false):", "setting TVMenuKey");
      TVMenuControl.enableTVMenuKey();
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }
    if (__DEV__) {
      const date = new Date();
      console.log(
        `app-end-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      );
    }
  }, []);

  setHubsData();
  const setCardFocus = () => {
    // console.log("firstCardRef.current", firstCardRef.current);
    // Alert.alert("Set hub data called");
    firstCardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
  };
  return (
    <View style={HomeScreenStyles.container}>
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
            {!isLoading && (
              <SafeAreaView style={{ flex: 1, paddingTop: -30 }}>
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
                  setCardFocus={setCardFocus}
                  onPressSettings={() => {
                    setOpen(open);
                    drawerRef.current.open();
                    if (currentFeed) {
                      // service?.addNavEventOnCurPageOpenOrClose(
                      //   {
                      //     navigation: {
                      //       params: {
                      //         feed: currentFeed,
                      //       },
                      //     },
                      //   },
                      //   Routes.Settings,
                      //   navigationAction.pageOpen
                      // );
                    }
                  }}
                />
                <View style={HomeScreenStyles.posterViewContainerStyles}>
                  {currentFeed && appUIDefinition.config.enableMarquee && (
                    <MFMarquee
                      currentFeed={currentFeed}
                      rootContainerStyles={{
                        flexDirection: GLOBALS.enableRTL
                          ? "row-reverse"
                          : "row",
                        alignContent: "space-around",
                      }}
                    />
                  )}
                </View>
                <View style={HomeScreenStyles.contentContainer}>
                  {!isLoading && (
                    <MFSwim
                      // @ts-ignore
                      ref={firstCardRef}
                      feeds={feeds}
                      onFocus={onFeedFocus}
                      onPress={(event) => {
                        props.navigation.navigate(Routes.Details, {
                          feed: event,
                        });
                      }}
                      onListEmptyElementFocus={clearCurrentHub}
                      onListFooterElementFocus={clearCurrentHub}
                      limitSwimlaneItemsTo={
                        appUIDefinition.config.limitSwimlaneItemsTo
                      }
                      onViewAllPressed={onTapViewAll}
                    />
                  )}
                </View>
                {isLoading && <MFLoader transparent={true} />}
              </SafeAreaView>
            )}
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
