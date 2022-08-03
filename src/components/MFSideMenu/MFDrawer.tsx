import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const isIOS = Platform.OS === "ios";
const VERSION = parseInt(Platform.Version.toString(), 10);
interface MFDrawerProps {
  open: boolean;
  drawerPercentage: number;
  animationTime: number;
  overlay: boolean;
  opacity: number;
  drawerContent?: any;
  animatedWidth?: number;
  closeOnPressBack?: boolean;
  navigation?: any;
  children?: any;
}
const Drawer = (props: MFDrawerProps, ref:Ref<any>) => {
  const [expanded, setExpanded] = useState(false);
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const leftOffset = new Animated.Value(0);

  useEffect(() => {
    props.open ? openDrawer() : closeDrawer();
  }, [props.open]);
  useImperativeHandle(ref, () => ({
    openDrawer,
    closeDrawer,
  }));
  const openDrawer = () => {
    const { drawerPercentage, animationTime, opacity } = props;
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);

    Animated.parallel([
      Animated.timing(leftOffset, {
        toValue: DRAWER_WIDTH,
        duration: animationTime,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: opacity,
        duration: animationTime,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    const { animationTime } = props;
    Animated.parallel([
      Animated.timing(leftOffset, {
        toValue: 0,
        duration: animationTime,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationTime,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const drawerFallback = () => {
    return (
      <TouchableOpacity onPress={closeDrawer}>
        <Text>Close</Text>
      </TouchableOpacity>
    );
  };
  const renderPush = () => {
    const { children, drawerContent, drawerPercentage } = props;
    const animated = { transform: [{ translateX: leftOffset }] };
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);

    if (isIOS && VERSION >= 11) {
      return (
        <Animated.View style={[animated, styles.main]}>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={[
                styles.drawer,
                {
                  width: DRAWER_WIDTH,
                  left: -DRAWER_WIDTH,
                },
              ]}
            >
              {drawerContent ? drawerContent : drawerFallback()}
            </View>
            <Animated.View
              style={[
                styles.container,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              {children}
            </Animated.View>
          </SafeAreaView>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[animated, styles.main, { width: SCREEN_WIDTH + DRAWER_WIDTH }]}
      >
        <View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              left: -DRAWER_WIDTH,
            },
          ]}
        >
          {drawerContent ? drawerContent : drawerFallback()}
        </View>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  };

  const renderOverlay = () => {
    const { children, drawerContent, drawerPercentage } = props;
    const animated = { transform: [{ translateX: leftOffset }] };
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);

    if (isIOS && VERSION >= 11) {
      return (
        <View style={[styles.main]}>
          <Animated.View
            style={[
              animated,
              styles.drawer,
              { width: DRAWER_WIDTH, left: -DRAWER_WIDTH },
            ]}
          >
            {drawerContent ? drawerContent : drawerFallback()}
          </Animated.View>
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {children}
          </Animated.View>
        </View>
      );
    }

    return (
      <View style={styles.main}>
        <Animated.View
          style={[
            animated,
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              left: -DRAWER_WIDTH,
            },
          ]}
        >
          {drawerContent ? drawerContent : drawerFallback()}
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    );
  };
  return <>{props.overlay ? renderOverlay() : renderPush()}</>;
};
export const MFDrawer = forwardRef(Drawer);

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    left: 0,
    top: 0,
    width: SCREEN_WIDTH * .5
  },
  container: {
    position: "absolute",
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 0,
  },
  drawer: {
    position: "absolute",
    height: SCREEN_HEIGHT,
    zIndex: 1,
  },
});
