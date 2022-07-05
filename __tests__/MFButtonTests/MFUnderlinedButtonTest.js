import React from "react";
import renderer from "react-test-renderer";
import MFButton, {
  MFButtonVariant,
} from "../../src/components/MFButton/MFButton";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Pressable } from "react-native";
import { MFTabBarStyles } from "../../src/components/MFTabBar/MFTabBarStyles";
import { enableRTL } from "../../src/config/constants";

const MFTheme = require("../../src/config/theme/theme.json");

configure({ adapter: new Adapter() });

const onPressEvent = (variant) => {
  console.log(`Variant is ${variant}`);
};

export const mediaURI =
  "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png";

test("MFButton Underlined Variant", () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Underlined}
      onPress={onPressEvent}
      textLabel={"MFButton - Underlined"}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{ uri: mediaURI }}
      imageSource={{ uri: mediaURI }}
      avatarSource={{ uri: mediaURI }}
      underlinedButtonProps={{
        enableRTL: enableRTL,
        underlinedButtonStyle: {
          focusedBorderColor: "blue",
          focusedBorderWidth: 5,
          unFocusedBorderColor: "grey",
          unFocusedBorderWidth: 2,
        },
        hasTVPreferredFocus: true,
      }}
    />
  );
  const pressableComponent = component.root.findByType(Pressable);
  const componentProps = component.root.props;
  expect(componentProps.variant).toBe(MFButtonVariant.Underlined);
  expect(componentProps.textLabel).toBe("MFButton - Underlined");
  expect(componentProps.underlinedButtonProps.hasTVPreferredFocus).toBeTruthy;
  expect(
    componentProps.underlinedButtonProps.underlinedButtonStyle
      .focusedBorderWidth
  ).toBe(5);
  console.log(pressableComponent.props);
  component.root.props.onPress(component.root.props.variant);
});
