import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import MFText from "./MFText";
import { MFTabBarStyles } from "./MFTabBar/MFTabBarStyles";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { AppImages } from "../assets/images";

interface MFOverlayProps {
  displayTitle?: string;
  overlayStyle?: StyleProp<ViewStyle>;
  overlayImageStyle?: StyleProp<ImageStyle>;
  displayTitleStyles?: StyleProp<TextStyle>;
}

const MFOverlay: React.FunctionComponent<MFOverlayProps> = (props) => {
  return (
    <View style={StyleSheet.flatten([styles.rootStyle, props.overlayStyle])}>
      <FastImage
        source={AppImages.overlayLandscape}
        style={StyleSheet.flatten([
          styles.overlayGradientStyle,
          props.overlayImageStyle,
        ])}
      />
      <MFText
        displayText={props.displayTitle}
        shouldRenderText
        textStyle={StyleSheet.flatten([
          MFTabBarStyles.tabBarItemText,
          styles.textStyle,
          props.displayTitleStyles,
        ])}
      />
    </View>
  );
};

export default MFOverlay;

const styles = StyleSheet.create({
  rootStyle: {
    width: "100%",
    height: "100%",
  },

  overlayGradientStyle: {
    width: "100%",
    height: 197,
    position: "absolute",
    top: 0,
    right: 0,
  },
  textStyle: { alignSelf: "flex-end", color: "white", marginTop: 5 },
});
