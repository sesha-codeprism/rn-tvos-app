import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import _ from "lodash";
import React, { useRef, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  FlatList,
  useTVEventHandler,
  TouchableOpacity,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import { searchItems } from "../../backend/subscriber/subscriber";
import { AppImages } from "../assets/images";
import Search from "../components/MFSearch";
import MFSwimLane from "../components/MFSwimLane";
import MFText from "../components/MFText";
import { Routes } from "../config/navigation/RouterOutlet";
import { massageResult } from "../utils/assetUtils";
import { ContentType, ItemShowType } from "../utils/common";
import { SCREEN_WIDTH } from "../utils/dimensions";
import { GLOBALS } from "../utils/globals";
import { getUIdef } from "../utils/uidefinition";

// const Search = requireNativeComponent('NKSearchComponent');

const { width, height } = Dimensions.get("window");

interface SearchScreenProps {
  navigation: NativeStackNavigationProp<any>;
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
  const searchPageConfig: any = getUIdef("Search")?.config;

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
  const [swimLaneFocused, setSwimLaneFocused] = useState(false);
  const firstCardRef = useRef<TouchableOpacity>(null);

  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  let timer: any;

  const myTVEventHandler = (evt: any) => {
    if (
      (evt.eventType === "down" || evt.eventType === "swipeDown") &&
      !swimLaneFocused
    ) {
      firstCardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    }
  };
  useTVEventHandler(myTVEventHandler);
  const onChangeText = (event: any) => {
    swimLaneFocused ? setSwimLaneFocused(false) : null;
    if (!_.isEmpty(event.nativeEvent.text)) {
      /** User is entering some text. Stop showing trending items and start showing search results */
      const text = event.nativeEvent.text;
      if (event.nativeEvent.text === searchString) {
        null;
      } else {
        setSearchString(event.nativeEvent.text);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setShowTrending(false);
          setShowSearchResult(true);
          onSearch(text);
        }, 600);
      }
    } else {
      /**Text length is zero. User has cleared out text. Show trending items only */
      /**Timer of 650 ms is given to set showTrending to true as we gave a debounce in search as well */
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowSearchResult(false);
        setShowTrending(true);
        setSearchResult([]);
      }, 650);
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
          // console.log(item, item.Name);
          return (
            <MFSwimLane
              // @ts-ignore
              ref={index === 0 ? firstCardRef : null}
              key={index}
              feed={item}
              data={item}
              limitSwimlaneItemsTo={10}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
              onPress={(event) => {
                props.navigation.push(Routes.Details, { feed: event });
              }}
              onFocus={() => {
                console.log("MFSwimLane focused in search screen", index);
                setTimeout(() => {
                  setSwimLaneFocused(true);
                }, 500);
              }}
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
          backgroundColor: "#00030E",
          height: "100%",
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
    console.log("searchPageConfig", searchPageConfig);
    if (text && text.length >= searchPageConfig.minQueryLength) {
      const params: SearchParam = {
        searchString: text,
        searchLive: false,
        $skip: searchPageConfig.$skip,
        $top: searchPageConfig.$top,
      };
      const result = await searchItems(params);
      // console.log("search result", result);
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
        // console.log("respData", respData);
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
        // console.log("massagedData", massagedData);
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
              ref={index === 0 ? firstCardRef : null}
              key={index}
              //@ts-ignore
              feed={item}
              data={item.items}
              limitSwimlaneItemsTo={10}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
              onPress={(event) => {
                //@ts-ignore
                if (event.assetType.contentType === "PERSON") {
                  Alert.alert(
                    "No implementation found",
                    "Person details screen not implemented yet"
                  );
                } else {
                  props.navigation.push(Routes.Details, { feed: event });
                }
              }}
              onFocus={() => {
                setTimeout(() => {
                  setSwimLaneFocused(true);
                }, 500);
              }}
            />
          );
        }}
      />
    );
  };
  return (
    <View style={styles.root}>
      <View style={styles.secondComponent}>
        {/* <ImageBackground
          source={require("../assets/images/onboarding_1280x752_landscape.jpg")}
          style={styles.imageComponent}
        > */}
        <SafeAreaView style={{ paddingBottom: 100 }}>
          {showTrending && !showSearchResults
            ? renderTrending()
            : showSearchResults && searchResult && searchResult?.length !== 0
            ? renderSearchResults()
            : renderNoResults()}
        </SafeAreaView>
        {/* </ImageBackground> */}
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
    height: height,
    marginTop: searchHeight,
    backgroundColor: "#00030E",
    paddingBottom: 300,
  },
  imageComponent: {
    height: 800,
    width: width,
    marginTop: 150,
  },
});

export default SearchScreen;
