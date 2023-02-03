import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../../config/constants";

const { width, height } = Dimensions.get("window");

const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

export const ShortCodeStyles = StyleSheet.create({
  root: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },
  scrollbarView: {
    backgroundColor: "#000210",
    // backgroundColor: 'red',
    height: "100%",
    width: "40%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  componentTitleView: {
    height: 100,
    alignSelf: "center",
  },
  scrollViewStyles: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentView: {
    backgroundColor: "yellow",
    height: "100%",
    width: "80%",
  },
  logoView: {
    height: 100,
    borderRadius: 5,
    margin: 10,
  },
  buttonComponent: {
    alignSelf: "center",
    width: "100%",
    marginTop: height / 4,
  },
  codeView: {
    backgroundColor: "#000210",
    height: "100%",
    overflow: "hidden",
    width: "60%",
    flexShrink: 50,
    padding: 120,
    alignContent: "center",
    justifyContent: "center",
  },
  focusedStyle: {
    transform: [{ scale: 1 }],
    backgroundColor: "#aab4be",
  },
  logoStyles: { height: 100, width: 300, borderRadius: 10 },
  titleTextStyle: {
    fontSize: appUIDefinition.theme.fontSizes.subTitle1,
    color: "white",
    flexShrink: 1,
  },
  subtitleText: {
    fontSize: appUIDefinition.theme.fontSizes.caption1,
    color: "grey",
    flexShrink: 1,
  },
  urlStyles: {
    fontSize: appUIDefinition.theme.fontSizes.body2,
    color: "white",
    opacity: 0.7,
    flexShrink: 1,
  },
  textViewStyle: {
    width: "80%",
    paddingVertical: 10,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  verificationCodeTileStyle: {
    height: 80,
    width: 80,
    backgroundColor: "#1d2126",
    marginRight: 15,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  refreshCodePressableStyles: {
    height: 80,
    width: 200,
    backgroundColor: appUIDefinition.theme.backgroundColors.primary1,
    borderRadius: 5,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  refreshCodeStyles: {
    fontSize: appUIDefinition.theme.fontSizes.body2,
    color: "white",
    opacity: 0.7,
    flexShrink: 1,
  },
});
