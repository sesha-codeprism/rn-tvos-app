import React, { forwardRef, Ref, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Modal,
  Settings as SettingsRN,
} from "react-native";
import { GLOBALS } from "../../../utils/globals";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MFEventEmitter from "../../../utils/MFEventEmitter";
import { PlayerSubtitleSideMenu } from "./SideMenus/PlayerSubtitleSideMenu";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface PlayerPlanelSubtitleProps {
  drawerPercentage: number;
  navigation?: any;
  params: any;
}
const PlayerPlanelSubtitle = (props: PlayerPlanelSubtitleProps) => {
  const offset = useSharedValue(GLOBALS.enableRTL ? 0 : SCREEN_WIDTH - SCREEN_WIDTH * props.drawerPercentage) ;


  useEffect(() => {
      openDrawer();
  }, );

  const openDrawer = () => {
    offset.value = withTiming(
      GLOBALS.enableRTL ? 0 : SCREEN_WIDTH - SCREEN_WIDTH * props.drawerPercentage,
      {
        duration: 10,
        easing: Easing.out(Easing.ease),
      }
    );
  };

  const closeDrawer = () => {
    offset.value = withTiming(0, {
      duration: 10,
      easing: Easing.in(Easing.linear),
    });
    MFEventEmitter.emit("closePlayerSubtitlePanel", null);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });


  const renderPush = () => {
    return (
      <Modal
        transparent={true}
        visible={true}
        onRequestClose={() => {
          closeDrawer();
        }}
        style={[styles.main, GLOBALS.enableRTL ? { left: 0 } : { right: 0 }]}
        onDismiss={() => {
          closeDrawer();
        }}
        presentationStyle={"overFullScreen"}
      >
        <Animated.View style={[styles.container, animatedStyles]}>
          <PlayerSubtitleSideMenu {...props.params}/>
        </Animated.View>
      </Modal>
    );
  };
  return renderPush();
};
const PlayerSubtitlePanel = PlayerPlanelSubtitle;
export default PlayerSubtitlePanel;

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
  },
});
