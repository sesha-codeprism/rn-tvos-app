import React from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
interface MFProgressBarProps {
  backgroundColor: string;
  foregroundColor: string;
  toValue: number;
  maxHeight: number;
  maxWidth: number;
}

const MFProgressBar: React.FunctionComponent<MFProgressBarProps> = (props) => {
  const progressHeight = (value: number) => {
    return value > 0 ? (value * props.maxHeight) / 100 : 0;
  };
  const progressWidth = (value: number) => {
    return value > 0 ? (value * props.maxWidth) / 100 : 0;
  };
  return (
    <View
      style={[styles.container, { backgroundColor: props.backgroundColor }]}
    >
      <Animated.View
        style={[
          styles.ProgressBar,
          {
            backgroundColor: props.foregroundColor,
            width: progressWidth(props.toValue),
          },
        ]}
      />
    </View>
  );
};
export default MFProgressBar;
const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    height: 4,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: height * 0.005,
    borderColor: "transparent",
  },
  ProgressBar: {
    height: "100%",
    width: 0,
    maxHeight: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    borderRadius: 30,
  },
});
