import { StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../../config/constants";

const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

const Styles = StyleSheet.create({
  Contained: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  outlined: {
    // paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: appUIDefinition.theme.backgroundColors.primary1,
  },
  underlined: {
    paddingHorizontal: 10,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: appUIDefinition.theme.backgroundColors.primary1,
  },
  focused: {
    // transform: [
    //   {
    //     scale: 1.1,
    //   },
    // ],
  },
  unFcoused: {
    transform: [
      {
        scale: 1,
      },
    ],
  },
  iconButtonStyles: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    flexDirection: "row",
  },
  avatarButtonStyles: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  railContainer: {
    width: "100%",
    // paddingLeft: 90,
    paddingLeft: 10
  },
  railTitle: {
    color: "#A7A7A7",
    fontSize: 31,
    marginBottom: 15,
    marginTop: 35,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 50
  },
  railCard: {
    width: 400,
    borderRadius: 5,
    marginRight: 30,
  },
});

export default Styles;
