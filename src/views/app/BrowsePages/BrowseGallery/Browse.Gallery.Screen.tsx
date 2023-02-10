import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  PressableProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  TVMenuControl,
  View,
} from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFText from "../../../../components/MFText";
import { Feed } from "../../../../@types/HubsResponse";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import MFGridView from "../../../../components/MFGridView";
import {
  appUIDefinition,
  defaultQueryOptions,
} from "../../../../config/constants";
import { HomeScreenStyles } from "../../Homescreen.styles";
import { SubscriberFeed } from "../../../../@types/SubscriberFeed";
import MFLoader from "../../../../components/MFLoader";
import FastImage from "react-native-fast-image";
import { AppImages } from "../../../../assets/images";
import {
  getNetworkInfo,
  removeTrailingSlash,
} from "../../../../utils/assetUtils";
import { getResolvedMetadata } from "../../../../components/MFMetadata/MFMetadataUtils";
import LinearGradient from "react-native-linear-gradient";
import { getUIdef } from "../../../../utils/uidefinition";
import { UNSTABLE_usePreventRemove } from "@react-navigation/native";
import BrowseFilter from "./BrowseFilters";
import { useQuery } from "react-query";
import { getDataFromUDL, getMassagedData } from "../../../../../backend";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../../utils/globals";
import {
  getBrowseFeed,
  getBaseValues,
  createInitialFilterState,
} from "./BrowseUtils/BrowseUtils";
import { MFTabBarStyles } from "../../../../components/MFTabBar/MFTabBarStyles";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { browseType } from "../../../../utils/common";
import { metadataSeparator } from "../../../../utils/Subscriber.utils";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { debounce2 } from "../../../../utils/app/app.utilities";
import { current } from "@reduxjs/toolkit";
interface GalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GalleryScreen: React.FunctionComponent<GalleryScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [filterState, setFilterState] = useState<any>(null);
  const browsePageConfig: any = getUIdef("BrowseGallery")?.config;
  const baseValues = getBaseValues(feed, browsePageConfig);
  const browseFeed = getBrowseFeed(feed, baseValues, {}, 0, browsePageConfig);
  const [browsePivots, setBrowsePivots] = useState(browseFeed.pivots);
  const [filterFocused, setFilterFocused] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);
  const [dataSource, setDataSource] = useState(Array<any>());
  // Get the desired length per page from the config params(top value).
  const lengthPerPage = browseFeed.$top;

  const [page, setCurrentPage] = useState(0);
  const barRef = useRef<TouchableOpacity>(null);
  const filterRef = useRef<PressableProps>(null);
  const cardRef = useRef<PressableProps>(null);
  const pivotsParam = "pivots=true";
  const pivotURL = `${removeTrailingSlash(browseFeed.Uri)}/${pivotsParam}`;

  UNSTABLE_usePreventRemove(openMenu, (data) => {
    setOpenSubMenu(false);
    setOpenMenu(false);
  });
  const toggleMenu = () => {
    console.log("Pressed on the browse filter", openMenu);
    setOpenMenu(!openMenu);
    setOpenSubMenu(!openSubMenu);
  };

  //@ts-ignore
  const fetchFeeds = async ({ queryKey }: any) => {
    const [key, requestPivots, page] = queryKey;
    try {
      const $top = browseFeed.$top;
      const skip = $top * page;
      let finalUri = "";
      const uri = `${browseFeed.Uri}?$top=${$top}&$skip=${skip}&storeId=${
        DefaultStore.Id
      }&$groups=${GLOBALS.store!.rightsGroupIds}`;
      if (browsePivots) {
        finalUri = uri.concat(`&pivots=${requestPivots}`);
      } else {
        finalUri = uri;
      }
      const data = await getDataFromUDL(finalUri);
      if (data) {
        /** we have data from backend, so use the data and setState */
        const massagedData = getMassagedData(uri, data);
        return massagedData;
      } else {
        console.log("No data currently for", uri);
        /** No data from backend.. so just render placeholder data.. */
        return undefined;
      }
    } catch (e) {
      console.log("Issue in getting feeds,actually..", e);
      return undefined;
    }
  };

  const filterData = (dataSet: any) => {
    if (dataSet.length < lengthPerPage) {
      setLastPageReached(true);
    }
    const dataArray = dataSource;
    if (dataArray.length > 0) {
      const newArray = dataArray.concat(dataSet);
      setDataSource(newArray);
    } else {
      setDataSource(dataSet);
    }
    return dataSet;
  };

  const refreshFeedsByPivots = () => {
    const parsedFilterState = filterState;
    let finalPivots = "";
    const parsedPivots = Object.keys(parsedFilterState).reduce(
      (prev: any, key: any) => {
        if (parsedFilterState[key].selectedIds.length > 0) {
          if (prev.length > 0) {
            return prev + "," + parsedFilterState[key].selectedIds;
          } else {
            return prev + parsedFilterState[key].selectedIds;
          }
        } else {
          return prev;
        }
      },
      finalPivots
    );
    setCurrentFeed(undefined);
    setDataSource([]);
    setBrowsePivots(parsedPivots);
  };

  const updateFeed = (focusedFeed: SubscriberFeed) => {
    setCurrentFeed(focusedFeed);
  };

  const { data, isLoading, isIdle } = useQuery(
    [`browseFeed-${browseFeed?.Uri}`, browsePivots, page],
    fetchFeeds,
    defaultQueryOptions
  );

  const handleEndReached = debounce2(() => {
    if (!lastPageReached) {
      setCurrentPage(page + 1);
    }
  }, 500);

  const pivotQuery = useQuery(
    "pivots",
    async () => {
      try {
        console.log("Requesting pivots for:", pivotURL);
        const pivots = await getDataFromUDL(pivotURL);
        const firstFilter = createInitialFilterState(pivots.data, baseValues);
        setFilterState(firstFilter);
        return pivots;
      } catch (e) {
        console.log("Some error in getting pivots", e);
        return undefined;
      }
    },
    {
      cacheTime: appUIDefinition.config.queryCacheTime,
    }
  );

  useEffect(() => {
    if (data && !isIdle) {
      return filterData(data);
    }
  }, [data]);

  const handleFilterClear = () => {
    setDataSource([]);
    setFilterState(null);
    setCurrentFeed(undefined);
    const firstFilter = createInitialFilterState(
      pivotQuery.data.data,
      baseValues
    );
    setFilterState(firstFilter);
    setBrowsePivots(browseFeed.pivots);
    setLastPageReached(false);
    setCurrentPage(0);
  };

  const handleFilterChange = (value: {
    key: string;
    value: { Id: string; Name: string };
  }) => {
    let parseFilter = filterState;
    /** Check if the array already has the data.. if Yes, delete it */
    if (parseFilter[value.key].selectedIds.includes(value.value.Id)) {
      parseFilter[value.key].selectedIds = [];
    } else {
      /** array doesn't have data.. add and make the api call */
      parseFilter[value.key].selectedIds = [value.value.Id];
      console.log(parseFilter);
    }
    setFilterState(parseFilter);
    refreshFeedsByPivots();
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

  const getGenreText = (genres?: Genre[]) =>
    genres?.map((genre) => `${genre.Name}`);

  const renderMetadata = () => {
    let metadata: string[] | undefined;

    const navigationTargetUri = feed?.NavigationTargetUri?.split("?")[0];
    if (navigationTargetUri !== browseType.restartTv) {
      metadata = currentFeed?.genre ? getGenreText(currentFeed?.genre) : [];

      currentFeed?.ReleaseYear && metadata?.push(currentFeed?.ReleaseYear);
      currentFeed?.Rating && metadata?.push(currentFeed?.Rating);
    }

    return (
      <View style={styles.metadataContainer}>
        <Text numberOfLines={2} style={styles.metadataLine2}>
          {metadata?.join(metadataSeparator) || currentFeed?.metadataLine2}
          {__DEV__ ? " " + dataSource.indexOf(currentFeed) : ""}
        </Text>
      </View>
    );
  };

  const onFocusBar = () => {
    if (!filterFocused) {
      setFilterFocused(true);
      filterRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    } else {
      setFilterFocused(false);
      cardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    }
  };

  const imageSource: any =
    currentFeed?.image16x9KeyArtURL ||
    currentFeed?.image16x9PosterURL ||
    AppImages.bgPlaceholder;

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
          {pivotQuery.data && (
            <MFButton
              ref={filterRef}
              variant={MFButtonVariant.Icon}
              iconSource={AppImages["filter"]}
              imageSource={0}
              avatarSource={undefined}
              iconStyles={{
                height: 28,
                width: 28,
                marginRight: 20,
              }}
              textLabel="Filter"
              textStyle={styles.filterButtonLabelStyle}
              style={styles.filterButtonBackgroundStyles}
              focusedStyle={styles.filterButtonFocusedStyle}
              onFocus={() => {
                console.log("Filter focused");
              }}
              onPress={toggleMenu}
              iconButtonStyles={{
                shouldRenderImage: true,
                iconPlacement: "Left",
              }}
              containedButtonProps={{
                containedButtonStyle: {
                  focusedBackgroundColor:
                    appUIDefinition.theme.backgroundColors.primary1,
                  enabled: true,
                  hoverColor: appUIDefinition.theme.backgroundColors.primary1,
                  elevation: 5,
                },
              }}
            />
          )}
        </View>
      </View>
      {isLoading && dataSource.length <= 0 ? (
        <MFLoader />
      ) : (
        <View style={styles.contentContainerStyles}>
          <>
            {dataSource.length > 0 ? (
              <>
                <View style={styles.currentFeedContainerStyles}>
                  {currentFeed && (
                    <>
                      <View style={styles.posterImageContainerStyles}>
                        <FastImage
                          style={styles.posterImageStyle}
                          source={imageSource}
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
                        {currentFeed?.CatalogInfo &&
                          currentFeed.CatalogInfo.Network && (
                            <View style={styles.networkLogoContainerStyle}>
                              <FastImage
                                source={{
                                  uri: getNetworkInfo(currentFeed)
                                    .tenFootLargeURL.uri,
                                }}
                                style={styles.networkLogoStyles}
                              />
                            </View>
                          )}
                        <MFText
                          shouldRenderText
                          displayText={currentFeed!.title}
                          textStyle={styles.titleTextStyle}
                          adjustsFontSizeToFit={false}
                          numberOfLines={3}
                        />
                        {renderMetadata()}
                        {renderRatingValues()}
                      </View>
                    </>
                  )}
                </View>
                <View style={styles.gridViewContainerStyles}>
                  <TouchableOpacity
                    ref={barRef}
                    style={{
                      backgroundColor: "transparent",
                      width: "100%",
                      height: 5,
                      // position: "absolute",
                    }}
                    onFocus={onFocusBar}
                  />
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
                      //@ts-ignore
                      ref={cardRef}
                      dataSource={dataSource}
                      style={HomeScreenStyles.portraitCardStyles}
                      imageStyle={HomeScreenStyles.portraitCardImageStyles}
                      focusedStyle={HomeScreenStyles.focusedStyle}
                      onFocus={updateFeed}
                      autoFocusOnFirstCard
                      selectedId={currentFeed?.Id}
                      onEndReached={handleEndReached}
                      onPress={(event) => {
                        props.navigation.push(Routes.Details, { feed: event });
                      }}
                    />
                  </LinearGradient>
                </View>
              </>
            ) : (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MFText
                  shouldRenderText
                  displayText={`Couldn't fetch data for ${browseFeed.Uri}`}
                  textStyle={[
                    MFTabBarStyles.tabBarItemText,
                    { color: "white", marginTop: 5 },
                  ]}
                />
              </View>
            )}
          </>
        </View>
      )}
      {pivotQuery.isLoading ? (
        <View />
      ) : (
        <BrowseFilter
          //@ts-ignore
          open={openMenu}
          filterData={pivotQuery?.data?.data}
          subMenuOpen={openSubMenu}
          filterState={filterState}
          setOpenSubMenu={() => {}}
          setOpenMenu={setOpenMenu}
          handleOnPress={handleFilterChange}
          handleFilterClear={handleFilterClear}
        />
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
    backgroundColor: appUIDefinition.theme.backgroundColors.primary1,
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
  metadataContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  metadataLine2: {
    color: globalStyles.fontColors.light,
    fontFamily: globalStyles.fontFamily.semiBold,
    fontSize: globalStyles.fontSizes.body2,
    lineHeight: globalStyles.lineHeights.body2,
    width: 650,
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
