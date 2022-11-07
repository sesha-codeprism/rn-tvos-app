import React, { useState } from "react";
import { View, Dimensions, StyleSheet, ImageBackground } from "react-native";
import MFSearch from "../components/MFSearch";

// const Search = requireNativeComponent('NKSearchComponent');

const { width, height } = Dimensions.get("window");

interface SearchScreenProps {
  showSearchResults: boolean;
}

const SearchScreen: React.FunctionComponent<SearchScreenProps> = (props) => {
  const [searchString, setSearchString] = useState("");
  const onChangeText = (event: {
    nativeEvent: { text: React.SetStateAction<string> };
  }) => {
    setSearchString(event.nativeEvent.text);
  };

  return (
    <View style={styles.root}>
      <View style={styles.search}>
        <MFSearch
          onChangeText={onChangeText}
          style={{ height: 50, width: 50, backgroundColor: "grey" }}
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
