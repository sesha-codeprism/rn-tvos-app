import React, { useState } from "react";
import { OutlinedButtonStyle } from "../MFButton/MFButton";
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

export interface MFOutlinedButtonProps {
  outlinedButtonStyle?: OutlinedButtonStyle;
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
}

const MFOutlinedButton: React.FunctionComponent<MFOutlinedButtonProps> = (
  props
) => {
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
      disabled={props.outlinedButtonStyle?.isDisabled}
      style={[
        props.style,
        Styles.outlined,
        focused
          ? StyleSheet.flatten([
              Styles.focused,
              props.style,
              props.focusedStyle,
              {
                borderBottomColor:
                  props.outlinedButtonStyle?.focusedBorderColor,
                borderBottomWidth:
                  props.outlinedButtonStyle?.focusedBorderWidth,
              },
            ])
          : StyleSheet.flatten([
              Styles.unFcoused,
              props.style,
              {
                borderBottomColor: "transparent",
                borderBottomidth:
                  props.outlinedButtonStyle?.unFocusedBorderWidth,
              },
            ]),
      ]}
      onFocus={_onFocus}
      onBlur={_onBlur}
      onPress={_onPress}
    >
      <MFText
        textStyle={props.textStyle}
        displayText={props.textLabel}
        enableRTL={props.enableRTL}
        shouldRenderText
      />
    </Pressable>
  );
};

export default MFOutlinedButton;
