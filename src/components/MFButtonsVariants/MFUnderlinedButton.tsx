import React, { useState } from "react";
import { UnderlinedButtonStyle } from "../MFButton/MFButton";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  ViewStyle,
} from "react-native";
import Styles from "./MFButtonStyles";
import { TextStyle } from "react-native";
import MFText from "../MFText";

export interface MFUnderlinedButtonProps {
  underlinedButtonStyle?: UnderlinedButtonStyle;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textLabel?: string;
  enableRTL?: boolean;

  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  hasTVPreferredFocus?: boolean;
  focusable?: boolean;
}

const MFUnderlinedButton: React.FunctionComponent<MFUnderlinedButtonProps> =
  React.forwardRef(({ ...props }, ref: any) => {
    const [focused, setFocused] = useState(false);

    const _onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(true);
      props.onFocus && props.onFocus(event);
    };
    const _onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(false);
      props.onBlur && props.onBlur(event);
    };
    const _onPress = (event: GestureResponderEvent) => {
      props.onPress && props.onPress(event);
    };
    return (
      <Pressable
        ref={ref}
        style={[
          props.style,
          Styles.underlined,
          focused
            ? StyleSheet.flatten([
                Styles.focused,
                props.style,
                props.focusedStyle,
                {
                  borderBottomColor:
                    props.underlinedButtonStyle?.focusedBorderColor,
                  borderBottomWidth:
                    props.underlinedButtonStyle?.focusedBorderWidth,
                },
              ])
            : StyleSheet.flatten([
                Styles.unFcoused,
                props.style,
                {
                  borderBottomColor:
                    props.underlinedButtonStyle?.unFocusedBorderColor,
                  borderBottomWidth:
                    props.underlinedButtonStyle?.unFocusedBorderWidth,
                },
              ]),
        ]}
        onFocus={_onFocus}
        onBlur={_onBlur}
        onPress={_onPress}
        hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
        focusable={props.focusable === false ? false : true}
      >
        <MFText
          textStyle={props.textStyle}
          displayText={props.textLabel}
          enableRTL={props.enableRTL}
          shouldRenderText
        />
      </Pressable>
    );
  });

export default MFUnderlinedButton;
