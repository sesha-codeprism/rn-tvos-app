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

import MFAvatarButton from "../MFButtonsVariants/MFAvatarButton";
import Styles from "../MFButtonsVariants/MFButtonStyles";
import MFContainedButton from "../MFButtonsVariants/MFContainedButton";
import MFIconButton from "../MFButtonsVariants/MFIconButton";
import MFImageButton from "../MFButtonsVariants/MFImageButton";
import MFOutlinedButton, {
  MFOutlinedButtonProps,
} from "../MFButtonsVariants/MFOutlinedButton";

import { MFAvatarButtonProps } from "../MFButtonsVariants/MFAvatarButton";
import { MFContainedButtonProps } from "../MFButtonsVariants/MFContainedButton";
import { Source, ImageStyle } from "react-native-fast-image";
import MFText from "../MFText";
import MFUnderlinedButton from "../MFButtonsVariants/MFUnderlinedButton";
import { MFUnderlinedButtonProps } from "../MFButtonsVariants/MFUnderlinedButton";
import MFTextButton from "../MFButtonsVariants/MFTextButton";
import MFDefaultButton from "../MFButtonsVariants/MFDefaultButton";

/**Variant of the Button */
export enum MFButtonVariant {
  /** Button with plain text */
  Text = "Text",
  /** Button with only inage background */
  Image = "Image",
  /** Button with text and colored background */
  Contained = "Contained",
  /**Button with text and colored underline */
  Underlined = "Underlined",
  /** Button with text and colored border */
  Outlined = "Outlined",
  /** Button with text and icon rendered on either side */
  Icon = "Icon",
  /** Button to render an  avatar */
  Avatar = "Avatar",
}

/**
 * Props for Contained Button variant
 *
 */
export interface ContainedButtonStyle {
  /** Specify if the button is enabled or not*/
  enabled: boolean;
  /** Background color when focused / highlighted*/
  focusedBackgroundColor: string;
  /** Hover color when focused / highlighted. Can be ignored*/
  hoverColor: String;
  /** Elevation of the button*/
  elevation: number;
  /** Background color when not focused / highlighted*/
  unFocusedBackgroundColor?: string;
  /**Unfocused Text Color */
  unFocusedTextColor?: string;
  /** Does the button has TV preferred focus */
  hasTVPreferredFocus?: boolean;
}

/**
 * Props for the Outlined button variant
 */
export interface OutlinedButtonStyle {
  /** Color of border when focused / highlighted*/
  focusedBorderColor: string;
  /** Width of border when focused / highlighted*/
  focusedBorderWidth: number;
  /** Color of border when not focused / highlighted*/
  unFocusedBorderColor: string;
  /** Width of border when focused / highlighted*/
  unFocusedBorderWidth: number;
  /** Specify if the button is disabled or not*/
  isDisabled: boolean;
}

export interface IconButtonProps {
  /** Placement of the icon, either to left of text or to the right */
  iconPlacement?: "Left" | "Right";
  /** Text to be displayed below the title text label */
  subTextLabel?: string;
  /** Style of the Subtitle textlabel */
  subTextStyle?: StyleProp<TextStyle>;
  /** Decide if the image should be rendered. Useful for conditional icon renders */
  shouldRenderImage?: boolean;
  /** Style of the Placeholder view to be rendered when icon is not. */
  placeholderStyles?: StyleProp<ViewStyle>;
}

/**
 * Props for Underlined button variant
 */
export interface UnderlinedButtonStyle {
  focusedBorderColor: string;
  /** Width of border when focused / highlighted*/
  focusedBorderWidth: number;
  /** Color of border when not focused / highlighted*/
  unFocusedBorderColor: string;
  /** Width of border when focused / highlighted*/
  unFocusedBorderWidth: number;
}

/**
 * Props for MFButton
 *
 */
export interface MFButtonProps {
  /** Type of MFButton to be rendered*/
  variant?: MFButtonVariant;
  /** Render style of MFButton*/
  style?: StyleProp<ViewStyle>;
  /** Style of MFButton when focused*/
  focusedStyle?: StyleProp<ViewStyle>;
  /** Style of text label*/
  textStyle?: StyleProp<TextStyle>;
  /** Text label to be displayed*/
  textLabel?: string;
  /** Source of icon to be rendered. For Icon variant only*/
  iconSource: Source | number;
  /** Source of image to be rendered. For Image variant only*/
  imageSource: Source | number;
  /** Source of avatar image to be rendered. For Avatar variant only*/
  avatarSource: Source | number | any;
  /** Props for Avatar button*/
  avatarButtonProps?: MFAvatarButtonProps;
  /** Props for Contained button*/
  containedButtonProps?: MFContainedButtonProps;
  /** Props for Outlined button*/
  outlinedButtonProps?: MFOutlinedButtonProps;
  /**props for Underlined button */
  underlinedButtonProps?: MFUnderlinedButtonProps;
  /** Styles for image.  For Image button*/
  imageStyles?: StyleProp<ImageStyle>;
  /*** Styles for icon.  For Icon button */
  iconStyles?: StyleProp<ImageStyle>;
  /** Styles for aavatar.  For Avatar button*/
  avatarStyles?: StyleProp<ImageStyle>;
  /** RTL support*/
  enableRTL?: boolean;
  /** Event to be triggered when focused */
  iconButtonStyles?: IconButtonProps;
  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered with unfocused */
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered with selected */
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  hasTVPreferredFocus?: boolean;
  disabled?: boolean;
  focusable?: boolean;
  children?: any;
}

const MFButton = React.forwardRef(({ ...props }: MFButtonProps, ref) => {
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

  return props.variant === MFButtonVariant.Text ? (
    <MFTextButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      style={[
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
      disabled={props.disabled ? props.disabled : false}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
    />
  ) : props.variant === MFButtonVariant.Image ? (
    <MFImageButton
      focusable={props.focusable === false ? false : true}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      buttonImage={props.imageSource}
      imageStyles={props.imageStyles}
      style={props.style}
      focusedStyle={props.focusedStyle}
      onBlur={_onBlur}
      onFocus={_onFocus}
      onPress={_onPress}
      disabled={props.disabled ? props.disabled : false}
    ></MFImageButton>
  ) : props.variant === MFButtonVariant.Contained ? (
    <MFContainedButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      onBlur={_onBlur}
      onFocus={_onFocus}
      onPress={_onPress}
      textLabel={props.textLabel}
      textStyle={props.textStyle}
      enableRTL={props.enableRTL}
      style={props.style}
      focusedStyle={props.focusedStyle}
      containedButtonStyle={props.containedButtonProps?.containedButtonStyle}
    ></MFContainedButton>
  ) : props.variant === MFButtonVariant.Outlined ? (
    <MFOutlinedButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      onBlur={_onBlur}
      onFocus={_onFocus}
      onPress={_onPress}
      textLabel={props.textLabel}
      textStyle={props.textStyle}
      enableRTL={props.enableRTL}
      outlinedButtonStyle={props.outlinedButtonProps?.outlinedButtonStyle}
    ></MFOutlinedButton>
  ) : props.variant === MFButtonVariant.Icon ? (
    <MFIconButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      imageSrc={props.iconSource}
      imageStyle={props.iconStyles}
      onBlur={_onBlur}
      onPress={_onPress}
      textLabel={props.textLabel}
      textStyle={props.textStyle}
      style={props.style}
      focusedStyle={props.focusedStyle}
      iconPlacement={props.iconButtonStyles?.iconPlacement}
      onFocus={_onFocus}
      subTextLabel={props.iconButtonStyles?.subTextLabel}
      subTextStyle={props.iconButtonStyles?.subTextStyle}
      shouldRenderImage={props.iconButtonStyles?.shouldRenderImage}
      placeholderStyles={props.iconButtonStyles?.placeholderStyles}
    ></MFIconButton>
  ) : props.variant === MFButtonVariant.Avatar ? (
    <MFAvatarButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      imageSrc={props.avatarSource}
      avatarStyle={props.avatarStyles}
      style={props.style}
      focusedStyle={props.focusedStyle}
      onBlur={_onBlur}
      onFocus={_onFocus}
      onPress={_onPress}
    ></MFAvatarButton>
  ) : props.variant === MFButtonVariant.Underlined ? (
    <MFUnderlinedButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
      onBlur={_onBlur}
      onFocus={_onFocus}
      onPress={_onPress}
      textLabel={props.textLabel}
      textStyle={props.textStyle}
      enableRTL={props.enableRTL}
      underlinedButtonStyle={props.underlinedButtonProps?.underlinedButtonStyle}
    />
  ) : (
    <MFDefaultButton
      ref={ref}
      focusable={props.focusable === false ? false : true}
      style={[
        Styles.Contained,
        focused
          ? StyleSheet.flatten([Styles.focused, props.style])
          : StyleSheet.flatten([Styles.unFcoused, props.style]),
      ]}
      onFocus={_onFocus}
      onBlur={_onBlur}
      onPress={_onPress}
      hasTVPreferredFocus={props.hasTVPreferredFocus ? true : false}
    >
      {props.children}
    </MFDefaultButton>
  );
});

export default MFButton;
