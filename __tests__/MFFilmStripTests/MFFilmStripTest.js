import React from 'react';
import renderer from 'react-test-renderer';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MFFilmStrip, {
  MFFilmStripProps,
} from '../../src/components/MFFilmStrip/MFFilmStrip';
import MFViewAllButton from '../../src/components/MFFilmStrip/ViewAllComponent';
import {View} from 'react-native';

configure({adapter: new Adapter()});

test('MFFilmStripTest', () => {
  const component = renderer.create(
    <MFFilmStrip
      limitItemsTo={10}
      title={'Test Render title'}
      appendViewAll
      viewAllPlacement={'Prepend'}
      viewAll={
        <MFViewAllButton
          displayStyles={{
            color: 'white',
            textAlign: 'center',
            textAlignVertical: 'center',
          }}
          displayText={'View All'}></MFViewAllButton>
      }
    />,
  );
  const filmStripComponent = component.root.findByType(MFFilmStrip);
  console.log(`View component props ${component.root.props}`);
  expect(filmStripComponent.props.limitItemsTo < 15);
  expect(filmStripComponent.props.title).toBe('Test Render title');
  expect(filmStripComponent.props.viewAllPlacement).toBe('Prepend');
});