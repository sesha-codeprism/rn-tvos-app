import React, { RefObject, useState } from "react";
import { ContainedButtonStyle } from "../MFButton/MFButton";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextStyle,
  ViewStyle,
} from "react-native";
import Styles from "./MFButtonStyles";
import MFText from "../MFText";
export interface MFDefaultButtonProps {
  containedButtonStyle?: ContainedButtonStyle;
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
  disabled?: boolean;
  children?: any;
}

const MFDefaultButton = React.forwardRef(
  ({ ...props }: MFDefaultButtonProps, ref: any) => {
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
        focusable={props.focusable === false ? false : true}
        style={props.style}
        onFocus={_onFocus}
        onBlur={_onBlur}
        onPress={_onPress}
        hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      >
        {props.children}
      </Pressable>
    );
  }
);

export default MFDefaultButton;
