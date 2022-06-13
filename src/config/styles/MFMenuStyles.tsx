import { Dimensions, StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../constants";
const { width, height } = Dimensions.get("window");
const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

const MFMenuStyles = StyleSheet.create({
  hubsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    height: 145,
    width: width,
  },
  avatarStyles: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    marginTop: 20,
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
    resizeMode: "cover",
  },
  textStyle: {
    fontSize: appUIDefinition.theme.fontSizes.subTitle2,
    color: "#828282",
    fontFamily: "Inter",
    lineHeight: 50,
  },
  focusedTextStyle: {
    fontSize: 34,
    color: appUIDefinition.theme.backgroundColors.white,
    fontFamily: "Inter",
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
});

export default MFMenuStyles;
