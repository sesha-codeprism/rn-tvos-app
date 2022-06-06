import React from 'react';
import renderer from 'react-test-renderer';
import MFButton, {
  MFButtonVariant,
} from '../../src/components/MFButton/MFButton';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Pressable} from 'react-native';
import {MFTabBarStyles} from '../../src/components/MFTabBar/MFTabBarStyles';

configure({adapter: new Adapter()});

const onPressEvent = variant => {
  console.log(`Variant is ${variant}`);
};

export const mediaURI =
  'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png';

test('MFButton Icon Variant', () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Icon}
      onPress={onPressEvent}
      textLabel={'Hello'}
      iconPlacement={'Left'}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{uri: mediaURI}}
      imageSource={{uri: mediaURI}}
      avatarSource={{uri: mediaURI}}
      iconStyles={{height: 60, width: 60}}
    />,
  );
  const pressableComponent = component.root.findByType(Pressable);
  expect(component.root.props.iconPlacement).toBe('Left');
  // console.log(pressableComponent.props.style);
  // expect(pressableComponent.props.style[1].height).toBe(60);
  expect(component.root.props.iconSource.uri).toBe(mediaURI);

  component.root.props.onPress(component.root.props.variant);
});
