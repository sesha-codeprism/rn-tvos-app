import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { SCREEN_WIDTH } from "../../utils/dimensions";
import { appUIDefinition } from "../constants";
const { width, height } = Dimensions.get("window");
const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

const MFMenuStyles = StyleSheet.create({
  rootContainerStyles: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    // paddingLeft: 90,
    // paddingRight: 88,
    //backgroundColor: 'red'
  },
  avatarStyles: {
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
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    //backgroundColor: __DEV__ ? 'blue' : 'transparent',
  },
  hubsContainerStyles: {
    flex: 2.6,
    paddingBottom: 10,
    paddingRight: 20,
    overflow: "visible",
    height: 147,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: __DEV__ ? 'green' : 'transparent'
  },
  profileViewStyles: {
    flex: 0.9,
    flexDirection: "row",
    paddingLeft: 20,
    height: 147,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // marginLeft: 50
    // backgroundColor: __DEV__ ? 'yellow' : 'transparent'
  },
  tabBarItem: {
    display: "flex",
    borderRadius: 5,
    padding: 30,
  },
  tabBarItemFocused1: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
  serchCircleStyle1: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: appUIDefinition.theme.colors.primary,
    justifyContent: "center",
  },
  profileCircleStyle: {
    height: 95,
    width: 95,
    borderRadius: 50,
    borderWidth: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderColor: appUIDefinition.theme.colors.primary,
  },
});

export default MFMenuStyles;
