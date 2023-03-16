import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";
import {
  getScaledValue,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../../utils/dimensions";
import { PageContainer } from "../../../../components/PageContainer";
import {
  chooseRating,
  format,
  isExpiringSoon,
  massageDiscoveryFeedAsset,
  massageEpisodePlayOption,
  massageProgramDataForUDP,
  massageSeasonPlayOptionData,
} from "../../../../utils/assetUtils";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import {
  assetTypeObject,
  RecordStatus,
  sourceTypeString,
} from "../../../../utils/analytics/consts";
import { getImageUri } from "../../../../utils/Subscriber.utils";
import FastImage from "react-native-fast-image";
import { useQuery } from "react-query";
import { defaultQueryOptions } from "../../../../config/constants";
import { getDataFromUDL } from "../../../../../backend";
import { GLOBALS } from "../../../../utils/globals";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { isFeatureAssigned } from "../../../../utils/helpers";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { DetailsSidePanel } from "../DetailSidePanel";
import { AppImages } from "../../../../assets/images";
import { Definition as DefinitionOfItem } from "../../../../utils/DVRUtils";
import { DetailRoutes } from "../../../../config/navigation/DetailsNavigator";
import MFOverlay from "../../../../components/MFOverlay";
import { appQueryCache } from "../../../../config/queries";

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
  const [currentEpisode, setCurrentEpisode] = useState<any>(undefined);
  const [ctaList, setCTAList] = useState<any>();
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState(
    Array<any>
  );
  const [episodeDetailsData, setEpisodeDetailsData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState(DetailRoutes.MoreInfo);
  const [screenProps, setScreenProps] = useState<any>();
  const [mount, setMount] = useState(false);

  const metadataList: string[] = discoveryData?.ReleaseYear
    ? [discoveryData?.ReleaseYear]
    : discoveryData?.StartYear
    ? [discoveryData?.StartYear]
    : [];
  if (chooseRating(discoveryData?.Ratings)) {
    metadataList.push(chooseRating(discoveryData?.Ratings));
  }
  const metadata = metadataList.join(" · ");
  const drawerRef: React.MutableRefObject<any> = useRef();
  const str_seasonNumber_episodeNumber: string =
    AppStrings?.str_seasonNumber_episodeNumber || "";

  let episodeFlatList = React.createRef<FlatList>();
  let seasonScrollView = React.createRef<ScrollView>();
  let seasonButtonRef: React.RefObject<any> = React.createRef<any>();
  let firstEpisodeRef: React.RefObject<any> = React.createRef<any>();
  let lastEpisodeRef: React.RefObject<any> = React.createRef<any>();

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

  const toggleSidePanel = () => {
    const { CatalogInfo } = currentEpisode;

    setScreenProps({
      udpData: navigationParams.udpData,
      networkInfo: navigationParams.udpData.networkInfo,
      genres:
        navigationParams.udpData?.genre ||
        navigationParams.discoveryProgramData?.genre,
      episodeData: {
        seasonNumber:
          CatalogInfo?.SeasonNumber || episodeDiscoveryData?.SeasonNumber,
        episodeNumber:
          CatalogInfo?.EpisodeNumber || episodeDiscoveryData?.EpisodeNumber,
        episodeName:
          CatalogInfo?.EpisodeName ||
          episodeDiscoveryData?.EpisodeName ||
          CatalogInfo?.Name,
        episodeDescription:
          CatalogInfo?.Description || episodeDiscoveryData?.Description,
      },
      episodeDetailsData: episodeDetailsData,
    });
    setRoute(DetailRoutes.MoreInfo);
    setOpen(open);
    drawerRef?.current?.open();
  };

  const ctaButtonPress: any = {
    [AppStrings?.str_details_program_record_button]: () => {
      drawerRef?.current?.close();
      const { stationId } = navigationParams;

      if (!episodeSchedules) {
        console.warn("No Schedules");
        return;
      }
      const schedules = episodeSchedules;
      if (schedules && schedules.length) {
        let schedule = schedules[0];
        // Get the correct schedule, the one which is shown in UI
        if (stationId && schedules && schedules.length) {
          schedule =
            schedules.find((s: any) => s?.StationId === stationId) || schedule;
        }
        const recordingOptions = {
          Definition: DefinitionOfItem.SINGLE_PROGRAM,
          Parameters: [
            {
              Key: "ProgramId",
              Value: episodeDiscoveryData?.Id,
            },
          ],
          Settings: {
            StationId: schedule.StationId,
            ChannelNumber: schedule.ChannelNumber as number,
            StartUtc: schedule.StartUtc,
            MaximumViewableShows: undefined,
            EndLateSeconds: GLOBALS.store!.settings.dvr?.stopRecording || 0,
            RecyclingDisabled: false,
            ShowType: "FirstRunOnly",
            AirtimeDomain: "Anytime",
            ChannelMapId: GLOBALS.userAccountInfo.ChannelMapId.toString(),
            IsMultiChannel: false,
          },
        };
        const params = {
          isNew: true,
          programId: episodeDiscoveryData.Id,
          seriesId: episodeDiscoveryData.SeriesId,
          isGeneric: episodeDiscoveryData?.isGeneric,
          programDiscoveryData: episodeDiscoveryData,
          schedules: schedules,
          recordingOptions: recordingOptions,
        };
        setRoute(DetailRoutes.EpisodeRecordOptions);
        setScreenProps(params);
        setOpen(open);
        drawerRef?.current?.open();
      }
    },
    [AppStrings?.str_details_cta_more_info]: toggleSidePanel,
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
    const allSubcriptionGroups = {
      ...(GLOBALS.scheduledSubscriptions || {}),
      SubscriptionGroups: [
        ...((GLOBALS.scheduledSubscriptions &&
          GLOBALS.scheduledSubscriptions.SubscriptionGroups) ||
          []),
        ...((GLOBALS.viewableSubscriptions &&
          GLOBALS.viewableSubscriptions.SubscriptionGroups) ||
          []),
      ],
    };
    const massagedSeasonResponse = massageSeasonPlayOptionData(
      udlResponse.data,
      GLOBALS.channelMap,
      stationId,
      allSubcriptionGroups,
      GLOBALS.userAccountInfo,
      undefined
    );
    console.log("massagedSeasonResponse", massagedSeasonResponse);
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
    const resp = massageEpisodePlayOption(udlResponse.data);
    return resp;
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
    return data.data;
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

  const { data: episodeDiscoveryData } = useQuery(
    ["get-episode-discoveryData", currentEpisode],
    getEpisodeDiscoveryData,
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
    if (seasonPlayOptions && episodeDiscoveryData && episodeSchedules) {
      const {
        discoveryData,
        subscriberData,
        stationId,
        isSeriesRecordingBlocked,
        isFromEPG,
        StationIdFromEPG,
        udpData,
      } = navigationParams;
      const hasFeatureIosCarrierBilling =
        isFeatureAssigned("IOSCarrierBilling");
      const allSubcriptionGroups = {
        ...(GLOBALS.scheduledSubscriptions || {}),
        SubscriptionGroups: [
          ...((GLOBALS.scheduledSubscriptions &&
            GLOBALS.scheduledSubscriptions.SubscriptionGroups) ||
            []),
          ...((GLOBALS.viewableSubscriptions &&
            GLOBALS.viewableSubscriptions.SubscriptionGroups) ||
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
          selectedEpisodeSeasonNumber =
            selectedEpisode.CatalogInfo.SeasonNumber;
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
          GLOBALS.viewableSubscriptions,
          GLOBALS.scheduledSubscriptions,
          GLOBALS.recorders,
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
        const { ctaButtons = undefined } = epData || {};

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
    } else {
      console.log("Haven't received full episode details yet..");
      return;
    }
    // Adding mount as a dependency to make the CTA useEffect re-fire after "DVR updated" duplex message is obtained
  }, [seasonPlayOptions, episodeDiscoveryData, episodeSchedules, mount]);

  useEffect(() => {
    appQueryCache.subscribe((event) => {
      console.log(event);
      if (event?.type === "queryUpdated") {
        if (event.query.queryHash?.includes("get-all-subscriptionGroups")) {
          setTimeout(() => {
            // A simple reset function to trigger the useEffect that calculates the CTA buttons
            setMount(!mount);
          }, 1000);
        }
      }
    });
  }, []);

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
      setCTAList([]);
    } else {
      /** Focused season is same as currently active season  So, don't update anything */
      setCurrentEpisode(undefined);
      setCTAList([]);
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
    console.log(season);
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
    const isCTAButtonlistEmpty = ctaList?.length <= 0;
    const selectedHighlightStyles =
      isCurrentSeason && isCTAButtonlistEmpty
        ? episodeStyles.seasonBlockSelectedHighlight
        : {};

    const textStyle = isCurrentSeason
      ? episodeStyles.seasonTextSelected
      : episodeStyles.seasonText;
    return (
      <View
        style={StyleSheet.flatten([
          episodeStyles.seasonBlock,
          selectedHighlightStyles,
        ])}
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
    // setCurrentEpisode(episode);
    const { discoveryData } = navigationParams;

    discoveryData["currentEpisode"] = episode;

    setCurrentEpisode(episode);
    if (episode?.index === skip - 2) {
      getMoreEpisodes();
    } else {
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
    console.log(subscriberData);
    return subscriberData?.CatalogInfo?.Seasons?.map(
      (season: any, index: number) => {
        season["index"] = index;
        //   season["onFocus"] = handleSeasonFocus;
        if (currentSeason?.Id === season?.Id && !isSeasonScrolled) {
          scrollToSeasonItem(index);
        }
        return renderSeasonItem(season);
      }
    );
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
      AppImages.bgPlaceholder;

    const progressBarStyle: any = getUIdef("ProgressBar")?.style;

    const iconStyle = {
      color:
        episode?.dvrItemsState !== RecordStatus.SCHEDULED
          ? globalStyles.auxiliaryColors.statusError
          : globalStyles.backgroundColors.primary1,
    };

    let networkImageSource = episode.channelLogoUri;
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
              fallback
              defaultSource={AppImages.bgPlaceholder}
            >
              {episode.episodeInfo && (
                <MFOverlay
                  renderGradiant={true}
                  displayTitle={episode.episodeInfo}
                  displayTitleStyles={[
                    episodeStyles.seasonNumberTextStyle,
                    { fontSize: 29, margin: 14 },
                  ]}
                  showProgress={episode.Bookmark! || episode.progress}
                  progress={
                    episode?.Bookmark?.TimeSeconds &&
                    episode?.Bookmark?.RuntimeSeconds &&
                    (episode?.Bookmark?.TimeSeconds /
                      episode?.Bookmark?.RuntimeSeconds) *
                      100
                  }
                />
              )}
            </FastImage>
            <View style={[episodeStyles.episodeItemInfo, { flexShrink: 1 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={episodeStyles.episodeItemTitle}>{name}</Text>
                {episode.dvrItemsState && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        episodeStyles.statusIcon,
                        iconStyle,
                        { fontSize: 50, marginRight: 5 },
                      ]}
                    >
                      {getFontIcon("pin_digit")}
                    </Text>
                    <Text style={episodeStyles.episodeItemMetadata}>
                      {episode.dvrItemsState}
                    </Text>
                  </View>
                )}
              </View>
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
              fallback
              defaultSource={AppImages.bgPlaceholder}
            >
              {episode.episodeInfo && (
                <MFOverlay
                  renderGradiant={true}
                  displayTitle={episode.episodeInfo}
                  displayTitleStyles={[
                    episodeStyles.seasonNumberTextStyle,
                    { fontSize: 29, margin: 14 },
                  ]}
                  showProgress={episode.Bookmark! || episode.progress}
                  progress={
                    episode?.Bookmark?.TimeSeconds &&
                    episode?.Bookmark?.RuntimeSeconds &&
                    (episode?.Bookmark?.TimeSeconds /
                      episode?.Bookmark?.RuntimeSeconds) *
                      100
                  }
                />
              )}
            </FastImage>
            <View style={[episodeStyles.episodeItemInfo, { flexShrink: 1 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={episodeStyles.episodeItemTitle}>{name}</Text>
                {episode.dvrItemsState && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        episodeStyles.statusIcon,
                        iconStyle,
                        { fontSize: 50, marginRight: 5 },
                      ]}
                    >
                      {getFontIcon("pin_digit")}
                    </Text>
                    <Text style={episodeStyles.episodeItemMetadata}>
                      {episode.dvrItemsState}
                    </Text>
                  </View>
                )}
              </View>
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
                      onFocus={() => {
                        setOpen(false);
                        drawerRef.current.close();
                        drawerRef.current.resetRoutes();
                      }}
                      variant={MFButtonVariant.FontIcon}
                      fontIconSource={cta.iconSource}
                      fontIconTextStyle={StyleSheet.flatten([
                        episodeStyles.textStyle,
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
          AppImages.landing_background
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
          <TouchableOpacity
            style={{
              width: 10,
              height: SCREEN_HEIGHT,
              backgroundColor: "transparent",
            }}
            onFocus={() => {
              if (ctaList.length <= 0) {
                /** Basically we haven't focused on episodes yet.. so need to focus on episodes */
                firstEpisodeRef?.current?.setNativeProps({
                  hasTVPreferredFocus: true,
                });
              } else {
                /** Coming from Episode list.. need to pick the correct season */
                seasonButtonRef?.current?.setNativeProps({
                  hasTVPreferredFocus: true,
                });
              }
            }}
          />
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
      <DetailsSidePanel
        ref={drawerRef}
        drawerPercentage={37}
        animationTime={200}
        overlay={false}
        opacity={1}
        open={open}
        animatedWidth={SCREEN_WIDTH * 0.37}
        closeOnPressBack={false}
        navigation={props.navigation}
        drawerContent={false}
        route={route}
        screenProps={screenProps}
        closeModal={() => {
          setOpen(false);
        }}
      />
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
        width: 300,
        marginBottom: 43,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
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
      textStyle: {
        fontFamily: globalStyles.fontFamily.icons,
        color: globalStyles.fontColors.light,
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
