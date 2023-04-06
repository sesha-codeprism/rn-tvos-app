import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { layout2x3 } from "../config/constants";
import { appQueryCache, getAllFeedDataForFeed } from "../config/queries";
import { GLOBALS } from "../utils/globals";
import MFSwimLane from "./MFSwimLane";
import MFLoader from "./MFLoader";
import { SCREEN_WIDTH } from "../utils/dimensions";
import { getUIdef } from "../utils/uidefinition";
import EventEmitter from "../utils/MFEventEmitter";

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
    const applicationConfig = getUIdef("Application")?.config;
    //@ts-ignore
    const showsFeedNotImplemented = applicationConfig?.showsFeedNotImplemented;
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


    const updateUI = (params?: any) => {
      console.log("received params,", params!);
      setMount(!mount);
    };

    useEffect(() => {
      EventEmitter.on("UpdateFeeds", updateUI);
    }, []);

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
        extraData={mount}
        renderItem={({ item, index }) => {
          // If the feed is waiting for some dependent query is is just loading, show loading indicator
          return data[index].isIdle || data[index].isLoading ? (
            <View
              style={{
                height: 350,
                width: SCREEN_WIDTH,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MFLoader />
            </View>
          ) : //If the query is not in idle or loading state, then check if undefined feeds are rendered; If yes, render everything
          showsFeedNotImplemented ? (
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
              extraData={mount}
            />
          ) : (
            // If undefined feeds are not permitted, then don't render anything for now..
            data[index].data && (
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
                extraData={mount}
              />
            )
          );
        }}
      />
    );
  }
);

export default MFSwim;
