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
interface GalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GalleryScreen: React.FunctionComponent<GalleryScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;
  const didMountRef = useRef(false);
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const [top, setTop] = useState(16);
  const [skip, setSkip] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [feedData, setFeedData] = useState<Array<any>>();
  const [filterState, setFilterState] = useState<any>();
  const browsePageConfig: any = getUIdef("BrowseGallery")?.config;
  const baseValues = getBaseValues(feed, browsePageConfig);
  const browseFeed = getBrowseFeed(feed, baseValues, {}, 0, browsePageConfig);
  const [browsePivots, setBrowsePivots] = useState(browseFeed.pivots);
  const [filterFocused, setFilterFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const menuRef = filterData.map(() => useRef<PressableProps>(null));
  const barRef = useRef<TouchableOpacity>(null);
  const filterRef = useRef<PressableProps>(null);
  const cardRef = useRef<PressableProps>(null);
  const pivotsParam = "pivots=true";
  const pivotURL = `${removeTrailingSlash(browseFeed.Uri)}/${pivotsParam}`;

  // const filterRef = useEffect(() => {
  //   if (didMountRef.current) {
  //   } else didMountRef.current = true;
  // });
  // const backAction = () => {
  //   if (openMenu) {
  //     setOpenSubMenu(false);
  //     setOpenMenu(false);
  //     return true;
  //   } else {
  //     // Open !true. So something is happening. Removed some console.log
  //   }
  // };
  // useEffect(() => {
  //   if (openMenu) {
  //     console.log("Drawer status (Hopefully false):", "setting TVMenuKey");
  //     TVMenuControl.enableTVMenuKey();
  //     BackHandler.addEventListener("hardwareBackPress", backAction);
  //   }
  // }, []);
  UNSTABLE_usePreventRemove(openMenu, (data) => {
    // openSubMenu ? setOpenSubMenu(false) : setOpenMenu(false);
    setOpenSubMenu(false);
    setOpenMenu(false);
  });

  const toggleMenu = () => {
    console.log("Pressed on the browse filter", openMenu);
    setOpenMenu(!openMenu);
    setOpenSubMenu(!openSubMenu);
  };

  //@ts-ignore
  const fetchFeeds = async (requestPivots: any) => {
    try {
      const uri = `${browseFeed.Uri}?$top=${top}&skip=${skip}storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${requestPivots}`;
      console.log("Requesting data for:", uri);
      const data = await getDataFromUDL(uri);
      if (data) {
        /** we have data from backend, so use the data and setState */
        const massagedData = getMassagedData(uri, data);
        console.log("Setting feed data:", data, "for", uri);
        // setFeedData(massagedData);
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
  };

  const updateFeed = (focusedFeed: SubscriberFeed) => {
    setCurrentFeed(focusedFeed);
  };

  const { data, isLoading } = useQuery(
    ["browseFeed", browsePivots],
    () => fetchFeeds(browsePivots),
    defaultQueryOptions
  );

  const pivotQuery = useQuery(
    "pivots",
    async () => {
      try {
        console.log("Requesting pivots for:", pivotURL);
        const pivots = await getDataFromUDL(pivotURL);
        const firstFilter = createInitialFilterState(pivots.data, baseValues);
        setFilterState(firstFilter);
        console.log("firstFilter", firstFilter);
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

  const onFocusBar = () => {
    if (!filterFocused) {
      setFilterFocused(true);
      filterRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    } else {
      setFilterFocused(false);
      cardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    }
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
                  focusedBackgroundColor: appUIDefinition.theme.colors.blue,
                  enabled: true,
                  hoverColor: appUIDefinition.theme.colors.blue,
                  elevation: 5,
                },
              }}
            />
          )}
        </View>
      </View>
      {isLoading ? (
        <MFLoader />
      ) : (
        <View style={styles.contentContainerStyles}>
          <>
            {data ? (
              <>
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
                        <MFText
                          shouldRenderText
                          displayText={getResolvedMetadata(
                            appUIDefinition.metadataByItemType.RECOMM.metadata2,
                            currentFeed
                          )}
                          textStyle={styles.metadataLine2Styles}
                          adjustsFontSizeToFit={false}
                          numberOfLines={3}
                        />
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
                      ref={cardRef}
                      dataSource={data}
                      style={HomeScreenStyles.portraitCardStyles}
                      imageStyle={HomeScreenStyles.portraitCardImageStyles}
                      focusedStyle={HomeScreenStyles.focusedStyle}
                      onFocus={updateFeed}
                      autoFocusOnFirstCard
                      selectedId={currentFeed?.Id}
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
          // handleFilterChange={(value) => {
          //   console.log("Value is", value);
          // }}
          // defaultPivots={baseValues}
          subMenuOpen={openSubMenu}
          filterState={filterState}
          setOpenSubMenu={() => {}}
          setOpenMenu={setOpenMenu}
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
