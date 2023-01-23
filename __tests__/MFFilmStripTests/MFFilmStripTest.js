import React from "react";
import renderer from "react-test-renderer";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MFFilmStrip from "../../src/components/MFFilmStrip/MFFilmStrip";
import MFViewAllButton from "../../src/components/MFFilmStrip/ViewAllComponent";

configure({ adapter: new Adapter() });

test("MFFilmStripTest", () => {
  const component = renderer.create(
    <MFFilmStrip
      limitItemsTo={10}
      title={"Test Render title"}
      appendViewAll
      viewAllPlacement={"Prepend"} 
    />
  );
  const filmStripComponent = component.root.findByType(MFFilmStrip);
  expect(filmStripComponent.props.limitItemsTo < 15);
  expect(filmStripComponent.props.title).toBe("Test Render title");
  expect(filmStripComponent.props.viewAllPlacement).toBe("Prepend");
});
