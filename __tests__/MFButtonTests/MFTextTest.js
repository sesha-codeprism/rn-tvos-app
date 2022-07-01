import React from "react";
import renderer from "react-test-renderer";
import { enableRTL } from "../../src/config/constants";
import MFText from "../../src/components/MFText";
import { Text } from "react-native";

test("MFText testcase", () => {
  const component = renderer.create(
    <MFText
      shouldRenderText
      enableRTL={enableRTL}
      displayText="MFText testcase"
    />
  );

  const componentProps = component.root.props;
  const testComponent = component.root.findByType(Text);
  expect(componentProps.enableRTL).toBeFalsy;
  expect(componentProps.shouldRenderText).toBeTruthy;
  expect(componentProps.displayText).toEqual("MFText testcase");
  expect(testComponent.props.style[0].fontFamily).toBe("Inter-Regular");
  expect(testComponent.props.style[2].writingDirection).toBe("ltr");
});
