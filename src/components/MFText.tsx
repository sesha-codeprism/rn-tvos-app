import React from 'react';
import {StyleProp, TextStyle, Text} from 'react-native';

export interface MFTextProps {
  displayText?: string;
  textStyle?: StyleProp<TextStyle>;
  enableRTL?: boolean;
  shouldRenderText: boolean;
}

const MFText: React.FunctionComponent<MFTextProps> = props => {
  return (
    <Text
      style={[
        props.textStyle,
        {writingDirection: props.enableRTL ? 'rtl' : 'ltr'},
      ]}>
      {props.shouldRenderText ? props.displayText : ''}
    </Text>
  );
};

export default MFText;
