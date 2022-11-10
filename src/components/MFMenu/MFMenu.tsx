import React, { useContext, useEffect, useState } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
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

interface MFMenuProps {
  navigation: any;
  hubsData?: HubsList;
  enableRTL?: boolean;
  hubList?: Array<FeedItem>;
  onPress?: null | ((event: number) => void) | undefined;
  onFocus?: null | ((event: number) => void) | undefined;
  onPressSettings?: any;
  setCardFocus?: any;
}

const MFMenu: React.FunctionComponent<MFMenuProps> = (props) => {
  const [hubs1, setHubs1] = useState(Array<ButtonVariantProps>());
  const [isIdentityAssigned, setIdentityAssigned] = useState(false);
  const globalContext = useContext(GlobalContext);
  const [focused, setFocused] = useState("");
  const testing = false;
  const _onPressMain = (event: GestureResponderEvent, index: number) => {
    console.log("Some log");
    props.onPress && props.onPress(index);
  };
  const _onFocus = (index: number) => {
    props.onFocus && props.onFocus(index);
  };
  useEffect(() => {
    console.log("HubsList", props.hubList);
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
  }, [props.hubList, globalContext]);

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
      style: StyleSheet.flatten([MFMenuStyles.tabBarItem1]),
      focusedStyle: StyleSheet.flatten([
        MFMenuStyles.tabBarItem1,
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
              style={StyleSheet.flatten([MFMenuStyles.searchContainerStyles1])}
            >
              <View
                style={
                  focused === "search"
                    ? MFMenuStyles.serchCircleStyle1
                    : { ...MFMenuStyles, borderColor: "transparent" }
                }
              >
                <MFButton
                  variant={MFButtonVariant.Icon}
                  iconSource={AppImages.search}
                  iconStyles={MFMenuStyles.iconStyles}
                  avatarSource={{}}
                  imageSource={{}}
                  iconButtonStyles={{ shouldRenderImage: true }}
                  onFocus={() => {
                    setFocused("search");
                  }}
                  onBlur={() => {
                    setFocused("");
                  }}
                  onPress={() => {}}
                />
              </View>
            </View>
            <View
              style={StyleSheet.flatten([MFMenuStyles.hubsContainerStyles1])}
            >
              <MFButtonGroup
                onPress={(event, index) => _onPressMain(event, index)}
                buttonsList={hubs1}
                onHubChanged={() => {}}
                containedButtonProps={{
                  containedButtonStyle: {
                    enabled: true,
                    focusedBackgroundColor:
                      appUIDefinition.theme.colors.primary,
                    elevation: 5,
                    hoverColor: "red",
                    unFocusedBackgroundColor:
                      appUIDefinition.theme.colors.secondary,
                  },
                }}
                enableRTL={GLOBALS.enableRTL}
                outlinedButtonProps={{
                  outlinedButtonStyle: {
                    focusedBorderColor: appUIDefinition.theme.colors.primary,
                    unFocusedBorderColor:
                      appUIDefinition.theme.colors.secondary,
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
                MFMenuStyles.profileViewStyles1,
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
                    variant={MFButtonVariant.Icon}
                    avatarSource={{}}
                    imageSource={{}}
                    iconSource={AppImages.settings_grey}
                    iconStyles={MFMenuStyles.iconStyles}
                    iconButtonStyles={{ shouldRenderImage: true }}
                    onPress={() => {
                      // props.navigation.toggleDrawer();
                      props.onPressSettings();
                      console.log("setting pressed", props.navigation);
                    }}
                    onFocus={() => {
                      setFocused("settings");
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
