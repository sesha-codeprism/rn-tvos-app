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

test('MFButton Contained Variant', () => {
  const component = renderer.create(
    <MFButton
      variant={MFButtonVariant.Contained}
      onPress={onPressEvent}
      textLabel={'Hello'}
      textStyle={[MFTabBarStyles.tabBarItemText]}
      focusedStyle={MFTabBarStyles.tabBarItemFocused}
      iconSource={{uri: mediaURI}}
      imageSource={{uri: mediaURI}}
      avatarSource={{uri: mediaURI}}
      containedButtonProps={{
        containedButtonStyle: {
          enabled: true,
          focusedBackgroundColor: MFTheme.colors.primary,
          elevation: 5,
          hoverColor: 'red',
          unFocusedBackgroundColor: MFTheme.colors.secondary,
        },
      }}
    />,
  );
  const pressableComponent = component.root.findByType(Pressable);
  expect(pressableComponent.props.style[2][0].backgroundColor).toBe(
    MFTheme.colors.secondary,
  );

  component.root.props.onPress(component.root.props.variant);
});
