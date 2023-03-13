import {
  View,
  Text,
  ImageBackground,
  ScrollView,
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
import { buildFilterDataSource } from "../../../utils/DVRUtils";
import { isExpiringSoon, massageDVRFeed } from "../../../utils/assetUtils";
import MFSwimLane from "../../../components/MFSwimLane";
import { Routes } from "../../../config/navigation/RouterOutlet";
import _ from "lodash";
import { SourceType } from "../../../utils/common";
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
  RecordStatus,
  sourceTypeString,
} from "../../../utils/analytics/consts";
import FastImage from "react-native-fast-image";

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
  const channelMap = GLOBALS.channelMap;
  const [viewableFilters, setViewableFilters] = useState();
  const [scheduledFilters, setScheduledFilters] = useState();
  const [dataToRender, setDataToRender] = useState<any[]>(viewableRecordings);
  const [swimLaneKey, setSwimLaneKey] = useState("");
  const [swimLaneFocused, setSwimLaneFocused] = useState(false);
  const [filterState, setFilterState] = useState<any>(null);
  const [filterData, setFilterData] = useState<any>([]);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [defaultFilterState, setDefaultFilterState] = useState<any>([]);
  const [openSidePannel, setOpenSidePannel] = useState(false);
  const [focusedCard, setFocusedCard] = useState<any>(null);
  const [currentScheduledItem, setCurrentScheduledItem] = useState<any>({
    id: undefined,
  });
  const navigationParams = props.route.params;
  const lazyListConfig: any = getUIdef("EpisodeList.LazyListWrapper")?.config;
  const scaledSnapToInterval = getScaledValue(lazyListConfig.snapToInterval);
  const offset = useSharedValue(420);
  const opacity = useSharedValue(1);
  const firstCardRef = useRef<TouchableOpacity>(null);
  const firstScheduledCardRef = useRef<TouchableOpacity>(null);
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  const filterRef = useRef<PressableProps>(null);
  const menuRef = dvrMenuItems.map(() => {
    return useRef<PressableProps>(null);
  });
  const drawerRef: React.MutableRefObject<any> = useRef();

  const myTVEventHandler = (evt: any) => {
    // evt.eventType === "longSelect"
    //   ? console.log(
    //       "evt.eventType",
    //       evt,
    //       "openSidePannel",
    //       openSidePannel,
    //       "isMenuFocused",
    //       isMenuFocused,
    //       "swimLaneFocused",
    //       swimLaneFocused
    //     )
    //   : null;
    if (
      evt.eventType === "longSelect" &&
      !isMenuFocused &&
      swimLaneFocused &&
      !openSidePannel
    ) {
      // console.log(
      //   "Drawer is opening as long pressed",
      //   "openSidePannel",
      //   openSidePannel,
      //   "isMenuFocused",
      //   isMenuFocused,
      //   "swimLaneFocused",
      //   swimLaneFocused
      // ); // Alert.alert("Long pressed called ");
      setOpenSidePannel(true);
      drawerRef?.current?.open();
    }
  };
  useTVEventHandler(myTVEventHandler);
  const processData = (data: any[]) => {
    const newData: any[] = [];
    for (let i = 0; i < data.length; i++) {
      let obj: any = {};
      obj[data[i].SubscriptionItems[0].ProgramDetails.ShowType] = [data[i]];
      // if()
      // for (let j = 0; j < data[i].SubscriptionItems.length; j++) {
      //   let obj: any = {};
      //   console.log('objects inside l1', obj, _.isEmpty(obj))
      //   if (_.isEmpty(obj)) {
      // obj[data[i].SubscriptionItems[j].ProgramDetails.ShowType] = [
      //   data[i].SubscriptionItems[j],
      // ];
      //   } else {
      //     obj[data[i].SubscriptionItems[j].ProgramDetails.ShowType] = obj[
      //       data[i].SubscriptionItems[j].ProgramDetails.ShowType
      //     ].push(data[i].SubscriptionItems[j]);
      //   }
      // }
    }
    // data.forEach((item, index)=>{
    //   item.SubscriptionItems[0].ProgramDetails.ShowType
    // })
    console.log("setDataToRender", newData);
    // setDataToRender(newData);
  };
  const backAction = () => {
    console.log("Capturing hadware back presses on profile screen");
    Alert.alert("Back button pressed");
    return null;
  };
  useEffect(() => {
    console.log("scheduledRecordings", scheduledRecordings);
    processData(viewableRecordings);
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
  const handleScheduledItemFocus = (episode: any, index: any) => {};
  const renderScheduled = () => {
    return (
      <View style={styles.secondBlock}>
        <FlatList
          snapToInterval={scaledSnapToInterval}
          snapToAlignment={lazyListConfig.snapToAlignment || "start"}
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
    console.log("data inside scheduled item", data);
    const { item, index } = data;
    // const { Description = "" } = item?.CatalogInfo;
    const name = item?.title || item?.SeriesDetails.Title;

    let selectedStyle: any = styles.unSelectedEpisode;
    let isSelectedEpisode = false;
    if (item.ProgramId === currentScheduledItem?.ProgramId) {
      selectedStyle = styles.selectedEpisode;
      isSelectedEpisode = true;
    }
    const handleEpisodeFocus = () => {
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
    const shouldShowExpiringIcon = isExpiringSoon(item);
    return (
      <View
        style={[styles.episodeItemContainer, selectedStyle]}
        key={`ListItem_${index}`}
        // ref={
        //   index === 0
        //     ? firstEpisodeRef
        //     : index === currentSeasonEpisodes.length - 1
        //     ? lastEpisodeRef
        //     : undefined
        // }
      >
        {currentScheduledItem && currentScheduledItem?.Id === item?.Id ? (
          // ctaList &&
          // ctaList?.length
          <View
            // ref={index === 0 ? firstEpisodeRef : undefined}
            style={styles.episodeItemShowcard}
          >
            <FastImage
              //@ts-ignore
              source={imageSource}
              style={styles.episodeItemImage}
              fallback
              defaultSource={AppImages.bgPlaceholder}
            />
            <View style={[styles.episodeItemInfo, { flexShrink: 1 }]}>
              <Text style={styles.episodeItemTitle}>{name}</Text>
              <Text style={styles.episodeItemMetadata}>
                {item.metadataLine2}
              </Text>
              {/* <Text style={styles.episodeItemDescription} numberOfLines={2}>
                {Description}
              </Text> */}
              {item?.Id === item?.Id && (
                <Text style={styles.statusTextStyle} numberOfLines={2}>
                  {statusText}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Pressable
            onFocus={handleEpisodeFocus}
            onPress={() => {}}
            disabled={currentScheduledItem.Id === item?.Id}
            focusable={currentScheduledItem.Id !== item?.Id}
            // ref={index === 0 ? firstEpisodeRef : undefined}
            style={styles.episodeItemShowcard}
          >
            <FastImage
              //@ts-ignore
              source={imageSource}
              style={styles.episodeItemImage}
              fallback
              defaultSource={AppImages.bgPlaceholder}
            />
            <View style={[styles.episodeItemInfo, { flexShrink: 1 }]}>
              <Text style={styles.episodeItemTitle}>{name}</Text>
              <Text style={styles.episodeItemMetadata}>{item.metadata}</Text>
              {/* <Text style={styles.episodeItemDescription} numberOfLines={2}>
                {Description}
              </Text> */}
              {currentScheduledItem.Id === item?.ProgramId && (
                <Text style={styles.statusTextStyle} numberOfLines={2}>
                  {statusText}
                </Text>
              )}
            </View>
          </Pressable>
        )}
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

  const renderRecorded = () => {
    return (
      <FlatList
        data={Array(1).fill(0)}
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
              feed={{ Name: "All Recordings" }}
              data={viewableRecordings}
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
    // refreshFeedsByPivots();
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
              <View style={{ width: "100%", height: "100%" }}>
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
  episodeItemContainer: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  selectedEpisode: {
    backgroundColor: globalStyles.backgroundColors.shade2,
  },
  unSelectedEpisode: {
    opacity: 0.8,
  },
  episodeItemImage: {
    height: 237,
    width: 419,
  },
  episodeItemShowcard: {
    flexDirection: "row",
  },
  episodeItemCTA: {
    marginLeft: 25,
  },
  episodeItemInfo: {
    height: 237,
    justifyContent: "center",
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25,
  },
  episodeItemTitle: {
    fontFamily: globalStyles.fontFamily.bold,
    color: globalStyles.fontColors.light,
    fontSize: 31,
    lineHeight: 50,
  },
  episodeItemMetadata: {
    fontFamily: globalStyles.fontFamily.semiBold,
    color: globalStyles.fontColors.lightGrey,
    fontSize: 25,
    lineHeight: 38,
  },
  episodeItemDescription: {
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
});
export default DVRManagerScreen;
