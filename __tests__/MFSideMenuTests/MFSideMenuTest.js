import React from "react";
import renderer from "react-test-renderer";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Text } from "react-native";
import SideMenuLayout from "../../src/components/MFSideMenu";

test("MFSideMenu Layout", () => {
  const component = renderer.create(
    <SideMenuLayout title="Hello" subTitle="Welcome" />
  );
  const SideMenuComponent = component.root.findByType(SideMenuLayout);
  console.log(`SideMenuComponent component props ${JSON.stringify(SideMenuComponent.props)}`);
  expect(SideMenuComponent.props.title).toBe("Hello");
  expect(SideMenuComponent.props.subTitle).toBe("Welcome");

});
