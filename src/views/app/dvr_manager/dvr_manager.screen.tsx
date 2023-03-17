import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
  useTVEventHandler,
  Dimensions,
  TVMenuControl,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { PageContainer } from "../../../components/PageContainer";
import { getScaledValue, SCREEN_WIDTH } from "../../../utils/dimensions";
import { globalStyles } from "../../../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../../../utils/uidefinition";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStrings } from "../../../config/strings";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import { PressableProps } from "react-native-tvfocus";
import { AppImages } from "../../../assets/images";
import { appUIDefinition } from "../../../config/constants";
import { GLOBALS } from "../../../utils/globals";
import { buildFilterDataSource, Definition } from "../../../utils/DVRUtils";
import {
  chooseRating,
  generalizeQuality,
  getDurationSeconds,
  isExpiringSoon,
  massageDVRFeed,
  massageResult,
} from "../../../utils/assetUtils";
import MFSwimLane from "../../../components/MFSwimLane";
import _, { uniqBy } from "lodash";
import {
  DvrItemState,
  FilterValue,
  ItemShowType,
  SourceType,
} from "../../../utils/common";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BrowseFilter from "../BrowsePages/BrowseGallery/BrowseFilters";
import { SidePanel } from "./SidePannel";
import { getImageUri } from "../../../utils/Subscriber.utils";
import {
  DvrRecordedState,
  RecordStatus,
  sourceTypeString,
} from "../../../utils/analytics/consts";
import FastImage from "react-native-fast-image";
import { config } from "../../../config/config";
import { convertSecondsToDayHourMinStrings } from "../../../utils/dataUtils";

interface DvrManagerProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}
enum DvrMenuItems {
  Recorded,
  Scheduled,
}
export enum SubViews {
  Menu,
  RecordingResults,
  ScheduleResults,
  Filter,
  None,
}
const dvrMenuItems = [
  { Id: DvrMenuItems.Recorded, Name: AppStrings.str_dvr_recorded },
  {
    Id: DvrMenuItems.Scheduled,
    Name: AppStrings.str_dvr_scheduled,
  },
];
const { width, height } = Dimensions.get("window");

const DVRManagerScreen = (props: DvrManagerProps) => {
  const [currentDvrMenu, setCurrentDvrMenu] = useState(DvrMenuItems.Recorded);
  const [selectedAsset, setSelectedAsset] = useState();
  const [completedWidth, setCompletedWidth] = useState(0);
  const [pivots, setPivots] = useState();
  const [isMenuFocused, setIsMenuFocused] = useState(false);
  const [focussedComponent, setFocussedComponent] = useState(SubViews.None);
  const scheduledRecordings = massageDVRFeed(
    GLOBALS.scheduledSubscriptions,
    SourceType.DVR,
    "",
    GLOBALS.channelMap
  );
  const viewableRecordings = massageDVRFeed(
    GLOBALS.viewableSubscriptions,
    SourceType.DVR,
    "",
    GLOBALS.channelMap
  );
  const [recordedList, setRecordedList] = useState<any[]>([]);
  const channelMap = GLOBALS.channelMap;
  const [viewableFilters, setViewableFilters] = useState();
  const [scheduledFilters, setScheduledFilters] = useState();
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const [swimLaneFocused, setSwimLaneFocused] = useState(false);
  const [filterState, setFilterState] = useState<any>(null);
  const [filterData, setFilterData] = useState<any>([]);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [defaultFilterState, setDefaultFilterState] = useState<any>([]);
  const [openSidePannel, setOpenSidePannel] = useState(false);
  const [focusedCard, setFocusedCard] = useState<any>(null);
  const [currentScheduledItem, setCurrentScheduledItem] = useState<any>({
    id: null,
  });
  const navigationParams = props.route.params;
  const lazyListConfig: any = getUIdef("EpisodeList.LazyListWrapper")?.config;
  const scaledSnapToInterval = getScaledValue(lazyListConfig.snapToInterval);
  const offset = useSharedValue(420);
  const opacity = useSharedValue(1);
  const firstCardRef = useRef<TouchableOpacity>(null);
  const firstScheduledCardRef: React.RefObject<any> = React.createRef<any>();
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  const filterRef = useRef<PressableProps>(null);
  const menuRef = dvrMenuItems.map(() => {
    return useRef<PressableProps>(null);
  });
  const drawerRef: React.MutableRefObject<any> = useRef();

  const myTVEventHandler = (evt: any) => {
    if (
      evt.eventType === "longSelect" &&
      !isMenuFocused &&
      swimLaneFocused &&
      !openSidePannel
    ) {
      setOpenSidePannel(true);
      drawerRef?.current?.open();
    }
  };
  useTVEventHandler(myTVEventHandler);
  const handleFilterChange = (filterData: FilterValue) => {
    setFilterState(filterData);
  };
  const processData = () => {
    const filteredRecordinglist = viewableRecordings.filter((item: any) => {
      return item.SubscriptionItems.length > 0;
    });
    let listAllRecorded: any = [],
      filteredRecording: any = [],
      objFilterRecorded: any = {};
    filteredRecordinglist &&
      filteredRecordinglist.forEach((item: any) => {
        const { SeriesDetails = {} } = item || {};
        item.SubscriptionItems?.length &&
          item.SubscriptionItems.forEach((itemData: any) => {
            if (
              itemData.ItemState === DvrItemState.RECORDED ||
              itemData.ItemState === DvrItemState.RECORDING
            ) {
              if (objFilterRecorded[item.Id] == undefined) {
                filteredRecording.push(item);
                objFilterRecorded[item.Id] = item;
              }
              if (itemData?.ProgramDetails) {
                itemData.ProgramDetails["SeriesId"] = item?.SeriesId;
                itemData["SeriesDetails"] = SeriesDetails;
              }
              if (listAllRecorded?.length < config.defaultFeedItemsCount)
                listAllRecorded.push(itemData);
            }
          });
      });

    const feedItems = [];

    if (listAllRecorded) {
      feedItems.push({
        feed: { Name: AppStrings?.str_recently_recorded },
        items: massageResult.MixedShow(
          listAllRecorded
            .map((item: any) => {
              if (
                Object.keys(item.SeriesDetails).length === 0 &&
                item?.ProgramDetails &&
                !item?.ProgramDetails?.SeriesId
              ) {
                item.ProgramDetails["programId"] = item?.ProgramId;
              } else if (!item.SeriesDetails.SeriesId) {
                item.ProgramDetails["programId"] = item?.ProgramId;
              }
              if (Object.keys(item?.ProgramDetails).length) {
                item.ProgramDetails["recentlyRecordedId"] =
                  item?.Id || undefined;
                item.ProgramDetails["dvrSetting"] = item?.Settings || "";
                item.ProgramDetails["ItemState"] = item?.ItemState || "";
              } else if (Object.keys(item.SeriesDetails).length) {
                item.SeriesDetails["dvrSetting"] = item?.Settings || "";
                item.SeriesDetails["ItemState"] = item?.ItemState || "";
              }
              const {
                SeriesDetails: {
                  StartYear = "",
                  Ratings: SeriesDetailsRatings = undefined,
                } = {},
              } = item || {};
              const {
                ProgramDetails,
                Settings: { ChannelNumber = undefined } = {},
                ScheduledAvailabilityStartUtc,
                ActualAvailabilityEndUtc,
                ActualAvailabilityStartUtc,
                ItemState,
              } = item || {};
              const {
                SeasonNumber,
                EpisodeNumber,
                Ratings: ProgramDetailsRatings,
                ReleaseDate,
              } = ProgramDetails || {};
              if (SeasonNumber && EpisodeNumber) {
                item["episodeInfo"] = `S${SeasonNumber} E${EpisodeNumber}`;
              }
              if (
                ScheduledAvailabilityStartUtc &&
                ActualAvailabilityEndUtc &&
                ItemState !== DvrRecordedState.Recording
              ) {
                const duration = getDurationSeconds(item);
                item["metadataLine3"] =
                  convertSecondsToDayHourMinStrings(duration);
                item["recordingIcon"] = false;
              } else if (ItemState === DvrRecordedState.Recording) {
                item["metadataLine3"] = undefined;
                item["recordingIcon"] = true;
              }

              if (ChannelNumber) {
                let channel =
                  GLOBALS.channelMap?.findChannelByNumber(ChannelNumber) || {};
                channel = channel.channel || {};

                const { LiveRights, CallLetters } = channel;

                const ratings = SeriesDetailsRatings || ProgramDetailsRatings;
                const chosenRaiting = chooseRating(ratings);
                const metadata = [];
                if (chosenRaiting && (StartYear || ReleaseDate)) {
                  const releaseYear = new Date(ReleaseDate);
                  metadata.push(
                    StartYear ? StartYear : releaseYear.getFullYear()
                  );
                  metadata.push(chosenRaiting);
                } else if (StartYear || ReleaseDate) {
                  const releaseYear = new Date(ReleaseDate);
                  metadata.push(
                    StartYear ? StartYear : releaseYear.getFullYear()
                  );
                } else if (chosenRaiting) {
                  metadata.push(chosenRaiting);
                }

                if (LiveRights && CallLetters) {
                  metadata.push(`${CallLetters} ${ChannelNumber}`);

                  // Quality
                  if (LiveRights.length) {
                    const qualities = generalizeQuality(LiveRights);
                    const quality = qualities && qualities[0];
                    metadata.push(quality?.q);
                  }
                }
                item["metadataLine2"] = metadata.join("  ·  ");
              }

              const {
                SeriesDetailsOrig,
                ProgramDetails: FoundProgramDetailsOrig,
                episodeInfo,
                metadataLine2,
                metadataLine3,
                recordingIcon = undefined,
                Id,
                SubscriptionId,
              } = item || {};

              // Copy the object, create new object for each episode
              const SeriesDetails = { ...SeriesDetailsOrig };
              const FoundProgramDetails = {
                ...FoundProgramDetailsOrig,
              };
              if (SeriesDetails?.SeriesId) {
                SeriesDetails["episodeInfo"] = episodeInfo;
                SeriesDetails["metadataLine2"] = metadataLine2;
                SeriesDetails["metadataLine3"] = metadataLine3;
                SeriesDetails["recordingIcon"] =
                  recordingIcon === undefined
                    ? SeriesDetails["recordingIcon"]
                    : recordingIcon;
              }

              if (FoundProgramDetails?.ProgramId) {
                FoundProgramDetails["episodeInfo"] = episodeInfo;
                FoundProgramDetails["metadataLine2"] = metadataLine2;
                FoundProgramDetails["metadataLine3"] = metadataLine3;
                FoundProgramDetails["recordingIcon"] =
                  recordingIcon === undefined
                    ? FoundProgramDetails["recordingIcon"]
                    : recordingIcon;
              }
              if (SeriesDetails?.SeriesId) {
                // copy details
                SeriesDetails["ActualAvailabilityEndUtc"] =
                  ActualAvailabilityEndUtc;
                SeriesDetails["ActualAvailabilityStartUtc"] =
                  ActualAvailabilityStartUtc;
                SeriesDetails["ScheduledAvailabilityStartUtc"] =
                  ScheduledAvailabilityStartUtc;
                SeriesDetails["SubscriptionItemId"] = Id;
                SeriesDetails["SubscriptionGroupId"] = SubscriptionId;
                return SeriesDetails;
              } else {
                // copy details
                FoundProgramDetails["ActualAvailabilityEndUtc"] =
                  ActualAvailabilityEndUtc;
                FoundProgramDetails["ActualAvailabilityStartUtc"] =
                  ActualAvailabilityStartUtc;
                FoundProgramDetails["ScheduledAvailabilityStartUtc"] =
                  ScheduledAvailabilityStartUtc;
                FoundProgramDetails["SubscriptionItemId"] = Id;
                FoundProgramDetails["SubscriptionGroupId"] = SubscriptionId;
                return FoundProgramDetails;
              }
            })
            ?.filter((item: any) => item)
        ),
      });
    }
    let tvShows = viewableRecordings.filter((item: any, index: any) => {
      if (index < config.defaultFeedItemsCount) {
        return (
          !!item.SeriesId ||
          (item.Definition === Definition.SINGLE_PROGRAM &&
            item.SubscriptionItems[0]?.ProgramDetails?.ShowType ==
              ItemShowType.TVShow)
        );
      }
    });

    let movies = viewableRecordings.filter((item: any, index: any) => {
      if (index < config.defaultFeedItemsCount) {
        return (
          item.Definition === Definition.SINGLE_PROGRAM &&
          item.SubscriptionItems[0]?.ProgramDetails?.ShowType ==
            ItemShowType.Movie
        );
      }
    });
    tvShows = uniqBy(tvShows, (item: any) => {
      return `${item?.Definition}-${item?.SeriesId}`;
    });
    if (tvShows && tvShows.length) {
      let items = {
        LibraryItems: tvShows.map((item: any) => {
          if (item.SeriesDetails || item.SubscriptionItems[0]?.ProgramDetails) {
            return item;
          }
        }),
      };
      feedItems.push({
        feed: { Name: AppStrings?.str_catagory_tvshows },
        items:
          (items?.LibraryItems?.length &&
            massageResult.Dvr(items, ItemShowType.DvrRecording)) ||
          [],
      });
    }
    if (movies && movies.length) {
      let items = {
        LibraryItems: movies.map(({ SubscriptionItems }: any) => {
          if (SubscriptionItems[0]?.ProgramDetails) {
            const [SubscriptionItem = {}] = SubscriptionItems || [];
            const { ProgramDetails, metadataLine2, metadataLine3, ProgramId } =
              SubscriptionItem || {};
            ProgramDetails["ProgramId"] = ProgramId;
            ProgramDetails["metadataLine2"] = metadataLine2;
            ProgramDetails["metadataLine3"] = metadataLine3;
            return ProgramDetails;
          }
        }),
      };
      feedItems.push({
        feed: { Name: AppStrings?.str_catagory_movie },
        items:
          (items?.LibraryItems?.length &&
            massageResult.Movie(items, ItemShowType.DvrMovie)) ||
          [],
      });
    }
    setRecordedList(feedItems);
  };

  const backAction = () => {
    console.log("Capturing hadware back presses on profile screen");
    Alert.alert("Back button pressed");
    return null;
  };
  useEffect(() => {
    processData();
    setTimeout(() => {
      console.log("recordedList", recordedList);
    }, 5000);
    if (channelMap && viewableRecordings) {
      const viewableFilter = buildFilterDataSource(
        GLOBALS.viewableSubscriptions?.SubscriptionGroups,
        DvrMenuItems.Recorded,
        channelMap,
        false
      );
      console.log("viewableFilter inside DVR manager", viewableFilter);
      setViewableFilters(viewableFilter);
    }
    if (channelMap && scheduledRecordings) {
      const scheduledFilter = buildFilterDataSource(
        GLOBALS.scheduledSubscriptions?.SubscriptionGroups,
        DvrMenuItems.Scheduled,
        channelMap,
        false
      );
      console.log("scheduledFilter inside DVR manager", scheduledFilter);

      setScheduledFilters(scheduledFilter);
    }
    TVMenuControl.enableTVMenuKey();
    BackHandler.addEventListener("hardwareBackPress", backAction);
  }, []);
  const handleScheduledItemFocus = (item: any, index: any) => {
    setCurrentScheduledItem(item);
  };
  const renderScheduled = () => {
    return (
      <View style={styles.secondBlock}>
        <FlatList
          snapToInterval={scaledSnapToInterval}
          snapToAlignment={lazyListConfig.snapToAlignment || "start"}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: globalStyles.backgroundColors.shade5,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              />
            );
          }}
          horizontal={lazyListConfig.horizontal || false}
          // ref={setFlatListRef}
          data={scheduledRecordings}
          keyExtractor={(i) => i.Id}
          renderItem={renderScheduledItem}
        />
      </View>
    );
  };
  const renderScheduledItem = (data: any) => {
    const { item, index } = data;
    // const { Description = "" } = item?.CatalogInfo;
    const name = item?.title || item?.SeriesDetails.Title;

    let selectedStyle: any = styles.unSelectedItem;
    let isSelectedEpisode = false;
    if (item.Id === currentScheduledItem?.Id) {
      selectedStyle = styles.selectedItem;
      isSelectedEpisode = true;
    }
    const handleScheduledFocus = () => {
      handleScheduledItemFocus(item, index);
    };

    const statusText = item?.statusText || "";
    // const statusText = item?.statusText || "";
    const imageSource =
      getImageUri(item?.SeriesDetails, "16x9/Poster") ||
      getImageUri(item?.SeriesDetails, "16x9/KeyArt") ||
      AppImages.bgPlaceholder;

    const progressBarStyle: any = getUIdef("ProgressBar")?.style;

    const iconStyle = {
      color:
        item?.dvrItemsState !== RecordStatus.SCHEDULED
          ? globalStyles.auxiliaryColors.statusError
          : globalStyles.backgroundColors.primary1,
    };

    let networkImageSource = item.channelLogoUri;
    if (!networkImageSource && item?.networkInfo) {
      const { networkInfo } = item;
      networkImageSource =
        networkInfo?.tenFootLargeURL ||
        networkInfo?.twoFootLargeURL ||
        networkInfo?.oneFootLargeURL ||
        networkInfo?.tenFootSmallURL ||
        networkInfo?.twoFootSmallURL ||
        networkInfo?.oneFootSmallURL;
    }
    const { udpData: { ChannelInfo: { Schedule = undefined } = {} } = {} } =
      navigationParams;

    if (
      item?.ProgramId === Schedule?.ProgramId &&
      Schedule?.playSource === sourceTypeString.UPCOMING
    ) {
      item["Bookmark"] = undefined;
    }
    console.log(
      "currentScheduledItem?.Id === item?.Id ",
      currentScheduledItem?.Id === item?.Id
    );
    const shouldShowExpiringIcon = isExpiringSoon(item);
    return (
      <View
        style={[styles.dvrItemContainer, selectedStyle]}
        key={`ListItem_${index}`}
        // ref={
        //   index === 0
        //     ? firstEpisodeRef
        //     : index === currentSeasonEpisodes.length - 1
        //     ? lastEpisodeRef
        //     : undefined
        // }
      >
        <Pressable
          onFocus={handleScheduledFocus}
          onPress={() => {}}
          disabled={currentScheduledItem.Id === item?.Id}
          focusable={currentScheduledItem.Id !== item?.Id}
          ref={index === 0 ? firstScheduledCardRef : undefined}
          style={styles.dvrItemShowcard}
        >
          <FastImage
            //@ts-ignore
            source={imageSource}
            style={styles.dvrItemImage}
            fallback
            defaultSource={AppImages.bgPlaceholder}
          />
          <View style={[styles.dvrItemInfo, { flexShrink: 1 }]}>
            <Text style={styles.dvrItemTitle}>{name}</Text>
            <Text style={styles.dvrItemMetadata}>{item.metadata}</Text>
            {/* <Text style={styles.dvrItemDescription} numberOfLines={2}>
                {Description}
              </Text> */}
            {currentScheduledItem.Id === item?.ProgramId && (
              <Text style={styles.statusTextStyle} numberOfLines={2}>
                {statusText}
              </Text>
            )}
          </View>
        </Pressable>

        {/* <View style={styles.buttonContainer}>
            {isSelectedEpisode && (
              <ScrollView
                horizontal
                snapToAlignment={"start"}
                snapToInterval={snapToInterval}
              >
                {ctaList?.length > 0 &&
                  ctaList?.map((cta: any, index: number) => {
                    let fontIconStyle: {
                      [key: string]: any;
                    };
                    if (
                      cta?.buttonAction ===
                      AppStrings?.str_details_program_record_button
                    ) {
                      fontIconStyle = styles.ctaFontIconStyle;
                    }
                    return (
                      <MFButton
                        key={`ctaBtn_${cta.buttonText}_${index}`}
                        ref={
                          index === 0
                            ? firstButtonRef
                            : (buttonRefObject as any)[cta.buttonText]
                        }
                        focusable
                        iconSource={0}
                        hasTVPreferredFocus={index === 0}
                        imageSource={0}
                        avatarSource={undefined}
                        onFocus={() => {
                          setOpen(false);
                          drawerRef.current.close();
                          drawerRef.current.resetRoutes();
                        }}
                        variant={MFButtonVariant.FontIcon}
                        fontIconSource={cta.iconSource}
                        fontIconTextStyle={StyleSheet.flatten([
                          styles.textStyle,
                          {
                            fontSize: 90,
                            color: cta.buttonText?.includes("Record")
                              ? globalStyles.fontColors.badge
                              : "white",
                          },
                        ])}
                        onPress={ctaButtonPress[cta.buttonAction]}
                        textStyle={{
                          color: "#EEEEEE",
                          fontFamily: "Inter-SemiBold",
                          fontSize: 25,
                          fontWeight: "600",
                          textAlign: "center",
                          marginLeft: 21,
                        }}
                        textLabel={cta.buttonText}
                        style={{
                          height: 62,
                          alignSelf: "center",
                          padding: 12,
                          backgroundColor: "#424242",
                          borderRadius: 6,
                          paddingHorizontal: 35,
                          zIndex: 100,
                        }}
                        focusedStyle={styles.focusedUnderLine}
                        fontIconProps={{
                          iconPlacement: "Left",
                          shouldRenderImage: true,
                        }}
                      />
                    );
                  })}
              </ScrollView>
            )}
          </View> */}
      </View>
    );
  };
  const checkEmptyData = (items: any) => {
    if (!items?.length) {
      return false;
    }
    return items.some((item: any) => item?.items?.length !== 0);
  };

  const renderRecorded = () => {
    const isEmpty = !checkEmptyData(recordedList);
    console.log("recordedList", recordedList);
    return !isEmpty ? (
      <FlatList
        data={recordedList}
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
              ref={index === 0 ? firstCardRef : null}
              key={index}
              //@ts-ignore
              feed={item.feed}
              data={item.items}
              limitSwimlaneItemsTo={10}
              swimLaneKey={swimLaneKey}
              updateSwimLaneKey={updateSwimLaneKey}
              cardStyle={"16x9"}
              onPress={(event) => {
                console.log("event", event);
              }}
              onLongPress={() => {
                Alert.alert("card long press working");
              }}
              onFocus={(event) => {
                console.log("onFocus event for card ", event);
                setFocusedCard(event);
                setTimeout(() => {
                  setSwimLaneFocused(true);
                }, 500);
              }}
            />
          );
        }}
      />
    ) : (
      <View style={DVRManagerStyles.noResultContainer}>
        <View>
          <FastImage
            source={AppImages.noResultBackgroundUri}
            style={DVRManagerStyles.imageIcon}
          ></FastImage>
          <View>
            <Text style={DVRManagerStyles.label}>
              {AppStrings?.str_dvr_no_recorded}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const onMenuItemFocus = (id: DvrMenuItems) => {
    setCurrentDvrMenu(id);
    setIsMenuFocused(true);
    if (id === DvrMenuItems.Recorded) {
      setFilterData(viewableFilters);
    } else {
      setFilterData(scheduledFilters);
    }
  };
  const setFocusedState = (comp: SubViews) => {
    if (comp === focussedComponent) {
      // avoid unnecessary state update
      return;
    }
    if (
      comp === SubViews.Filter &&
      focussedComponent !== SubViews.RecordingResults
    ) {
      setFocussedComponent(comp);
    }
    if (comp !== SubViews.Filter) {
      setFocussedComponent(comp);
    }
  };
  const _moveRight = () => {
    offset.value = withTiming(420, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  };
  const _moveLeft = () => {
    offset.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  };
  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: offset.value,
      opacity: opacity.value,
    };
  });
  const onFocusBar = () => {
    console.log("bar focussed");
    if (!isMenuFocused) {
      menuRef[currentDvrMenu].current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
    } else {
      setIsMenuFocused(false);
      filterRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    }
  };
  const onFocusSideBar = () => {
    if (!swimLaneFocused && currentDvrMenu === DvrMenuItems.Recorded) {
      _moveLeft();
      console.log("firstCardRef.current", firstCardRef.current);
      firstCardRef.current?.first.setNativeProps({ hasTVPreferredFocus: true });
      setSwimLaneFocused(true);
      setIsMenuFocused(false);
    } else if (!swimLaneFocused && currentDvrMenu === DvrMenuItems.Scheduled) {
      _moveLeft();
      console.log("firstCardRef.current", firstCardRef.current);
      firstScheduledCardRef.current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
      setSwimLaneFocused(true);
      setIsMenuFocused(false);
    } else {
      _moveRight();
      setSwimLaneFocused(false);
      setIsMenuFocused(true);
      menuRef[currentDvrMenu].current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
    }
  };

  const toggleMenu = () => {
    console.log("Pressed on the browse filter", openFilterMenu);
    setOpenFilterMenu(!openFilterMenu);
  };
  const closeModal = () => {
    console.log("close modal called on dvr manager");
    setOpenSidePannel(false);
    drawerRef.current.close();
  };

  const handleFilterClear = () => {
    // setDataSource([]);
    setFilterState(null);
    setViewableFilters(viewableFilters);
    // setCurrentFeed(undefined);
    // const firstFilter = createInitialFilterState(
    //   pivotQuery?.data?.data,
    //   baseValues
    // );
    // setFilterState(firstFilter);
    // setBrowsePivots(browseFeed.pivots);
    // setLastPageReached(false);
    // setCurrentPage(0);
  };
  const renderDvrSideMenu = () => {
    return dvrMenuItems.map((dvr: { Id: any; Name?: any }, index: number) => {
      const { Name, Id } = dvr;
      const onMenuFocus = () => {
        onMenuItemFocus(dvr.Id);
      };
      const textStyle =
        currentDvrMenu === dvr?.Id && isMenuFocused
          ? {
              ...DVRManagerStyles.dvrTextSelected,
              fontSize: 38,
              fontWeight: "bold",
              letterSpacing: 0,
              lineHeight: 55,
            }
          : {
              ...DVRManagerStyles.dvrText,
              fontSize: 31,
              letterSpacing: 0,
              lineHeight: 50,
            };
      const menuStyle =
        currentDvrMenu === dvr?.Id && isMenuFocused && !swimLaneFocused
          ? styles.menuStyle
          : { ...styles.menuStyle, borderBottomColor: "transparent" };
      return (
        <View style={DVRManagerStyles.dvrBlock} key={`DvrItem_${index}`}>
          <Pressable
            focusable={!swimLaneFocused}
            isTVSelectable={!swimLaneFocused}
            ref={menuRef[dvr.Id]}
            hasTVPreferredFocus={index === 0}
            onFocus={() => {
              onMenuFocus();
              if (!index) {
                setFocusedState(SubViews.Menu);
              }
            }}
            style={menuStyle}
          >
            <Text style={textStyle}>{Name}</Text>
          </Pressable>
        </View>
      );
    });
  };
  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={AppImages.landing_background}
        style={DVRManagerStyles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={DVRManagerStyles.backgroundPosterStyle}>
          <View
            style={[
              DVRManagerStyles.container,
              { width: "100%", height: "100%" },
            ]}
          >
            <View style={styles.header}>
              <View style={DVRManagerStyles.titlePadding}>
                <Text style={DVRManagerStyles.title}>
                  {AppStrings.str_dvr_manager}
                </Text>
              </View>
              <View style={DVRManagerStyles.filterViewStyle}>
                <MFButton
                  ref={filterRef}
                  hasTVPreferredFocus={false}
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
                      hoverColor:
                        appUIDefinition.theme.backgroundColors.primary1,
                      elevation: 5,
                    },
                  }}
                />
              </View>
              <Pressable
                style={DVRManagerStyles.headerUnderLine}
                onFocus={onFocusBar}
              />
            </View>
            <View style={DVRManagerStyles.dvrMain}>
              <Animated.View
                style={[
                  DVRManagerStyles.dvrView,
                  {
                    ...animatedStyles,
                    marginLeft: 50,
                    flexDirection: "row",
                    height: "100%",
                    marginTop: 50,
                  },
                ]}
              >
                {/* <View style={[DVRManagerStyles.flexOne]}> */}
                {renderDvrSideMenu()}
                {/* </View> */}
              </Animated.View>
              <Pressable
                onFocus={onFocusSideBar}
                style={{ height: "100%", width: 20 }}
              />
              <View style={{ width: "100%", height: height, paddingBottom: 200 }}>
                {currentDvrMenu === DvrMenuItems.Recorded
                  ? renderRecorded()
                  : renderScheduled()}
              </View>
            </View>
          </View>
          {!openSidePannel && (
            <BrowseFilter
              //@ts-ignore
              open={openFilterMenu}
              filterData={filterData}
              subMenuOpen={true}
              filterState={filterState}
              setOpenSubMenu={() => {}}
              setOpenMenu={setOpenFilterMenu}
              handleOnPress={handleFilterChange}
              handleFilterClear={handleFilterClear}
              defaultFilterState={defaultFilterState}
            />
          )}
          <SidePanel
            ref={drawerRef}
            drawerPercentage={37}
            animationTime={200}
            overlay={false}
            opacity={1}
            open={openSidePannel}
            animatedWidth={width * 0.37}
            // openPage="MoreInfo"
            closeOnPressBack={false}
            navigation={props.navigation}
            drawerContent={focusedCard}
            // route={route}
            closeModal={closeModal}
            // screenProps={screenProps} // moreInfoProps={}
          />
        </View>
      </ImageBackground>
    </PageContainer>
  );
};

const DVRManagerStyles: any = StyleSheet.create(
  getUIdef("DvrManager")?.style ||
    scaleAttributes({
      container: {
        paddingTop: 40,
      },
      dvrMain: {
        display: "flex",
        flexDirection: "row",
      },
      dvrView: {
        width: 420,
        height: "100%",
      },
      dvrScrollView: {
        paddingLeft: 90,
      },
      dvrresultsView: {
        width: 1920,
        height: 950,
        marginLeft: 40,
        marginTop: 20,
      },
      dvrScheduleViewStyle: {
        alignItems: "flex-start",
        width: 1920,
        height: 950,
      },
      noResultsView: {
        width: 1460,
        height: 950,
        marginTop: 20,
        marginLeft: 10,
        paddingBottom: 30,
      },
      manageButton: {
        height: 70,
        width: 300,
        backgroundColor: globalStyles.backgroundColors.shade3,
        marginTop: 55,
        textAlign: "center",
      },
      headerUnderLine: {
        width: 1920,
        opacity: 0.4,
        height: 1,
        borderWidth: 0.4,
        borderColor: globalStyles.backgroundColors.shade5,
        backgroundColor: globalStyles.backgroundColors.shade5,
        alignSelf: "center",
        marginTop: 30,
      },
      titlePadding: {
        paddingLeft: 88,
        paddingBottom: 20,
      },
      flexOne: {
        flex: 1,
      },
      title: {
        color: globalStyles.fontColors.light,
        fontSize: globalStyles.fontSizes.subTitle1,
        fontFamily: globalStyles.fontFamily.semiBold,
      },
      filterViewStyle: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        top: 0,
        right: 0,
        alignContent: "flex-end",
        zIndex: 1000,
      },
      dvrText: {
        fontFamily: globalStyles.fontFamily.regular,
        color: globalStyles.fontColors.darkGrey,
      },
      dvrTextSelected: {
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.light,
      },
      backgroundPosterStyle: {
        backgroundColor: globalStyles.backgroundColors.shade1,
        opacity: 0.9,
      },
      dvrBlock: {
        height: 62,
        width: 300,
        marginTop: 40,
      },
      dvrResultDetails: {
        marginTop: 30,
      },
      dvrCloudSpace: {
        fontFamily: globalStyles.fontFamily.regular,
        color: globalStyles.fontColors.darkGrey,
        fontSize: globalStyles.fontSizes.caption1,
        marginTop: 410,
      },
      recorded: {
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.lightGrey,
        fontSize: globalStyles.fontSizes.body2,
      },
      dvrSpace: {
        marginTop: 20,
        flexDirection: "row",
      },
      metadataSeparator: {
        marginLeft: 30,
      },
      progressBarContainer: {
        height: 6,
        width: 300,
        borderRadius: 9,
        marginTop: 20,
      },
      buttonContainerStyle: {
        height: 66,
        width: 180,
        marginTop: 30,
      },
      focusedUnderLine: {
        backgroundColor: globalStyles.backgroundColors.primary1,
      },
    })
);
const styles = StyleSheet.create({
  header: {
    width: "100%",
  },
  filterButtonBackgroundStyles: {
    width: 175,
    height: 62,
    backgroundColor: "#424242",
    borderRadius: 6,
    // marginTop: 40,
    marginRight: 100,
  },
  filterButtonFocusedStyle: {
    backgroundColor: appUIDefinition.theme.backgroundColors.primary1,
  },
  filterButtonContainerStyle: {
    flex: 0.23,
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
  menuStyle: {
    height: 59,
    width: 200,
    borderBottomWidth: 5,
    borderBottomColor: "#053C69",
  },
  dvrItemContainer: {
    padding: 10,
    // marginBottom: 20,
    borderRadius: 4,
  },
  selectedItem: {
    backgroundColor: globalStyles.backgroundColors.shade2,
  },
  unSelectedItem: {
    opacity: 0.8,
  },
  dvrItemImage: {
    height: 237,
    width: 419,
  },
  dvrItemShowcard: {
    flexDirection: "row",
  },
  dvrItemCTA: {
    marginLeft: 25,
  },
  dvrItemInfo: {
    height: 237,
    justifyContent: "center",
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25,
  },
  dvrItemTitle: {
    fontFamily: globalStyles.fontFamily.bold,
    color: globalStyles.fontColors.light,
    fontSize: 31,
    lineHeight: 50,
  },
  dvrItemMetadata: {
    fontFamily: globalStyles.fontFamily.semiBold,
    color: globalStyles.fontColors.lightGrey,
    fontSize: 25,
    lineHeight: 38,
  },
  dvrItemDescription: {
    fontFamily: globalStyles.fontFamily.regular,
    color: globalStyles.fontColors.darkGrey,
    fontSize: 25,
    lineHeight: 38,
  },
  imageContainer: {
    borderRadius: 4,
    overflow: "hidden",
    height: 237,
  },
  statusTextStyle: {
    color: globalStyles.fontColors.statusWarning,
    fontFamily: globalStyles.fontFamily.regular,
    fontSize: globalStyles.fontSizes.body2,
  },
  secondBlock: {
    flex: 1,
  },
  imageIcon: {
    marginTop: 130,
    height: 400,
    width: 600,
    resizeMode: "contain",
    marginLeft: 220,
  },
});

export default DVRManagerScreen;