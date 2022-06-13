import React from 'react';
import renderer from 'react-test-renderer';
import MFButton, {
  MFButtonVariant,
} from '../../src/components/MFButton/MFButton';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Pressable} from 'react-native';
import {MFTabBarStyles} from '../../src/components/MFTabBar/MFTabBarStyles';

const MFTheme = require('../../src/config/theme/theme.json');

configure({adapter: new Adapter()});

const onPressEvent = variant => {
  console.log(`Variant is ${variant}`);
};

export const mediaURI =
  'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png';

test('MFButton Outlined Variant', () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Outlined}
      onPress={onPressEvent}
      textLabel={'Hello'}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{uri: mediaURI}}
      imageSource={{uri: mediaURI}}
      avatarSource={{uri: mediaURI}}
      outlinedButtonProps={{
        outlinedButtonStyle: {
          focusedBorderColor: MFTheme.colors.primary,
          unFocusedBorderColor: MFTheme.colors.secondary,
          focusedBorderWidth: 4,
          unFocusedBorderWidth: 2,
          isDisabled: false,
        },
      }}
    />,
  );
  const pressableComponent = component.root.findByType(Pressable);
  expect(pressableComponent.props.style[2].borderBottomColor).toBe(
    MFTheme.colors.secondary,
  );
  component.root.props.onPress(component.root.props.variant);
});
