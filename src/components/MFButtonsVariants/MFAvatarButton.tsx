import React, { useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  ViewStyle,
} from "react-native";
import FastImage, { Source, ImageStyle } from "react-native-fast-image";
import Styles from "./MFButtonStyles";

export interface MFAvatarButtonProps {
  /** Width of Avatar button*/
  width?: number;
  /** Height of Avatar button*/
  height?: number;
  /** Specify if Avatar button is disabled*/
  disabled?: boolean;
  /** Avatar button image source*/
  imageSrc: Source | number;
  /** Render style for the button*/
  style?: StyleProp<ViewStyle>;
  /** Render style when button is focused*/
  focusedStyle?: StyleProp<ViewStyle>;
  /** Render style for the image*/
  avatarStyle?: StyleProp<ImageStyle>;

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

const MFAvatarButton: React.FunctionComponent<MFAvatarButtonProps> =React.forwardRef( (
  {...props}, ref: any
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
    ref={ref}
      style={[
        Styles.avatarButtonStyles,
        focused
          ? StyleSheet.flatten([
              Styles.focused,
              props.style,
              props.focusedStyle,
            ])
          : StyleSheet.flatten([Styles.unFcoused, props.style]),
      ]}
      onFocus={_onFocus}
      onBlur={_onBlur}
      onPress={_onPress}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      focusable={props.focusable === false ? false : true}
    >
      <FastImage
        source={props.imageSrc}
        style={props.avatarStyle}
        resizeMode={FastImage.resizeMode.cover}
      ></FastImage>
    </Pressable>
  );
});

export default MFAvatarButton;
