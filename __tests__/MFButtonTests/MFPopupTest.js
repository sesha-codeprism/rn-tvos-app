import React from "react";
import renderer from "react-test-renderer";
import MFPopup from "../../src/components/MFPopup";

test("MFPopUp test", () => {
  const component = renderer.create(
    <MFPopup
      buttons={[
        {
          title: "Button 1",
          onPress: () => {
            console.log("Button 1 pressed");
          },
        },
        {
          title: "Button 2",
          onPress: () => {
            console.log("Button 2 pressed");
          },
        },
      ]}
      description={"MFPopup Test"}
    />
  );
  const componentProps = component.root.props;
  const popupProps = component.root.findByProps(MFPopup).props;
  expect(componentProps.buttons.length).toBeGreaterThanOrEqual(2);
  expect(componentProps.description).toBe("MFPopup Test");
  componentProps.buttons[0].onPress();
  componentProps.buttons[1].onPress();
});
