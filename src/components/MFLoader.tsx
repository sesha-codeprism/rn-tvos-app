import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AnimatedLottieView from "lottie-react-native";
interface MFLoaderProps {
  style?: any;
  transparent?: boolean;
}
const MFLoader = (props: MFLoaderProps) => {
  return (
    <View
      style={[
        styles.root,
        { backgroundColor: props.transparent ? "transparent" : "#00030E" },
      ]}
    >
      <AnimatedLottieView
        autoPlay={ true }
        loop={ true}
        source={require(`../assets/animations/9379-loader.json`)} //${splashAnimation}
        style={props.style ? props.style : { width: 500, height: 300 }}
        // onAnimationFinish={_onAnimationFinish}
      />
    </View>
  );
};

export default MFLoader;

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
