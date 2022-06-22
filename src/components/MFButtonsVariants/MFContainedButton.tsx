import React, { useState } from "react";
import { ContainedButtonStyle } from "../MFButton/MFButton";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextStyle,
  ViewStyle,
} from "react-native";
import Styles from "./MFButtonStyles";
import MFText from "../MFText";
export interface MFContainedButtonProps {
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
}

const MFContainedButton: React.FunctionComponent<MFContainedButtonProps> = (
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
      testID={"Contained_Button"}
      onFocus={_onFocus}
      onBlur={_onBlur}
      onPress={_onPress}
      hasTVPreferredFocus
      disabled={props.containedButtonStyle?.enabled}
      style={[
        props.style,
        Styles.Contained,
        focused
          ? StyleSheet.flatten([
              Styles.focused,
              props.style,
              props.focusedStyle,
              {
                backgroundColor:
                  props.containedButtonStyle?.focusedBackgroundColor,
              },
            ])
          : [
              StyleSheet.flatten([
                Styles.unFcoused,
                props.style,
                {
                  backgroundColor:
                    props.containedButtonStyle?.unFocusedBackgroundColor,
                },
              ]),
            ],
      ]}
      focusable={props.focusable === false ? false : true}
    >
      <MFText
        textStyle={[
          props.textStyle,
          focused
            ? { color: "white" }
            : { color: props.containedButtonStyle?.unFocusedTextColor },
        ]}
        enableRTL={props.enableRTL}
        shouldRenderText
        displayText={props.textLabel}
      />
    </Pressable>
  );
};

export default MFContainedButton;
