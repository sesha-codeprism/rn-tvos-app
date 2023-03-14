import React, { useEffect } from "react";
import {
  Text,
  View,
  NativeModules,
  requireNativeComponent,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../../config/navigation/RouterOutlet";
import { massageLiveFeed } from "../../utils/assetUtils";
import { SourceType } from "../../utils/common";

const MKGuide = requireNativeComponent("MKGuide");

interface GuideScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GuideScreen: React.FunctionComponent<GuideScreenProps> = (props) => {
  const onUpdate = (event: { nativeEvent: { program: any } }) => {
    // console.log("nativeevent", event);
    console.log("program = ", event.nativeEvent.program);
    const feed = massageLiveFeed(
      [event.nativeEvent.program],
      SourceType.LIVE,
      "onNow"
    )[0];
    feed["isFromEPG"] = true;
    console.log("feed", feed);
    props.navigation.push(Routes.Details, { feed: feed });
  };
  return (
    <View style={{ alignContent: "center", alignItems: "center", padding: 5 }}>
      <MKGuide style={{ width: "100%", height: "100%" }} onUpdate={onUpdate} />
    </View>
  );
};

export default GuideScreen;
