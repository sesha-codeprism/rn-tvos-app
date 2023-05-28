import React, {
  Ref,
  useContext,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  DeviceEventEmitter,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useTVEventHandler,
  View,
} from "react-native";
import { HubsList } from "../../@types/Hubs";
import { appUIDefinition } from "../../config/constants";
import { AppImages } from "../../assets/images";
import MFButton, { MFButtonVariant } from "../MFButton/MFButton";
import MFButtonGroup, {
  ButtonVariantProps,
} from "../MFButtonGroup/MFButtonGroup";
import MFMenuStyles from "../../config/styles/MFMenuStyles";
import { FeedItem } from "../../@types/HubsResponse";
import { Routes } from "../../config/navigation/RouterOutlet";
import { GlobalContext } from "../../contexts/globalContext";
import FastImage from "react-native-fast-image";
import { isFeatureAssigned } from "../../utils/helpers";
import { GLOBALS } from "../../utils/globals";
import { TouchableOpacity } from "react-native-gesture-handler";
import { appQueryCache, queryClient } from "../../config/queries";

/**Props to configure MFMenu */
export interface MFMenuProps {
  /** Navigation prop to navigate to other screens */
  navigation: any;
  /** @deprecated List of hubs to render in button group */
  hubsData?: HubsList;
  /** Should RTL be enabled in MFMenu */
  enableRTL?: boolean;
  /**List of hubs to render in button group */
  hubList?: Array<FeedItem>;
  /** Function to trigger on hub press */
  onPress?: null | ((event: number) => void) | undefined;
  /** Function to trigger on hub focus */
  onFocus?: null | ((event: number) => void) | undefined;
  /** Function to trigger on settings button press */
  onPressSettings?: any;
  /** Function to set carousel card focus when focus moves from menu to carousel */
  setCardFocus?: any;
  /** Function to set setting reference*/
  setSetttingsRef?: (ref: any) => void;
}

/**
 * A functional component that renders an a MFMenu.
 * Uses MFButtonGroup to render list of buttons as menu options
 * @param {MFMenuProps} props - The props required for MFMenu.
 * @returns {JSX.Element} - The rendered MFMenu.
 */
const MFMenu = (props: MFMenuProps) => {
  const [hubs1, setHubs1] = useState(Array<ButtonVariantProps>());
  const [isIdentityAssigned, setIdentityAssigned] = useState(false);
  const globalContext = useContext(GlobalContext);
  const [focused, setFocused] = useState("");
  const testing = false;
  const _onPress = (event: GestureResponderEvent, index: number) => {
    if (__DEV__) {
      console.log(
        "Current globals",
        GLOBALS,
        "QueryCache",
        queryClient.getQueryCache()
      );
      DeviceEventEmitter.emit("UpdateFeeds", { a: 1, b: 2 });
    }
    props.onPress && props.onPress(index);
  };
  const _onFocus = (index: number) => {
    props.onFocus && props.onFocus(index);
  };
  // focus handler for handling focus from settings and profile icon
  const myTVEventHandler = (evt: any) => {
    // console.log("evt.eventType", evt);
    if (
      (evt.eventType === "down" || evt.eventType === "swipeDown") &&
      (focused === "profile" || focused === "settings")
    ) {
      console.log("evt.eventType", evt);
      props.setCardFocus();
      setFocused("");
    }
  };
  useTVEventHandler(myTVEventHandler);
  useEffect(() => {
    let array1: Array<ButtonVariantProps> = [];
    const identityAssigned = isFeatureAssigned("identity");
    setIdentityAssigned(identityAssigned);
    props.hubList?.forEach((e, index: number) => {
      var buttonProps = getButtonVariantProps(e);
      array1.push(buttonProps);
    });
    if (__DEV__ && testing && testing) {
      setHubs1([...array1, ...array1, ...array1, ...array1, ...array1]);
    } else {
      setHubs1(array1);
    }
  }, [globalContext]);

  const getButtonVariantProps = (hubObject: FeedItem) => {
    const element: ButtonVariantProps = {
      variant: MFButtonVariant.Outlined,
      iconSource: AppImages.search,
      imageSource: AppImages.logo,
      avatarSource: AppImages.avatar,
      textLabel: hubObject.Name,
      enableRTL: GLOBALS.enableRTL,
      iconStyles: MFMenuStyles.iconStyles,
      imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
      avatarStyles: MFMenuStyles.avatarStyles,
      textStyle: {
        textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
        focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
        unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
      },
      style: StyleSheet.flatten([MFMenuStyles.tabBarItem]),
      focusedStyle: StyleSheet.flatten([
        MFMenuStyles.tabBarItem,
        MFMenuStyles.tabBarItemFocused1,
      ]),
    };
    return element;
  };

  return (
    <GlobalContext.Consumer>
      {({ userProfile, setProfile }) => (
        <>
          <View
            style={StyleSheet.flatten([
              MFMenuStyles.rootContainerStyles,
              GLOBALS.enableRTL
                ? { flexDirection: "row-reverse" }
                : { flexDirection: "row" },
            ])}
          >
            <View
              style={StyleSheet.flatten([MFMenuStyles.searchContainerStyles])}
            >
              <View
                style={
                  focused === "search"
                    ? MFMenuStyles.serchCircleStyle1
                    : { ...MFMenuStyles, borderColor: "transparent" }
                }
              >
                <MFButton
                  hasTVPreferredFocus={false}
                  variant={MFButtonVariant.Icon}
                  iconSource={AppImages.search}
                  iconStyles={MFMenuStyles.iconStyles}
                  avatarSource={{}}
                  imageSource={{}}
                  iconButtonStyles={{ shouldRenderImage: true }}
                  onFocus={() => {
                    setTimeout(() => {
                      setFocused("search");
                      // EventEmitter.emit("EASClose", null);
                    }, 200);
                  }}
                  onBlur={() => {
                    setFocused("");
                  }}
                  onPress={() => {
                    props.navigation.navigate(Routes.Search);
                  }}
                />
              </View>
            </View>
            <View
              style={StyleSheet.flatten([MFMenuStyles.hubsContainerStyles])}
            >
              <MFButtonGroup
                onPress={(event, index) => _onPress(event, index)}
                buttonsList={hubs1}
                onHubChanged={() => {}}
                containedButtonProps={{
                  containedButtonStyle: {
                    enabled: true,
                    focusedBackgroundColor:
                      appUIDefinition.theme.backgroundColors.primary1,
                    elevation: 5,
                    hoverColor: "red",
                    unFocusedBackgroundColor:
                      appUIDefinition.theme.backgroundColors.primary1,
                  },
                }}
                enableRTL={GLOBALS.enableRTL}
                outlinedButtonProps={{
                  outlinedButtonStyle: {
                    focusedBorderColor:
                      appUIDefinition.theme.backgroundColors.primary1,
                    unFocusedBorderColor:
                      appUIDefinition.theme.backgroundColors.primary1,
                    focusedBorderWidth: 5,
                    unFocusedBorderWidth: 2,
                    isDisabled: true,
                  },
                }}
                onFocus={(event, index) => {
                  _onFocus(index);
                  setFocused("");
                }}
                setCardFocus={props.setCardFocus}
              />
            </View>
            <View
              style={StyleSheet.flatten([
                MFMenuStyles.profileViewStyles,
                GLOBALS.enableRTL
                  ? { flexDirection: "row-reverse" }
                  : { flexDirection: "row" },
              ])}
            >
              {isIdentityAssigned && (
                <View style={MFMenuStyles.profileContainerStyles}>
                  <View
                    style={
                      focused === "profile"
                        ? MFMenuStyles.profileCircleStyle
                        : {
                            ...MFMenuStyles.profileCircleStyle,
                            borderColor: "transparent",
                          }
                    }
                  >
                    <MFButton
                      variant={MFButtonVariant.Avatar}
                      avatarSource={
                        userProfile && userProfile.Image != null
                          ? AppImages[userProfile.Image] || AppImages.avatar
                          : AppImages.avatar
                      }
                      imageSource={{}}
                      iconSource={{}}
                      avatarStyles={MFMenuStyles.avatarStyles}
                      onPress={() => {
                        console.log("Profile pressed");
                        props.navigation.navigate(Routes.Profile);
                      }}
                      onFocus={() => {
                        setFocused("profile");
                      }}
                    />
                  </View>
                </View>
              )}
              <View style={MFMenuStyles.settingsContainerStyles}>
                <View
                  style={
                    focused === "settings" ? MFMenuStyles.serchCircleStyle1 : {}
                  }
                >
                  <MFButton
                    ref={props.setSetttingsRef}
                    variant={MFButtonVariant.Icon}
                    avatarSource={{}}
                    imageSource={{}}
                    iconSource={AppImages.settings_grey}
                    iconStyles={MFMenuStyles.iconStyles}
                    iconButtonStyles={{ shouldRenderImage: true }}
                    onPress={() => {
                      // props.navigation.toggleDrawer();
                      props.onPressSettings();
                      setFocused("");
                      console.log("setting pressed", props.navigation);
                    }}
                    onFocus={() => {
                      setFocused("settings");
                      GLOBALS.drawerPanelOpen = false;
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 3,
                  alignSelf: "flex-end",
                  height: 145,
                  alignContent: "flex-end",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FastImage
                  source={AppImages.logo_white}
                  style={MFMenuStyles.logoStyles}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </GlobalContext.Consumer>
  );
};

export default MFMenu;
