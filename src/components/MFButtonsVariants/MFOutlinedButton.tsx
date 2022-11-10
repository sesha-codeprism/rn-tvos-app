import React, { useState } from "react";
import { OutlinedButtonStyle } from "../MFButton/MFButton";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  View,
  ViewStyle,
} from "react-native";
import Styles from "./MFButtonStyles";
import { TextStyle } from "react-native";
import MFText from "../MFText";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    | (() => void)
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | (() => void)
    | undefined;
  onPress?:
    | null
    | (() => void)
    | ((event?: GestureResponderEvent) => void)
    | undefined;
  hasTVPreferredFocus?: boolean;
  focusable?: boolean;
  disabled?: boolean;
}

const MFOutlinedButton: React.FunctionComponent<MFOutlinedButtonProps> =
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
        focusable={props.focusable === false ? false : true}
        disabled={props.outlinedButtonStyle?.isDisabled}
        hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
        style={[
          Styles.outlined,
          props.style,
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
  });

export default MFOutlinedButton;
