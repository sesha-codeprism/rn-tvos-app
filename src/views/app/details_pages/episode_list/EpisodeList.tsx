import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";
import { getScaledValue, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { PageContainer } from "../../../../components/PageContainer";
import {
  chooseRating,
  format,
  isExpiringSoon,
  massageDiscoveryFeedAsset,
  massageProgramDataForUDP,
  massageSeasonPlayOptionData,
} from "../../../../utils/assetUtils";
import { AppStrings } from "../../../../config/strings";
import {
  assetTypeObject,
  placeholder16x9Image,
  RecordStatus,
  sourceTypeString,
} from "../../../../utils/analytics/consts";
import { getImageUri } from "../../../../utils/Subscriber.utils";
import FastImage from "react-native-fast-image";
import { useQuery } from "react-query";
import { defaultQueryOptions } from "../../../../config/constants";
import { getDataFromUDL, getMassagedData } from "../../../../../backend";
import { GLOBALS } from "../../../../utils/globals";
import { queryClient } from "../../../../config/queries";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { isFeatureAssigned } from "../../../../utils/helpers";
import { current } from "@reduxjs/toolkit";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { styles } from "../../BrowsePages/BrowseCategory/Browse.Category.screen";

interface EpisodeListProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const defaultBackgroundImageConfig: any = getUIdef("BackgroundImage")?.config;
const backgroundImageUri = defaultBackgroundImageConfig?.backgroundImageUri;
const conflictPopupConfig: any = getUIdef("DVRConflict")?.config;
const conflictPopupWidth =
  conflictPopupConfig?.containerWidth || getScaledValue(900);
const conflictPopupButtonWidth =
  conflictPopupConfig?.buttonWidth || getScaledValue(759);
const episodeListConfig: any = getUIdef("EpisodeList")?.config;
const snapToInterval: number =
  episodeListConfig?.snapToInterval || getScaledValue(20);
const lazyListConfig: any = getUIdef("EpisodeList.LazyListWrapper")?.config;
const scaledSnapToInterval = getScaledValue(lazyListConfig.snapToInterval);

const EpisodeList: React.FunctionComponent<EpisodeListProps> = (props) => {
  const navigationParams = props.route.params;
  const { udpData, subscriberData, discoveryData } = navigationParams;
  const [currentSeason, setCurrentSeason] = useState<any>();
  const [seasonItemHeight, setSeasonItemHeight] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState<any>();
  const [ctaList, setCTAList] = useState<any>();
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState(
    Array<any>
  );
  const [episodeDetailsData, setEpisodeDetailsData] = useState<any>();
  const metadataList: string[] = discoveryData?.ReleaseYear
    ? [discoveryData?.ReleaseYear]
    : discoveryData?.StartYear
    ? [discoveryData?.StartYear]
    : [];
  if (chooseRating(discoveryData?.Ratings)) {
    metadataList.push(chooseRating(discoveryData?.Ratings));
  }
  const metadata = metadataList.join(" · ");
  const str_seasonNumber_episodeNumber: string =
    AppStrings?.str_seasonNumber_episodeNumber || "";

  let episodeFlatList = React.createRef<FlatList>();
  let seasonScrollView = React.createRef<ScrollView>();
  let seasonButtonRef: React.RefObject<any>;
  let firstEpisodeRef: React.RefObject<any>;
  let lastEpisodeRef: React.RefObject<any>;

  let buttonRefObject = {
    [AppStrings?.str_details_cta_play]: React.createRef(),
    [AppStrings?.str_details_program_record_button]: React.createRef(),
    [AppStrings?.str_details_cta_more_info]: React.createRef(),
    [AppStrings?.str_details_cta_restart]: React.createRef(),
    [AppStrings?.str_details_cta_resume]: React.createRef(),
    [AppStrings?.str_details_cta_waystowatch]: React.createRef(),
    [AppStrings?.str_app_edit]: React.createRef(),
    [AppStrings?.str_dvr_resolve_conflict]: React.createRef(),
  };

  const ctaButtonPress: any = {
    [AppStrings?.str_details_program_record_button]: () => {},
    [AppStrings?.str_details_cta_more_info]: () => {},
    [AppStrings?.str_details_cta_play]: () => {},
    [AppStrings?.str_details_cta_trailer]: () => {},
    [AppStrings?.str_details_cta_restart]: () => {},
    [AppStrings?.str_details_cta_watch_live]: () => {},
    [AppStrings?.str_details_cta_play_from_beginning]: () => {},
    [AppStrings?.str_details_cta_waystowatch]: () => {},
    [AppStrings?.str_app_edit]: () => {},
    [AppStrings?.str_dvr_resolve_conflict]: () => {},
    [AppStrings?.str_details_cta_playdvr]: () => {},
    [AppStrings?.str_details_cta_rent]: () => {},
    [AppStrings?.str_details_cta_buy]: () => {},
    [AppStrings?.str_details_cta_rentbuy]: () => {},
    [AppStrings?.str_details_cta_package]: () => {},
    [AppStrings?.str_details_cta_subscribe]: () => {},
  };
  const refArray = [];

  let firstButtonRef = React.createRef();
  let buttonFocuszoneRef = React.createRef();
  let selectedButtonRef = React.createRef();
  let skip = 0;
  let top = 10;

  const setFlatListRef = (ref: any) => {
    episodeFlatList = ref;
  };

  let isSeasonScrolled = false;

  const getCurrentSeasonPlayOptions = async ({ queryKey }: any) => {
    const { stationId } = navigationParams;
    const [, seasonInfo] = queryKey;
    if (!seasonInfo) {
      console.log("No season info yet..");
      return;
    }
    if (!discoveryData) {
      console.log("No Discovery data to fetch series info...");
      return;
    }
    const seriesID = discoveryData?.Id;
    const seasonID = seasonInfo?.Id;
    const urlParam =
      "udl://subscriber/getSeasonPlayOptions/" +
      `?seriesID=${seriesID}&seasonID=${seasonID}`;

    const udlResponse = await getDataFromUDL(urlParam);
    const massagedSeasonResponse = massageSeasonPlayOptionData(
      udlResponse.data,
      GLOBALS.channelMap,
      stationId,
      undefined,
      GLOBALS.bootstrapSelectors,
      undefined
    );
    return massagedSeasonResponse;
  };

  const getPriorityEpisode = async () => {
    const { discoveryData, subscriberData } = navigationParams;
    const catalogInfo = subscriberData?.PriorityEpisodeTitle?.CatalogInfo;
    if (seasonPlayOptions?.Episodes?.length) {
      let priorityEpisode = seasonPlayOptions?.Episodes?.filter(
        (episode: any) =>
          catalogInfo?.EpisodeNumber === episode?.CatalogInfo?.EpisodeNumber &&
          catalogInfo?.SeasonNumber === episode?.CatalogInfo?.SeasonNumber
      )[0];

      if (!priorityEpisode) {
        priorityEpisode = currentEpisode;
        priorityEpisode = seasonPlayOptions?.Episodes[0];
      }

      discoveryData["currentEpisode"] = priorityEpisode;
      return priorityEpisode;
    }
  };

  const getAllViewableSubscriptions = async ({ queryKey }: any) => {
    /** As a thumb rule, let all DVR calls be called without keys to enable cache-reuse */
    const viewableSubscriptionGroups = queryClient.getQueryData([
      "get-viewableSubscriptionGroupsQuery",
    ]);
    if (!viewableSubscriptionGroups) {
      /** This block execution means subscriber call hasn't ben done yet.. */
      /** Make the api call now and store it in cache  */
      const udlParams = "udl://dvrproxy/viewable-subscription-items/";
      const data = await getDataFromUDL(udlParams);
      const massagedData = getMassagedData(udlParams, data);
      return massagedData;
    } else {
      /** Basically we got the response from cache where it has was stored in previous call */
      /** Just return the cached data */
      return viewableSubscriptionGroups;
    }
  };

  const getScheduledSubScriptions = async ({ queryKey }: any) => {
    const scheduledSubscriptions = queryClient.getQueryData([
      "get-ScheduledSubscriptionsQuery",
    ]);
    if (!scheduledSubscriptions) {
      /** This block execution means subscriber call hasn't ben done yet.. */
      /** Make the api call now and store it in cache  */
      const udlParams = "udl://dvrproxy/get-scheduled-subscription-groups/";
      const data = await getDataFromUDL(udlParams);
      const massagedData = getMassagedData(udlParams, data);
      return massagedData;
    } else {
      /** Basically we got the response from cache where it has was stored in previous call */
      /** Just return the cached data */
      return scheduledSubscriptions;
    }
  };

  const getAllSubscriptionGroups = async ({ queryKey }: any) => {
    const allSubscriptions = queryClient.getQueryData([
      `get-AllSubscriptionsQuery`,
    ]);

    if (!allSubscriptions) {
      /** This block execution means subscriber call hasn't ben done yet.. */
      /** Make the api call now and store it in cache  */
      const udlParams = "udl://dvrproxy/get-all-subscriptionGroups/";
      const data = await getDataFromUDL(udlParams);
      const massagedData = getMassagedData(udlParams, data);
      return massagedData;
    } else {
      /** Basically we got the response from cache where it has was stored in previous call */
      /** Just return the cached data */
      return allSubscriptions;
    }
  };

  const getEpisodeDiscoveryData = async ({ queryKey }: any) => {
    const currentEpisode = queryKey[1];
    if (!currentEpisode) {
      return;
    }
    const itemID = currentEpisode?.ProgramId;
    const params = `?storeId=${DefaultStore?.Id}&groups=${
      GLOBALS.store!.rightsGroupIds
    }&id=${itemID}`;
    const urlParam = "udl://discovery/programs/" + params;
    const data = await getDataFromUDL(urlParam);
    const massagedData = massageDiscoveryFeedAsset(
      data.data,
      assetTypeObject[0]
    );
    return massagedData;
  };

  const getCurrentEpisodePlayOptions = async ({ queryKey }: any) => {
    const [, currentEpisode] = queryKey;
    if (!currentEpisode) {
      console.log("No episode Info yet");
      return;
    }
    if (!discoveryData) {
      console.log("No Discovery data to fetch series info...");
      return;
    }
    const episodeId = currentEpisode?.ProgramId;
    const urlParam =
      "udl://subscriber/programplayactions/" + `?id=${episodeId}`;
    const udlResponse = await getDataFromUDL(urlParam);
    return udlResponse.data;
  };

  const getRecorders = async ({ queryKey }: any) => {
    const dvrRecorders = queryClient.getQueryData([`get-dvr-recorders`]);

    if (!dvrRecorders) {
      /** This block execution means subscriber call hasn't ben done yet.. */
      /** Make the api call now and store it in cache  */
      const udlParams = "udl://dvrproxy/get-dvr-recorders/";
      const data = await getDataFromUDL(udlParams);
      //   const massagedData = getMassagedData(udlParams, data);
      //   return massagedData;
      return data.data;
    } else {
      /** Basically we got the response from cache where it has was stored in previous call */
      /** Just return the cached data */
      return dvrRecorders;
    }
  };

  const getEpisodeSchedules = async ({ queryKey }: any) => {
    const [, episodeInfo] = queryKey;
    if (!currentEpisode) {
      console.log("No episode Info yet");
      return;
    }
    const id = episodeInfo?.ProgramId;
    if (!id) {
      return;
    }
    const params = `?$top=${1000}&$skip=${0}&storeId=${
      DefaultStore.Id
    }&$groups=${GLOBALS.store!.rightsGroupIds}&id=${id}&lang=${
      GLOBALS.store!.onScreenLanguage.languageCode
    }`;
    const udlParam = "udl://discovery/programSchedules/" + params;
    const data = await getDataFromUDL(udlParam);
    return data;
  };

  const { data: seasonPlayOptions, isLoading } = useQuery(
    ["get-seasonsPlayData", currentSeason],
    getCurrentSeasonPlayOptions,
    defaultQueryOptions
  );

  const { data: episodePlayOptions } = useQuery(
    ["get-episode-playoptions", currentEpisode],
    getCurrentEpisodePlayOptions,
    defaultQueryOptions
  );

  const { data: viewableSubscriptionGroups } = useQuery(
    ["get-viewableSubscriptionGroupsQuery"],
    getAllViewableSubscriptions,
    defaultQueryOptions
  );

  const { data: scheduledSubScriptionGroups } = useQuery(
    ["get-ScheduledSubscriptionsQuery"],
    getScheduledSubScriptions,
    defaultQueryOptions
  );

  const { data: allSubscriptionGroups } = useQuery(
    ["get-AllSubscriptionsQuery"],
    getAllSubscriptionGroups,
    defaultQueryOptions
  );

  const { data: episodeDiscoveryData } = useQuery(
    ["get-episode-discoveryData", currentEpisode],
    getEpisodeDiscoveryData,
    defaultQueryOptions
  );

  const { data: dvrRecorders } = useQuery(
    ["get-dvr-recorders"],
    getRecorders,
    defaultQueryOptions
  );

  const { data: episodeSchedules } = useQuery(
    ["get-episode-schedules", currentEpisode],
    getEpisodeSchedules,
    defaultQueryOptions
  );

  useEffect(() => {
    const season = getPrioritySeason();
    setTimeout(() => {
      setCurrentSeason(season);
    }, 800);
  }, []);

  useEffect(() => {
    if (
      !seasonPlayOptions &&
      !episodeDiscoveryData &&
      !allSubscriptionGroups &&
      !viewableSubscriptionGroups &&
      !scheduledSubScriptionGroups &&
      !episodeSchedules &&
      !dvrRecorders
    ) {
      console.log("Haven't received full episode details yet..");
      return;
    }
    const {
      discoveryData,
      subscriberData,
      stationId,
      isSeriesRecordingBlocked,
      isFromEPG,
      StationIdFromEPG,
      udpData,
    } = navigationParams;
    const hasFeatureIosCarrierBilling = isFeatureAssigned("IOSCarrierBilling");
    const allSubcriptionGroups = {
      ...(scheduledSubScriptionGroups || {}),
      SubscriptionGroups: [
        ...((scheduledSubScriptionGroups &&
          scheduledSubScriptionGroups.SubscriptionGroups) ||
          []),
        ...((viewableSubscriptionGroups &&
          viewableSubscriptionGroups.SubscriptionGroups) ||
          []),
      ],
    };
    const userChannelRights = GLOBALS.channelRights;
    if (seasonPlayOptions?.Episodes?.length) {
      const selectedEpisode = currentEpisode;
      let selectedEpisodeNumber = undefined;
      let selectedEpisodeSeasonNumber = undefined;
      if (selectedEpisode && selectedEpisode.CatalogInfo) {
        selectedEpisodeNumber = selectedEpisode.CatalogInfo.EpisodeNumber;
        selectedEpisodeSeasonNumber = selectedEpisode.CatalogInfo.SeasonNumber;
      }
      //TODO: Find out what this is supposed to do..
      // const liveSchedules = selectors.live.scheduleCache.get(state);

      let filteredEpisodePlayOptions = undefined;
      for (const episodePlayOptions of seasonPlayOptions.Episodes) {
        const { EpisodeNumber, SeasonNumber } =
          episodePlayOptions && episodePlayOptions?.CatalogInfo;
        if (
          selectedEpisodeNumber === EpisodeNumber &&
          selectedEpisodeSeasonNumber === SeasonNumber
        ) {
          filteredEpisodePlayOptions = episodePlayOptions;
          break;
        }
      }

      const epData = massageProgramDataForUDP(
        episodePlayOptions,
        subscriberData,
        episodeDiscoveryData,
        GLOBALS.channelMap,
        episodeSchedules,
        GLOBALS.currentSlots,
        allSubcriptionGroups,
        GLOBALS.userAccountInfo,
        [],
        filteredEpisodePlayOptions,
        viewableSubscriptionGroups,
        scheduledSubScriptionGroups,
        dvrRecorders,
        //TODO: networkIHD isn't supposed to be auto-undefined.. Implement this and pick up the current value
        undefined,
        isSeriesRecordingBlocked,
        stationId,
        undefined,
        undefined,
        userChannelRights,
        isFromEPG,
        StationIdFromEPG,
        hasFeatureIosCarrierBilling
      );
      setEpisodeDetailsData(epData);
      const { ctaButtons = undefined } = episodeDetailsData || {};

      if (
        currentEpisode?.ProgramId &&
        [episodeDiscoveryData?.Id, episodePlayOptions?.ProgramId].every(
          (id: string) => id === currentEpisode?.ProgramId
        )
      ) {
        // set Initial cta buttons for the selected episode
        setCTAList(ctaButtons);
      }
    }
  }, [
    seasonPlayOptions,
    episodeDiscoveryData,
    allSubscriptionGroups,
    viewableSubscriptionGroups,
    scheduledSubScriptionGroups,
    dvrRecorders,
  ]);

  const getEpisodesInChunks = (start: number, offset: number) => {
    if (seasonPlayOptions) {
      if (!seasonPlayOptions?.Episodes?.length) {
        return;
      }
      const episodes = seasonPlayOptions?.Episodes?.slice(start, offset);
      return episodes;
    }
  };

  const getMoreEpisodes = () => {
    if (!seasonPlayOptions?.Episodes?.length) {
      return null;
    }

    const episodes = currentSeasonEpisodes?.length
      ? [...currentSeasonEpisodes, ...getEpisodesInChunks(skip, top)]
      : [...getEpisodesInChunks(skip, top)];

    setCurrentSeasonEpisodes(episodes);
    skip = top;
    top += 10;
  };
  const getPrioritySeason = () => {
    if (
      udpData?.ChannelInfo?.Schedule?.season ||
      udpData?.ChannelInfo?.Schedule?.SeasonNumber
    ) {
      return subscriberData?.CatalogInfo?.Seasons?.filter(
        (season: any) =>
          season?.SeasonNumber === udpData?.ChannelInfo?.Schedule?.season ||
          season?.SeasonNumber === udpData?.ChannelInfo?.Schedule?.SeasonNumber
      )[0];
    } else if (
      discoveryData?.Seasons?.length &&
      subscriberData?.PriorityEpisodeTitle
    ) {
      return subscriberData?.CatalogInfo?.Seasons?.filter(
        (season: any) =>
          season?.Id ===
          subscriberData.PriorityEpisodeTitle?.CatalogInfo?.SeasonId
      )[0];
    } else {
      return (
        discoveryData?.Seasons[0] || subscriberData?.CatalogInfo?.Seasons[0]
      );
    }
  };

  useEffect(() => {
    if (!seasonPlayOptions) {
      console.log("No response yet.. waiting for some data");
      return;
    }
    getMoreEpisodes();
  }, [seasonPlayOptions]);

  useEffect(() => {
    if (!episodePlayOptions) {
      console.log("No response yet.. waiting for episodePlayOptions");
      return;
    }
  }, [episodePlayOptions]);

  const handleSeasonFocus = (season: any) => {
    if (season?.Id !== currentSeason?.Id) {
      /** Focused season is different from current active season  So, update episode list and everything */
      //@ts-ignore
      episodeFlatList?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCurrentSeasonEpisodes([]);
      setCurrentEpisode(undefined);
      discoveryData["focusedSeason"] = {
        seriesId: discoveryData?.Id,
        seasonId: season?.Id,
      };
      // Season and Episodes
      if (currentSeason) {
        setCurrentSeason(season);
      }
      skip = 0;
      top = 10;
    } else {
      /** Focused season is same as currently active season  So, don't update anything */
      setCurrentEpisode(undefined);
    }
  };

  const scrollToSeasonItem = (index: number) => {
    requestAnimationFrame(() => {
      if (seasonScrollView?.current) {
        seasonScrollView?.current.scrollTo({
          x: 0,
          y: index * seasonItemHeight,
          animated: true,
        });
        isSeasonScrolled = true;
      }
    });
  };

  const renderTitleBlock = (title: string, metadata: string) => {
    return (
      <View style={episodeStyles.titleBlock}>
        <Text style={episodeStyles.seasonTitle}>{title}</Text>
        <Text style={episodeStyles.seasonMetadata}>{metadata}</Text>
      </View>
    );
  };

  const renderSeasonItem = (season: any) => {
    const { Name, EpisodesCount, index, SeasonNumber } = season;
    const seasonTranslation =
      format(
        AppStrings?.str_season,
        SeasonNumber.toString(),
        EpisodesCount.toString()
      ) || `${Name} (${EpisodesCount})`;
    const defaultSeasonTranslation =
      AppStrings?.str_default_season || "Default Season";

    const handleSeasonItemFocus = () => {
      handleSeasonFocus(season);
    };
    const isCurrentSeason = season?.Id && currentSeason?.Id === season?.Id;

    const textStyle = isCurrentSeason
      ? episodeStyles.seasonTextSelected
      : episodeStyles.seasonText;
    return (
      <View
        style={
          isCurrentSeason
            ? episodeStyles.seasonBlockSelected
            : episodeStyles.seasonBlock
        }
        key={`SeasonItem_${index}`}
      >
        <Pressable
          onFocus={handleSeasonItemFocus}
          ref={
            season?.Id && currentSeason?.Id === season?.Id
              ? seasonButtonRef
              : undefined
          }
        >
          <Text style={textStyle}>
            {SeasonNumber ? seasonTranslation : defaultSeasonTranslation}
          </Text>
        </Pressable>
      </View>
    );
  };

  const handleEpisodeItemFocus = (episode: any, index: number) => {
    setCurrentEpisode(episode);
    const { discoveryData } = navigationParams;

    discoveryData["currentEpisode"] = episode;

    setCurrentEpisode(episode);

    // this.focusedEpisodeId = episode?.ProgramId;

    // this.props.getEpisodePlayOptionsData({
    //   assetType: AssetType.Program,
    //   programId: episode?.ProgramId,
    // });

    // this.props.getEpisodeDiscoveryData({
    //   id: episode?.ProgramId,
    // });

    // this.props.getProgramScheduleData({
    //   id: episode?.ProgramId,
    //   $skip: 0,
    //   $top: 1000,
    // });
    if (episode?.index === skip - 2) {
      console.log(episode?.index, skip, "Need to fetch more episodes");
      getMoreEpisodes();
    } else {
      console.log(episode?.index, skip, "No Need to fetch more episodes");
    }
  };

  const extractKey = (item: any) => item.Id;

  const renderSeasons = () => {
    if (
      !subscriberData ||
      !(subscriberData?.CatalogInfo?.Seasons?.length > 0)
    ) {
      return;
    }
    const subData = navigationParams.subscriberData;

    return subData?.CatalogInfo?.Seasons?.map((season: any, index: number) => {
      season["index"] = index;
      //   season["onFocus"] = handleSeasonFocus;
      if (currentSeason?.Id === season?.Id && !isSeasonScrolled) {
        scrollToSeasonItem(index);
      }
      return renderSeasonItem(season);
    });
  };

  const renderEpisodeListItem = (episodeItem: any) => {
    const { item: episode, index } = episodeItem;
    const { Description = "" } = episode?.CatalogInfo;
    const name =
      episode?.CatalogInfo?.EpisodeName || episode?.CatalogInfo?.Name;

    let selectedStyle: any = episodeStyles.unSelectedEpisode;
    let isSelectedEpisode = false;
    if (episode.ProgramId === currentEpisode?.ProgramId) {
      selectedStyle = episodeStyles.selectedEpisode;
      isSelectedEpisode = true;
    }
    const handleEpisodeFocus = () => {
      handleEpisodeItemFocus(episode, index);
    };

    const statusText =
      episodeDetailsData?.statusText[0] || episode?.statusText || "";
    // const statusText = episode?.statusText || "";
    const imageSource =
      getImageUri(episode?.CatalogInfo, "16x9/Poster") ||
      getImageUri(episode?.CatalogInfo, "16x9/KeyArt") ||
      placeholder16x9Image;

    const progressBarStyle: any = getUIdef("ProgressBar")?.style;

    const iconStyle = {
      color:
        episode?.dvrItemsState !== RecordStatus.SCHEDULED
          ? globalStyles.auxiliaryColors.statusError
          : globalStyles.backgroundColors.primary1,
    };

    let networkImageSource = episode.channelLogoUr;
    if (!networkImageSource && episode?.networkInfo) {
      const { networkInfo } = episode;
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
      episode?.ProgramId === Schedule?.ProgramId &&
      Schedule?.playSource === sourceTypeString.UPCOMING
    ) {
      episode["Bookmark"] = undefined;
    }
    const shouldShowExpiringIcon = isExpiringSoon(episode);
    return (
      <View
        style={[episodeStyles.episodeItemContainer, selectedStyle]}
        key={`ListItem_${index}`}
        ref={
          index === 0
            ? firstEpisodeRef
            : index === currentSeasonEpisodes.length - 1
            ? lastEpisodeRef
            : undefined
        }
      >
        {currentEpisode &&
        currentEpisode?.ProgramId === episode?.ProgramId &&
        ctaList &&
        ctaList?.length ? (
          <View
            ref={index === 0 ? firstEpisodeRef : undefined}
            style={episodeStyles.episodeItemShowcard}
          >
            <FastImage
              //@ts-ignore
              source={imageSource}
              style={episodeStyles.episodeItemImage}
            />
            <View style={[episodeStyles.episodeItemInfo, { flexShrink: 1 }]}>
              <Text style={episodeStyles.episodeItemTitle}>{name}</Text>
              <Text style={episodeStyles.episodeItemMetadata}>
                {episode.metadata} {index} - {currentSeasonEpisodes.length - 1}
              </Text>
              <Text
                style={episodeStyles.episodeItemDescription}
                numberOfLines={2}
              >
                {Description}
              </Text>
              {currentEpisode?.ProgramId === episode?.ProgramId && (
                <Text style={episodeStyles.statusTextStyle} numberOfLines={2}>
                  {statusText}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Pressable
            onFocus={handleEpisodeFocus}
            onPress={() => {}}
            disabled={currentEpisode?.ProgramId === episode?.Program?.id}
            focusable={currentEpisode?.ProgramId !== episode?.Program?.id}
            ref={index === 0 ? firstEpisodeRef : undefined}
            style={episodeStyles.episodeItemShowcard}
          >
            <FastImage
              //@ts-ignore
              source={imageSource}
              style={episodeStyles.episodeItemImage}
            />
            <View style={[episodeStyles.episodeItemInfo, { flexShrink: 1 }]}>
              <Text style={episodeStyles.episodeItemTitle}>{name}</Text>
              <Text style={episodeStyles.episodeItemMetadata}>
                {episode.metadata}
              </Text>
              <Text
                style={episodeStyles.episodeItemDescription}
                numberOfLines={2}
              >
                {Description}
              </Text>
              {currentEpisode?.ProgramId === episode?.ProgramId && (
                <Text style={episodeStyles.statusTextStyle} numberOfLines={2}>
                  {statusText}
                </Text>
              )}
            </View>
          </Pressable>
        )}
        <View style={episodeStyles.buttonContainer}>
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
                    fontIconStyle = episodeStyles.ctaFontIconStyle;
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
                      onFocus={() => {}}
                      variant={MFButtonVariant.FontIcon}
                      fontIconSource={cta.iconSource}
                      fontIconTextStyle={StyleSheet.flatten([
                        episodeStyles.ctaFontIconStyle,
                        { fontSize: 90 },
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
                      focusedStyle={episodeStyles.focusedUnderLine}
                      fontIconProps={{
                        iconPlacement: "Left",
                        shouldRenderImage: true,
                      }}
                    />
                  );
                })}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={
          props.route.params.discoveryData?.image16x9KeyArtURL ||
          props.route.params.discoveryData?.image2x3PosterURL ||
          props.route?.image16x9KeyArtURL ||
          props.route?.image16x9PosterURL ||
          backgroundImageUri
        }
        style={episodeStyles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={episodeStyles.containerStyle}>
          <View style={episodeStyles.firstBlock}>
            {renderTitleBlock(discoveryData?.Name, metadata)}
            <View style={episodeStyles.flexOne}>
              <ScrollView
                style={episodeStyles.seasonScrollView}
                ref={seasonScrollView}
              >
                {renderSeasons()}
              </ScrollView>
            </View>
          </View>
          <View style={episodeStyles.secondBlock}>
            <FlatList
              snapToInterval={scaledSnapToInterval}
              snapToAlignment={lazyListConfig.snapToAlignment || "start"}
              horizontal={lazyListConfig.horizontal || false}
              ref={setFlatListRef}
              //   extraData={this.state.ctaList}
              data={currentSeasonEpisodes}
              keyExtractor={extractKey}
              renderItem={renderEpisodeListItem}
            />
            <Pressable
              style={{
                width: SCREEN_WIDTH * 0.5,
                height: 10,
                backgroundColor: "transparent",
                alignSelf: "center",
              }}
              onFocus={() => {
                firstButtonRef?.current?.setNativeProps({
                  hasTVPreferredFocus: true,
                });
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </PageContainer>
  );
};

const episodeStyles: any = StyleSheet.create(
  getUIdef("EpisodeList")?.style ||
    scaleAttributes({
      containerStyle: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 72,
        paddingLeft: 90,
        paddingRight: 58,
        backgroundColor: globalStyles.backgroundColors.shade1,
        opacity: 0.9,
      },
      firstBlock: {
        width: 543,
      },
      titleBlock: {
        marginBottom: 116,
      },
      seasonTitle: {
        fontFamily: globalStyles.fontFamily.bold,
        fontSize: globalStyles.fontSizes.subTitle1,
        color: globalStyles.fontColors.light,
        marginBottom: 15,
      },
      seasonMetadata: {
        fontFamily: globalStyles.fontFamily.semiBold,
        fontSize: globalStyles.fontSizes.body2,
        color: globalStyles.fontColors.lightGrey,
      },
      flexOne: {
        flex: 1,
      },
      seasonScrollView: {
        marginBottom: 30,
      },
      secondBlock: {
        flex: 1,
      },
      seasonBlock: {
        height: 62,
        width: 225,
        marginBottom: 43,
      },
      seasonBlockSelected: {
        height: 62,
        width: 225,
        marginBottom: 43,
        borderBottomColor: "#053C69",
        borderBottomWidth: 4,
      },
      seasonText: {
        fontFamily: "Inter-Regular",
        color: "#6D6D6D",
        fontSize: 38,
      },
      seasonTextSelected: {
        fontFamily: "Inter-Bold",
        color: "#EEEEEE",
        fontSize: 38,
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
        opacity: 0.6,
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
        fontSize: globalStyles.fontSizes.subTitle2,
        lineHeight: globalStyles.lineHeights.subTitle2,
      },
      episodeItemMetadata: {
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.lightGrey,
        fontSize: globalStyles.fontSizes.body2,
        lineHeight: globalStyles.lineHeights.body2,
      },
      episodeItemDescription: {
        fontFamily: globalStyles.fontFamily.regular,
        color: globalStyles.fontColors.darkGrey,
        fontSize: globalStyles.fontSizes.body2,
        lineHeight: globalStyles.lineHeights.body2,
      },
      imageContainer: {
        borderRadius: 4,
        overflow: "hidden",
        height: 237,
      },
      textOnImage: {
        zIndex: 10,
        position: "absolute",
        right: 19,
        top: 16,
        fontFamily: globalStyles.fontFamily.semiBold,
        fontSize: globalStyles.fontSizes.body1,
        color: globalStyles.fontColors.light,
      },
      ctaBtnContainer: {
        flex: 1,
        marginTop: 28,
      },
      buttonGroupContainer: {
        flexDirection: "row",
        flex: 1,
      },
      iconContainer: {
        width: 100,
      },
      ctaButtonStyle: {
        height: 66,
        fontFamily: globalStyles.fontFamily.semiBold,
        marginRight: 20,
      },
      ctaFontIconStyle: {
        fontFamily: globalStyles.fontFamily.icons,
        color: globalStyles.fontColors.statusError,
      },
      buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 28,
      },
      modalContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
      },
      solidBackground: {
        backgroundColor: globalStyles.backgroundColors.shade4,
      },
      buttonIconContainer: {
        borderRadius: 35,
        width: 70,
        height: 70,
        overflow: "hidden",
        backgroundColor: globalStyles.backgroundColors.shade4,
      },
      statusTextStyle: {
        color: globalStyles.fontColors.statusWarning,
        fontFamily: globalStyles.fontFamily.regular,
      },
      statusIcon: {
        fontFamily: globalStyles.fontFamily.icons,
      },
      descriptionStyle: {
        color: globalStyles.fontColors.darkGrey,
        fontFamily: globalStyles.fontFamily.regular,
      },
      metadataStyle: {
        color: globalStyles.fontColors.lightGrey,
        fontFamily: globalStyles.fontFamily.semiBold,
      },
      titleStyle: {
        color: globalStyles.fontColors.light,
        fontFamily: globalStyles.fontFamily.bold,
      },
      seasonNumberTextStyle: {
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.light,
      },
      networkImageStyle: {
        resizeMode: "contain",
        height: 64,
        width: 64,
      },
      separatorTextStyle: {
        color: globalStyles.fontColors.lightGrey,
      },
      focusedUnderLine: {
        backgroundColor: globalStyles.backgroundColors.primary1,
      },
    })
);

export default EpisodeList;
