import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  useTVEventHandler,
  View,
  Animated,
} from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFText from "../../../../components/MFText";
import { Feed } from "../../../../@types/HubsResponse";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { getDataForUDL } from "../../../../config/queries";
import MFGridView from "../../../../components/MFGridView";
import { appUIDefinition } from "../../../../config/constants";
import { HomeScreenStyles } from "../../Homescreen.styles";
import { SubscriberFeed } from "../../../../@types/SubscriberFeed";
import MFLoader from "../../../../components/MFLoader";
import FastImage from "react-native-fast-image";
import { AppImages } from "../../../../assets/images";
import {
  getBrowseFeedObject,
  getNetworkInfo,
  removeTrailingSlash,
} from "../../../../utils/assetUtils";
import { getResolvedMetadata } from "../../../../components/MFMetadata/MFMetadataUtils";
import LinearGradient from "react-native-linear-gradient";
import { getUIdef } from "../../../../utils/uidefinition";
import {
  UNSTABLE_usePreventRemove,
  useFocusEffect,
} from "@react-navigation/native";
import {
  browseType,
  feedBaseURI,
  ItemShowType,
} from "../../../../utils/common";
import BrowseFilter from "./BrowseFilters";
import { useQuery } from "react-query";
import { getDataFromUDL } from "../../../../../backend";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../../utils/globals";
interface GalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

export const getBaseValues = (feed: any, browsePageConfig: any) => {
  const browseFeedObject = getBrowseFeedObject(feed, browsePageConfig);
  let pivots =
    feed.NavigationTargetUri?.split("?")[1]?.split("&")[0] || undefined;
  let orderBy = browseFeedObject?.params?.$orderBy;
  if (pivots) {
    pivots = pivots?.replace("=", "|");
  }
  if (browseFeedObject?.params?.baseFilters) {
    pivots = pivots
      ? pivots?.concat(",", browseFeedObject.params?.baseFilters)
      : browseFeedObject.params?.baseFilters;
  }
  if (feed?.ItemType && feed?.ItemType === ItemShowType.App) {
    orderBy =
      feed.NavigationTargetUri?.split("&")[1]?.split("=")[1] ||
      browseFeedObject?.params?.$orderBy;
  }
  return {
    orderBy,
    pivots,
  };
};

export const getBrowseFeed = (
  feed: any,
  baseValues: any,
  parsedState: { pivots?: string; orderBy?: string; showType?: string },
  page: number,
  browsePageConfig: any
) => {
  const browseFeed = { ...feed };
  const navigationTargetUri = feed.NavigationTargetUri?.split("?")[0];
  const browseFeedObject = getBrowseFeedObject(feed, browsePageConfig);

  let pivots = parsedState?.pivots || "";

  const baseValuePivots = baseValues?.pivots?.split(",") || [];

  for (const pivot of baseValuePivots) {
    if (!pivots.includes(pivot?.split("|")[0])) {
      pivots += pivots ? "," + pivot : pivot;
    }
  }

  if (feed.pivotGroup) {
    pivots = pivots + `,${feed.pivotGroup}|${feed.Id}`;
  }
  if (
    (navigationTargetUri === browseType.browsepromotions &&
      feedBaseURI.subscriber.test(feed.Uri)) ||
    navigationTargetUri === browseType.libraries
  ) {
    const libraryId = feed.Uri?.split("/").pop();
    browseFeed["Uri"] = `${browseFeedObject.uri}/${libraryId}`;
  } else {
    browseFeed["Uri"] = browseFeedObject.uri;
  }
  if (feed.ItemType === ItemShowType.SvodPackage) {
    browseFeed["CategoryId"] = parsedState.pivots
      ? parsedState.pivots
      : feed.CategoryId;
  }

  browseFeed["pivots"] = pivots;
  browseFeed["$top"] = browseFeedObject.params.$top;
  browseFeed["$orderBy"] = parsedState.orderBy || baseValues.orderBy;
  browseFeed["types"] =
    browseFeedObject.params.types && browseFeedObject.params.types?.split("|");
  browseFeed["$skip"] = browseFeedObject.params.$top * page;
  browseFeed["ShowType"] =
    parsedState.showType || browseFeedObject.params.showType;
  return browseFeed;
};

const GalleryScreen: React.FunctionComponent<GalleryScreenProps> = (props) => {
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [top, setTop] = useState(16);
  const [skip, setSkip] = useState(0);
  const browsePageConfig: any = getUIdef("BrowseGallery")?.config;
  const feed: Feed = props.route.params.feed;
  const baseValues = getBaseValues(feed, browsePageConfig);
  const browseFeed = getBrowseFeed(feed, baseValues, {}, 0, browsePageConfig);
  console.log("BaseValues", baseValues, "browseFeed", browseFeed);
  const { data, isLoading, isError } = getDataForUDL(
    `${browseFeed.Uri}?$top=${top}&skip=${skip}storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${browseFeed.pivots}`
  );

  const pivotsParam = "pivots=true";
  const pivotURL = `${removeTrailingSlash(browseFeed.Uri)}/${pivotsParam}`;
  console.log(pivotURL);
  const menuAnim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const optionsAnim = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  useEffect(() => {
    console.log("Some log");
    props.navigation.addListener("beforeRemove", (e) => {
      console.log("Listener added to navigation");
      if (!showFilterMenu && !showFilterOptions) {
        return;
      }
      e.preventDefault();
      if (showFilterMenu && showFilterOptions) {
        setShowFilterOptions(false);
      } else if (showFilterMenu && !showFilterOptions) {
        setShowFilterMenu(false);
      }
    });
  }, []);

  UNSTABLE_usePreventRemove(openMenu, (data) => {
    openSubMenu ? setOpenSubMenu(false) : setOpenMenu(false);
  });

  const toggleMenu = () => {
    console.log("toggleMenu called", openMenu);
    setOpenMenu(true);
  };

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

  const pivotQuery = useQuery(
    "pivots",
    async () => {
      const pivots = await getDataFromUDL(pivotURL);
      return pivots;
    },
    {
      cacheTime: appUIDefinition.config.queryCacheTime,
    }
  );
  console.log(pivotQuery.data);

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
            onPress={
              toggleMenu

              // () => {
              // console.log("Filter pressed");
              // if (!showFilterMenu) {
              //   setShowFilterMenu(true);
              //   Animated.timing(menuAnim, {
              //     useNativeDriver: true,
              //     toValue: SCREEN_WIDTH - SCREEN_WIDTH * 0.2,
              //     duration: 150,
              //   }).start();
              // } else {
              //   console.log("Don't be an idiot");
              // }
              // }
            }
            iconButtonStyles={{
              shouldRenderImage: true,
              iconPlacement: "Left",
            }}
            containedButtonProps={{
              containedButtonStyle: {
                focusedBackgroundColor: appUIDefinition.theme.colors.blue,
                enabled: true,
                hoverColor: appUIDefinition.theme.colors.blue,
                elevation: 5,
              },
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
      <BrowseFilter
        //@ts-ignore
        open={openMenu}
        subMenuOpen={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
      />
      {/* <View
        style={{
          position: "absolute",
          flexDirection: "row",
          width: SCREEN_WIDTH,
        }}
      > */}
      {/* {showFilterMenu && (
          <Animated.View
            style={{
              width: SCREEN_WIDTH * 0.2,
              height: SCREEN_HEIGHT,
              backgroundColor: "#191B1F",
              transform: [{ translateX: menuAnim }],
            }}
          >
            <Button
              title="Open Options"
              onPress={() => {
                setShowFilterOptions(true);
                Animated.parallel([
                  Animated.timing(menuAnim, {
                    useNativeDriver: true,
                    toValue: SCREEN_WIDTH - SCREEN_WIDTH * 0.4,
                    duration: 150,
                  }),
                  Animated.timing(optionsAnim, {
                    useNativeDriver: true,
                    toValue: SCREEN_WIDTH - SCREEN_WIDTH * 0.2,
                    duration: 150,
                  }),
                ]).start();
              }}
            />
          </Animated.View>
        )}
        {showFilterOptions && (
          <Animated.View
            style={{
              width: SCREEN_WIDTH * 0.3,
              height: SCREEN_HEIGHT,
              backgroundColor: "#202124",
              transform: [{ translateX: optionsAnim }],
              alignSelf: "flex-end",
              position: "absolute",
            }}
          ></Animated.View>
        )} */}
      {/* </View> */}
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
    backgroundColor: appUIDefinition.theme.colors.blue,
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
