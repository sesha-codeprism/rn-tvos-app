import React from 'react';
import renderer from 'react-test-renderer';
import MFButton, {
  MFButtonVariant,
} from '../../src/components/MFButton/MFButton';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Pressable} from 'react-native';
import {MFTabBarStyles} from '../../src/components/MFTabBar/MFTabBarStyles';
import FastImage from 'react-native-fast-image';

configure({adapter: new Adapter()});

const onPressEvent = variant => {
  console.log(`Variant is ${variant}`);
};

const mediaURI =
  'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png';

test('MFButton Avatar Variant', () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Avatar}
      onPress={onPressEvent}
      textLabel={'Hello'}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{uri: mediaURI}}
      imageSource={{uri: mediaURI}}
      avatarSource={{uri: mediaURI}}
    />,
  );
  const pressableComponent = component.root.findByType(Pressable);
  const imageComponent = component.root.findByType(FastImage);
  expect(component.root.props.avatarSource.uri).toBe(mediaURI);
  expect(pressableComponent.props.style[0].width).toBe(50);
  expect(pressableComponent.props.style[0].height).toBe(50);
  component.root.props.onPress(component.root.props.variant);
  expect(imageComponent.props.style).toStrictEqual(
    imageComponent.props.avatarStyles,
  );
});
