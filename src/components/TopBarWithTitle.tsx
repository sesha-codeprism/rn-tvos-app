import * as React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { AppImages } from "../assets/images";
import { globalStyles } from "../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../utils/uidefinition";

type PropsWithTitle = {
  what?: boolean;
} & { title: string };

const titlePlaceholder = "Page Title";

const uiConfig: any = getUIdef("Header.Logo")?.config;

export const TopBarWithTitle: React.FC<PropsWithTitle> = ({ title }) => {
  return (
    <View style={[styles.fullScreen, { ...StyleSheet.absoluteFillObject }]}>
      <View style={[styles.full, styles.topBar]}>
        <View style={styles.titlePadding}>
          <Text style={styles.title}>{title || titlePlaceholder}</Text>
        </View>
        <View style={styles.logoPadding}>
          <Image source={AppImages.logo_white} style={styles.logo}></Image>
        </View>
      </View>
      <View style={styles.headerUnderLine} />
    </View>
  );
};

const styles: any = StyleSheet.create(
  getUIdef("Header.TopBarWithTitle")?.style ||
    scaleAttributes({
      full: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: globalStyles.auxiliaryColors.overlay3,
      },
      logo: {
        resizeMode: "contain",
        width: 200,
        height: 60,
      },
      headerUnderLine: {
        width: 1920,
        opacity: 0.4,
        height: 1,
        borderWidth: 0.4,
        borderColor: globalStyles.backgroundColors.shade5,
        backgroundColor: globalStyles.backgroundColors.shade5,
        alignSelf: "center",
      },
      title: {
        color: globalStyles.fontColors.light,
        fontSize: globalStyles.fontSizes.subTitle1,
        fontFamily: globalStyles.fontFamily.semiBold,
      },
      titlePadding: {
        paddingLeft: 88,
      },
      logoPadding: {
        paddingRight: 92,
      },
      topBar: {
        maxHeight: 132,
      },
      fullWidth: {
        width: "100%",
      },
      fullScreen: {
        width: "100%",
        height: 118,
      },
    })
);
