import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { layout2x3 } from "../config/constants";
import { appQueryCache, getAllFeedDataForFeed } from "../config/queries";
import { GLOBALS } from "../utils/globals";
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
    const flatListRef = useRef<FlatList>(null);
    const [swimLaneKey, setSwimLaneKey] = useState("");
    const [hubName, setHubName] = useState("");
    const [mount, setMount] = useState(false);
    const data = getAllFeedDataForFeed(
      props.feeds!,
      GLOBALS.nowNextMap,
      GLOBALS.currentSlots,
      GLOBALS.channelMap
    );
    const updateSwimLaneKey = (key: string) => {
      setSwimLaneKey(key);
    };

    useEffect(() => {
      setHubName(props.feeds?.Name || "");
    });

    appQueryCache.subscribe((event) => {
      if (event?.type === "queryUpdated") {
        if (
          event.query.queryHash.includes("get-live-data") &&
          event.query.state.data
        ) {
          console.log("Need to reset updates", event?.query);
          if (!mount) {
            setMount(true);
          }
        }
      }
    });

    return (
      <FlatList
        data={props.feeds?.Feeds}
        keyExtractor={(x, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: 450,
          offset: 450 * index,
          index,
        })}
        style={{
          flex: 1,
        }}
        snapToAlignment={"start"}
        snapToInterval={0}
        maxToRenderPerBatch={5}
        windowSize={5}
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
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
              onListEmptyElementPress={props.onListEmptyElementPress}
              onListFooterElementOnPress={props.onListFooterElementOnPress}
              onFocus={(event) => {
                props.onFocus && props.onFocus(event);
              }}
              onListEmptyElementFocus={(event) => {
                props.onListEmptyElementFocus &&
                  props.onListEmptyElementFocus(event);
              }}
              onListFooterElementFocus={(event) => {
                props.onListFooterElementFocus &&
                  props.onListFooterElementFocus(event);
              }}
              navigation={props.navigation}
            />
          );
        }}
      />
    );
  }
);

export default MFSwim;
