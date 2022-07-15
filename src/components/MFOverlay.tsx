import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import MFText from "./MFText";
import { MFTabBarStyles } from "./MFTabBar/MFTabBarStyles";
import FastImage from "react-native-fast-image";
import { AppImages } from "../assets/images";

const MFOverlay = ({ displayString }: { displayString: string }) => {
  return (
    <View
      //ImageBackground
      // source={AppImages.overlay_gradiant}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <FastImage
        source={AppImages.overlayLandscape}
        style={{
          width: '100%',
          height: 197,
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />
      <MFText
        displayText={displayString}
        shouldRenderText
        textStyle={[
          MFTabBarStyles.tabBarItemText,
          { alignSelf: "flex-end", color: "white", marginTop: 5 },
        ]}
      />
    </View>
  );
};

export default MFOverlay;

const styles = StyleSheet.create({});
