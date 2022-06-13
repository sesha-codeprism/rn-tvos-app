import React from 'react';
import {
  ImageBackground,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';

export interface MFFilmStripCardProps {
  title?: string;
  titleStyles?: StyleProp<TextStyle>;
  imageSource?: string;
  imageStyles?: StyleProp<ImageStyle>;
}

const MFFilmStripCard: React.FunctionComponent<MFFilmStripCardProps> =
  props => {
    return (
      <View>
        <ImageBackground source={{uri:props.imageSource}} style={props.imageStyles}></ImageBackground>
      </View>
    );
  };

export default MFFilmStripCard;
