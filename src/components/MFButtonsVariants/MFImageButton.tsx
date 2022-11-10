import React, { useState } from "react";
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
import FastImage, { Source, ImageStyle } from "react-native-fast-image";

export interface MFImageButtonProps {
  textStyle?: StyleProp<TextStyle>;
  textLabel?: string;
  buttonImage: Source | number;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  imageStyles?: StyleProp<ImageStyle>;
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
  disabled?: boolean;
  focusable?: boolean;
}

const MFImageButton: React.FunctionComponent<MFImageButtonProps> =
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
        style={[
          focused
            ? StyleSheet.flatten([props.style, props.focusedStyle])
            : StyleSheet.flatten([props.style]),
        ]}
        onFocus={_onFocus}
        onBlur={_onBlur}
        onPress={_onPress}
        testID={"Image_Button"}
        hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      >
        <FastImage source={props.buttonImage} style={[props.imageStyles]}>
          {props.children}
        </FastImage>
      </Pressable>
    );
  });

export default MFImageButton;
