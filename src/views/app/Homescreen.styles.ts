import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../../config/constants";
import { SCREEN_HEIGHT } from "../../utils/dimensions";
const MFTheme: MFThemeObject = require("../../config/theme/theme.json");
export const HomeScreenStyles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  contentContainer: {
    height: '100%',
    // paddingBottom: 500
    flex: 1
  },
  viewContainer: {
    paddingHorizontal: 50,
  },
  tabBarLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textStyle: {
    fontSize: appUIDefinition.theme.fontSizes.body1,
    color: "grey",
  },
  focusedTextStyle: {
    fontSize: appUIDefinition.theme.fontSizes.body1,
    color: "white",
  },
  landScapeCardStyles: {
    width: (appUIDefinition.config.height16x9 * 16) / 9,
    height: appUIDefinition.config.height16x9,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,

  },
  landScapeCardImageStyles: {
    width: ((appUIDefinition.config.height16x9 * 16) / 9) - 25,
    height: appUIDefinition.config.height16x9 * 0.9,
    borderRadius: 5,
  },
  portraitCardStyles: {
    width: (appUIDefinition.config.height2x3 * 2) / 3,
    height: appUIDefinition.config.height2x3,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  portraitCardImageStyles: {
    width: ((appUIDefinition.config.height2x3 * 2) / 3) - 25,
    height: appUIDefinition.config.height2x3 * 0.9,
    borderRadius: 10,
  },
  focusedStyle: {
    borderWidth: 5,
    borderColor: appUIDefinition.theme.colors.primary,
    borderRadius: 10,// overflow: 'visible'
  },


  linearGradientStyles: { padding: 10 },
  posterImageStyles: {
    height: 220,
    width: (220 * 16) / 9,
    borderRadius: 8
  },
  posterViewContainerStyles: {
    // marginTop: 50,
    paddingHorizontal: 50,
    height: SCREEN_HEIGHT * 0.2,
    width: '100%',
    marginHorizontal: 30
  },
  posterImageContainerStyles: { flex: 0.38 },
  titleTextStyle: {
    fontSize: appUIDefinition.theme.fontSizes.subTitle1,
    color: "white",
    flexShrink: 1,
  },
  subtitleText: {
    fontSize: appUIDefinition.theme.fontSizes.caption1,
    color: "white",
    flexShrink: 1,
  },
  postContentContainerStyles: {
    justifyContent: "flex-start",
    flex: 0.62,
    marginTop: 50,
    paddingHorizontal: 50
  },
  posterContainerDescriptionStyles: { marginTop: 10 },

  viewAllButtonStyles: {
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
  },
  imageBackGroundStyles: {
    opacity: 0.5,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    margin: 20,
  },
  iconContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  overlayStyle: {
    width: '80%',
    height: '80%',
    alignSelf: "flex-end",
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  overlayImageStyles: {
    width: '90%',
    height: '80%',
    alignSelf: "flex-end",
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rootCardStyles: {
    flexDirection: 'column',
  }
});
