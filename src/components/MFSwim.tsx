import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { getAllFeedDataForFeed } from "../config/queries";
import MFSwimLane from "./MFSwimLane";

interface MFSwim {
  index: number;
  feeds: FeedItem | undefined;
}

const MFSwim: React.FunctionComponent<MFSwim> = (props) => {
  const data = getAllFeedDataForFeed(props.feeds!);
  //   console.log("data from getAllFeedDataForFeed", data);
  //   data.forEach((element) => {
  //     console.log("element", element);
  //   });
  return (
    <FlatList
      data={props.feeds?.Feeds}
      keyExtractor={(x, i) => i.toString()}
      renderItem={({ item, index }) => {
        return <MFSwimLane key={index} feed={item} data={data[index].data} />;
      }}
    />
  );
};

export default MFSwim;
