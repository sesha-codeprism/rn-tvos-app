import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  DeviceEventEmitter,
  Image,
  ImageBackground,
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
  massageDiscoveryFeedAsset,
  massageProgramDataForUDP,
  massageSeriesDataForUDP,
  removeTrailingSlash,
} from "../../../../utils/assetUtils";
import LinearGradient from "react-native-linear-gradient";
import { getUIdef } from "../../../../utils/uidefinition";
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
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { browseType, ShowType } from "../../../../utils/common";
import { metadataSeparator } from "../../../../utils/Subscriber.utils";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { debounce2 } from "../../../../utils/app/app.utilities";
import _ from "lodash";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import {
  isAdultContentBlock,
  isPconBlocked,
} from "../../../../utils/pconControls";
import { fontIconsObject, PinType } from "../../../../utils/analytics/consts";
import { getItemId } from "../../../../utils/dataUtils";
import {
  assetTypeObject,
  ContentType,
} from "../../../../utils/analytics/consts";
import { isFeatureAssigned } from "../../../../utils/helpers";
import { invalidateQueryBasedOnSpecificKeys } from "../../../../config/queries";
interface GalleryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const GalleryScreen: React.FunctionComponent<GalleryScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;
  const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
  const [currentFocusedFeed, setCurrentFocusedFeed] =
    useState<SubscriberFeed>();
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [filterState, setFilterState] = useState<any>(null);
  const [defaultFilterState, setDefaultFilterState] = useState<any>(null);
  const browsePageConfig: any = getUIdef("BrowseGallery")?.config;
  const baseValues = getBaseValues(feed, browsePageConfig);
  const browseFeed = getBrowseFeed(feed, baseValues, {}, 0, browsePageConfig);
  const [browsePivots, setBrowsePivots] = useState(browseFeed.pivots);
  const [filterFocused, setFilterFocused] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);
  const [dataSource, setDataSource] = useState(Array<any>());
  const [playActionsData, setplayActionsData] = useState<any>(undefined);
  const [discoverySchedulesData, setdiscoverySchedulesData] =
    useState<any>(undefined);
  const [discoveryProgramData, setdiscoveryProgramData] =
    useState<any>(undefined);
  const [subscriberData, setsubscriberData] = useState<any>(undefined);
  // Get the desired length per page from the config params(top value).
  const lengthPerPage = browseFeed.$top;

  const [page, setCurrentPage] = useState(0);
  const isSearch = feed.NavigationTargetUri === "browsesearch";
  const barRef = useRef<TouchableOpacity>(null);
  const filterRef = useRef<PressableProps>(null);
  const cardRef = useRef<PressableProps>(null);
  GLOBALS.selectedFeed = browseFeed;
  const pivotsParam = "pivots=true";
  let pivotURL = `${removeTrailingSlash(browseFeed.Uri)}/${pivotsParam}`;
  let browseFeedUri = `${browseFeed.Uri}?$top=${browseFeed.$top}`;
  if (browseFeed.Id) {
    pivotURL = `${pivotURL}?Id=${browseFeed?.Id}`;
    browseFeedUri = `${browseFeed.Uri}?Id=${browseFeed?.Id}&$top=${browseFeed.$top}`;
  } else if (browseFeed?.StationId) {
    browseFeedUri = `${browseFeed.Uri}?Id=${browseFeed?.StationId}&$top=${browseFeed.$top}`;
  }
  console.log("Pivot url", pivotURL, browseFeedUri, browseFeed);
  // UNSTABLE_usePreventRemove(openMenu, (data) => {
  //   setOpenSubMenu(false);
  //   setOpenMenu(false);
  // });
  const getDataForSearch = (data: any) => {
    const feedName = feed.Name.split(" ").join("");
    console.log("data coming to search filter", data, feedName);
    const filteredData = data.find((item: any, index: any) =>
      item.hasOwnProperty(feedName)
    );
    return filteredData[feedName];
  };
  //@ts-ignore
  const fetchFeeds = async ({ queryKey }: any) => {
    const [key, requestPivots, page] = queryKey;
    try {
      const $top = browseFeed.$top;
      const skip = $top * page;
      let finalUri = "";
      const searchParams = `&partialName=${
        feed.SearchString
      }&$top=${$top}&searchLive=${false}&$lang=${
        GLOBALS.store!.onScreenLanguage?.languageCode || lang || "en-US"
      }`;
      const uri = `${browseFeedUri}&$skip=${skip}&storeId=${
        DefaultStore.Id
      }&$groups=${GLOBALS.store!.rightsGroupIds}`;
      if (isSearch) {
        finalUri = uri + searchParams;
      } else if (browsePivots) {
        finalUri = uri.concat(`&pivots=${requestPivots}`);
      } else {
        finalUri = uri;
      }
      const data = await getDataFromUDL(finalUri);
      console.log("isSearch", isSearch, finalUri, data);
      if (data) {
        /** we have data from backend, so use the data and setState */
        isSearch ? (data["data"] = getDataForSearch(data.data)) : null;
        const massagedData = getMassagedData(uri, data);
        console.log("massagedData in get feeds", massagedData);
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
      const newArray = isSearch ? dataSet : dataArray.concat(dataSet);
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

  const { data, isLoading, isIdle, isFetched } = useQuery(
    [`browseFeed-${browseFeedUri}`, browsePivots, page],
    fetchFeeds,
    isSearch
      ? { refetchOnMount: "always", ...defaultQueryOptions }
      : defaultQueryOptions
  );

  const handleEndReached = debounce2(() => {
    if (!lastPageReached) {
      setCurrentPage(page + 1);
    }
  }, 500);

  const pivotQuery = useQuery(
    "pivots",
    async () => {
      const pivots = await getDataFromUDL(pivotURL);
      if (pivots.status > 200 && pivots.status < 300) {
        const firstFilter = createInitialFilterState(pivots.data, baseValues);
        setFilterState(firstFilter);
        return pivots;
      }
    },
    {
      cacheTime: appUIDefinition.config.queryCacheTime,
    }
  );
  const isSeries = (assetData: any) =>
    assetData.assetType.contentType === ContentType.SERIES ||
    assetData.assetType.contentType === ContentType.EPISODE;

  const isProgramOrGeneric = (assetData: any) =>
    assetData.assetType.contentType === ContentType.PROGRAM ||
    assetData.assetType.contentType === ContentType.GENERIC;

  const getPlayActions = async (assetData: any) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = isSeries(assetData)
      ? assetData?.Schedule?.ProgramId || assetData?.ProgramId || assetData?.Id
      : assetData?.Id || assetData?.ProgramId;
    const params = `?catchup=true&storeId=${DefaultStore.Id}&groups=${
      GLOBALS.store!.rightsGroupIds
    }&id=${id}`;
    const udlParam = "udl://subscriber/programplayactions/" + params;
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getDiscoverySchedules = async (assetData: any) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }

    let udlParam: string = "";
    const id = getItemId(assetData);
    const params = `?$top=${browseFeed.$top}&$skip=${
      browseFeed.$skip
    }&storeId=${DefaultStore.Id}&$groups=${
      GLOBALS.store!.rightsGroupIds
    }&pivots=${browseFeed.pivots}&id=${id}&itemType=${
      assetData.ItemType
    }&lang=${GLOBALS.store!.onScreenLanguage.languageCode}`;
    if (isSeries(assetData)) {
      udlParam = "udl://discovery/seriesSchedules/" + params;
    } else if (isProgramOrGeneric(assetData)) {
      udlParam = "udl://discovery/programSchedules/" + params;
    }
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getDiscoveryProgramData = async (assetData: any) => {
    let udlParam: string = "";
    const id = getItemId(assetData);
    const params = `?storeId=${DefaultStore.Id}&$groups=${
      GLOBALS.store!.rightsGroupIds
    }&pivots=${assetData.pivots}&id=${id}&lang=${
      GLOBALS?.store?.onScreenLanguage.languageCode
    }`;
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    if (isSeries(assetData)) {
      udlParam = "udl://discovery/series/" + params;
    } else if (isProgramOrGeneric(assetData)) {
      udlParam = "udl://discovery/programs/" + params;
    }
    const data = await getDataFromUDL(udlParam);
    const massagedData = massageDiscoveryFeedAsset(
      data.data,
      assetTypeObject[assetData.contentTypeEnum]
    );
    return massagedData;
  };

  const getProgramSubscriberData = async (assetData: any) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    let udlParam: string = "";
    const id = getItemId(assetData);
    const params = `?storeId=${DefaultStore.Id}&id=${id}`;
    if (isSeries(assetData)) {
      udlParam = "udl://subscriber/getSeriesSubscriberData/" + params;
    } else if (isProgramOrGeneric(assetData)) {
      udlParam = "udl://subscriber/getProgramSubscriberData/" + params;
    }
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const playActionsQuery = useQuery(
    ["get-playActions", currentFeed?.Id],
    () => getPlayActions(currentFeed),
    {
      cacheTime: 60000,
      staleTime: 60000,
    }
  );

  const {
    data: discoverySchedulesQueryData,
    isLoading: isLoadingDiscoverySchedulesQueryData,
    isFetching: isFetchingDiscoverySchedulesQueryData,
  } = useQuery(
    ["get-discoveryschedules", currentFeed?.Id],
    () => getDiscoverySchedules(currentFeed),
    { ...defaultQueryOptions }
  );

  const {
    data: discoveryProgramQueryData,
    isLoading: isLoadingDiscoveryProgramQueryData,
    isFetching: isFetchingDiscoveryProgramQueryData,
  } = useQuery(
    ["get-program-data", currentFeed?.Id],
    () => getDiscoveryProgramData(currentFeed),
    {
      ...defaultQueryOptions,
    }
  );

  const {
    data: subscriberDataQuery,
    isLoading: isLoadingsubscriberDataQuery,
    isFetching: isFetchingsubscriberDataQuery,
  } = useQuery(
    ["get-subscriber-data", currentFeed?.Id],
    () => getProgramSubscriberData(currentFeed),
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  // const backAction: any = ()=>{
  //   console.log("currentFeed",currentFeed,dataSource)
  // if(currentFeed?.Id === dataSource[0].Id){
  //   props.navigation.goBack()
  // } else {
  //   cardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
  // }
  // }
  useEffect(() => {
    return () => {
      GLOBALS.selectedFeed = undefined;
      isSearch
        ? invalidateQueryBasedOnSpecificKeys(`browseFeed`, browseFeedUri)
        : null;
    };
  }, []);
  useEffect(() => {
    console.log("pivotQuery?.data?.data", pivotQuery?.data?.data);
    if (!pivotQuery.data) {
      cardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    }
    console.log("Data in side gallery inside useeffect", data);
    if (data && isFetched) {
      const firstFilter = createInitialFilterState(
        pivotQuery?.data?.data,
        baseValues
      );
      setDefaultFilterState(firstFilter);
      return filterData(data);
    }
    // TVMenuControl.enableTVMenuKey();
    // // props.navigation.addListener('beforeRemove',backAction);
    // BackHandler.addEventListener("hardwareBackPress", backAction);
  }, [data]);

  useEffect(() => {
    if (
      playActionsQuery.data &&
      !playActionsQuery.isFetching &&
      !playActionsQuery.isStale &&
      playActionsQuery.isFetched &&
      playActionsData !== playActionsQuery.data
    ) {
      setplayActionsData(playActionsQuery.data);
    }
  }, [
    playActionsQuery.data,
    playActionsQuery.isFetching,
    playActionsQuery.isStale,
    playActionsQuery.isFetched,
  ]);

  useEffect(() => {
    if (
      discoverySchedulesQueryData &&
      !isFetchingDiscoverySchedulesQueryData &&
      discoverySchedulesData !== discoverySchedulesQueryData
    ) {
      setdiscoverySchedulesData(discoverySchedulesQueryData);
    }
  }, [discoverySchedulesQueryData, isFetchingDiscoverySchedulesQueryData]);

  useEffect(() => {
    if (
      discoveryProgramQueryData &&
      !isFetchingDiscoveryProgramQueryData &&
      discoveryProgramData !== discoveryProgramQueryData
    ) {
      setdiscoveryProgramData(discoveryProgramQueryData);
    }
  }, [discoveryProgramQueryData, isFetchingDiscoveryProgramQueryData]);

  useEffect(() => {
    if (
      subscriberDataQuery &&
      !isFetchingsubscriberDataQuery &&
      subscriberData !== subscriberDataQuery
    ) {
      setsubscriberData(subscriberDataQuery);
    }
  }, [subscriberDataQuery, isFetchingsubscriberDataQuery]);

  useEffect(() => {
    if (currentFeed && subscriberData && playActionsData) {
      if (
        currentFeed?.assetType?.contentType === ContentType.PROGRAM ||
        currentFeed?.assetType?.contentType === ContentType.GENERIC ||
        currentFeed?.assetType?.contentType === ContentType.EPISODE
      ) {
        setCurrentFocusedFeed(
          massageProgramDataForUDP(
            playActionsData,
            currentFeed,
            discoveryProgramData,
            GLOBALS.channelMap,
            discoverySchedulesData,
            GLOBALS.currentSlots,
            GLOBALS.allSubcriptionGroups,
            GLOBALS.userAccountInfo,
            subscriberData,
            undefined,
            GLOBALS.viewableSubscriptions,
            GLOBALS.scheduledSubscriptions,
            GLOBALS.recorders,
            GLOBALS.networkIHD,
            undefined,
            undefined,
            undefined,
            undefined,
            GLOBALS.channelRights,
            undefined,
            undefined,
            isFeatureAssigned("IOSCarrierBilling")
          )
        );
      } else {
        setCurrentFocusedFeed(
          massageSeriesDataForUDP(
            subscriberData,
            discoveryProgramData,
            discoverySchedulesData,
            GLOBALS.channelMap,
            currentFeed,
            GLOBALS.currentSlots,
            GLOBALS.allSubcriptionGroups,
            GLOBALS.viewableSubscriptions,
            GLOBALS.scheduledSubscriptions,
            GLOBALS.userAccountInfo,
            GLOBALS.recorders,
            playActionsData,
            GLOBALS.networkIHD,
            undefined,
            undefined,
            GLOBALS.channelRights,
            undefined,
            undefined,
            isFeatureAssigned("IOSCarrierBilling")
          )
        );
      }
    }
  }, [currentFeed, subscriberData, playActionsData]);

  const handleFilterClear = () => {
    setDataSource([]);
    setFilterState(null);
    setCurrentFeed(undefined);
    const firstFilter = createInitialFilterState(
      pivotQuery?.data?.data,
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
      <View style={styles.contentRatingsContainer}>
        {first ? (
          <View style={styles.ratingBlock}>
            <Image
              style={styles.contentRatingIcon}
              source={{
                uri: first.Image,
              }}
            ></Image>
            <Text
              style={[styles.ratingTextStyle, styles.contentRatingText]}
            >{`${first?.Score}%`}</Text>
          </View>
        ) : null}

        {second ? (
          <View style={styles.ratingBlock}>
            <Image
              style={styles.contentRatingIcon}
              source={{
                uri: second.Image,
              }}
            ></Image>
            <Text
              style={[styles.ratingTextStyle, styles.contentRatingText]}
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
      metadata = currentFocusedFeed?.genre
        ? getGenreText(currentFocusedFeed?.genre)
        : [];
      currentFocusedFeed?.ReleaseYear &&
        metadata?.push(currentFocusedFeed?.ReleaseYear);
      currentFocusedFeed?.Rating && metadata?.push(currentFocusedFeed?.Rating);
    }

    return (
      <View style={styles.metadataContainer}>
        <Text numberOfLines={2} style={styles.metadataLine2}>
          {metadata?.join(metadataSeparator) ||
            currentFocusedFeed?.metadataLine2}
        </Text>
      </View>
    );
  };

  const renderIndicators = () => {
    const langaugeIndicator = currentFocusedFeed?.locale?.split("-")[0];
    const qualityLevel =
      currentFocusedFeed?.combinedQualityLevels &&
      currentFocusedFeed?.combinedQualityLevels[0];
    const audioTag = currentFocusedFeed?.combinedAudioIndicator;
    return (
      <View style={styles.metadataContainer}>
        {/* Quality Indicators */}
        {!!qualityLevel && (
          <Text style={styles.fontIconStyle}>
            {getFontIcon((fontIconsObject as any)[qualityLevel])}
          </Text>
        )}
        {/* Language Indicators */}
        {!!langaugeIndicator && (
          <Text style={styles.fontIconStyle}>
            {getFontIcon((fontIconsObject as any)[langaugeIndicator])}
          </Text>
        )}

        {/* Audio Indicator */}

        {!!audioTag?.length &&
          audioTag.map((audioIndicator: any) => {
            return (
              <Text style={styles.fontIconStyle} key={audioIndicator}>
                {getFontIcon((fontIconsObject as any)[audioIndicator])}
              </Text>
            );
          })}
      </View>
    );
  };

  const toggleMenu = () => {
    console.log("Pressed on the browse filter", openMenu);
    setOpenMenu(!openMenu);
    setOpenSubMenu(!openSubMenu);
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
  const onFocusBar = () => {
    if (!filterFocused) {
      setFilterFocused(true);
      filterRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    } else {
      setFilterFocused(false);
      cardRef.current?.setNativeProps({ hasTVPreferredFocus: true });
    }
  };
  const getFilterCount = () => {
    let filters = [];
    const defaultFilters: string[] = [];
    for (let key in filterState) {
      if (!_.isEmpty(filterState[key].selectedIds)) {
        filters.push(filterState[key].selectedIds[0]);
      }
    }
    for (let key in defaultFilterState) {
      if (
        !_.isEmpty(defaultFilterState[key].selectedIds) &&
        filterState &&
        defaultFilterState[key].selectedIds[0] ===
          filterState[key]?.selectedIds[0]
      ) {
        // defaultFilters.push(defaultFilterState[key].selectedIds[0]);
        filters.splice(
          filters.indexOf(defaultFilterState[key].selectedIds[0]),
          1
        );
      }
    }
    return filters.length;
  };
  const renderNoResults = () => {
    return (
      <View style={styles.noSearchResultContainer}>
        <FastImage
          style={{ height: 260, width: 250 }}
          source={AppImages.noSearchResult}
        />
        <MFText
          textStyle={styles.noSeasrchResultTitle}
          displayText={"No Match Found"}
          shouldRenderText={true}
        />
        <MFText
          textStyle={styles.noSeasrchResultText}
          displayText={`${
            AppStrings.str_search_no_result_key ||
            "Try changing the filters or clear filters to see all"
          } "${feed.Name}"`}
          shouldRenderText={true}
        />
      </View>
    );
  };
  const handlePress = (event: any) => {
    console.log("handlePress inside browse gallery", event);
    const IsAdult = event.IsAdult;
    if (IsAdult && isAdultContentBlock()) {
      DeviceEventEmitter.emit("openPinVerificationPopup", {
        pinType: PinType.adult,
        data: event,
        onSuccess: () => {
          props.navigation.navigate(Routes.Details, {
            feed: event,
          });
        },
      });
    } else if (isPconBlocked(event)) {
      DeviceEventEmitter.emit("openPinVerificationPopup", {
        pinType: PinType.content,
        data: event,
        onSuccess: () => {
          props.navigation.navigate(Routes.Details, {
            feed: event,
          });
        },
      });
    } else {
      props.navigation.navigate(Routes.Details, {
        feed: event,
      });
    }
    // props.navigation.push(Routes.Details, { feed: event });
  };

  const imageSource: any =
    currentFeed?.image16x9KeyArtURL ||
    currentFeed?.image16x9PosterURL ||
    AppImages.bgPlaceholder;

  const statusText =
    (currentFocusedFeed?.statusText?.length &&
      currentFocusedFeed?.statusText[0]) ||
    "";

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
          {getFilterCount() > 0 ? (
            <View style={styles.filterCountContainer}>
              <Text style={styles.filterCountText}>{getFilterCount()}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {isLoading && dataSource.length <= 0 ? (
        <MFLoader />
      ) : (
        <View style={styles.contentContainerStyles}>
          <>
            {dataSource.length > 0 && isFetched ? (
              <>
                <View style={styles.currentFeedContainerStyles}>
                  {currentFeed && (
                    <>
                      <ImageBackground
                        imageStyle={styles.imageStyle}
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
                          {renderIndicators()}
                          {renderRatingValues()}
                          <Text style={styles.statusTextStyle}>
                            {statusText}
                          </Text>
                        </View>
                      </ImageBackground>
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
                      cardStyle="2x3"
                      onFocus={updateFeed}
                      autoFocusOnFirstCard
                      selectedId={currentFeed?.Id}
                      onEndReached={handleEndReached}
                      onPress={handlePress}
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
                {renderNoResults()}
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
          defaultFilterState={defaultFilterState}
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
    flex: 0.77,
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
    // transform: [
    //   {
    //     scale: 1.1,
    //   },
    // ],
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
  metadataContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  fontIconStyle: {
    fontFamily: globalStyles.fontFamily.icons,
    color: globalStyles.fontColors.light,
    fontSize: 70,
    marginRight: 15,
    marginBottom: -15,
  },
  statusTextStyle: {
    color: globalStyles.fontColors.statusWarning,
    fontFamily: globalStyles.fontFamily.regular,
    fontSize: globalStyles.fontSizes.body2,
    marginTop: 30,
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
    marginRight: 20,
  },
  contentContainerStyles: {
    flexDirection: "row",
    height: "100%",
  },
  currentFeedContainerStyles: {
    flex: 0.5,
  },
  gridViewContainerStyles: {
    flex: 0.55,
    height: "100%",
    width: "100%",
  },
  posterImageContainerStyles: { width: 918, height: 519, overflow: "hidden" },
  posterImageStyle: {
    position: "relative",
    height: 519,
    width: 918,
    flex: 1,
    shadowOpacity: 0.5,
  },
  imageStyle: {
    resizeMode: "contain",
  },
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
  },
  contentRatingText: {
    marginLeft: 10,
  },
  contentRatingsContainer: {
    marginTop: 30,
    flexDirection: "row",
  },
  ratingBlock: {
    marginRight: 30,
    flexDirection: "row",
  },
  filterCountContainer: {
    width: 38,
    height: 38,
    backgroundColor: globalStyles.auxiliaryColors.statusError,
    borderRadius: 20,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    top: 10,
    right: 140,
  },
  filterCountText: {
    color: "#EEEEEE",
    fontSize: 23,
    fontWeight: "600",
    lineHeight: 38,
  },
  noSearchResultContainer: {
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 100,
    backgroundColor: "#00030E",
    height: "100%",
  },
  noSeasrchResultTitle: {
    fontSize: 38,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 55,
    color: "#EEEEEE",
    textAlign: "center",
    marginTop: 20,
  },
  noSeasrchResultText: {
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
    color: "#A7A7A7",
    textAlign: "center",
    marginTop: 10,
  },
});
export default GalleryScreen;
