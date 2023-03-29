import React from "react";
import { View, requireNativeComponent } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../../config/navigation/RouterOutlet";
import { massageLiveFeed } from "../../utils/assetUtils";
import { SourceType } from "../../utils/common";
import { GLOBALS } from "../../utils/globals";

const MKGuide = requireNativeComponent("MKGuide");

interface GuideScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GuideScreen: React.FunctionComponent<GuideScreenProps> = (props) => {
  const onUpdate = (event: { nativeEvent: { program: any } }) => {
    // console.log("nativeevent", event);
    console.log("program = ", event.nativeEvent.program);
    // const currentSchedule = GLOBALS.nowNextMap.entries.filter((item: any) => {
    //   item.now.ProgramId === event.nativeEvent.program.ProgramId;
    // });

    const currentSchedule = Object.values(GLOBALS.nowNextMap).filter(
      (item) => item?.now?.ProgramId === event.nativeEvent.program.ProgramId
    );

    const feed = massageLiveFeed(
      [
        {
          ...event.nativeEvent.program,
          Schedule: currentSchedule.length ? currentSchedule[0].now : {},
        },
      ],
      SourceType.LIVE
    );
    console.log(feed[0]);

    props.navigation.push(Routes.Details, {
      feed: feed[0],
    });
  };
  return (
    <View style={{ alignContent: "center", alignItems: "center", padding: 5 }}>
      <MKGuide style={{ width: "100%", height: "100%" }} onUpdate={onUpdate} />
    </View>
  );
};

export default GuideScreen;
