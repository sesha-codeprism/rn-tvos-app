import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { getAllFeedDataForFeed } from "../config/queries";
import { SCREEN_WIDTH } from "../utils/dimensions";
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
  onViewAllPressed?: null | ((event: SubscriberFeed) => void) | undefined;
}

const MFSwim: React.FunctionComponent<MFSwimProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    const data = getAllFeedDataForFeed(props.feeds!);
    const [swimLaneKey, setSwimLaneKey] = useState("");
    const updateSwimLaneKey = (key: string) => {
      setSwimLaneKey(key);
    };
    return (
      <FlatList
        data={props.feeds?.Feeds}
        keyExtractor={(x, i) => i.toString()}
        renderItem={({ item, index }) => {
          return (
            <MFSwimLane
              // @ts-ignore
              ref={index === 0 ? ref : null}
              key={index}
              feed={item}
              data={data[index].data}
              onPress={props.onPress}
              limitSwimlaneItemsTo={props.limitSwimlaneItemsTo}
              onBlur={props.onBlur}
              onFocus={props.onFocus}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
              onListEmptyElementFocus={props.onListEmptyElementFocus}
              onListEmptyElementPress={props.onListEmptyElementPress}
              onListFooterElementFocus={props.onListFooterElementFocus}
              onListFooterElementOnPress={props.onListFooterElementOnPress}
              onViewAllPressed={props.onViewAllPressed}
            />
          );
        }}
      />
    );
  }
);

export default MFSwim;
