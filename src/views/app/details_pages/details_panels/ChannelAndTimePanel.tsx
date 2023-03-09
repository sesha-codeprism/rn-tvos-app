import React from "react";
import { View } from "react-native";

interface ChannelAndTimeProps {
  navigation?: any;
  route?: any;
}

const ChannelAndTime: React.FunctionComponent<ChannelAndTimeProps> = (
  props
) => {
  const { title, subTitle, programId } = props.route.params;
  return <View></View>;
};

export default ChannelAndTime;
