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
import { searchItems } from "../../backend/subscriber/subscriber";
import MFSearch from "../components/MFSearch";
import MFSwimLane from "../components/MFSwimLane";
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
const SearchScreen: React.FunctionComponent<SearchScreenProps> = (props) => {
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  let timer: any;
  const onChangeText = (event: {
    nativeEvent: { text: React.SetStateAction<string> };
  }) => {
    setSearchString(event.nativeEvent.text);
    clearTimeout(timer);
    timer = setTimeout(() => {
      onSearch(searchString);
    }, 1000);
  };
  useEffect(()=>{
    console.log('GLOBALS.moviesAndTvShows', GLOBALS.moviesAndTvShows)
    GLOBALS.moviesAndTvShows ?  setSearchResult(GLOBALS.moviesAndTvShows) : null
  })
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
        setSearchResult(result.data);
      }
    }
  };
  return (
    <View style={styles.root}>
      <View style={styles.search}>
        <MFSearch
          onChangeText={onChangeText}
          style={{ height: 50, width: 50, backgroundColor: "#00030E" }}
        />
      </View>
      <View style={styles.secondComponent}>
        <ImageBackground
          source={require("../assets/images/onboarding_1280x752_landscape.jpg")}
          imageStyle={{
            opacity: 0.5,
          }}
          style={styles.imageComponent}
        >
          <SafeAreaView style={{ paddingBottom: 50 }}>
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
    </SafeAreaView>
          {/* <Text style={{ color: "white", fontSize: 30, fontWeight: "600" }}>
            {searchString}
          </Text> */}
          {/* <MFFilmStrip
            mfCardArray={cardArray}
            limitItemsTo={5}
            enableCircularLayout
            title={'Search Results'}
            isCircular={false}
            enableRTL={enableRTL}
            appendViewAll
            dataSource={dataSource}
            renderMFCard={(item, index) => (
            )}
            viewAll={
              <MFViewAllButton
                displayStyles={{
                  color: 'white',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
                displayText={'View All'}></MFViewAllButton>
            }></MFFilmStrip> */}
        </ImageBackground>
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
    flex: 1,
    height: 200,
  },
  secondComponent: {
    height: 800,
    marginTop: 200,
  },
  imageComponent: {
    height: 800,
    width: width,
    marginTop: 150,
  },
});

export default SearchScreen;
