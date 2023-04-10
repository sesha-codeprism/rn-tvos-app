import React, { forwardRef, Ref, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Settings as SettingsRN,
  DeviceEventEmitter,
} from "react-native";
import { PurchasePanelNavigator } from "../../config/navigation/RouterOutlet";
import { GLOBALS } from "../../utils/globals";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Empty } from "../../views/MFDrawersContainer";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface PurchaseContainerProps {
  drawerPercentage: number;
  params:any;
  navigation?: any;
}
const PurchaseContainer = (props: PurchaseContainerProps) => {
  const offset = useSharedValue(GLOBALS.enableRTL ? 0 : SCREEN_WIDTH - SCREEN_WIDTH * props.drawerPercentage) ;
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        // Only restore state
        const savedStateString = SettingsRN.get("PURCHASE_NAVIGATION_HISTORY");
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  useEffect(() => {
    if (isReady) {
      openDrawer();
    }
  }, [isReady]);

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
    SettingsRN.set({ PURCHASE_NAVIGATION_HISTORY: {} })
    DeviceEventEmitter.emit("closeClosePurchase", null);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  if (!isReady) {
    return <Empty />;
  }

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
          <PurchasePanelNavigator initialState={initialState} params={props.params} />
        </Animated.View>
      </Modal>
    );
  };
  return renderPush();
};
const Purchase = PurchaseContainer;
export default Purchase;

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
