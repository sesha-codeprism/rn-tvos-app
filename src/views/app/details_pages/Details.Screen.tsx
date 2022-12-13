import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Feed } from "../../../@types/HubsResponse";
import { AppImages } from "../../../assets/images";
import MFText from "../../../components/MFText";
import { getMetadataLine2 } from "../../../utils/assetUtils";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../utils/dimensions";
import { getImageUri } from "../../../utils/Subscriber.utils";

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const DetailsScreen: React.FunctionComponent<DetailsScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;
  console.log("feed info", feed, getImageUri(feed, "3x4/Poster"));
  const renderRatingValues = () => {
    //@ts-ignore
    const [first, second] = feed!.ratingValues || [];
    return (
      <View style={styles.ratingBlock}>
        {first ? (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingIcon}
              source={{
                uri: first.Image,
              }}
            />
            <Text
              style={[styles.ratingTextStyle, styles.ratingTextStyle]}
            >{`${first?.Score}%`}</Text>
          </View>
        ) : null}

        {second ? (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingIcon}
              source={{
                uri: second.Image,
              }}
            />
            <Text
              style={[styles.ratingTextStyle, styles.ratingTextStyle]}
            >{`${second?.Score}%`}</Text>
          </View>
        ) : null}
      </View>
    );
  };
  return (
    <ImageBackground
      source={AppImages.landing_background}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
    >
      <View style={styles.root}>
        <View style={styles.topRow} />
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <FastImage
              //@ts-ignore
              source={getImageUri(feed, "3x4/Poster")}
              style={{
                height: 766,
                width: 419,
                //   justifyContent: "center",
                //   alignSelf: "center",
              }}
              resizeMode="contain"
            />
            <View style={{ height: "30%", width: "100%" }}></View>
          </View>
          <View style={styles.detailsContainer}>
            <MFText
              shouldRenderText
              //@ts-ignore
              displayText={feed.title || feed?.Name || item?.CatalogInfo?.Name}
              textStyle={styles.titleTextStyle}
            />
            <MFText
              shouldRenderText
              displayText={getMetadataLine2(feed)}
              textStyle={styles.metadataStyles}
            />

            <MFText
              shouldRenderText
              displayText={"Placeholder Status Text"}
              textStyle={styles.placeholderTextStyles}
            />
            <MFText
              shouldRenderText
              displayText={
                //@ts-ignore
                feed.CatalogInfo?.Description ||
                feed?.ShowDescription! ||
                "No description found"
              }
              textStyle={styles.descriptionStyles}
              adjustsFontSizeToFit={false}
              numberOfLines={5}
            />
            {renderRatingValues()}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexDirection: "column",
    backgroundColor: "rgba(0,10,32,0.95)",
  },
  topRow: {
    height: 86,
    width: SCREEN_WIDTH,
    // backgroundColor: "blue",
  },
  contentContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // backgroundColor: "red",
    marginLeft: "4%",
    marginRight: "4%",
    flexDirection: "row",
  },
  imageContainer: {
    width: "25%",
    height: "70%",
    // backgroundColor: "green",
    justifyContent: "center",
    overflow: "hidden",
  },
  detailsContainer: {
    width: "75%",
    height: "70%",
    // backgroundColor: "purple",
    overflow: "hidden",
  },
  titleTextStyle: {
    height: 72,
    width: 838,
    color: "#EEEEEE",
    fontFamily: "Inter",
    fontSize: 57,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 72,
  },
  metadataStyles: {
    height: 38,
    width: 538,
    color: "#A7A7A7",
    fontFamily: "Inter",
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    margin: 8,
  },
  descriptionStyles: {
    height: 114,
    width: 905,
    color: "#A7A7A7",
    fontFamily: "Inter",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 22,
  },
  ratingBlock: {
    flexDirection: "row",
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
  placeholderTextStyles: {
    height: 38,
    width: 281,
    color: "#E7A230",
    fontFamily: "Inter",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 23,
  },
});

export default DetailsScreen;
