import React from "react";
import renderer from "react-test-renderer";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MFButtonGroup from "../src/components/MFButtonGroup/MFButtonGroup";
import { MFButtonVariant } from "../src/components/MFButton/MFButton";
import { enableRTL } from "../src/config/constants";
import { StyleSheet } from "react-native";
import MFMenuStyles from "../src/config/styles/MFMenuStyles";
import { MFTabBarStyles } from "../src/components/MFTabBar/MFTabBarStyles";

configure({ adapter: new Adapter() });

test("MFButtonGroup", () => {
  const component = renderer.create(
    <MFButtonGroup
      vertical
      onHubChanged={() => {}}
      buttonsList={[
        {
          variant: MFButtonVariant.Text,
          textLabel: "MFButton",
          enableRTL: false,
          enableRTL: enableRTL,
          iconStyles: MFMenuStyles.iconStyles,
          imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
          avatarStyles: MFMenuStyles.avatarStyles,
          textStyle: {
            textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
            focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
            unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          },
          style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
          focusedStyle: StyleSheet.flatten([
            MFTabBarStyles.tabBarItem,
            MFTabBarStyles.tabBarItemFocused,
          ]),
        },
        {
          variant: MFButtonVariant.Text,
          textLabel: "MFButtonGroup",
          enableRTL: false,
          enableRTL: enableRTL,
          iconStyles: MFMenuStyles.iconStyles,
          imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
          avatarStyles: MFMenuStyles.avatarStyles,
          textStyle: {
            textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
            focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
            unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          },
          style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
          focusedStyle: StyleSheet.flatten([
            MFTabBarStyles.tabBarItem,
            MFTabBarStyles.tabBarItemFocused,
          ]),
        },
        {
          variant: MFButtonVariant.Text,
          textLabel: "MFCard",
          enableRTL: false,
          enableRTL: enableRTL,
          iconStyles: MFMenuStyles.iconStyles,
          imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
          avatarStyles: MFMenuStyles.avatarStyles,
          textStyle: {
            textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
            focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
            unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          },
          style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
          focusedStyle: StyleSheet.flatten([
            MFTabBarStyles.tabBarItem,
            MFTabBarStyles.tabBarItemFocused,
          ]),
        },
        {
          variant: MFButtonVariant.Text,
          textLabel: "MFFilmStrip",
          enableRTL: false,
          enableRTL: enableRTL,
          iconStyles: MFMenuStyles.iconStyles,
          imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
          avatarStyles: MFMenuStyles.avatarStyles,
          textStyle: {
            textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
            focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
            unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          },
          style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
          focusedStyle: StyleSheet.flatten([
            MFTabBarStyles.tabBarItem,
            MFTabBarStyles.tabBarItemFocused,
          ]),
        },
        {
          variant: MFButtonVariant.Text,
          textLabel: "MFGridView",
          enableRTL: false,
          enableRTL: enableRTL,
          iconStyles: MFMenuStyles.iconStyles,
          imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
          avatarStyles: MFMenuStyles.avatarStyles,
          textStyle: {
            textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
            focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
            unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          },
          style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
          focusedStyle: StyleSheet.flatten([
            MFTabBarStyles.tabBarItem,
            MFTabBarStyles.tabBarItemFocused,
          ]),
        },
        {
          variant: MFButtonVariant.Text,
          textLabel: "MFSearch",
          enableRTL: false,
          enableRTL: enableRTL,
          iconStyles: MFMenuStyles.iconStyles,
          imageStyles: StyleSheet.flatten([MFMenuStyles.imageStyles]),
          avatarStyles: MFMenuStyles.avatarStyles,
          textStyle: {
            textStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
            focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
            unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          },
          style: StyleSheet.flatten([MFTabBarStyles.tabBarItem]),
          focusedStyle: StyleSheet.flatten([
            MFTabBarStyles.tabBarItem,
            MFTabBarStyles.tabBarItemFocused,
          ]),
        },
      ]}
      onPress={(event, index) => {
        console.log(event, index);
      }}
    />
  );
  const buttonGroup = component.root.findByType(MFButtonGroup);
//   console.log("MFButtonGroup", component.root.props);
  expect(component.root.props.buttonsList.length >= 6);
  expect(buttonGroup.props.buttonsList.length >= 6);
});
