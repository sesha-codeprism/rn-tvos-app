import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { AppImages } from "../assets/images";
import { HomeScreenStyles } from "../views/app/Homescreen.styles";
import MFText from "./MFText";

interface MFMetaDataProps {
  rootContainerStyles?: StyleProp<ViewStyle>;
  imageContainer?: StyleProp<ViewStyle>;
  contentContainer?: StyleProp<ViewStyle>;
  currentFeed?: SubscriberFeed;
}

const MFMetaData: React.FunctionComponent<MFMetaDataProps> = (props) => {
  return (
    <View style={props.rootContainerStyles}>
      <View style={HomeScreenStyles.posterImageContainerStyles}>
        {props.currentFeed?.image16x9PosterURL !== undefined ? (
          <FastImage
            source={{ uri: props.currentFeed?.image16x9PosterURL.uri }}
            style={HomeScreenStyles.posterImageStyles}
          />
        ) : (
          <FastImage
            source={{ uri: AppImages.tvshowPlaceholder }}
            style={HomeScreenStyles.posterImageStyles}
          />
        )}
      </View>
      <View style={HomeScreenStyles.postContentContainerStyles}>
        <MFText
          shouldRenderText
          displayText={props.currentFeed?.title}
          textStyle={HomeScreenStyles.titleTextStyle}
        />
        <View style={HomeScreenStyles.posterContainerDescriptionStyles}>
          <MFText
            shouldRenderText
            displayText={
              props.currentFeed?.CatalogInfo
                ? props.currentFeed?.CatalogInfo.Description
                : props.currentFeed?.metadataLine2
            }
            textStyle={[HomeScreenStyles.subtitleText]}
          />
        </View>
      </View>
    </View>
  );
};

export default MFMetaData;
