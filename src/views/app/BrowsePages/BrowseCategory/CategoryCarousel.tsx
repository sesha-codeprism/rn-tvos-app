import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { getDataFromUDL } from "../../../../../backend";
import MFLoader from "../../../../components/MFLoader";
import MFSwimLane from "../../../../components/MFSwimLane";
import { MFTabBarStyles } from "../../../../components/MFTabBar/MFTabBarStyles";
import MFText from "../../../../components/MFText";
import {
  appUIDefinition,
  defaultQueryOptions,
} from "../../../../config/constants";
import { getScaledValue, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { getUIdef } from "../../../../utils/uidefinition";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SourceType } from "../../../../utils/common";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { massageDiscoveryFeed } from "../../../../utils/assetUtils";
import { debounce2 } from "../../../../utils/app/app.utilities";

const browsePageConfig: any = getUIdef("BrowseCategory")?.config;
const scaledSnapToInterval = getScaledValue(browsePageConfig.snapToInterval);
const extraPadding = {
  paddingBottom: scaledSnapToInterval,
};

interface BrowseCategoryCarouselProps {
  feedDispatch: any;
  navigation: NativeStackNavigationProp<any>;
  itemsPerPage: number;
}

const BrowseCategoryCarousel: React.FunctionComponent<
  BrowseCategoryCarouselProps
> = (props) => {
  const flatListRef = useRef<FlatList>(null);
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const [page, setPage] = useState(0);
  const [lastPageReached, setLastPageReached] = useState(false);
  const [$skip, set$skip] = useState(0);
  const [dataSource, setDatSource] = useState(Array());

  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };

  const getFeedsList = async ({ queryKey }: any) => {
    const [, skip] = queryKey;

    if (!props.feedDispatch) {
      console.log("No data");
      return undefined;
    }
    const url = props.feedDispatch + `&$skip=${$skip}`;
    const data = await getDataFromUDL(url);
    console.log("Got response data", data.data);
    return data;
  };

  const filterData = (dataSet: any) => {
    if (dataSet.length < props.itemsPerPage) {
      setLastPageReached(true);
    }
    const dataArray = dataSource;
    if (dataArray.length > 0) {
      const newArray = dataArray.concat(dataSet);
      setDatSource(newArray);
    } else {
      setDatSource(dataSet);
    }
    return dataSet;
  };

  const handleEndReached = debounce2(() => {
    if (!lastPageReached) {
      setPage(page + 1);
      set$skip(props.itemsPerPage * page);
    }
  }, 500);

  const { data, isLoading, isPreviousData, isIdle } = useQuery(
    [props.feedDispatch, $skip],
    getFeedsList,
    {
      ...defaultQueryOptions,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data && !isIdle) {
      return filterData(data.data);
    }
  }, [data]);
  return isLoading ? (
    <MFLoader />
  ) : (
    <SafeAreaView style={{ paddingBottom: 110 }}>
      {dataSource !== undefined ? (
        dataSource.length > 0 ? (
          <FlatList
            data={dataSource}
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
            snapToAlignment={browsePageConfig.snapToAlignment}
            snapToInterval={scaledSnapToInterval}
            onEndReachedThreshold={0.8}
            onEndReached={handleEndReached}
            renderItem={({ item, index }) => {
              return (
                <MFSwimLane
                  key={index}
                  feed={item}
                  data={massageDiscoveryFeed(
                    { Items: item.Items },
                    SourceType.VOD
                  )}
                  limitSwimlaneItemsTo={16}
                  swimLaneKey={swimLaneKey}
                  updateSwimLaneKey={updateSwimLaneKey}
                  renderViewAll={item.HasMore}
                  onPress={(event) => {
                    props.navigation.push(Routes.Details, { feed: event });
                  }}
                  onFocus={(event) => {
                    flatListRef.current?.scrollToIndex({
                      animated: true,
                      index: index,
                      viewOffset: 200,
                    });
                  }}
                  onListEmptyElementFocus={(event) => {
                    flatListRef.current?.scrollToIndex({
                      animated: true,
                      index: index,
                      viewOffset: 200,
                    });
                  }}
                  navigation={props.navigation}
                />
              );
            }}
            ref={flatListRef}
          />
        ) : (
          <MFText
            shouldRenderText
            displayText={`No items returned ${
              props.feedDispatch.split("?")[0]
            }`}
            textStyle={[
              MFTabBarStyles.tabBarItemText,
              { alignSelf: "center", color: "white", marginTop: 5 },
            ]}
          />
        )
      ) : (
        <MFText
          shouldRenderText
          displayText={`No data found for ${props.feedDispatch.split("?")[0]}`}
          textStyle={[
            MFTabBarStyles.tabBarItemText,
            { alignSelf: "center", color: "white", marginTop: 5 },
          ]}
        />
      )}
    </SafeAreaView>
  );
};

export default BrowseCategoryCarousel;
