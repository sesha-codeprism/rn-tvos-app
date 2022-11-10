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
  displayText: string;
  displayStyles: StyleProp<TextStyle>;
  /** Rendered MFCard default styles */
  style?: StyleProp<ViewStyle>;
  /** Rendered MFCard image styles. Ideally same as Card's default style */
  imageStyle?: StyleProp<ImageStyle>;
  /** Rendered MFCard style when focused */
  focusedStyle?: StyleProp<ViewStyle>;
  onPress?: null | ((event: any) => void) | undefined;
  onFocus?: null | ((event: any) => void) | undefined;
}

const MFViewAllButton: React.FunctionComponent<MFViewAllButtonProps> =
  React.forwardRef(({ ...props }, ref: any) => {
    const [focused, setFocused] = useState(false);

    const _onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(true);
      props.onFocus && props.onFocus(event);
    };
    return (
      <MFCard
        ref={ref}
        title={props.displayText}
        data={undefined}
        style={props.style}
        focusedStyle={props.focusedStyle}
        imageStyle={props.imageStyle}
        layoutType={"LandScape"}
        shouldRenderText={true}
        titlePlacement={TitlePlacement.overlayCenter}
        onFocus={(event) => {
          console.log("MFViewAll focused", props.onFocus);
          props.onFocus && props.onFocus(event);
        }}
        onPress={(event) => {
          props.onPress && props.onPress(event);
        }}
      />
    );
  });
export default MFViewAllButton;
