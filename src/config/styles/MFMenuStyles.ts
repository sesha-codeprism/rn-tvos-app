import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { SCREEN_WIDTH } from "../../components/MFFilmStrip/MFFilmStrip";
import { appUIDefinition } from "../constants";
const { width, height } = Dimensions.get("window");
const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

const MFMenuStyles = StyleSheet.create({
  rootContainerStyles: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    // height: 145,
    // width: width,
  },
  avatarStyles: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
  },
  profileContainerStyles: {
    flex: 1,
    height: 145,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsContainerStyles: {
    flex: 1,
    height: 145,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyles: { height: 80, width: 300 },
  iconStyles: {
    height: 32,
    width: 32,
    color: "grey",
    tintColor: "red",
    resizeMode: "contain",
  },
  textStyle: {
    fontSize: appUIDefinition.theme.fontSizes.subTitle2,
    color: "#828282",
    fontFamily: "Inter-Regular",
    lineHeight: 50,
  },
  focusedTextStyle: {
    fontSize: 34,
    color: appUIDefinition.theme.backgroundColors.white,
    fontFamily: "Inter-Regular",
    fontWeight: "bold",
  },
  buttonGroup2: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  logoStyles: {
    height: 40,
    width: 240,
    alignSelf: "center",
  },
  searchContainerStyles: {
    width: SCREEN_WIDTH * 0.05,
    height: 147,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    // marginLeft: 70,marginRight: 30
    // backgroundColor: __DEV__ ? 'red' : 'transparent'
  },
  hubsContainerStyles: {
    flex: 2.8,
    paddingBottom: 10,
    paddingRight: 20,
    overflow: "visible",
    height: 147,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: __DEV__ ? 'green' : 'transparent'
  },
  profileViewStyles: {
    flex: 0.9,
    flexDirection: "row",
    paddingLeft: 20,
    height: 147,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 50
    // backgroundColor: __DEV__ ? 'blue' : 'transparent'
  },
  tabBarItem: {
    display: "flex",
    borderRadius: 5,
    padding: 30,
  },
  tabBarItemFocused: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
});

export default MFMenuStyles;
