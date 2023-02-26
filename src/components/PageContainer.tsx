//@ts-nocheck
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/dimensions";
import { globalStyles as g } from "../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../utils/uidefinition";

type Props = {
  type: "TabPage" | "FullPage";
};

export const PageContainerWithBackgroundImage: React.FC<
  Props & { imageUrl: string }
> = ({ children, type, imageUrl }) => {
  return (
    <View style={styles[type]}>
      <Image source={imageUrl} style={fullScreen} />
      <View style={[fullScreen, styles.overlay]} />
      {children}
    </View>
  );
};

export const PageContainer: React.FC<Props> = ({ children, type }) => {
  return <View style={styles[type]}>{children}</View>;
};

const fullScreen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  ...StyleSheet.absoluteFillObject,
};

const styles = StyleSheet.create(
  getUIdef("PageContainer")?.style ||
    scaleAttributes({
      FullPage: {
        backgroundColor: g.backgroundColors.shade3,
        flex: 1,
      },
      TabPage: {
        backgroundColor: g.backgroundColors.shade3,
        flex: 1,
        paddingTop: 120,
      },
      overlay: {
        backgroundColor: g.backgroundColors.shade4,
        opacity: 0.9,
        height: "100%",
        width: "100%",
      },
    })
);
