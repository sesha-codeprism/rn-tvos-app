import React, { useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Styles from "./MFButtonStyles";
import FastImage, { Source, ImageStyle } from "react-native-fast-image";
import MFText from "../MFText";

export interface MFIconButtonProps {
  iconPlacement?: "Left" | "Right";
  imageSrc: Source | number;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textLabel?: string;
  subTextLabel?: string;
  subTextStyle?: StyleProp<TextStyle>;
  enableRTL?: boolean;
  /** Event to be triggered when the button is focused */
  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered when the button loses focus */
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered when the button is pressed */
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  /** Decide if the image should be rendered. Useful for conditional icon renders */
  shouldRenderImage?: boolean;
  /** Style of the Placeholder view to be rendered when icon is not. */
  placeholderStyles?: StyleProp<ViewStyle>;
  hasTVPreferredFocus?: boolean;
  focusable?:boolean;
}

const MFIconButton: React.FunctionComponent<MFIconButtonProps> = (props) => {
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

  return props.iconPlacement === "Left" ? (
    <Pressable
      style={[
        Styles.iconButtonStyles,
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
      {props.shouldRenderImage ? (
        <FastImage source={props.imageSrc} style={props.imageStyle} />
      ) : (
        <View style={props.placeholderStyles} />
      )}
      <View style={{ flexDirection: "column" }}>
        <MFText
          textStyle={props.textStyle}
          displayText={props.textLabel}
          enableRTL={props.enableRTL}
          shouldRenderText
        />
        {props.subTextLabel ? (
          <MFText
            textStyle={props.subTextStyle}
            displayText={props.subTextLabel}
            enableRTL={props.enableRTL}
            shouldRenderText
          />
        ) : (
          <View />
        )}
      </View>
    </Pressable>
  ) : (
    <Pressable
      style={[
        Styles.iconButtonStyles,
        focused
          ? StyleSheet.flatten([Styles.focused])
          : StyleSheet.flatten([Styles.unFcoused]),
      ]}
      onFocus={_onFocus}
      onBlur={_onBlur}
      onPress={_onPress}
    >
      <View style={{ flexDirection: "column" }}>
        <MFText
          textStyle={props.textStyle}
          displayText={props.textLabel}
          enableRTL={props.enableRTL}
          shouldRenderText
        />
        {props.subTextLabel ? (
          <MFText
            textStyle={props.subTextStyle}
            displayText={props.subTextLabel}
            enableRTL={props.enableRTL}
            shouldRenderText
          />
        ) : (
          <View />
        )}
      </View>
      {props.shouldRenderImage ? (
        <FastImage source={props.imageSrc} style={props.imageStyle} />
      ) : (
        <View style={props.placeholderStyles} />
      )}
    </Pressable>
  );
};

export default MFIconButton;
