import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Button,
  StyleSheet,
  TVMenuControl,
  View,
} from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";

interface BrowseFilterProps {
  showFilterMenu: boolean;
}

const BrowseFilter: React.FunctionComponent<BrowseFilterProps> = (props) => {
  //   const [, setShowFilterMenu] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      console.log("From backHandler");
      if (props.showFilterMenu && showFilterOptions) {
        setShowFilterOptions(false);
        return true;
      } else if (props.showFilterMenu && !showFilterOptions) {
        return true;
      }
      return false;
    });
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        alignSelf: "flex-end",
        flexDirection: "row",
      }}
    >
      {props.showFilterMenu ? (
        <View
          style={{
            width: SCREEN_WIDTH * 0.2,
            height: SCREEN_HEIGHT,
            backgroundColor: "#191B1F",
          }}
        >
          <Button
            title="Open Options"
            onPress={() => {
              setShowFilterOptions(true);
            }}
          />
        </View>
      ) : (
        <View />
      )}
      {showFilterOptions ? (
        <View
          style={{
            width: SCREEN_WIDTH * 0.2,
            height: SCREEN_HEIGHT,
            backgroundColor: "#202124",
          }}
        ></View>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#00030E",
    flexDirection: "column",
    paddingBottom: 150,
    position: "relative",
  },
  topRow: {
    width: SCREEN_WIDTH,
    height: 120,
    borderBottomColor: "#424242",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  titleContainerStyles: {
    flex: 0.8,
    justifyContent: "center",
  },
  titleTextStyles: {
    color: "#EEEEEE",
    height: 55,
    width: 261,
    fontFamily: "Inter-Regular",
    fontSize: 38,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 55,
    marginLeft: 88,
  },
  filterButtonFocusedStyle: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
  filterButtonContainerStyle: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonLabelStyle: {
    height: 38,
    width: 62,
    color: "#EEEEEE",
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
  },
  filterButtonBackgroundStyles: {
    width: 175,
    height: 62,
    backgroundColor: "#424242",
    borderRadius: 6,
  },
  contentContainerStyles: {
    flexDirection: "row",
    height: "100%",
  },
  currentFeedContainerStyles: {
    flex: 0.45,
  },
  gridViewContainerStyles: {
    flex: 0.55,
    height: "100%",
    width: "100%",
  },
  posterImageContainerStyles: { width: 918, height: 519, overflow: "hidden" },
  posterImageStyle: { width: 918, height: 519, overflow: "hidden" },
  networkLogoContainerStyle: {
    height: 100,
    width: 100,
    opacity: 0.85,
    borderRadius: 6,
    backgroundColor: "#282828",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  networkLogoStyles: { height: 30.96, width: 76.6 },
  metadataContainerStyles: {
    height: 329,
    width: 727,
    paddingLeft: 93,
    marginTop: 8,
  },
  titleTextStyle: {
    height: 60,
    width: 727,
    color: "#EEEEEE",
    fontFamily: "Inter",
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 60,
  },
  metadataLine2Styles: {
    height: 38,
    width: 466,
    color: "#EEEEEE",
    fontFamily: "Inter",
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
  },
  contentRatingIcon: { height: 30, width: 30 },
  ratingTextStyle: {
    height: 38,
    width: 54,
    color: "#828282",
    fontFamily: "Inter",
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
  },
  ratingBlock: {
    flexDirection: "row",
  },
});

export default BrowseFilter;
