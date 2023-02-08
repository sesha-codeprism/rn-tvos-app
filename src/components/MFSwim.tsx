import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { layout2x3 } from "../config/constants";
import { getAllFeedDataForFeed } from "../config/queries";
import MFSwimLane from "./MFSwimLane";

interface MFSwimProps {
  feeds: FeedItem | undefined;
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;
  limitSwimlaneItemsTo?: number;
  onListEmptyElementFocus?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  onListEmptyElementPress?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  onListFooterElementFocus?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  onListFooterElementOnPress?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  navigation: NativeStackNavigationProp<any>;
}

const MFSwim: React.FunctionComponent<MFSwimProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    const data = getAllFeedDataForFeed(props.feeds!);
    const [swimLaneKey, setSwimLaneKey] = useState("");
    const [hubName, setHubName] = useState("");
    const updateSwimLaneKey = (key: string) => {
      setSwimLaneKey(key);
    };

    useEffect(() => {
      setHubName(props.feeds?.Name || "");
    });

    return (
      <FlatList
        data={props.feeds?.Feeds}
        keyExtractor={(x, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          return (
            <MFSwimLane
              // @ts-ignore
              ref={index === 0 ? ref : null}
              key={`${hubName}-${index}`}
              swimId={`${hubName}-${index}`}
              feed={item}
              data={data[index].data}
              onPress={props.onPress}
              limitSwimlaneItemsTo={props.limitSwimlaneItemsTo}
              onBlur={props.onBlur}
              cardStyle={
                item.ShowcardAspectRatio === layout2x3 ? "2x3" : "16x9"
              }
              onFocus={props.onFocus}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
              onListEmptyElementFocus={props.onListEmptyElementFocus}
              onListEmptyElementPress={props.onListEmptyElementPress}
              onListFooterElementFocus={props.onListFooterElementFocus}
              onListFooterElementOnPress={props.onListFooterElementOnPress}
              navigation={props.navigation}
            />
          );
        }}
      />
    );
  }
);

export default MFSwim;
