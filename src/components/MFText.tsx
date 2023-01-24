import React from "react";
import { StyleProp, TextStyle, Text, StyleSheet } from "react-native";

export interface MFTextProps {
  displayText?: string;
  textStyle?: StyleProp<TextStyle>;
  enableRTL?: boolean;
  shouldRenderText: boolean;
  adjustsFontSizeToFit?: boolean;
  numberOfLines?: number;
}

const MFText: React.FunctionComponent<MFTextProps> = (props) => {
  return (
    <Text
      style={[
        textStyleSheet.defaultStyle,
        props.textStyle,
        { writingDirection: props.enableRTL ? "rtl" : "ltr" },
      ]}
      adjustsFontSizeToFit={props.adjustsFontSizeToFit}
      numberOfLines={props.numberOfLines}
      textBreakStrategy="balanced"
      ellipsizeMode="tail"
    >
      {props.shouldRenderText ? props.displayText : ""}
    </Text>
  );
};

MFText.defaultProps = {
  adjustsFontSizeToFit: false,
  numberOfLines: 1,
};

const textStyleSheet = StyleSheet.create({
  defaultStyle: {
    fontFamily: "Inter-Regular",
  },
});

export default MFText;
