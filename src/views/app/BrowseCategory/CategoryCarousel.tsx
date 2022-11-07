import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { getDataFromUDL } from "../../../../backend";
import MFLoader from "../../../components/MFLoader";
import MFSwimLane from "../../../components/MFSwimLane";
import { appUIDefinition } from "../../../config/constants";
import { getDataForUDL } from "../../../config/queries";
import { ILibrary, ILibraryItem, ILibrarySet } from "../../../utils/common";
import { SCREEN_WIDTH } from "../../../utils/dimensions";

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

  const filterData = (dataSource: ILibrarySet) => {
    if (!dataSource) {
      Alert.alert("No data from UDL call");
      return undefined;
    }
    if (!dataSource.Libraries && !dataSource.LibraryItems) {
      Alert.alert("No data to showcase here");
      return undefined;
    }
    let dataArray: any = [];
    let tempArray: any = [];

    // dataSource.Libraries.forEach((library: ILibrary) => {
    //   tempArray = [];
    //   library.LibraryItems.forEach((libraryItem: string) => {
    //     const suitableLibraryElement: ILibraryItem[] =
    //       dataSource.LibraryItems.filter((item) => item.Id === libraryItem);
    //     tempArray.push(suitableLibraryElement);
    //   });
    //   dataArray.push({ library: library, libraryItem: tempArray[0] });
    // });

    dataArray = dataSource.Libraries.map((library) => ({
      library: library,
      libraryItem: dataSource.LibraryItems.filter(
        (e) => library.LibraryItems.indexOf(e.Id) !== -1
      ),
    }));

    // for (var i = 0; i < dataSource.Libraries.length; i++) {
    //   tempArray = [];
    //   var library: ILibrary = dataSource.Libraries[i];
    //   for (var j = 0; j < library.LibraryItems.length; j++) {
    //     const libraryItem = library.LibraryItems[i];
    //     const filteredArrayForLibrary = dataSource.LibraryItems.filter(
    //       (item) => item.Id === libraryItem
    //     );
    //     console.log(
    //       "i",
    //       i,
    //       "j",
    //       j,
    //       "filteredArrayForLibrary",
    //       filteredArrayForLibrary
    //     );
    //     tempArray.push(filteredArrayForLibrary);
    //   }
    //   dataArray.push({ library: library, libraryItem: tempArray[0] });
    // }

    // dataSource.Libraries.forEach((element: any) => {
    //   element.LibraryItems.forEach((libraryItem: any) => {
    //     const suitableLibraryItem = dataSource.LibraryItems.filter(
    //       (e: any) => e.Id === libraryItem
    //     );
    //     dataArray.push({
    //       library: element,
    //       libraryItem: suitableLibraryItem,
    //     });
    //   });
    // });

    console.log("dataArray", dataArray, dataArray.length);
    if (dataArray.length > dataSource.Libraries.length) {
      console.warn(
        "Something is going wrong.. we're showcasing more items than we have somehow"
      );
    }
    return dataArray;
  };
  const { data, isLoading } = useQuery("getFeeds", getFeedsList, {
    cacheTime: appUIDefinition.config.queryCacheTime,
    staleTime: appUIDefinition.config.queryStaleTime,
  });

  useEffect(() => {}, []);
  return isLoading ? (
    <MFLoader />
  ) : (
    <SafeAreaView>
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
              feed={item.library}
              data={item.libraryItem}
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
