import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFText from "../../../../components/MFText";
import { Feed } from "../../../../@types/HubsResponse";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { getDataForUDL, resetSpecificQuery } from "../../../../config/queries";
import MFGridView from "../../../../components/MFGridView";
import { appUIDefinition } from "../../../../config/constants";
import { HomeScreenStyles } from "../../Homescreen.styles";
import { SubscriberFeed } from "../../../../@types/SubscriberFeed";
import MFLoader from "../../../../components/MFLoader";
import FastImage from "react-native-fast-image";
import { AppImages } from "../../../../assets/images";
import {
  getNetworkInfo,
  massageSubscriberFeed,
  removeTrailingSlash,
} from "../../../../utils/assetUtils";
import { getResolvedMetadata } from "../../../../components/MFMetadata/MFMetadataUtils";
import LinearGradient from "react-native-linear-gradient";
import { getUIdef, initUIDef } from "../../../../utils/uidefinition";
import { UNSTABLE_usePreventRemove } from "@react-navigation/native";
import { FilterValue, SourceType } from "../../../../utils/common";
import BrowseFilter from "./BrowseFilters";
import { useQuery } from "react-query";
import { getDataFromUDL } from "../../../../../backend";
import {
  DefaultStore,
  massageDiscoveryFeed,
} from "../../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../../utils/globals";
import {
  getBrowseFeed,
  getBaseValues,
  createInitialFilterState,
} from "./BrowseUtils/BrowseUtils";
import { parseUdl } from "../../../../../backend/udl/provider";
interface GalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GalleryScreen: React.FunctionComponent<GalleryScreenProps> = (props) => {
  const didMountRef = useRef(false);
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const [top, setTop] = useState(16);
  const [skip, setSkip] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [filterValue, setFilterValue] = useState<FilterValue>();
  const [filterState, setFilterState] = useState<any>();
  const [browsePivots, setBrowsePivots] = useState(
    "ShowType|Movie,Price|Free,orderBy|Popularity"
  );

  const browsePageConfig: any = getUIdef("BrowseGallery")?.config;
  const feed: Feed = props.route.params.feed;
  const baseValues = getBaseValues(feed, browsePageConfig);
  const browseFeed = getBrowseFeed(feed, baseValues, {}, 0, browsePageConfig);
  const pivotsParam = "pivots=true";
  const pivotURL = `${removeTrailingSlash(browseFeed.Uri)}/${pivotsParam}`;
  useEffect(() => {
    if (didMountRef.current) {
      setBrowsePivots(browseFeed.pivots);
    } else didMountRef.current = true;
  });

  UNSTABLE_usePreventRemove(openMenu, (data) => {
    // openSubMenu ? setOpenSubMenu(false) : setOpenMenu(false);
    setOpenSubMenu(false);
    setOpenMenu(false);
  });

  const toggleMenu = () => {
    setOpenMenu(true);
    setOpenSubMenu(true);
  };

  //@ts-ignore
  const fetchFeeds = async ({ queryKey }) => {
    const [_, paramPivots] = queryKey;
    console.log("paramPivots", paramPivots);
    console.log("Running..");
    const uri = `${browseFeed.Uri}?$top=${top}&skip=${skip}storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${browsePivots}`;
    const udlID = parseUdl(uri);
    const data = await getDataFromUDL(uri);
    if (data) {
      if (udlID!.id.split("/")[0] === "discovery") {
        const hasDataItems = data.data.Items;
        if (!hasDataItems) {
          const dataSource = { Items: data.data };
          const massagedData = massageDiscoveryFeed(dataSource, SourceType.VOD);
          return massagedData;
        } else {
          const massagedData = massageDiscoveryFeed(data.data, SourceType.VOD);
          return massagedData;
        }
      } else {
        const massagedData = massageSubscriberFeed(
          data.data,
          "",
          SourceType.VOD
        );
        return massagedData;
      }
    } else {
      return undefined;
    }
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
    setBrowsePivots(parsedPivots);
    resetSpecificQuery("browseFeed").then(() => {
      feedQuery
        .refetch({})
        .then((value) => {
          console.log("Refetching done with", browsePivots);
        })
        .catch((err) => console.log("some error happened", err));
    });
  };

  const updateFeed = (focusedFeed: SubscriberFeed) => {
    setCurrentFeed(focusedFeed);
  };

  const feedQuery = useQuery(`browseFeed-${browsePivots}`, fetchFeeds, {
    cacheTime: appUIDefinition.config.queryCacheTime,
    staleTime: appUIDefinition.config.queryStaleTime,
  });

  const pivotQuery = useQuery(
    "pivots",
    async () => {
      const pivots = await getDataFromUDL(pivotURL);
      const firstFilter = createInitialFilterState(pivots.data, baseValues);
      setFilterState(firstFilter);
      console.log("firstFilter", firstFilter);
      return pivots;
    },
    {
      cacheTime: appUIDefinition.config.queryCacheTime,
    }
  );

  const handleFilterChange = (value: {
    key: string;
    value: { Id: string; Name: string };
  }) => {
    let parseFilter = filterState;
    console.log("Value", value, "parseFilter", parseFilter);
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

  console.log("Current data", feedQuery.data);

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
            onPress={toggleMenu}
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
          {feedQuery.isLoading ? (
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
                dataSource={feedQuery.data}
                style={HomeScreenStyles.portraitCardStyles}
                imageStyle={HomeScreenStyles.portraitCardImageStyles}
                focusedStyle={HomeScreenStyles.focusedStyle}
                onFocus={updateFeed}
                autoFocusOnFirstCard
              />
            </LinearGradient>
          )}
        </View>
      </View>
      {pivotQuery.isLoading ? (
        <View />
      ) : (
        <BrowseFilter
          //@ts-ignore
          open={openMenu}
          filterData={pivotQuery.data.data}
          // handleFilterChange={(value) => {
          //   console.log("Value is", value);
          // }}
          // defaultPivots={baseValues}
          subMenuOpen={openSubMenu}
          filterState={filterState}
          setOpenSubMenu={() => {}}
          handleOnPress={handleFilterChange}
          // filterState={filterValue!}
          // onChange={function (filterState: FilterValue): void {
          //   console.log("filterState", filterState);
          // }}
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
