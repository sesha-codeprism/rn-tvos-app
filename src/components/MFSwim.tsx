import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { getAllFeedDataForFeed } from "../config/queries";
import MFSwimLane from "./MFSwimLane";

interface MFSwimProps {
  index: number;
  feeds: FeedItem | undefined;
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;
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
}

const MFSwim: React.FunctionComponent<MFSwimProps> = (props) => {
  const data = getAllFeedDataForFeed(props.feeds!);
  console.log("Props in MFSwim", props);
  return (
    <FlatList
      data={props.feeds?.Feeds}
      keyExtractor={(x, i) => i.toString()}
      renderItem={({ item, index }) => {
        return (
          <MFSwimLane
            key={index}
            feed={item}
            data={data[index].data}
            onPress={props.onPress}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            onListEmptyElementFocus={props.onListEmptyElementFocus}
            onListEmptyElementPress={props.onListEmptyElementPress}
            onListFooterElementFocus={props.onListFooterElementFocus}
            onListFooterElementOnPress={props.onListFooterElementOnPress}
          />
        );
      }}
    />
  );
};

export default MFSwim;
