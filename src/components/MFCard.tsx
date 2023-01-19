import React, { useRef, useState } from "react";
import MFText from "./MFText";
import {
  Animated,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { Feed } from "../@types/HubsResponse";
import { appUIDefinition, debounceTime } from "../config/constants";
import Styles from "./MFButtonsVariants/MFButtonStyles";
import { AppImages } from "../assets/images";
import { globalStyles } from "../config/styles/GlobalStyles";
import { getFontIcon } from "../config/strings";

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
export interface MFCardProps {
  title: string;
  subTitle?: string;
  data?: Feed;
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
  onFocus?: null | ((event: any) => void) | undefined;
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onPress?: null | ((event: any) => void) | undefined;
}

const MFCard: React.FunctionComponent<MFCardProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    const [focused, setFocused] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(0)).current;
    const _onPress = () => {
      props.onPress && props.onPress(props.data);
    };
    //@ts-ignore
    const view_all = getFontIcon("view_all");

    const _onFocus = () => {
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
            transform: [
              {
                translateY: translateAnim,
              },
            ],
          }}
        >
          <MFText
            textStyle={[
              Styles.railTitle,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
                color: appUIDefinition.theme.colors.white,
                fontFamily: "Inter-Bold",
              },
            ]}
            displayText={props.title}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
          />
          <MFText
            textStyle={[
              Styles.railTitle,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
                color: appUIDefinition.theme.colors.white,
                fontFamily: "Inter-Bold",
              },
            ]}
            displayText={props.subTitle}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
          />
        </Animated.View>
      ) : (
        <View>
          <MFText
            textStyle={[
              Styles.railTitle,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
                color: appUIDefinition.theme.colors.white,
                fontFamily: "Inter-Bold",
              },
            ]}
            displayText={props.title}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
          />
          <MFText
            textStyle={[
              Styles.railTitle,
              ,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
                color: appUIDefinition.theme.colors.white,
                fontFamily: "Inter-Bold",
              },
            ]}
            displayText={props.subTitle}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
          />
        </View>
      );

    return (
      <TouchableOpacity
        ref={ref}
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
        <View
          style={StyleSheet.flatten([
            props.imageStyle,
            {
              backgroundColor: globalStyles.backgroundColors.shade2,
              justifyContent: "center",
              paddingBottom: 50,
            },
          ])}
        >
          {props.title.includes("View") && (
            <MFText
              shouldRenderText
              displayText={view_all}
              textStyle={{
                fontFamily: globalStyles.fontFamily.icons,
                fontSize: 150,
                color: globalStyles.fontColors.light,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            />
          )}
          <MFText
            shouldRenderText
            displayText={props.title}
            textStyle={[
              styles.cardTitleText,
              { marginTop: props.title.includes("View") ? 0 : 30 },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  }
);

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
    fontSize: globalStyles.fontSizes.body1,
    marginTop: -10,
    fontFamily: globalStyles.fontFamily.bold,
    textAlign: "center",
    textAlignVertical: "center",
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
export default MFCard;
