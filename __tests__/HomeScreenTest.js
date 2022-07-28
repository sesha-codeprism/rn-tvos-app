import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { View } from "react-native";
import HomeScreen from "../src/views/app/Home.screen";

const createTestProps = (props) => ({
  navigation: {
    navigate: jest.fn(),
  },
  ...props,
});

describe("LoadingScreen", () => {
  describe("rendering", () => {
    let wrapper;
    let props; // use type "any" to opt-out of type-checking
    beforeEach(() => {
      props = createTestProps({});
      wrapper = shallow(<HomeScreen {...props} />); // no compile-time error
    });

    it("should render a <View />", () => {
      expect(wrapper.find(View)).toHaveLength(1); // SUCCESS
    });
  });
});
