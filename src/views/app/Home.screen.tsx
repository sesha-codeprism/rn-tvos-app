//@ts-nocheck
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  TVMenuControl,
  Alert,
  useTVEventHandler,
} from "react-native";
import { appUIDefinition, debounceTime } from "../../config/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS } from "../../utils/globals";
import { HomeScreenStyles } from "./Homescreen.styles";
import { FeedItem } from "../../@types/HubsResponse";
import MFMenu from "../../components/MFMenu/MFMenu";
import MFLoader from "../../components/MFLoader";
import { AppStrings } from "../../config/strings";
import {
  getAllHubs,
  invalidateQueryBasedOnSpecificKeys,
} from "../../config/queries";
import { AppImages } from "../../assets/images";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
import MFMarquee from "../../components/MFMarquee";
import MFSwim from "../../components/MFSwim";
import { Routes } from "../../config/navigation/RouterOutlet";
import { SafeAreaView } from "react-native-safe-area-context";
import useAccount from "../../customHooks/useAccount";
import MFEventEmitter from "../../utils/MFEventEmitter";
import { GlobalContext } from "../../contexts/globalContext";
import { ItemType } from "../../utils/common";
import { globalStyles } from "../../config/styles/GlobalStyles";
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
  // const [showExitPopup, setShowExitPopup] = useState(false);
  const firstSwimlaneRef = useRef<TouchableOpacity>(null);
  const setttingsRef = useRef(null);
  const drawerRef: React.MutableRefObject<any> = useRef();
  const accountInfo = useAccount();
  const currentContext = useContext(GlobalContext);

  let feedTimeOut: any = null;
  let hubTimeOut: any = null;
  // const data = undefined;
  // const isLoading = true;

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
        console.log("CurrentFeed in Home screen", event);
      }
    }, debounceTime);
  };
  console.log(AppStrings);

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
              console.log(
                "GLOBALS.store!.userProfile.Name",
                GLOBALS.store!.userProfile.Name
              );
              replace_hub[0].Name =
                (
                  GLOBALS.store!.userProfile.Name! || GLOBALS.userProfile?.Name
                ).substring(0, 9) + "..." || AppStrings.str_hub_name_you;
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

  const clearCurrentHub = (event: SubscriberFeed) => {
    setCurrentFeed(undefined);
  };
  const backAction = () => {
    TVMenuControl.disableTVMenuKey();
    console.log(
      `'back pressed on home screen'canGoBack:${props.navigation.canGoBack()},getId: ${props.navigation.getId()}, getState:${
        props.navigation.getState().routes[0].name === "home"
      }`
    );
    if (open) {
      setOpen(false);
      drawerRef.current.close();
      return true;
    } else if (
      !props.navigation.canGoBack() &&
      props.navigation.getState().routes[0].name === "home"
    ) {
      console.log("Trying to close the app now");
      // Open !true. So we are showing the exit popup
      // setShowExitPopup(true);
      // BackHandler.exitApp();
      // TVMenuControl.disableTVMenuKey();
      // MFEventEmitter.emit("openPopup", {
      //   buttons: [
      //     {
      //       title: "Exit",
      //       onPress: () => {
      //         // Assumes close popup on each action, whether Yes or No or Cancel
      //         // BackHandler.exitApp()
      //         MFEventEmitter.emit("closePopup", null);

      //       },
      //     },
      //     {
      //       title: "Cancel",
      //       onPress: () => {

      //       // Assumes close popup on each action, whether Yes or No or Cancel
      //       setShowExitPopup(false);
      //       MFEventEmitter.emit("closePopup", null);
      //       },
      //     },
      //   ],
      //   description: AppStrings.str_exit_app_description,
      //   title: AppStrings.str_exit_app_title
      // })
    }
  };

  const onDuplexMessage = (message: any) => {
    console.log("Received message in Home screen => ", message);
    if (message?.type === "unpin" || message?.type === "pin") {
      const account = message.continuationToken
        ?.split("|")?.[1]
        ?.split(";")?.[0];
      if (account === GLOBALS.userAccountInfo?.Id) {
        invalidateQueryBasedOnSpecificKeys(
          "feed",
          "udl://subscriber/library/Pins"
        );
      }
    }
  };

  useEffect(() => {
    if (!open) {
      console.log("Drawer status (Hopefully false):", "setting TVMenuKey");
      TVMenuControl.enableTVMenuKey();
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }
    if (
      !props.navigation.canGoBack() &&
      props.navigation.getState().routes[0].name === "home"
    ) {
      TVMenuControl.disableTVMenuKey();
    }
    if (__DEV__) {
      const date = new Date();
      console.log(
        `app-end-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      );
    }
    //register duplex handler
    currentContext.addDuplexMessageHandler(onDuplexMessage);
    () => {
      currentContext.removeDuplexHandler(onDuplexMessage);
    };
  }, []);

  const setSetttingsRef = (ref: any) => {
    setttingsRef.current = ref;
  };

  setHubsData();
  const setCardFocus = () => {
    // @ts-ignore
    const cardRef =
      firstSwimlaneRef.current?.focused ||
      firstSwimlaneRef.current?.first ||
      firstSwimlaneRef.current?.viewAll?.current ||
      firstSwimlaneRef.current?.feedNotImplemented?.current ||
      firstSwimlaneRef.current?.NoItemsReturened?.current;
    cardRef?.setNativeProps({ hasTVPreferredFocus: true });
  };

  console.log("firstSwimlaneRef ", firstSwimlaneRef);
  // console.log(
  //   GLOBALS.nowNextMap.now
  //     .map((e: any) => e.ProgramId !== undefined)
  //     .filter((val: any) => val !== false).length
  // );
  return (
    <View style={HomeScreenStyles.container}>
      <ImageBackground
        source={AppImages.landing_background}
        style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}
      >
        <View
          style={{
            backgroundColor: globalStyles.backgroundColors.shade1,
            opacity: 0.9,
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
          }}
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
                  MFEventEmitter.emit("openSettings", {
                    onClose: () =>
                      setttingsRef.current &&
                      setttingsRef?.current?.setNativeProps({
                        hasTVPreferredFocus: true,
                      }),
                    drawerPercentage: 0.35,
                  });
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
                setSetttingsRef={setSetttingsRef}
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
              <View style={HomeScreenStyles.contentContainer}>
                {!isLoading && (
                  <MFSwim
                    // @ts-ignore
                    ref={firstSwimlaneRef}
                    feeds={feeds}
                    onFocus={onFeedFocus}
                    onPress={(event) => {
                      console.log(event);
                      //@ts-ignore
                      if (event.Schedule) {
                        //@ts-ignore
                        event["isFromEPG"] = true;
                        props.navigation.navigate(Routes.Details, {
                          feed: event,
                        });
                      } else if (event.ItemType === ItemType.PACKAGE) {
                        props.navigation.navigate(Routes.PackageDetails, {
                          feed: event,
                        });
                      } else {
                        props.navigation.navigate(Routes.Details, {
                          feed: event,
                        });
                      }
                    }}
                    onListEmptyElementFocus={clearCurrentHub}
                    onListFooterElementFocus={clearCurrentHub}
                    limitSwimlaneItemsTo={
                      appUIDefinition.config.limitSwimlaneItemsTo
                    }
                    navigation={props.navigation}
                  />
                )}
              </View>
              {isLoading && <MFLoader transparent={true} />}
            </SafeAreaView>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;
