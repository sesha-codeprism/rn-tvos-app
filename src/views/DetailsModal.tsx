import React from "react";
import { useEffect } from "react";
import {
  BackHandler,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GLOBALS } from "../utils/globals";
import MFEventEmitter from "../utils/MFEventEmitter";
import { Empty } from "./MFDrawersContainer";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
interface SettingsContainerProps {
  drawerPercentage: number;
  navigation?: any;
  children: any;
}
const DetailsContainer = (props: any) => {
  const offset = useSharedValue(0);
  const [initialState, setInitialState] = React.useState();

  const openDrawer = () => {
    offset.value = withTiming(SCREEN_WIDTH - SCREEN_WIDTH * 0.39, {
      duration: 10,
      easing: Easing.out(Easing.ease),
    });
  };

  const closeDrawer = () => {
    console.log("closinf off..");
    offset.value = withTiming(0, {
      duration: 10,
      easing: Easing.in(Easing.linear),
    });
    MFEventEmitter.emit("closeModal", null);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  //   if (!isReady) {
  //     return <Empty />;
  //   }

  const renderPush = () => {
    return (
      <View>
        <Animated.View style={[styles.container, animatedStyles]}>
          <Text style={{ color: "white", fontSize: 40 }}>RenderModal</Text>
        </Animated.View>
      </View>
    );
  };
  return renderPush();
};

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    // right: 0,
    top: 0,
    width: SCREEN_WIDTH,
    backgroundColor: "green",
  },
  container: {
    position: "absolute",
    // right: 0,
    width: SCREEN_WIDTH * 0.37,
    height: SCREEN_HEIGHT,
    zIndex: 0,
  },
  drawer: {
    position: "absolute",
    height: SCREEN_HEIGHT,
    zIndex: 1,
    backgroundColor: "red",
  },
});

export default DetailsContainer;
