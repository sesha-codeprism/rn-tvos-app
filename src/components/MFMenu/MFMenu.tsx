import React, { useContext, useEffect, useState } from "react";
import {
  GestureResponderEvent,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { HubsList } from "../../@types/Hubs";
import { enableRTL, appUIDefinition } from "../../config/constants";
import { AppImages } from "../../assets/images";
import MFButton, { MFButtonVariant } from "../MFButton/MFButton";
import MFButtonGroup, {
  ButtonVariantProps,
} from "../MFButtonGroup/MFButtonGroup";
import { MFTabBarStyles } from "../MFTabBar/MFTabBarStyles";
import MFMenuStyles from "../../config/styles/MFMenuStyles";
import { FeedItem } from "../../@types/HubsResponse";
import { Routes } from "../../config/navigation/RouterOutlet";
import { GlobalContext } from "../../contexts/globalContext";
import { useDrawerStatus } from "@react-navigation/drawer";
import FastImage from "react-native-fast-image";
import { isFeatureAssigned } from "../../utils/helpers";
import { screenWidth } from "../../utils/dimensions";

interface MFMenuProps {
  navigation: any;
  hubsData?: HubsList;
  enableRTL?: boolean;
  hubList?: Array<FeedItem>;
  onPress?: null | ((event: number) => void) | undefined;
}

const MFMenu: React.FunctionComponent<MFMenuProps> = (props) => {
  const [hubs1, setHubs1] = useState(Array<ButtonVariantProps>());
  const [isIdentityAssigned, setIdentityAssigned] = useState(false);
  const globalContext = useContext(GlobalContext);

  const _onPressMain = (event: GestureResponderEvent, index: number) => {
    props.onPress && props.onPress(index);
  };
  const isDrawerOpen = useDrawerStatus() === "open";
  useEffect(() => {
    console.log("HubsList", props.hubList);
    let array1: Array<ButtonVariantProps> = [];
    const identityAssigned = isFeatureAssigned("identity");
    setIdentityAssigned(identityAssigned);
    props.hubList?.forEach((e, index: number) => {
      var buttonProps = getButtonVariantProps(e);
      array1.push(buttonProps);
    });
    setHubs1(array1);
  }, [props.hubList, globalContext]);

  const getButtonVariantProps = (hubObject: FeedItem) => {
    const element: ButtonVariantProps = {
      variant: MFButtonVariant.Outlined,
      iconSource: AppImages.search,
      imageSource: AppImages.logo,
      avatarSource: AppImages.avatar,
      textLabel: hubObject.Name,
      enableRTL: enableRTL,
      iconStyles: MFMenuStyles.iconStyles,
      imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
      avatarStyles: MFMenuStyles.avatarStyles,
      textStyle: {
        textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
        focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
        unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
      },
      style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
      focusedStyle: StyleSheet.flatten([
        MFTabBarStyles.tabBarItem,
        MFTabBarStyles.tabBarItemFocused,
      ]),
    };
    return element;
  };

  return (
    <GlobalContext.Consumer>
      {({ userProfile, setProfile }) => (
        <View style={MFMenuStyles.hubsContainer}>
          <View style={{ flex: 0.2 }}>
            <MFButton
              variant={MFButtonVariant.Icon}
              iconSource={AppImages.search}
              iconStyles={MFMenuStyles.iconStyles}
              avatarSource={{}}
              imageSource={{}}
              iconButtonStyles={{ shouldRenderImage: true }}
            />
          </View>
          <View style={{ flex: 2.2, paddingBottom: 10, overflow: "visible" }}>
            <MFButtonGroup
              onPress={(event, index) => _onPressMain(event, index)}
              buttonsList={hubs1}
              onHubChanged={() => {}}
              containedButtonProps={{
                containedButtonStyle: {
                  enabled: true,
                  focusedBackgroundColor: appUIDefinition.theme.colors.primary,
                  elevation: 5,
                  hoverColor: "red",
                  unFocusedBackgroundColor:
                    appUIDefinition.theme.colors.secondary,
                },
              }}
              enableRTL={enableRTL}
              outlinedButtonProps={{
                outlinedButtonStyle: {
                  focusedBorderColor: appUIDefinition.theme.colors.primary,
                  unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
                  focusedBorderWidth: 5,
                  unFocusedBorderWidth: 2,
                  isDisabled: false,
                },
              }}
            />
          </View>
          <View style={{ flex: 0.9, flexDirection: "row" }}>
            {isIdentityAssigned && (
              <View style={MFMenuStyles.profileContainerStyles}>
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
                />
              </View>
            )}
            <View style={MFMenuStyles.settingsContainerStyles}>
              <MFButton
                variant={MFButtonVariant.Icon}
                iconSource={AppImages.settings_grey}
                imageSource={{}}
                avatarSource={{}}
                iconStyles={MFMenuStyles.iconStyles}
                iconButtonStyles={{ shouldRenderImage: true }}
                onPress={() => {
                  props.navigation.toggleDrawer();
                  console.log(
                    "setting pressed",
                    props.navigation,
                    isDrawerOpen
                  );
                }}
              />
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
      )}
    </GlobalContext.Consumer>
  );
};

export default MFMenu;
