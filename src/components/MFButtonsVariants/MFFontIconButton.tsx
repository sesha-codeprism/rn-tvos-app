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
import { globalStyles } from "../../config/styles/GlobalStyles";
import MFText from "../MFText";
import Styles from "./MFButtonStyles";

export interface MFFontIconProps {
  /**Prop to decide icon placement */
  iconPlacement?: "Left" | "Right";
  /** Unicode string to be rendered as Icon */
  fontIcon?: string;
  /**Style of the fonticon */
  fontIconStyle?: StyleProp<TextStyle>;
  /** Prop to indicate whether the button is focused. Used in ButtonGroup */
  focused?: boolean;
  /** Style of the base button container */
  style?: StyleProp<ViewStyle>;
  /** Style of button container when the button is focused */
  focusedStyle?: StyleProp<ViewStyle>;
  /** Label to be rendered */
  textLabel?: string;
  /** Style of the textlabel */
  textLabelStyle?: StyleProp<TextStyle>;
  /**Prop to decide if RTL feature should be enabled */
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
  hasTVPreferredFocus?: boolean;
  /** Prop to decide if the button is focusable */
  focusable?: boolean;
  /** Prop to decide if the Textlabel should be rendered */
  shoulRenderLabel?: boolean;
  /** Props to control font icon auto-sizing */
  shouldAutoSizeIcon?: boolean;
}

const MFFontIconButton: React.FunctionComponent<MFFontIconProps> =
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
          Styles.iconButtonStyles,
          props.style,
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
        {props.iconPlacement === "Left" ? (
          <React.Fragment>
            {props.shouldRenderImage && (
              <MFText
                shouldRenderText
                displayText={props.fontIcon}
                textStyle={props.fontIconStyle}
                adjustsFontSizeToFit={props.shouldAutoSizeIcon}
              />
            )}
            {props.shoulRenderLabel && (
              <MFText
                shouldRenderText
                displayText={props.textLabel}
                textStyle={props.textLabelStyle}
                adjustsFontSizeToFit={false}
                numberOfLines={2}
              />
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {props.shoulRenderLabel && (
              <MFText
                shouldRenderText
                displayText={props.textLabel}
                textStyle={props.textLabelStyle}
                adjustsFontSizeToFit={false}
                numberOfLines={2}
              />
            )}
            {props.shouldRenderImage && (
              <MFText
                shouldRenderText
                displayText={props.fontIcon}
                textStyle={props.fontIconStyle}
                adjustsFontSizeToFit={props.shouldAutoSizeIcon}
              />
            )}
          </React.Fragment>
        )}
      </Pressable>
    );
  });

MFFontIconButton.defaultProps = {
  shouldRenderImage: true,
  iconPlacement: "Left",
  fontIconStyle: {
    fontFamily: globalStyles.fontFamily.icons,
  },
  shoulRenderLabel: true,
  shouldAutoSizeIcon: true,
};

export default MFFontIconButton;
