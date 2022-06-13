/**
 * @format
 */

import "react-native";
import React from "react";

// Note: test renderer must be required after react-native.
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import HomeScreen from "../src/views/app/Home.screen.tsx";
import MFButtonGroup from "../src/components/MFButtonGroup/MFButtonGroup";
import renderer from "react-test-renderer";

configure({ adapter: new Adapter() });


describe("App", () => {
  test("Home rendered Correctly", () => {
    const renderedWidget = renderer.create(<HomeScreen />);
    // const pressableButton = renderedWidget.find(Pressable);
    expect(renderedWidget).toMatchSnapshot();
  });
});

test("2 MFButtonGroups exist in the app", () => {
  const renderedWidget = shallow(<HomeScreen />);
  expect(renderedWidget.find(MFButtonGroup)).toHaveLength(2);
});
