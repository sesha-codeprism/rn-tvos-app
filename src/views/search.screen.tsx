import _ from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  Alert,
  SafeAreaView,
  FlatList,
} from "react-native";
import FastImage from "react-native-fast-image";
import { searchItems } from "../../backend/subscriber/subscriber";
import { AppImages } from "../assets/images";
import Search from "../components/MFSearch";
import MFSearch from "../components/MFSearch";
import MFSwimLane from "../components/MFSwimLane";
import MFText from "../components/MFText";
import { massageDiscoveryFeed, massageResult } from "../utils/assetUtils";
import { ItemShowType, SourceType } from "../utils/common";
import { SCREEN_WIDTH } from "../utils/dimensions";
import { GLOBALS } from "../utils/globals";

// const Search = requireNativeComponent('NKSearchComponent');

const { width, height } = Dimensions.get("window");

interface SearchScreenProps {
  showSearchResults: boolean;
}
export interface SearchParam {
  searchString: string;
  $skip: number;
  $top: number;
  searchLive: boolean;
  mediaTypes?: string;
}

interface SearchResultObject {
  name: string;
  items: Array<any>;
  index: number;
  aspectRatio: string;
  liveSchedules?: any;
}
const searchHeight = height * 0.3;
const SearchScreen: React.FunctionComponent<SearchScreenProps> = (props) => {
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState<
    SearchResultObject[] | undefined
  >();
  const [trendingData, setTrendingData] = useState<any>(
    GLOBALS.moviesAndTvShows
  );
  const [showTrending, setShowTrending] = useState(true);
  const [showSearchResults, setShowSearchResult] = useState(false);
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  let timer: any;
  let searchQuery: string = "";
  const onChangeText = (event: any) => {
    if (event.nativeEvent.text.length > 0) {
      /** User is entering some text. Stop showing trending items and start showing search results */
      const text = event.nativeEvent.text;
      if (event.nativeEvent.text === searchString) {
        null
      } else {
        searchQuery = event.nativeEvent.text;
        setSearchString(event.nativeEvent.text);
        clearTimeout(timer);

        timer = setTimeout(() => {
          setShowTrending(false);
          setShowSearchResult(true);
          onSearch(text);
        }, 1000);
      }
    } else {
      /**Text length is zero. User has cleared out text. Show trending items only */
      setShowSearchResult(false);
      setShowTrending(true);
    }
  };
  // useEffect(() => {
  //   console.log("GLOBALS.moviesAndTvShows", GLOBALS.moviesAndTvShows);
  //   GLOBALS.moviesAndTvShows ? setSearchResult(GLOBALS.moviesAndTvShows) : null;
  // }, []);

  /** Component that renders the trending items */
  const renderTrending = () => {
    return (
      <FlatList
        data={trendingData}
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
          console.log(item, item.Name);
          return (
            <MFSwimLane
              key={index}
              feed={item}
              data={item}
              limitSwimlaneItemsTo={10}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
            />
          );
        }}
      />
    );
  };

  const renderNoResults = () => {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 100,
        }}
      >
        <FastImage
          style={{ height: 260, width: 250 }}
          source={AppImages.noSearchResult}
        />
        <MFText
          textStyle={{
            fontSize: 38,
            fontWeight: "600",
            letterSpacing: 0,
            lineHeight: 55,
            color: "#EEEEEE",
            textAlign: "center",
            marginTop: 20,
          }}
          displayText="No Results Found"
          shouldRenderText={true}
        />
        <MFText
          textStyle={{
            fontSize: 25,
            letterSpacing: 0,
            lineHeight: 38,
            color: "#A7A7A7",
            textAlign: "center",
            marginTop: 10,
          }}
          displayText={`Sorry, we couldn't find any content for ${searchString}`}
          shouldRenderText={true}
        />
      </View>
    );
  };
  const onSearch = async (text: any) => {
    console.log("text", text);
    if (text && text.length >= 3) {
      const params: SearchParam = {
        searchString: text,
        searchLive: false,
        $skip: 0,
        $top: 50,
      };
      const result = await searchItems(params);
      console.log("search result", result);
      if (result.status === 200) {
        const objMatch: any = { TVShow: 1, Movie: 2, Person: 3, Dvr: 4 };
        const newArray: any = [];
        const respData = result.data;
        respData.forEach((si: any) => {
          let itemIndex: any = si && Object.keys(si)[0];
          if (objMatch[itemIndex]) {
            newArray[objMatch[itemIndex] - 1] = si;
          }
        });
        console.log("respData", respData);
        const massagedData: SearchResultObject[] = [];
        respData.forEach((item: {}, swimlaneIndex: number) => {
          const searchResultsFeedName = Object.keys(item)[0];
          // const items = Object.values(item)[0];
          // let itemsList = {
          //   LibraryItems: items,
          // };
          // const massagedlistItems: any = (massageResult as any)[
          //   searchResultsFeedName
          // ](itemsList, null, null);
          if (Object.values(item)[0].length) {
            massagedData.push({
              name: searchResultsFeedName,
              items: Object.values(item)[0],
              index: swimlaneIndex,
              aspectRatio:
                searchResultsFeedName === ItemShowType.Person ? "3x4" : "2x3",
            });
          }
        });
        console.log("massagedData", massagedData);
        setSearchResult(massagedData);
        // const data = formatSearchRsult(result.data);
        // setSearchResult(_.isEmpty(data) ? [] : result.data);
      }
    }
  };

  const renderSearchResults = () => {
    return (
      <FlatList
        data={searchResult}
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
          let mediaTypes = item.name;
          if (!item.items.length) {
            return <View />;
          }
          let itemsList = {
            LibraryItems: item.items,
          };
          const massagedlistItems: any = (massageResult as any)[item.name](
            itemsList,
            null,
            null
          );
          return (
            <MFSwimLane
              key={index}
              //@ts-ignore
              feed={item}
              data={item.items}
              limitSwimlaneItemsTo={10}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
            />
          );
        }}
      />
    );
  };
  return (
    <View style={styles.root}>
      <View style={styles.secondComponent}>
        <ImageBackground
          source={require("../assets/images/onboarding_1280x752_landscape.jpg")}
          style={styles.imageComponent}
        >
          <SafeAreaView style={{ paddingBottom: 100 }}>
            {showTrending
              ? renderTrending()
              : showSearchResults
              ? !searchResult || searchResult?.length! === 0
                ? renderNoResults()
                : renderSearchResults()
              : renderNoResults()}
          </SafeAreaView>
        </ImageBackground>
      </View>
      <View style={styles.search}>
        <Search
          onChangeText={onChangeText}
          style={{
            width: Dimensions.get("screen").width,
            height: searchHeight,
            backgroundColor: "#00030E",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    // height: height,
    // width: width,
  },
  search: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("screen").width,
    height: searchHeight,
    overflow: "hidden",
  },
  secondComponent: {
    height: height - searchHeight,
    marginTop: searchHeight - 150,
  },
  imageComponent: {
    height: 800,
    width: width,
    marginTop: 150,
  },
});

export default SearchScreen;
