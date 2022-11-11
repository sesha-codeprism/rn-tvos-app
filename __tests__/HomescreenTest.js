import React from "react";
import renderer from "react-test-renderer";
import Adapter from "enzyme-adapter-react-16";
import { configureStore } from "@reduxjs/toolkit";
import HomeScreen from "../src/views/app/Home.screen";

configureStore({ adapter: new Adapter() });

test("Home-screen test", () => {
  const component = renderer.create(<HomeScreen />);
  const screen = component.root.findByType("View");
  console.log("screen", screen);
});
