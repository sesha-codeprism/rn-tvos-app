import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../../config/constants";
const MFTheme: MFThemeObject = require("../../config/theme/theme.json");
export const HomeScreenStyles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  contentContainer: {
    marginTop: Dimensions.get('window').height * 0.3,
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
    width: 480,
    height: 287,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  landScapeCardImageStyles: {
    width: 460,
    height: 263,
    borderRadius: 10,
  },
  portraitCardStyles: {
    width: 226,
    height: 339,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  portraitCardImageStyles: {
    width: 206,
    height: 319,
    borderRadius: 10,
  },
  focusedStyle: {
    borderWidth: 5,
    borderColor: appUIDefinition.theme.colors.primary,
    borderRadius: 10,// overflow: 'visible'
  },


  linearGradientStyles: { padding: 10 },
  posterImageStyles: {
    height: 300,
    width: (300 * 16) / 9,
  },
  posterViewContainerStyles: {
    flexDirection: "row",
    alignContent: "space-around",
    marginTop: 50,
    paddingHorizontal: 50,
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
  content: {},
});
