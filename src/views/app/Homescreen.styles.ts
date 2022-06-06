import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../../config/constants";
const MFTheme: MFThemeObject = require("../../config/theme/theme.json");
export const HomeScreenStyles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "black",
  },
  contentContainer: {
    paddingBottom: 250,
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
  cardStyles: {
    height: 300,
    width: 300,
    aspectRatio: 16 / 9,
    borderRadius: 15,
    overflow: 'hidden',
  },
  focusedStyle: {
    borderColor: appUIDefinition.theme.colors.primary,
    borderWidth: 5,
    borderRadius: 15,
    overflow: 'hidden',
    height: 300,
    width: 300,
    aspectRatio: 16 / 9,
    // overflow: 'visible'
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
