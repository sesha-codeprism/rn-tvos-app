import React, { useEffect, useState } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { HubsList, HubObject } from "../../@types/Hubs";
import { enableRTL, appUIDefinition } from "../../config/constants";
import { AppImages } from "../../assets/images";
import MFButton, { MFButtonVariant } from "../MFButton/MFButton";
import MFButtonGroup, {
  ButtonVariantProps,
} from "../MFButtonGroup/MFButtonGroup";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";

import { MFTabBarStyles } from "../MFTabBar/MFTabBarStyles";
import MFMenuStyles from "../../config/styles/MFMenuStyles";
import { Feed, FeedItem } from "../../@types/HubsResponse";
import { Dimensions } from "react-native";
import { SubComponent } from "../../@types/UIDefinition";
import FastImage from "react-native-fast-image";
import { HomeScreenStyles } from "../../views/app/Homescreen.styles";

interface MFSubMenuProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  hubsData?: HubsList;
  enableRTL?: boolean;
  hubList?: Array<FeedItem>;
  onPress?: null | ((event: Feed) => void) | undefined;
}

const MFSubMenu: React.FunctionComponent<MFSubMenuProps> = (props) => {
  const [hubs1, setHubs1] = useState(Array<ButtonVariantProps>());
  const [hubs2, setHubs2] = useState(Array<ButtonVariantProps>());
  const [hubIndex, setHubIndex] = useState(0);

  return (
    <View style={HomeScreenStyles.logoContainer}>
      <FastImage
        source={AppImages.logo}
        style={MFMenuStyles.imageStyles}
        resizeMode="cover"
      />
      <View style={HomeScreenStyles.iconContainer}>
        <MFButton
          variant={MFButtonVariant.Icon}
          iconSource={AppImages.message}
          imageSource={AppImages.message}
          avatarSource={AppImages.message}
          style={MFTabBarStyles.tabBarItem}
          iconStyles={MFMenuStyles.iconStyles}
        />
        <MFButton
          variant={MFButtonVariant.Icon}
          iconSource={AppImages.search}
          imageSource={AppImages.search}
          avatarSource={AppImages.search}
          style={MFTabBarStyles.tabBarItem}
          iconStyles={MFMenuStyles.iconStyles}
        />
        <MFButton
          variant={MFButtonVariant.Icon}
          iconSource={AppImages.settings}
          imageSource={AppImages.settings}
          avatarSource={AppImages.settings}
          style={MFTabBarStyles.tabBarItem}
          iconStyles={MFMenuStyles.iconStyles}
        />
      </View>
    </View>
  );
};

export default MFSubMenu;
