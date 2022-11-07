import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  TargetedEvent,
  TextStyle,
  ViewStyle,
} from "react-native";
import MFCard, { TitlePlacement } from "../MFCard";
import { ImageStyle } from "react-native-fast-image";

export interface MFViewAllButtonProps {
  /** Text to be displayed on the card */
  displayText: string;
  /** Style of the text rendered on the card */
  displayStyles: StyleProp<TextStyle>;
  /** Rendered MFCard default styles */
  style?: StyleProp<ViewStyle>;
  /** Rendered MFCard image styles. Ideally same as Card's default style */
  imageStyle?: StyleProp<ImageStyle>;
  /** Rendered MFCard style when focused */
  focusedStyle?: StyleProp<ViewStyle>;
  /** Function to execute when card is pressed */
  onPress?: null | ((event: any) => void) | undefined;
  /** Function to execute when card is focused */
  onFocus?: null | ((event: any) => void) | undefined;
  /** Feed that is being used to display */
  feed?: any;
}

const MFViewAllButton: React.FunctionComponent<MFViewAllButtonProps> = (
  props
) => {
  const [focused, setFocused] = useState(false);

  const _onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(true);
    props.onFocus && props.onFocus(event);
  };

  const _onPressed = (event: any) => {
    props.onPress && props.feed && props.onPress(props.feed);
  };
  return (
    <MFCard
      title={props.displayText}
      data={undefined}
      style={props.style}
      focusedStyle={props.focusedStyle}
      imageStyle={props.imageStyle}
      layoutType={"LandScape"}
      shouldRenderText={true}
      titlePlacement={TitlePlacement.overlayCenter}
      onFocus={(event) => {
        console.log("MFViewAll focused", props.onFocus, props.onPress);
        props.onFocus && props.onFocus(event);
      }}
      onPress={(event) => {
        _onPressed(event);
      }}
    />
  );
};

export default MFViewAllButton;
