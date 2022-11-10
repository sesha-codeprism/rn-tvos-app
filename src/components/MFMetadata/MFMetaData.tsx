import React, { useRef } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
import { MetadataStyles } from "../../@types/UIDefinition";
import { appUIDefinition } from "../../config/constants";
import { getNetworkInfo, getMetadataLine2 } from "../../utils/assetUtils";
import { SCREEN_WIDTH } from "../../utils/dimensions";
import { GLOBALS } from "../../utils/globals";
import MFText from "../MFText";
import { getMetadataInfo, MetadataType } from "./MFMetadataUtils";

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
      style={StyleSheet.flatten([
        appUIDefinition.metadataStyles.RECOMM.metadataContainer1Styles,
        { width: SCREEN_WIDTH * 0.4 },
      ])}
    >
      {getMetaDataComponent1()}
      <View
        style={StyleSheet.flatten([
          appUIDefinition.metadataStyles.RECOMM.metadataContainer2Styles,
        ])}
      >
        {getMetaDataComponent2()}
        {getMetaDataComponent3()}
      </View>
    </View>
  );

  function getImageComponent(metadata: string): React.ReactElement {
    return metadata.length > 0 ? (
      <View
        style={StyleSheet.flatten([
          appUIDefinition.metadataStyles.RECOMM.metadataImageContainerStyle,
        ])}
      >
        <FastImage
          source={{
            uri: metadata,
          }}
          style={StyleSheet.flatten([
            appUIDefinition.metadataStyles.RECOMM.metadataImageStyle,
          ])}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    ) : (
      <View></View>
    );
  }
  function getTextComponent(metadata: string, styles: any): React.ReactElement {
    return (
      <MFText
        shouldRenderText
        displayText={
          metadata.length > 50
            ? metadata.substring(0, 50).concat("...")
            : metadata
        }
        textStyle={styles}
      />
    );
  }

  function getIconComponent(metadata: string): React.ReactElement {
    return <View></View>;
  }

  function getMetaDataComponent1(): React.ReactElement {
    const metadataInfo = getMetadataInfo(
      appUIDefinition.metadataByItemType.RECOMM.metadata1,
      props.currentFeed
    );
    const metadataStyles = StyleSheet.flatten(
      appUIDefinition.metadataStyles.RECOMM.metadata1
    );
    if (metadataInfo.type === MetadataType.text) {
      return getTextComponent(metadataInfo.metadataInfo, metadataStyles);
    } else if (metadataInfo.type === MetadataType.image) {
      return getImageComponent(metadataInfo.metadataInfo);
    } else {
      return getIconComponent(metadataInfo.metadataInfo);
    }
  }
  function getMetaDataComponent2(): React.ReactElement {
    const metadataInfo = getMetadataInfo(
      appUIDefinition.metadataByItemType.RECOMM.metadata2,
      props.currentFeed
    );
    const metadataStyles = StyleSheet.flatten([
      appUIDefinition.metadataStyles.RECOMM.metadata2,
    ]);
    if (metadataInfo.type === MetadataType.text) {
      return getTextComponent(metadataInfo.metadataInfo, metadataStyles);
    } else if (metadataInfo.type === MetadataType.image) {
      return getImageComponent(metadataInfo.metadataInfo);
    } else {
      return getIconComponent(metadataInfo.metadataInfo);
    }
  }
  function getMetaDataComponent3(): React.ReactElement {
    const metadataInfo = getMetadataInfo(
      appUIDefinition.metadataByItemType.RECOMM.metadata3,
      props.currentFeed
    );
    const metadataStyles = StyleSheet.flatten([
      appUIDefinition.metadataStyles.RECOMM.metadata3,
    ]);
    if (metadataInfo.type === MetadataType.text) {
      return getTextComponent(metadataInfo.metadataInfo, metadataStyles);
    } else if (metadataInfo.type === MetadataType.image) {
      return getImageComponent(metadataInfo.metadataInfo);
    } else {
      return getIconComponent(metadataInfo.metadataInfo);
    }
  }
};

export default MFMetaData;
