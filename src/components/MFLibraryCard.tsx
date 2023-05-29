import React, { useEffect, useRef, useState } from "react";
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
  ImageBackground,
} from "react-native";
import { ImageStyle } from "react-native-fast-image";
import { MFThemeObject } from "../@types/MFTheme";
import { appUIDefinition } from "../config/constants";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { AppImages } from "../assets/images";
import { SCREEN_HEIGHT } from "../utils/dimensions";
import { sourceTypeString } from "../utils/analytics/consts";
import dateUtils from "../utils/dateUtils";
import MFOverlay from "./MFOverlay";
import { queryClient } from "../config/queries";
import { getLiveData } from "../customHooks/useLiveData";
import { GLOBALS } from "../utils/globals";

/** All supported Aspect Ratios */
export enum AspectRatios {
  "2:3" = "2:3",
  "4:3" = "4:3",
  "16:9" = "16:9",
  "3:2" = "3:2",
  "3:4" = "3:4",
  "9:16" = "9:16",
}

/** Enum to decide on Title Placement */
export enum TitlePlacement {
  "overlayCenter",
  "overlayTop",
  "overlayBottom",
  "beneath",
}

/** Props for MFLibraryCard */
export interface MFLibraryCardProps {
  /** Text label to be rendered */
  title: string;
  /** Subtitle string to be rendered */
  subTitle?: string;
  /** Feed information to be rendered as card */
  data: SubscriberFeed;
  /** Should RTL be enabled for card */
  enableRTL?: boolean;
  /** Specification of layout type of card */
  layoutType: "LandScape" | "Portrait" | "Circular";
  /** Should the progress indicator be rendered */
  showProgress?: boolean;
  /** Component to be rendered as progress component */
  progressComponent?: React.ReactElement | undefined;
  /** Should title be rendered only when card is focused */
  showTitleOnlyOnFocus?: boolean;
  /** Style of card */
  style?: StyleProp<ViewStyle>;
  /** Style of the background image */
  imageStyle?: StyleProp<ImageStyle>;
  /** style of card when focused */
  focusedStyle?: StyleProp<ViewStyle>;
  /** Placement of title w.r.t card */
  titlePlacement?: TitlePlacement;
  /** Component to be rendered on top of the card */
  overlayComponent?: React.ReactElement;
  /** Should the text component be rendered */
  shouldRenderText: boolean;
  /** Function to execute when card is focused */
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  /** Function to execute then card is unfocused */
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Function to execute then card is pressed */
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
  /** Should autofocus on the first card */
  autoFocusOnFirstCard?: boolean;
  /** ID of the selected card */
  libraryCardId?: string;
  /** Event to trigger on long press of card */
  onLongPress?: any;
}

/**
 * A functional component that renders a showcard
 * @param {MFLibraryCardProps} props - Props for MFCard
 * @returns {React.ForwardedRef} - The rendered MFCard
 */
const MFLibraryCard: React.FunctionComponent<MFLibraryCardProps> =
  React.forwardRef(({ ...props }, ref: any) => {
    const [focused, setFocused] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const textFadeAnim = useRef(new Animated.Value(1)).current;
    const translateAnim = useRef(new Animated.Value(0)).current;

    const getStartTime = () => {
      //@ts-ignore
      const schedule = props.data?.Schedule,
        startUtc = schedule?.StartUtc;
      return dateUtils.convertISOStringToTimeStamp(startUtc);
    };

    const getEndTime = () => {
      //@ts-ignore
      const schedule = props.data?.Schedule,
        endUtc = schedule?.EndUtc;
      return dateUtils.convertISOStringToTimeStamp(endUtc);
    };
    let progressUpdateInterval: any;
    let clearIntervalTimeout: any;
    let progressBookmarkTimeout: any;
    const [startTime, setStarTime] = useState(getStartTime());
    const [endTime, setEndTime] = useState(getEndTime());
    const [progress, setProgress] = useState<any>(undefined);
    // const [progressUpdateInterval, setProgressUpdateInterval] = useState(0);
    // const [clearIntervalTimeout, setClearIntervalTimeout] = useState(0);
    // const [progressBookmarkTimeout, setProgressBookmarkTimeout] = useState(0);
    const _onPress = () => {
      console.log("onPress called");
      props.onPress && props.onPress(props.data);
    };
    const _onLongPress = () => {
      console.log("onLongPress called");

      props.onLongPress && props.onLongPress(props.data);
    };

    const _onFocus = () => {
      setFocused(true);
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 1,
        duration: 250,
      }).start();
      Animated.timing(textFadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 250,
      }).start();

      Animated.timing(translateAnim, {
        useNativeDriver: true,
        toValue: -15,
        duration: 250,
      }).start();
      props.onFocus && props.onFocus(props.data);
    };

    // if (props.data?.assetType.sourceType === sourceTypeString["LIVE"]) {
    //   console.log("Title", props.data?.title, "Progress", progress);
    // }

    const _onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      fadeAnim.stopAnimation();
      translateAnim.stopAnimation();
      setFocused(false);
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 250,
      }).start();
      Animated.timing(textFadeAnim, {
        useNativeDriver: true,
        toValue: 1,
        duration: 250,
      }).start();

      Animated.timing(translateAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 250,
      }).start();
      props.onBlur && props.onBlur(event);
    };

    useEffect(() => {
      if (props.data?.assetType?.sourceType === sourceTypeString["LIVE"]) {
        processBookmark();
      }
    }, []);

    const startUpdateTimer = () => {
      stopUpdateTimer();
      progressUpdateInterval = setInterval(() => {
        recalculateBookmark();
      }, 5000);
    };

    const stopUpdateTimer = () => {
      if (progressUpdateInterval) {
        clearInterval(progressUpdateInterval);
      }
    };

    const startClearIntervalTimer = async (timeToEnd: number) => {
      stopClearIntervalTimer();
      clearIntervalTimeout = setTimeout(() => {
        stopUpdateTimer();
        console.log("Invalidating the live queries");
        console.log("Refreshing details");
        getLiveData(GLOBALS.channelRights).then(() => {
          queryClient.refetchQueries(["live"]);
        });
      }, timeToEnd);
      setStarTime(getStartTime());
    };

    const stopClearIntervalTimer = () => {
      if (clearIntervalTimeout) {
        clearTimeout(clearIntervalTimeout);
      }
    };

    // if (__DEV__) {
    //   setTimeout(() => {
    //     queryClient.resetQueries({ queryKey: ["live"] });
    //   }, 5000);
    // }

    const startProgressBookmarkTimer = (timeToStart: number) => {
      stopProgressBookmarkTimer();
      progressBookmarkTimeout = setTimeout(() => {
        processBookmark();
      }, timeToStart);
      setStarTime(getStartTime());
    };

    const stopProgressBookmarkTimer = () => {
      if (progressBookmarkTimeout) {
        clearTimeout(progressBookmarkTimeout);
      }
    };

    const recalculateBookmark = () => {
      const runtimeSeconds = (endTime - startTime) / 1000;
      const bookmarkSeconds = (Date.now() - startTime) / 1000;
      setProgress(bookmarkSeconds / runtimeSeconds);
    };

    const processBookmark = () => {
      if (Date.now() - endTime > 0) {
        return;
      }

      const timeToStart = startTime - Date.now();
      if (timeToStart > 0) {
        stopUpdateTimer();
        recalculateBookmark();
        startProgressBookmarkTimer(timeToStart);
      } else {
        const timeToEnd = endTime - Date.now();
        if (timeToEnd > 0) {
          recalculateBookmark();
          startUpdateTimer();
          startClearIntervalTimer(timeToEnd);
        }
      }
    };

    const getRenderImageURI = (renderType: any) => {
      switch (renderType) {
        case "16x9":
          //* : Return the !undefined 16x9 image or undefined otherwise */
          if (props.data.image16x9KeyArtURL) {
            return props.data.image16x9KeyArtURL.uri;
          } else if (props.data.image16x9PosterURL) {
            return props.data.image16x9PosterURL.uri;
          } else {
            return undefined;
          }
        case "2x3":
          //* : Return the !undefined 2x3 image or undefined otherwise */
          if (props.data.image2x3KeyArtURL) {
            return props.data.image2x3KeyArtURL.uri;
          } else if (props.data.image2x3PosterURL) {
            return props.data.image2x3PosterURL.uri;
          } else {
            return undefined;
          }
        case "3x4":
          //* : Return the !undefined 3x4 image or undefined otherwise */
          //@ts-ignore
          if (props.data.image3x4PosterURL) {
            //@ts-ignore
            return props.data.image3x4PosterURL.uri;
            //@ts-ignore
          } else if (props.data.image3x4KeyArtURL) {
            //@ts-ignore
            return props.data.image3x4KeyArtURL.uri;
          } else {
            return undefined;
          }
        default:
          return undefined;
      }
    };

    const TitleAndSubtitle = () =>
      props.showTitleOnlyOnFocus ? (
        //   <Animated.View
        //     style={{
        //       opacity: fadeAnim,
        //       transform: [{ translateY: translateAnim }],
        //     }}
        //   >
        //     <View>
        //       <MFMetaData currentFeed={props.data} />
        //     </View>
        //   </Animated.View>
        // ) : (
        //   <MFMetaData currentFeed={props.data} />

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: translateAnim,
              },
            ],
          }}
          key={`${props.libraryCardId}-av-1`}
        >
          <MFText
            textStyle={[
              styles.cardTitleText,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
              },
            ]}
            displayText={props.title}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
            key={`${props.libraryCardId}-av-1-text-1`}
          />
          <MFText
            textStyle={[
              styles.cardSubTitleText,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
              },
            ]}
            displayText={props.subTitle}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
            key={`${props.libraryCardId}-av-1-text-2`}
          />
        </Animated.View>
      ) : (
        <View>
          <MFText
            textStyle={[
              styles.cardTitleText,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
              },
            ]}
            displayText={props.title}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
            key={`${props.libraryCardId}-v-1`}
          />
          <MFText
            textStyle={[
              styles.cardSubTitleText,
              {
                alignSelf:
                  props.layoutType === "Circular" ? "center" : "flex-start",
                paddingRight: props.layoutType === "Circular" ? 150 : 0,
              },
            ]}
            displayText={props.subTitle}
            enableRTL={props.enableRTL}
            shouldRenderText={props.shouldRenderText}
            key={`${props.libraryCardId}-v-1-text-1`}
          />
        </View>
      );

    return (
      <TouchableOpacity
        hasTVPreferredFocus={props.autoFocusOnFirstCard}
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
        onLongPress={_onLongPress}
        delayLongPress={3000}
        key={`${props.libraryCardId}-to`}
      >
        <View
          style={StyleSheet.flatten([
            props.imageStyle,
            {
              backgroundColor: "transparent",
            },
          ])}
          key={`${props.libraryCardId}-to-v-1`}
        >
          <ImageBackground
            source={
              getRenderImageURI(props.cardStyle)
                ? {
                    uri: getRenderImageURI(props.cardStyle),
                    cache: "default",
                  }
                : AppImages.bgPlaceholder
            }
            defaultSource={AppImages.bgPlaceholder}
            //@ts-ignore
            style={props.imageStyle}
          >
            <MFOverlay
              renderGradiant={true}
              //@ts-ignore
              showProgress={
                //@ts-ignore
                props.data.Bookmark! ||
                //@ts-ignore
                props.data.progress ||
                progress !== undefined
              }
              //@ts-ignore
              progress={progress && progress * 100}
              //@ts-ignore
              displayTitle={props.data.episodeInfo && props.data.episodeInfo}
              bottomText={
                //@ts-ignore
                props.data.metadataLine3 ||
                //@ts-ignore
                props.data.durationMinutesString ||
                ""
              }
              // showRec={true}
              // recType={"series"}
            />
            {getRenderImageURI(props.cardStyle) === undefined && !focused && (
              <Animated.View
                style={{
                  opacity: textFadeAnim,
                  position: "absolute",
                  alignSelf: "center",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  marginTop: SCREEN_HEIGHT * 0.07,
                }}
                key={`${props.libraryCardId}-to-v-1-f-1-av-1`}
              >
                <MFText
                  shouldRenderText
                  displayText={props.data.title}
                  textStyle={[
                    styles.cardTitleText,
                    {
                      fontSize: 25,
                      textAlign: "center",
                      textAlignVertical: "center",
                    },
                  ]}
                  key={`${props.libraryCardId}-to-v-1-f-1-av-1-text-1`}
                />
              </Animated.View>
            )}
            <View key={`${props.libraryCardId}-to-v-1-f-1-v-1`}>
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
              key={`${props.libraryCardId}-to-v-1-f-1-v-2`}
            >
              {props.titlePlacement != TitlePlacement.beneath ? (
                <TitleAndSubtitle
                  key={`${props.libraryCardId}-to-v-1-f-1-v-2-title`}
                />
              ) : undefined}
            </View>
          </ImageBackground>
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
                key={`${props.libraryCardId}-to-v-1-ao-1`}
              >
                <TitleAndSubtitle
                  key={`${props.libraryCardId}-to-v-1-ao-1-title`}
                />
              </Animated.View>
            ) : (
              <View
                style={[styles.cardContentContainer]}
                key={`${props.libraryCardId}-to-v-1-v-1`}
              >
                <TitleAndSubtitle
                  key={`${props.libraryCardId}-to-v-1-v-1-title`}
                />
              </View>
            )
          ) : undefined}
        </View>
      </TouchableOpacity>
    );
  });
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
