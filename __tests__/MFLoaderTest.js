import React from "react";
import renderer from "react-test-renderer";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import MFLoader from "../src/components/MFLoader";

configure({ adapter: new Adapter() });

test("MFLoader Test", () => {
  const component = renderer.create(<MFLoader transparent />);
  expect(component.root.props.transparent).toBeTruthy;
});
