import React, { useRef, useState } from "react";
import MFText from "./MFText";
import {
  Animated,
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { MFThemeObject } from "../@types/MFTheme";
import { appUIDefinition } from "../config/constants";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { AppImages } from "../assets/images";
import MFMetaData from "./MFMetaData";
const MFTheme: MFThemeObject = require("../config/theme/theme.json");

export enum AspectRatios {
  "2:3" = "2:3",
  "4:3" = "4:3",
  "16:9" = "16:9",
  "3:2" = "3:2",
  "3:4" = "3:4",
  "9:16" = "9:16",
}

export enum TitlePlacement {
  "overlayCenter",
  "overlayTop",
  "overlayBottom",
  "beneath",
}
export interface MFLibraryCardProps {
  title: string;
  subTitle?: string;
  data: SubscriberFeed;
  enableRTL?: boolean;
  layoutType: "LandScape" | "Portrait" | "Circular";
  showProgress?: boolean;
  progressComponent?: React.ReactElement | undefined;
  showTitleOnlyOnFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  titlePlacement?: TitlePlacement;
  overlayComponent?: React.ReactElement;
  shouldRenderText: boolean;
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
}

const MFLibraryCard: React.FunctionComponent<MFLibraryCardProps> = (props) => {
  const [focused, setFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const _onPress = (event: GestureResponderEvent) => {
    props.onPress && props.onPress(props.data);
  };

  const _onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(true);
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 250,
    }).start();
    Animated.timing(translateAnim, {
      useNativeDriver: true,
      toValue: -15,
      duration: 250,
    }).start();
    props.onFocus && props.onFocus(props.data);
  };

  const _onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
    fadeAnim.stopAnimation();
    translateAnim.stopAnimation();
    setFocused(false);
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 250,
    }).start();
    Animated.timing(translateAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 250,
    }).start();
    props.onBlur && props.onBlur(event);
  };

  const TitleAndSubtitle = () =>
    props.showTitleOnlyOnFocus ? (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        }}
      >
        <View>
          <MFMetaData currentFeed={props.data} />
        </View>
      </Animated.View>
    ) : (
      <MFMetaData currentFeed={props.data} />

      //   <Animated.View
      //     style={{
      //       opacity: fadeAnim,
      //       transform: [
      //         {
      //           translateY: translateAnim,
      //         },
      //       ],
      //     }}
      //   >
      //     <MFText
      //       textStyle={[
      //         styles.cardTitleText,
      //         {
      //           alignSelf:
      //             props.layoutType === "Circular" ? "center" : "flex-start",
      //           paddingRight: props.layoutType === "Circular" ? 150 : 0,
      //         },
      //       ]}
      //       displayText={props.title}
      //       enableRTL={props.enableRTL}
      //       shouldRenderText={props.shouldRenderText}
      //     />
      //     <MFText
      //       textStyle={[
      //         styles.cardSubTitleText,
      //         {
      //           alignSelf:
      //             props.layoutType === "Circular" ? "center" : "flex-start",
      //           paddingRight: props.layoutType === "Circular" ? 150 : 0,
      //         },
      //       ]}
      //       displayText={props.subTitle}
      //       enableRTL={props.enableRTL}
      //       shouldRenderText={props.shouldRenderText}
      //     />
      //   </Animated.View>
      // ) : (
      //   <View>
      //     <MFText
      //       textStyle={[
      //         styles.cardTitleText,
      //         {
      //           alignSelf:
      //             props.layoutType === "Circular" ? "center" : "flex-start",
      //           paddingRight: props.layoutType === "Circular" ? 150 : 0,
      //         },
      //       ]}
      //       displayText={props.title}
      //       enableRTL={props.enableRTL}
      //       shouldRenderText={props.shouldRenderText}
      //     />
      //     <MFText
      //       textStyle={[
      //         styles.cardSubTitleText,
      //         {
      //           alignSelf:
      //             props.layoutType === "Circular" ? "center" : "flex-start",
      //           paddingRight: props.layoutType === "Circular" ? 150 : 0,
      //         },
      //       ]}
      //       displayText={props.subTitle}
      //       enableRTL={props.enableRTL}
      //       shouldRenderText={props.shouldRenderText}
      //     />
      //   </View>
    );

  return (
    <TouchableOpacity
      style={[
        styles.rootContainer,
        focused
          ? StyleSheet.flatten([props.style, props.focusedStyle])
          : StyleSheet.flatten([props.style]),
      ]}
      activeOpacity={1}
      onPress={_onPress}
      onFocus={_onFocus}
      onBlur={_onBlur}
    >
      <View style={StyleSheet.flatten([props.imageStyle])}>
        <FastImage
          style={[props.imageStyle]}
          source={{
            uri:
              props.data.image16x9PosterURL != undefined
                ? props.data.image16x9PosterURL.uri
                : AppImages.tvshowPlaceholder,
            priority: FastImage.priority.normal,
          }}
        >
          {props.overlayComponent}
          <View>
            {props.showProgress && props.progressComponent != undefined
              ? props.progressComponent
              : undefined}
          </View>
          <View
            style={[
              styles.overlay,
              props.titlePlacement === TitlePlacement.overlayTop
                ? styles.overlayTopStyles
                : props.titlePlacement === TitlePlacement.overlayBottom
                ? styles.overlayBottomStyles
                : props.titlePlacement === TitlePlacement.overlayCenter
                ? styles.overlayCenterStyles
                : {},
            ]}
          >
            {props.titlePlacement != TitlePlacement.beneath ? (
              <TitleAndSubtitle />
            ) : undefined}
          </View>
        </FastImage>
        {props.titlePlacement === TitlePlacement.beneath ? (
          props.showTitleOnlyOnFocus ? (
            <Animated.View
              style={[
                styles.cardContentContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: translateAnim,
                    },
                  ],
                },
              ]}
            >
              <TitleAndSubtitle />
            </Animated.View>
          ) : (
            <View style={[styles.cardContentContainer]}>
              <TitleAndSubtitle />
            </View>
          )
        ) : undefined}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  rootContainer: {
    width: 480,
    height: 287,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 460,
    height: 263,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    zIndex: 1,
    elevation: 1,
  },
  cardContentContainer: {
    width: 450,
    height: 253,
  },
  cardTitleText: {
    color: "white",
    fontSize: appUIDefinition.theme.fontSizes.subTitle1,
    marginTop: 10,
  },
  cardSubTitleText: {
    color: "white",
    fontSize: appUIDefinition.theme.fontSizes.body2,
    marginTop: 10,
  },
  overlayTopStyles: {
    top: 0,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  overlayBottomStyles: {
    bottom: 0,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  overlayCenterStyles: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});
export default MFLibraryCard;
