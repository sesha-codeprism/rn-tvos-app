import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import MFText from "./MFText";
import { MFTabBarStyles } from "./MFTabBar/MFTabBarStyles";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { AppImages } from "../assets/images";
import MFProgressBar from "./MFProgressBar";

interface MFOverlayProps {
  displayTitle?: string;
  renderGradiant?: boolean;
  overlayStyle?: StyleProp<ViewStyle>;
  overlayImageStyle?: StyleProp<ImageStyle>;
  displayTitleStyles?: StyleProp<TextStyle>;
  showProgress?: boolean;
  progress?: any;
  bottomText?: string;
  showRec?: boolean;
  recType?: "single" | "series";
}

const MFOverlay: React.FunctionComponent<MFOverlayProps> = (props) => {
  return (
    <View style={StyleSheet.flatten([styles.rootStyle, props.overlayStyle])}>
      {props.renderGradiant && (
        <FastImage
          source={AppImages.overlayLandscape}
          style={StyleSheet.flatten([
            styles.overlayGradientStyle,
            props.overlayImageStyle,
          ])}
        />
      )}
      {props.displayTitle !== undefined && props.displayTitle!.length > 0 && (
        <MFText
          displayText={props.displayTitle}
          shouldRenderText
          textStyle={StyleSheet.flatten([
            MFTabBarStyles.tabBarItemText,
            styles.textStyle,
            props.displayTitleStyles,
          ])}
        />
      )}
      {props.showRec && (
        <View
          style={{
            width: 95,
            height: 34,
            flexDirection: "row",
            right: 0,
            position: "absolute",
            paddingRight: 15,
            bottom: props.showProgress ? 20 : 10,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <FastImage
            source={
              props.recType === "series"
                ? AppImages.series_rec
                : AppImages.single_rec
            }
            resizeMode={"contain"}
            style={{ width: props.recType === "series" ? 37 : 18, height: 18 }}
          />
          <Text style={styles.bottomText}>REC</Text>
        </View>
      )}
      {props.bottomText !== undefined && props.bottomText!.length > 0 && (
        <View
          style={[
            styles.bottomTextContainer,
            { bottom: props.showProgress ? 20 : 10 },
          ]}
        >
          <Text style={styles.bottomText}>{props.bottomText}</Text>
        </View>
      )}
      {props.showProgress && props.progress && (
        <View style={styles.progressBarContainer}>
          <MFProgressBar
            backgroundColor={"#424242"}
            foregroundColor={"#E7A230"}
            toValue={props.progress}
            maxHeight={15}
            maxWidth={350}
          />
        </View>
      )}
    </View>
  );
};

export default MFOverlay;

const styles = StyleSheet.create({
  rootStyle: {
    width: "100%",
    height: "100%",
  },

  overlayGradientStyle: {
    width: "100%",
    height: 197,
    position: "absolute",
    top: 0,
    right: 0,
  },
  textStyle: { alignSelf: "flex-end", color: "white", marginTop: 5 },
  bottomTextContainer: {
    height: 38,
    // width: 216,
    right: 0,
    position: "absolute",
    paddingRight: 15,
  },
  bottomText: {
    color: "#EEEEEE",
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "right",
  },
  progressBarContainer: {
    width: "100%",
    height: 20,
    bottom: 0,
    left: 0,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});
