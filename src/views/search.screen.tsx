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
import MFSearch from "../components/MFSearch";
import MFSwimLane from "../components/MFSwimLane";
import MFText from "../components/MFText";
import { massageDiscoveryFeed } from "../utils/assetUtils";
import { SourceType } from "../utils/common";
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
const searchHeight = height * 0.3;
const SearchScreen: React.FunctionComponent<SearchScreenProps> = (props) => {
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | undefined>(
    GLOBALS.moviesAndTvShows
  );
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  let timer: any;
  const onChangeText = (event: {
    nativeEvent: { text: React.SetStateAction<string> };
  }) => {
    console.log("event.nativeEvent.text", event.nativeEvent.text);
    setSearchString(event.nativeEvent.text);
    clearTimeout(timer);
    timer = setTimeout(() => {
      onSearch(searchString);
    }, 1000);
  };
  // useEffect(() => {
  //   console.log("GLOBALS.moviesAndTvShows", GLOBALS.moviesAndTvShows);
  //   GLOBALS.moviesAndTvShows ? setSearchResult(GLOBALS.moviesAndTvShows) : null;
  // }, []);

  const formatSearchRsult = (result: any[]) => {
    const formattedData: any[] = [];
    result.forEach((item, index) => {
      for (const key in item) {
        if (item[key].length > 0) {
          formattedData.push(item);
        }
      }
    });
    console.log("data came", result);
    console.log("formattedData", formattedData);
    const massagedData = massageDiscoveryFeed(
      {Items:formattedData},
      SourceType.VOD
    );
    return massagedData;
  };
  const onSearch = async (text: any) => {
    console.log("text", text);
    if (searchString && searchString.length >= 3) {
      const params: SearchParam = {
        searchString: searchString,
        searchLive: false,
        $skip: 0,
        $top: 50,
      };
      const result = await searchItems(params);
      console.log("search result", result);
      if (result.status === 200) {
        const data = formatSearchRsult(result.data);
        setSearchResult(_.isEmpty(data) ? [] : result.data);
      }
    }
  };
  return (
    <View style={styles.root}>
      <View style={styles.secondComponent}>
        <ImageBackground
          source={require("../assets/images/onboarding_1280x752_landscape.jpg")}
          // imageStyle={{
          //   opacity: 0.5,
          // }}
          style={styles.imageComponent}
        >
          <SafeAreaView style={{ paddingBottom: 100 }}>
            {searchResult && searchResult.length > 0 ? (
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
            ) : (
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
            )}
          </SafeAreaView>
        </ImageBackground>
      </View>
      <View style={styles.search}>
        <MFSearch onChangeText={onChangeText} style={{ width: Dimensions.get('screen').width, height: searchHeight, backgroundColor: "#00030E" }} />
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: searchHeight,
    overflow: 'hidden',
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
