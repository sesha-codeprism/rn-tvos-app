import { StyleSheet } from "react-native";
import { MFThemeObject } from "../../@types/MFTheme";
import { appUIDefinition } from "../../config/constants";

const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

export const MFTabBarStyles = StyleSheet.create({
  tabBarContainer: {
    width: "100%",
    height: 80,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
  },
  tabBarItem: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    display: "flex",
    borderRadius: 5,
    marginHorizontal: 20,
    padding: 20,
  },
  tabBarItemUnFocused: {
    transform: [
      {
        scale: 1,
      },
    ],
  },
  tabBarItemFocused: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
  tabBarItemText: {
    fontSize: appUIDefinition.theme.fontSizes.body1,
    color: "grey",
  },
  tabBarFocusedText: {
    fontSize: appUIDefinition.theme.fontSizes.body1,
    color: "white",
  },
});
