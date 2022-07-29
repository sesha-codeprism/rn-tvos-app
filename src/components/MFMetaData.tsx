import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface MFMetaDataProps {
  rootContainerStyles?: StyleProp<ViewStyle>;
  imageContainer?: StyleProp<ViewStyle>;
  contentContainer?: StyleProp<ViewStyle>;
  title?: string;
  image?: any;
  description?: string;
}

const MFMetaData: React.FunctionComponent<MFMetaDataProps> = (props) => {
  return <View style={props.rootContainerStyles}></View>;
};

export default MFMetaData;
