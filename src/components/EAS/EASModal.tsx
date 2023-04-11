import React, { useEffect, useState } from "react";
import {
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  Modal,
  StyleSheet,
  TVMenuControl,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import EASAlert from "./EASAlert";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
interface EASContainerProps {
  easDetails: any;
}
const EASModal = (props: EASContainerProps) => {
  const closeDrawer = () => {
    console.log("Requestiong modal close");
    DeviceEventEmitter.emit("EASClose", null);
  };

  useEffect(() => {
    TVMenuControl.enableTVMenuKey();
    BackHandler.addEventListener("hardwareBackPress", () => {
      console.log("Requestiong modal close");
      DeviceEventEmitter.emit("EASClose", null);
      return true;
    });
  }, []);

  return (
    <View
      // transparent={true}
      // visible={true}
      // onRequestClose={() => {
      //   closeDrawer();
      // }}
      style={styles.main}
      // onDismiss={closeDrawer}
      // presentationStyle={"overFullScreen"}
      // animationType="fade"
      // needsOffscreenAlphaCompositing
    >
      <EASAlert easMessage={props} />
    </View>
  );
};
// const EASModal = EASModal;
export default EASModal;

const styles = StyleSheet.create({
  main: {
    // right: 0,
    top: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 1200,
    backgroundColor: "red",
  },
  container: {
    // right: 0,
    height: SCREEN_HEIGHT,
    zIndex: 0,
  },
  drawer: {
    position: "absolute",
    height: SCREEN_HEIGHT,
    zIndex: 1,
  },
});
