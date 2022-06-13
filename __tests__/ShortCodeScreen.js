import 'react-native';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';
import ShortCodeScreen from '../src/views/auth/Shortcode.screen';
import renderer from 'react-test-renderer';
import {AppStrings} from '../src/config/strings';
import {View} from 'react-native';

configure({adapter: new Adapter()});

it('Short code screen', () => {
  const component = renderer.create(
    <ShortCodeScreen verificationCode="EPQTPJ" />,
  );
  const screen = component.root.findByType(View);
  console.log(screen.children);
  expect(component.root.props.verificationCode).toBe(AppStrings.sample_refresh_code);
});
