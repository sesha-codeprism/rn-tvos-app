import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Animated, Dimensions, StyleSheet, Modal } from "react-native";
import { GLOBALS } from "../../../utils/globals";
import MoreInfoPanel from "./MoreInfoPanel";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
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
  moreInfoProps: {
    udpData: any;
    networkInfo: any;
    genres: any;
    episodeData?: any;
    episodeDetailsData?: any;
  };
}
const DetailsDrawer = (props: DetailsDrawerProps, ref: Ref<any>) => {
  const [expanded, setExpanded] = useState(props.open);
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
  const leftOffset = new Animated.Value(
    GLOBALS.enableRTL
      ? -(SCREEN_WIDTH * (props.drawerPercentage / 100))
      : SCREEN_WIDTH * (props.drawerPercentage / 100)
  );

  useEffect(() => {
    expanded ? openDrawer() : closeDrawer();
  }, [expanded]);
  useImperativeHandle(ref, () => ({
    openDrawer,
    closeDrawer,
    open,
    close,
  }));
  const open = () => {
    setExpanded(true);
  };
  const close = () => {
    setExpanded(false);
  };
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
  };
  const renderPush = () => {
    const { drawerPercentage } = props;
    const animated = { transform: [{ translateX: leftOffset }] };
    console.log("renderPush");

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={expanded}
        onRequestClose={() => {
          setExpanded(false);
          closeDrawer();
          console.log("Modal has been closed.", expanded);
        }}
        style={[styles.main, GLOBALS.enableRTL ? { left: 0 } : { right: 0 }]}
        onDismiss={() => {
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
            <MoreInfoPanel
              udpData={props.moreInfoProps.udpData}
              networkInfo={props.moreInfoProps.networkInfo}
              genres={props.moreInfoProps.genres}
              episodeData={props.moreInfoProps.episodeData}
              episodeDetailsData={props.moreInfoProps.episodeDetailsData}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  };
  return renderPush();
};
export const DetailsSidePanel = forwardRef(DetailsDrawer);

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

DetailsSidePanel.defaultProps = {
  drawerPercentage: 37,
  animationTime: 200,
  overlay: false,
  animatedWidth: SCREEN_WIDTH * 0.2,
  closeOnPressBack: false,
  drawerContent: false,
};
