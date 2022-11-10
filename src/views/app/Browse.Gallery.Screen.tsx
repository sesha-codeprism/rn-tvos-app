import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFText from "../../components/MFText";
import { Feed } from "../../@types/HubsResponse";
import MFButton, { MFButtonVariant } from "../../components/MFButton/MFButton";
import { getDataForUDL } from "../../config/queries";
import MFGridView from "../../components/MFGridView";
import { appUIDefinition, layout2x3 } from "../../config/constants";
import { HomeScreenStyles } from "./Homescreen.styles";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
import MFLoader from "../../components/MFLoader";
import FastImage from "react-native-fast-image";
import { AppImages } from "../../assets/images";
import {
  durationInDaysHoursMinutes,
  getNetworkInfo,
} from "../../utils/assetUtils";
import { getResolvedMetadata } from "../../components/MFMetadata/MFMetadataUtils";
import LinearGradient from "react-native-linear-gradient";
import { galleryFilter } from "../../utils/analytics/consts";
import { getUIdef } from "../../utils/uidefinition";

interface GalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GalleryScreen: React.FunctionComponent<GalleryScreenProps> = (props) => {
  const pivotConfig = getUIdef("LoginPage")?.config;
  const { SORTBY_KEY, RESTRICTIONS_KEY } = galleryFilter;
  const gradientView = getUIdef("BrowseGallery.GradientView")?.config;
  const browsePageConfig: any = getUIdef("BrowseGallery")?.config;

  console.log(
    "pivotConfig",
    pivotConfig,
    "SORTBY_KEY",
    SORTBY_KEY,
    "RESTRICTIONS_KEY",
    RESTRICTIONS_KEY,
    "gradientView",
    gradientView,
    "browsePageConfig",
    browsePageConfig
  );

  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const feed: Feed = props.route.params.feed;
  const { data, isLoading, isError } = getDataForUDL(feed.Uri);
  console.log("Icon", AppImages["filter"]);

  const updateFeed = (focusedFeed: SubscriberFeed) => {
    setCurrentFeed(focusedFeed);
  };
  const renderRatingValues = () => {
    //@ts-ignore
    const [first, second] = currentFeed!.ratingValues || [];
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
    <View style={styles.root}>
      <View style={styles.topRow}>
        <View style={styles.titleContainerStyles}>
          <MFText
            shouldRenderText
            displayText={feed.Name}
            textStyle={styles.titleTextStyles}
          />
        </View>
        <View style={styles.filterButtonContainerStyle}>
          <MFButton
            variant={MFButtonVariant.Icon}
            iconSource={AppImages["filter"]}
            imageSource={0}
            avatarSource={undefined}
            iconStyles={{
              height: 28,
              width: 28,
              marginRight: 20,
              tintColor: "#EEEEEE",
            }}
            textLabel="Filter"
            textStyle={styles.filterButtonLabelStyle}
            style={styles.filterButtonBackgroundStyles}
            focusedStyle={styles.filterButtonFocusedStyle}
            onFocus={() => {
              console.log("Filter focused");
            }}
            onPress={() => {
              console.log("Filter pressed");
            }}
            iconButtonStyles={{
              shouldRenderImage: true,
              iconPlacement: "Left",
            }}
          />
        </View>
      </View>
      <View style={styles.contentContainerStyles}>
        <View style={styles.currentFeedContainerStyles}>
          {currentFeed && (
            <>
              <View style={styles.posterImageContainerStyles}>
                <FastImage
                  style={styles.posterImageStyle}
                  source={{
                    uri:
                      currentFeed?.image16x9PosterURL != undefined
                        ? currentFeed!.image16x9PosterURL.uri
                        : AppImages.tvshowPlaceholder,
                    priority: FastImage.priority.normal,
                  }}
                >
                  <LinearGradient
                    colors={["transparent", "#00030E", "#00030E"]}
                    start={{ x: 0, y: 0.8 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      flex: 1,
                    }}
                  />
                </FastImage>
              </View>
              <View style={styles.metadataContainerStyles}>
                {currentFeed?.CatalogInfo && currentFeed.CatalogInfo.Network && (
                  <View style={styles.networkLogoContainerStyle}>
                    <FastImage
                      source={{
                        uri: getNetworkInfo(currentFeed).tenFootLargeURL.uri,
                      }}
                      style={styles.networkLogoStyles}
                    />
                  </View>
                )}
                <MFText
                  shouldRenderText
                  displayText={currentFeed!.title}
                  textStyle={styles.titleTextStyle}
                />
                <MFText
                  shouldRenderText
                  displayText={getResolvedMetadata(
                    appUIDefinition.metadataByItemType.RECOMM.metadata2,
                    currentFeed
                  )}
                  textStyle={styles.metadataLine2Styles}
                />
                {renderRatingValues()}
              </View>
            </>
          )}
        </View>
        <View style={styles.gridViewContainerStyles}>
          {isLoading ? (
            <MFLoader transparent={true} />
          ) : (
            <LinearGradient
              colors={[
                "transparent",
                "#00030E",
                "#00030E",
                "#00030E",
                "#00030E",
                "#00030E",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.1, y: 0 }}
              style={{
                flex: 1,
              }}
            >
              <MFGridView
                dataSource={data}
                style={HomeScreenStyles.portraitCardStyles}
                imageStyle={HomeScreenStyles.portraitCardImageStyles}
                focusedStyle={HomeScreenStyles.focusedStyle}
                onFocus={updateFeed}
              />
            </LinearGradient>
          )}
        </View>
      </View>
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
export default GalleryScreen;
