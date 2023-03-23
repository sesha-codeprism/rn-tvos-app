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
  Modal,
  View,
  Alert,
  BackHandler,
} from "react-native";
import { DetailRoutes } from "../../../config/navigation/DetailsNavigator";
import { GLOBALS } from "../../../utils/globals";
import LongPressMenu from "./longPressMenu";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// export const enum DetailRoutes {
//   Empty,
//   Popup,
//   MoreInfo,
//   EpisodeRecordOptions,
// }

// export enum OpenPages = 'MoreInf0'
export type OpenPages = "MoreInfo" | "EpisodeRecord";
interface DetailsDrawerProps {
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
  route?: any;
  screenProps?: any;
  closeModal: () => void;
  toggleMoreInfo?: ()=> void;
  // openPage: typeof DetailRoutes;
  // moreInfoProps: {
  //   udpData: any;
  //   networkInfo: any;
  //   genres: any;
  //   episodeData?: any;
  //   episodeDetailsData?: any;
  // };
  // episodeRecordingProps?: EpisodeRecordOptionsProps;
}

const SideDrawer = (props: DetailsDrawerProps, ref: Ref<any>) => {
  const [expanded, setExpanded] = useState(props.open);
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));

  const leftOffset = new Animated.Value(
    GLOBALS.enableRTL
      ? -(SCREEN_WIDTH * (props.drawerPercentage / 100))
      : SCREEN_WIDTH * (props.drawerPercentage / 100)
  );
  const backAction = () => {
    console.log("Capturing hadware back presses on profile screen");
    Alert.alert("Back button pressed");
    return null;
  };
  useEffect(() => {
    expanded ? openDrawer() : closeDrawer();
    BackHandler.addEventListener("hardwareBackPress", backAction);
  }, [expanded]);
  useImperativeHandle(ref, () => ({
    openDrawer,
    closeDrawer,
    open,
    close,
    pushRoute,
    popRoute,
    resetRoutes,
  }));

  const pushRoute = (route: typeof DetailRoutes, props: any) => {};
  const popRoute = () => {};

  const resetRoutes = () => {
    // componentStack.current = [{ route: DetailRoutes.Empty, props: {} }];
  };
  const open = () => {
    setExpanded(true);
  };
  const close = () => {
    setExpanded(false);
  };

  const componentMount = () => {};
  const openDrawer = () => {
    const { animationTime, opacity, drawerPercentage } = props;
    const DRAWER_WIDTH = SCREEN_WIDTH * (drawerPercentage / 100);
    console.log("Drawer is open", expanded, DRAWER_WIDTH);

    Animated.parallel([
      GLOBALS.enableRTL
        ? Animated.timing(leftOffset, {
            toValue: 0,
            duration: animationTime,
            useNativeDriver: true,
          })
        : Animated.timing(leftOffset, {
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
      GLOBALS.enableRTL
        ? Animated.timing(leftOffset, {
            toValue: 0,
            duration: animationTime,
            useNativeDriver: true,
          })
        : Animated.timing(leftOffset, {
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
    setExpanded(false);
    props.closeModal();
  };
  const renderPush = () => {
    const { drawerPercentage } = props;
    const animated = { transform: [{ translateX: leftOffset }] };
    return (
      <Modal
        animationType="none"
        transparent={true}
        focusable
        visible={expanded}
        onRequestClose={() => {
          setExpanded(false);
          closeDrawer();
          console.log("Modal has been closed.", expanded);
        }}
        style={[styles.main, GLOBALS.enableRTL ? { left: 0 } : { right: 0 }]}
        onDismiss={() => {
          setExpanded(false);
          closeDrawer();
          console.log("Modal dismissed", expanded);
        }}
        presentationStyle={"overFullScreen"}
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
              GLOBALS.enableRTL ? { left: 0 } : { right: 0 },
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <LongPressMenu data={props.drawerContent} toggleMoreInfo={props.toggleMoreInfo}  />
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  };
  return renderPush();
};
export const SidePanel = forwardRef(SideDrawer);

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

SidePanel.defaultProps = {
  drawerPercentage: 37,
  animationTime: 200,
  overlay: false,
  animatedWidth: SCREEN_WIDTH * 0.2,
  closeOnPressBack: false,
  drawerContent: false,
};
