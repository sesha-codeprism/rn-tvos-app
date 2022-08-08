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
  Modal,
} from "react-native";
import PropTypes from "prop-types";
import { SettingsNavigator } from "../../config/navigation/RouterOutlet";

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
const Drawer = (props: MFDrawerProps, ref: Ref<any>) => {
  const [expanded, setExpanded] = useState(props.open);
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const leftOffset = new Animated.Value(
    SCREEN_WIDTH * (props.drawerPercentage / 100)
  );

  useEffect(() => {
    console.log('inside useEffect', expanded, props.open);
    expanded ? openDrawer() : closeDrawer();
  }, [expanded]);
  useImperativeHandle(ref, () => ({
    openDrawer,
    closeDrawer,
    open,
    close,
  }));
  const open = () => {
    console.log('open');
    setExpanded(true);
  };
  const close = () => {
    console.log('close');
    setExpanded(false);
  };
  const openDrawer = () => {
    console.log("Drawer is open", expanded);
    const { drawerPercentage, animationTime, opacity } = props;
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);
    Animated.parallel([
      Animated.timing(leftOffset, {
        toValue: 0,
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
    console.log("Drawer is closed");
    const { animationTime, drawerPercentage } = props;
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);
    Animated.parallel([
      Animated.timing(leftOffset, {
        toValue: DRAWER_WIDTH,
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
  const renderPush = () => {
    const { children, drawerContent, drawerPercentage } = props;
    const animated = { transform: [{ translateX: leftOffset }] };
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);
    console.log("renderPush");
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={expanded}
        // onShow={(e) => {
        //   e.preventDefault();
        //   console.log("modal visible", e, expanded);
        // }}
        onRequestClose={() => {
          setExpanded(false);
          closeDrawer();
          console.log("Modal has been closed.", expanded);
        }}
        style={styles.main}
        onDismiss={() => {
          console.log("Modal dismissed", expanded);
        }}
        presentationStyle={'overFullScreen'}
        
      >
        <Animated.View
          style={[
            animated,
            // styles.main,
            { width: SCREEN_WIDTH },
          ]}
        >
          <Animated.View
            style={[
              styles.container,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <SettingsNavigator isAuthorized={true} />
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  };

  //   const renderOverlay = () => {
  //     const { children, drawerContent, drawerPercentage } = props;
  //     const animated = { transform: [{ translateX: leftOffset }] };
  //     const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);
  //     console.log("renderOverlay");

  //     if (isIOS && VERSION >= 11) {
  //       return (
  //         <View style={[styles.main]}>
  //           <Animated.View
  //             style={[
  //               animated,
  //               styles.drawer,
  //               { width: DRAWER_WIDTH, left: -DRAWER_WIDTH },
  //             ]}
  //           >
  //             {drawerContent ? drawerContent : drawerFallback()}
  //           </Animated.View>
  //           <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
  //             {children}
  //           </Animated.View>
  //         </View>
  //       );
  //     }

  //     return (
  //       <View style={styles.main}>
  //         <Animated.View
  //           style={[
  //             animated,
  //             styles.drawer,
  //             {
  //               width: DRAWER_WIDTH,
  //               left: -DRAWER_WIDTH,
  //             },
  //           ]}
  //         >
  //           {drawerContent ? drawerContent : drawerFallback()}
  //         </Animated.View>
  //         <Animated.View
  //           style={[
  //             styles.container,
  //             {
  //               opacity: fadeAnim,
  //             },
  //           ]}
  //         >
  //           {children}
  //         </Animated.View>
  //       </View>
  //     );
  //   };
  return renderPush();
};
export const MFDrawer = forwardRef(Drawer);

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    right: 0,
    top: 0,
    width: SCREEN_WIDTH,
    backgroundColor: "green",
  },
  container: {
    position: "absolute",
    right: 0,
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
