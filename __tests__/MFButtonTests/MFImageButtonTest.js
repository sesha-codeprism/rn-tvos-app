import React from 'react';
import renderer from 'react-test-renderer';
import MFButton, {
  MFButtonVariant,
} from '../../src/components/MFButton/MFButton';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {MFTabBarStyles} from '../../src/components/MFTabBar/MFTabBarStyles';


configure({adapter: new Adapter()});

const onPressEvent = variant => {
  console.log(`Variant is ${variant}`);
};

export const mediaURI =
  'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png';

test('MFButton Image Variant', () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Image}
      onPress={onPressEvent}
      textLabel={'Hello'}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{uri: mediaURI}}
      imageSource={{uri: mediaURI}}
      avatarSource={{uri: mediaURI}}
    />,
  );
  component.root.props.onPress(component.root.props.variant);
  expect(component.root.props.imageSource.uri).toBe(mediaURI);
});
