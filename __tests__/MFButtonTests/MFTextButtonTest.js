import React from "react";
import renderer from "react-test-renderer";
import MFButton, {
  MFButtonVariant,
} from "../../src/components/MFButton/MFButton";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Text } from "react-native";
import { MFTabBarStyles } from "../../src/components/MFTabBar/MFTabBarStyles";

export const mediaURI =
  "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png";

configure({ adapter: new Adapter() });

const onPressEvent = (variant) => {
  console.log(`Variant is ${variant}`);
};

test("MFButton Text Variant", () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Text}
      onPress={onPressEvent}
      textLabel={"Hello"}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{ uri: mediaURI }}
      imageSource={{ uri: mediaURI }}
      avatarSource={{ uri: mediaURI }}
    />
  );
  const textField = component.root.findByType(Text);
  expect(textField.props.children).toBe("Hello");
  // expect(textField.props.textStyle).toEqual([
  //   { fontFamily: "Inter-Regular" },
  //   [{ color: "grey", fontSize: 29 }],
  //   { writingDirection: "ltr" },
  // ]);
});
