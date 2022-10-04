import React, { useRef } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  TargetedEvent,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { appUIDefinition } from "../config/constants";
import { getNetworkInfo, getMetadataLine2 } from "../utils/assetUtils";
import { SCREEN_WIDTH } from "../utils/dimensions";
import { GLOBALS } from "../utils/globals";
import MFText from "./MFText";

interface MFMetaDataProps {
  currentFeed: SubscriberFeed;
}

const MFMetaData: React.FunctionComponent<MFMetaDataProps> = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const _onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
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
  };

  const _onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
    fadeAnim.stopAnimation();
    translateAnim.stopAnimation();

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
  };
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.4,
        height: 141,
        // marginLeft: 80,
        marginTop: 50,
        flexDirection: GLOBALS.enableRTL ? "row-reverse" : "row",
      }}
    >
      {props.currentFeed.CatalogInfo && props.currentFeed.CatalogInfo.Network && (
        <View
          style={{
            width: 94,
            height: 94,
            marginRight: 20,
            backgroundColor: "#282828",
            borderRadius: 6,
            opacity: 0.85,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <FastImage
            source={{
              uri: getNetworkInfo(props.currentFeed).tenFootLargeURL.uri,
            }}
            style={{ width: 72, height: 30, alignSelf: "center" }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      )}
      <View style={{ flexDirection: "column" }}>
        <MFText
          shouldRenderText
          displayText={
            props.currentFeed?.title.length > 30
              ? props.currentFeed.title.substring(0, 35).concat("...")
              : props.currentFeed.title
          }
          textStyle={{
            fontFamily: "Inter-Bold",
            fontSize: 38,
            color: appUIDefinition.theme.colors.white,
            lineHeight: 55,
            textAlign: "left",
          }}
        />
        <MFText
          shouldRenderText
          displayText={getMetadataLine2(props.currentFeed)}
          textStyle={{
            fontFamily: "Inter-SemiBold",
            fontSize: 25,
            lineHeight: 38,
            color: "#828282",
            textAlign: "left",
          }}
        />
      </View>
    </View>
  );
};

export default MFMetaData;
