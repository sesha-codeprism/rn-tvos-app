import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { getDataFromUDL } from "../../../../../backend";
import { parseUdl } from "../../../../../backend/udl/provider";
import MFLoader from "../../../../components/MFLoader";
import MFSwimLane from "../../../../components/MFSwimLane";
import { appUIDefinition } from "../../../../config/constants";
import { massageSubscriberFeed } from "../../../../utils/assetUtils";
import { ILibrarySet, SourceType } from "../../../../utils/common";
import { getScaledValue, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { massageDiscoveryFeed } from "../../../../utils/DiscoveryUtils";
import { getUIdef } from "../../../../utils/uidefinition";
const browsePageConfig: any = getUIdef("BrowseCategory")?.config;
const scaledSnapToInterval = getScaledValue(browsePageConfig.snapToInterval);
const extraPadding = {
  paddingBottom: scaledSnapToInterval,
};

interface BrowseCategoryCarouselProps {
  feedDispatch: any;
}

const BrowseCategoryCarousel: React.FunctionComponent<
  BrowseCategoryCarouselProps
> = (props) => {
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };

  const getFeedsList = async () => {
    const data = await getDataFromUDL(props.feedDispatch);
    console.log(data);
    if (data) {
      return filterData(data.data);
    } else {
      Alert.alert("Something went wrong.. ");
      return null;
    }
  };

  const filterData = (dataSource: any) => {
    // if (!dataSource) {
    //   Alert.alert("No data from UDL call");
    //   return undefined;
    // }
    // if (!dataSource.Libraries && !dataSource.LibraryItems) {
    //   Alert.alert("No data to showcase here");
    //   return undefined;
    // }
    // let dataArray: any = [];
    // let massagedData: any;
    // const udlID = parseUdl(props.feedDispatch);
    // if (udlID!.id.split("/")[0] === "discovery") {
    //   massagedData = massageDiscoveryFeed(dataSource, SourceType.VOD);
    // } else {
    //   massagedData = massageSubscriberFeed(dataSource, "", SourceType.VOD);
    // }

    // dataArray = dataSource.Libraries.map((library) => ({
    //   library: library,
    //   libraryItem: massagedData.filter(
    //     (e: any) => library.LibraryItems.indexOf(e.Id) !== -1
    //   ),
    // }));

    // console.log("dataArray", dataArray, dataArray.length);
    // if (dataArray.length > dataSource.Libraries.length) {
    //   console.warn(
    //     "Something is going wrong.. we're showcasing more items than we have somehow"
    //   );
    // }
    return dataSource;
  };
  const { data, isLoading } = useQuery("getFeeds", getFeedsList, {
    cacheTime: appUIDefinition.config.queryCacheTime,
    staleTime: appUIDefinition.config.queryStaleTime,
  });

  useEffect(() => {}, []);
  return isLoading ? (
    <MFLoader />
  ) : (
    <SafeAreaView style={{ paddingBottom: 50 }}>
      <FlatList
        data={data}
        keyExtractor={(x, i) => i.toString()}
        ItemSeparatorComponent={(x, i) => (
          <View
            style={{
              backgroundColor: "transparent",
              height: 5,
              width: SCREEN_WIDTH,
            }}
          />
        )}
        renderItem={({ item, index }) => {
          return (
            <MFSwimLane
              key={index}
              feed={item}
              data={item.Items}
              limitSwimlaneItemsTo={16}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default BrowseCategoryCarousel;
