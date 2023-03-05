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
import { massageDVRFeed } from "../../../utils/assetUtils";
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

  const offset = useSharedValue(420);
  const opacity = useSharedValue(1);
  const firstCardRef = useRef<TouchableOpacity>(null);
  const updateSwimLaneKey = (key: string) => {
    setSwimLaneKey(key);
  };
  const filterRef = useRef<PressableProps>(null);
  const menuRef = dvrMenuItems.map(() => {
    return useRef<PressableProps>(null);
  });

  const processData = (data: any[]) => {
    const newData: any[] = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].SubscriptionItems.length; j++) {
        let obj: any = {};
        if (_.isEmpty(obj)) {
          obj[data[i].SubscriptionItems[j].ProgramDetails.ShowType] = [
            data[i].SubscriptionItems[j],
          ];
        } else {
          obj[data[i].SubscriptionItems[j].ProgramDetails.ShowType] = obj[
            data[i].SubscriptionItems[j].ProgramDetails.ShowType
          ].push(data[i].SubscriptionItems[j]);
        }
      }
    }
    // data.forEach((item, index)=>{
    //   item.SubscriptionItems[0].ProgramDetails.ShowType
    // })
    setDataToRender(newData);
  };
  useEffect(() => {
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
  }, []);
  const renderScheduled = () => {
    return <View></View>;
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
              onLongPress={()=>{Alert.alert('card long press working')}}
              onFocus={() => {
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
    // Animated.timing(scheduleViewAnimation, {
    //   toValue: { x: getScaledValue(230), y: 0 },
    //   useNativeDriver: true,
    //   duration: 300,
    // }).start();
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
    // Animated.timing(scheduleViewAnimation, {
    //   toValue: { x: getScaledValue(0), y: 0 },
    //   useNativeDriver: true,
    //   duration: 300,
    // }).start();
  };
  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: offset.value,
      opacity: opacity.value,
    };
  });
  // const handledOnScroll = ({ nativeEvent }: any) => {
  //   if (nativeEvent.contentOffset.x > 10 && nativeEvent.contentOffset.x < 50) {
  //     _moveLeft();
  //   } else if (
  //     nativeEvent.contentOffset.x > 50 &&
  //     nativeEvent.contentOffset.x < 100
  //   ) {
  //     _moveRight();
  //   }
  // };
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
    // props.navigation.navigate(Routes.BrowseFilters,{
    //   open:openMenu,
    //       filterData: pivotQuery?.data?.data,
    //       subMenuOpen: openSubMenu,
    //       filterState: filterState,
    //       setOpenSubMenu: () => {},
    //       setOpenMenu: setOpenMenu,
    //       handleOnPress: handleFilterChange,
    //       handleFilterClear: handleFilterClear,
    //       defaultFilterState: defaultFilterState,
    // })
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
                style={{ height: "100%", width: 20, backgroundColor: "red" }}
              />
              <View style={{ width: "100%", height: "100%" }}>
                {currentDvrMenu === DvrMenuItems.Recorded
                  ? renderRecorded()
                  : renderScheduled()}
              </View>
            </View>
          </View>
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
});
export default DVRManagerScreen;
