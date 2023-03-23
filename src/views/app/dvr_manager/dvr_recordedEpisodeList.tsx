import {
  Alert,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PageContainer } from "../../../components/PageContainer";
import { AppImages } from "../../../assets/images";
import { globalStyles } from "../../../config/styles/GlobalStyles";
import { AppStrings, getFontIcon } from "../../../config/strings";
import { config } from "../../../config/config";
import {
  RecordStatus,
  RestrictionValue,
  sourceTypeString,
} from "../../../utils/analytics/consts";
import { ItemShowType, SourceType } from "../../../utils/common";
import {
  findChannelByStationId,
  format,
  isInHome,
  massageDVRFeed,
  removeEntitlementsAbbreviationsAndSort,
} from "../../../utils/assetUtils";
import { generateType, getImageUri } from "../../../utils/Subscriber.utils";
import { GLOBALS } from "../../../utils/globals";
import { HorizontalShowcardButtonType } from "./dvr_manager.screen";
import { IChannelCache } from "../../../utils/live/live";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import FastImage from "react-native-fast-image";
import { getUIdef } from "../../../utils/uidefinition";
import {
  getScaledValue,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../utils/dimensions";
import MFOverlay from "../../../components/MFOverlay";
import { DetailsSidePanel } from "../details_pages/DetailSidePanel";
import { DetailRoutes } from "../../../config/navigation/DetailsNavigator";
import axios from "axios";
import { IRecordingToDelete } from "../../../@types/subscriptionGroup";

interface Props {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}
const deleteIcon = getFontIcon("delete");
const editIcon = getFontIcon("edit");
const infoIcon = getFontIcon("info");
const playIcon = getFontIcon("play");
const savedIcon = getFontIcon("dvr_saved");
const unSavedIcon = getFontIcon("dvr_unsaved");

// const deleteIcon = AppImages.Delete_ic; // getFontIcon("delete");
// const editIcon = AppImages.More_info_ic; // getFontIcon("edit");
// const infoIcon = AppImages.More_info_ic; //getFontIcon("info");
// const playIcon = AppImages.Play_ic;
// const savedIcon = AppImages.Save_ic; // getFontIcon("dvr_saved");
// const unSavedIcon = AppImages.Save_ic; // getFontIcon("dvr_unsaved");
const lazyListConfig: any = getUIdef("EpisodeList.LazyListWrapper")?.config;
const scaledSnapToInterval = getScaledValue(lazyListConfig.snapToInterval);

const DvrRecordedEpisode = (props: any) => {
  const navigationParams = props.route.params;
  const { item } = navigationParams;
  console.log("props inside DvrRecordedEpisode", props);
  const [ctaButtonList, setCTAButtonList] = useState<any[]>([]);
  const [season, setSeason] = useState<any[]>([]);
  const [currentDvrMenu, setCurrentDvrMenu] = useState("");
  const [mainSeason, setMainSeason] = useState<any[]>([]);
  const [seriesDetails, setSeriesDetails] = useState({});
  const [metaData, setMetaData] = useState<any>({});
  const [itemType, setItemType] = useState("");
  const [currentSeason, setCurrentSeason] = useState<any>();
  const [currentEpisode, setCurrentEpisode] = useState<any>(undefined);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState(
    Array<any>
  );
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState(DetailRoutes.MoreInfo);
  const [screenProps, setScreenProps] = useState<any>();
  const [seasonItemHeight, setSeasonItemHeight] = useState(1);
  const [isSeasonFocused, setIsSeasonFocused] = useState(true);
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
  let episodeFlatList = React.createRef<FlatList>();
  let seasonScrollView = React.createRef<ScrollView>();
  let seasonButtonRef: React.RefObject<any> = React.createRef<any>();
  let firstEpisodeRef: React.RefObject<any> = React.createRef<any>();
  let lastEpisodeRef: React.RefObject<any> = React.createRef<any>();
  const drawerRef: React.MutableRefObject<any> = useRef();
  const moreInfoDrawerRef: React.MutableRefObject<any> = useRef();

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
  let firstButtonRef = React.createRef();
  let isSeasonScrolled = false;
  const toggleMoreInfo = (item: any) => {
    console.log('toggleMoreInfo', item)
    let udpData: any = {};
    const {
      Definition,
      SubscriptionItems: SubscriptionGroups = [],
      SeriesDetails,
      SeriesId,
      title: itemTitle = "",
      Settings,
    } = item;
    const [subscriptionItem = {}] = SubscriptionGroups || [];
    if (SeriesDetails) {
      udpData = SeriesDetails;
    } else  {
      udpData = subscriptionItem.ProgramDetails || {};
    }
    udpData["description"] = item.SubscriptionItems[0].ProgramDetails.Description || "";
    udpData["title"] = item?.title || "";
    setScreenProps({
      udpData: udpData,
      networkInfo: null, //networkInfo,
      genres: udpData?.genre || udpData?.Genre, // || discoveryProgramData?.genre,
    });
    setRoute(DetailRoutes.MoreInfo);
    // drawerRef?.current.pushRoute(DetailRoutes.MoreInfo, {
    //   udpData: udpDataAsset,
    //   networkInfo: networkInfo,
    //   genres: udpDataAsset?.genre || discoveryProgramData?.genre,
    // });
    setOpen(true);
    // drawerRef.current.close();
    moreInfoDrawerRef?.current?.open();
    
  };
  const closeMoreInfoModal = () => {
    console.log("close modal called on dvr manager");
    // setOpenSidePannel(false);
    moreInfoDrawerRef.current.close();
  };
  const deleteDvrListOrItem = (item: any) => {
    // setState({
    //   isDeleted: true,
    // });
    let RecordingsToDelete: any = [];
    let obj = {
      SubscriptionId: item?.SubscriptionId,
      SubscriptionItemIds: [item?.Id],
      isSeries: false,
    };
    RecordingsToDelete.push(obj);

    props
      .deleteRequest({
        RecordingsToDelete,
      })
      .then(() => {
        // ToDo: after deleting the item refresh the page
        // props.getViewableRecordings().then(() => {
        //   setupData();
        // });
      });
  };

  // const cancelDvrButton = () => {
  //   if (focuszoneRef?.current) {
  //     FocusManager.focus(focuszoneRef?.current);
  //   }
  // };

  const onPressPlayDVR = (item: any) => {
    const channel = findChannelByStationId(
      item.StationId,
      undefined,
      undefined,
      props.channelMap
    );

    const channelInfo = {
      Schedule: { ...item }, // to avoid cyclic error in json.stingify used in Video.tsx
      Channel: channel,
      Service: props.channelMap?.getService(channel?.channel),
    };

    item["ChannelInfo"] = channelInfo;
    // (item["assetType"] = generateType(item, SourceType.DVR)),
    //   isPconBlocked(item?.ProgramDetails, props.locale?.full).then(
    //     (isBlocked) => {
    //       if (isBlocked) {
    //         props.navigation.pushRoute("PconDisplay", {
    //           data: item,
    //           onSuccess: playDvr,
    //           pinType: PinType.content,
    //         });
    //       } else {
    //         playDvr(item);
    //       }
    //     }
    //   );
  };

  const onPressSave = (item: any) => {
    console.log("onPressSave", item);
    const id: string = item.UniversalProgramId || item.Id;
    
    const serviceMap = GLOBALS.bootstrapSelectors?.ServiceMap.Services; //bootstrapBootstrapSelectors.serviceMap(getState());
    if (!serviceMap) {
      throw "No serviceMap or axios instance.";
    }
    return axios
      .put(
        `${serviceMap.dvr}v1/scheduled-items/${id}/settings`,
        item.dvrSetting
      )
      .then((response: any) => {
        console.log("response coming in save item", response);
        if (response?.data?.State === "Completed") {
        }
      })
      .catch((err: any) => {
        console.log("POST METHOD ERROR: ", err);
      });
  };

 

  const deleteDvrPopUp = (item: any) => {
    Alert.alert(AppStrings?.str_dvr_delete_warning, "", [
      {
        text: AppStrings?.str_profile_button_delete,
        onPress: () => {
          deleteRecording(item);
        },
      },
      {
        text: AppStrings?.str_profile_button_cancel,
        onPress: () => {},
      },
    ]);

   
  };
  const deleteRecording = (item: any) => {
    console.log("item to delete", item);
    const { SeriesId, SeasonNumber, EpisodeNumber } =
      item?.ProgramDetails || {};
    const isSeries = !!(SeriesId || SeasonNumber || EpisodeNumber);
    const objRecorded: IRecordingToDelete  = {
      SubscriptionId: item?.SubscriptionId,
      SubscriptionItemIds: [item?.Id || item.UniversalProgramId],
      isSeries: isSeries,
    };
    // const recordDetails: IBatchDeleteRequest = [[objRecorded]];

    const serviceMap = GLOBALS.bootstrapSelectors?.ServiceMap.Services; //bootstrapBootstrapSelectors.serviceMap(getState());
    // const axios = sdkConfigSelectors.api(getState());
    if (!serviceMap) {
      throw "No serviceMap or axios instance.";
    }
    return axios
      .post(`${serviceMap.dvr}v1/batch-delete-request`, [objRecorded])
      .then((response: any) => {
        if (response?.data?.State === "Completed") {
          // dispatch(initData.actionCreators.request());
        }
      })
      .catch((err: any) => {
        console.log("POST METHOD ERROR: ", err);
      });
  };
  
  const setupData = () => {
    const massagedData = item || [];
    let filteredRecording: any;
    if (massagedData?.ItemType === ItemShowType.DvrRecording) {
      filteredRecording = viewableRecordings?.filter((item: any) => {
        return item.SubscriptionItems.length > 0;
      });
    } else {
      filteredRecording = scheduledRecordings?.filter((item: any) => {
        return item.SubscriptionItems.length > 0;
      });
    }
    console.log(
      "filteredRecording for scheduled",
      GLOBALS.scheduledSubscriptions
    );
    renderData(massagedData, filteredRecording);
  };
  const renderData = (massagedData: any, filteredRecording: any) => {
    let setItemState: any =
      massagedData?.ItemType === ItemShowType.DvrRecording
        ? { Recorded: 1, Recording: 1 }
        : { Scheduled: 1, Recording: 1 };
    let filterTvDetails: any = [];
    let seasonObj: any = {};
    if (massagedData && filteredRecording) {
      const { SeriesId, SubscriptionItems = [] } = massagedData || {};
      let tvShows = filteredRecording.filter((item: any) => {
        const { SeriesId, Definition, SubscriptionItems } = item;
        const [subscriptionItem = {}] = SubscriptionItems || [];
        let { ProgramDetails: { ShowType = undefined } = {} } =
          subscriptionItem || {};
        return (
          !!SeriesId ||
          (Definition === Definition.GENERIC_PROGRAM &&
            ShowType === ItemShowType.TVShow) ||
          (Definition === Definition.SINGLE_PROGRAM &&
            ShowType == ItemShowType.TVShow)
        );
      });
      if (SeriesId) {
        filterTvDetails = tvShows.filter((item: any) => {
          return item.SeriesId === SeriesId;
        });
      } else {
        filterTvDetails = [massagedData];
      }

      filterTvDetails?.length &&
        filterTvDetails.forEach((itemFilter: any) => {
          itemFilter?.SubscriptionItems.forEach((item: any) => {
            if (setItemState[item.ItemState] !== undefined) {
              if (item?.ProgramDetails?.SeasonNumber) {
                if (seasonObj[item.ProgramDetails.SeasonNumber] === undefined) {
                  seasonObj[item.ProgramDetails.SeasonNumber] = [item];
                } else {
                  seasonObj[item.ProgramDetails.SeasonNumber] = [
                    ...seasonObj[item.ProgramDetails.SeasonNumber],
                    item,
                  ];
                }
              } else if (
                seasonObj[AppStrings?.str_default_season] !== undefined
              ) {
                seasonObj[AppStrings?.str_default_season] = [
                  ...seasonObj[AppStrings?.str_default_season],
                  item,
                ];
              } else {
                seasonObj[AppStrings?.str_default_season] = [item];
              }
            }
          });
        });
      const [filteredTVItem = {}] = filterTvDetails || [];
      const {
        SeriesDetails: { Title = "", StartYear = "", Rating = "" } = {},
      } = filteredTVItem;
      let seriesDetailsObject = {
        title: Title,
        year: `${StartYear} ${Rating}`,
      };
      let seasonsObj: any = [];

      if (Object.keys(seasonObj).length > 0) {
        for (let key in seasonObj) {
          let seasonsminiObj: any = {};
          seasonsminiObj["SeasonNumber"] = key;
          seasonsminiObj["EpisodesCount"] = seasonObj[key].length;
          seasonsminiObj["Name"] =
            key !== AppStrings?.str_default_season ? "Season " + key : key;
          seasonsminiObj["Id"] = key;
          seasonsObj.push(seasonsminiObj);
        }
      }

      if (!seasonsObj?.length) {
        // If no seasons to show, navigate back to DVR manager
        props.navigation.popRoute();
      } else {
        // To Do: set requires data state values
        setCurrentSeason(seasonsObj[0]);
        setCurrentDvrMenu(seasonsObj[0].Id);
        setSeason(seasonsObj);
        setMainSeason(seasonObj);
        setMetaData(filterTvDetails[0]);
        setItemType(massagedData?.ItemType);
        setSeriesDetails(seriesDetailsObject);
        console.log("data in side recorded ep list", {
          season: seasonsObj,
          currentDvrMenu: seasonsObj[0].Id,
          mainSeason: seasonObj,
          seriesDetails: seriesDetailsObject,
          metaData: filterTvDetails[0],
          itemType: massagedData?.ItemType,
        });
        
      }
    }
  };

  const getCtaButtons = (item: any) => {
   
    let ipStatus = props.account?.ClientIpStatus || {};
    if (!config.inhomeDetection.useSubscriberInHome) {
      // networkIHD data
      const inHomeValue =
        props.networkIHD?.status === "inHome" ||
        config.inhomeDetection.inHomeDefault;
      ipStatus["InHome"] = inHomeValue
        ? RestrictionValue.Yes
        : RestrictionValue.No;
    }
    const ctaButtonList = [];
    if (item.itemType === ItemShowType.DvrRecording) {
     
      ctaButtonList.push({
        type: "TextIcon",
        text: item?.Settings?.RecyclingDisabled
          ? AppStrings?.str_dvr_saved
          : AppStrings?.str_profile_button_save,
        icon: item?.Settings?.RecyclingDisabled ? savedIcon : unSavedIcon,
        onPress: () => onPressSave(item),
      });
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_details_cta_more_info,
        icon: infoIcon,
        onPress: () => toggleMoreInfo(item),
      });
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_profile_button_delete,
        icon: deleteIcon,
        onPress: () => deleteDvrPopUp(item),
      });
    } else {
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_app_edit,
        icon: editIcon,
        onPress: () => {
         // TODO: Edit to be implemented
          // editRecording(item),
        },
      });
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_details_cta_more_info,
        icon: infoIcon,
        onPress: () => toggleMoreInfo(item),
      });
    }
    setCTAButtonList(ctaButtonList);
    console.log("ctaButtonList", ctaButtonList);
  };
  const getChannelByStationId = (
    channels: IChannelCache[],
    stationId: string
  ) => {
    return channels?.find(
      (channel) => channel.ChannelNumber.toString() === stationId
    );
  };
  useEffect(() => {
    getCtaButtons(item);
    setupData();
  }, []);
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
  const renderSeasons = () => {
    console.log("seasons in renderSeasons", season);
    if (season?.length > 0) {
      return season?.map((season: any, index: number) => {
        season["index"] = index;
        //   season["onFocus"] = handleSeasonFocus;
        if (currentSeason?.Id === season?.Id && !isSeasonScrolled) {
          scrollToSeasonItem(index);
        }
        return renderSeasonItem(season);
      });
    } else {
      return <View />;
    }
  };

  const handleSeasonFocus = (season: any) => {
    console.log("season item focused", season);
    setIsSeasonFocused(true);
    if (season?.Id !== currentSeason?.Id) {
      /** Focused season is different from current active season  So, update episode list and everything */
      //@ts-ignore
      episodeFlatList?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCurrentSeasonEpisodes([]);
      setCurrentEpisode(undefined);
      
      // Season and Episodes
      if (currentSeason) {
        setCurrentSeason(season);
      }
      // setCTAList([]);
    } else {
      /** Focused season is same as currently active season  So, don't update anything */
      setCurrentEpisode(undefined);
      // setCTAList([]);
    }
  };
  const renderSeasonItem = (season: any) => {
    console.log("season in renderSeasonItem", season);
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
    console.log(isCurrentSeason, isCurrentSeason);
    const isCTAButtonlistEmpty = ctaButtonList?.length <= 0;
    const selectedHighlightStyles =
      isCurrentSeason && isSeasonFocused
        ? styles.seasonBlockSelectedHighlight
        : {};

    const textStyle = isCurrentSeason
      ? styles.seasonTextSelected
      : styles.seasonText;
    return (
      <View
        style={StyleSheet.flatten([
          styles.seasonBlock,
          selectedHighlightStyles,
        ])}
        key={`SeasonItem_${index}`}
      >
        <Pressable
          onFocus={handleSeasonItemFocus}
          onBlur={() => {
            console.log("season Blurred");
          }}
          hasTVPreferredFocus={index === 0}
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
  const handleItemFocus = (item: any, index: any) => {
    console.log("handleItemFocus render episode", handleItemFocus);
    setCurrentEpisode(item);
  };

  const renderEpisodeContents = (episodeItem: any) => {
    const { item, index } = episodeItem;
    console.log("episodeItem in renderEpisodeContents", item);
    // const { Description = "" } =item?.CatalogInfo;
    const Description = item.ProgramDetails.Description;
    const name = item.ProgramDetails.Title || item.ProgramDetails.EpisodeName;

    let selectedStyle: any = styles.unSelectedEpisode;
    let isSelectedEpisode = false;
    if (item.Id === currentEpisode?.Id) {
      selectedStyle = styles.selectedEpisode;
      isSelectedEpisode = true;
    }
    const handleEpisodeFocus = () => {
      handleItemFocus(item, index);
    };

    // const statusText =
    //   episodeDetailsData?.statusText[0] ||item?.statusText || "";
    const statusText = item?.statusText || "";
    const imageSource =
      getImageUri(item?.ProgramDetails, "16x9/Poster") ||
      getImageUri(item?.ProgramDetails, "16x9/KeyArt") ||
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
      item?.Id === Schedule?.Id &&
      Schedule?.playSource === sourceTypeString.UPCOMING
    ) {
      item["Bookmark"] = undefined;
    }
    const image =
      item?.ProgramDetails?.image16x9KeyArtURL || metaData?.image16x9KeyArtURL;
    // const ctaButtons = getCtaButtons(item);
    return (
      <View
        style={[styles.episodeItemContainer, selectedStyle]}
        key={`ListItem_${index}`}
        ref={
          index === 0
            ? firstEpisodeRef
            : // : index === currentSeasonEpisodes.length - 1
              // ? lastEpisodeRef
              undefined
        }
      >
        {currentEpisode && currentEpisode?.Id === item?.Id ? (
          // &&
          // ctaButtonList &&
          // ctaButtonList?.length
          <View
            ref={index === 0 ? firstEpisodeRef : undefined}
            style={styles.episodeItemShowcard}
          >
            <FastImage
              //@ts-ignore
              source={imageSource}
              style={styles.episodeItemImage}
              fallback
              defaultSource={AppImages.bgPlaceholder}
            >
              {item.episodeInfo && (
                <MFOverlay
                  renderGradiant={true}
                  displayTitle={item.episodeInfo}
                  displayTitleStyles={[
                    styles.seasonNumberTextStyle,
                    { fontSize: 29, margin: 14 },
                  ]}
                  showProgress={item.Bookmark! || item.progress}
                  progress={
                    item?.Bookmark?.TimeSeconds &&
                    item?.Bookmark?.RuntimeSeconds &&
                    (item?.Bookmark?.TimeSeconds /
                      item?.Bookmark?.RuntimeSeconds) *
                      100
                  }
                />
              )}
            </FastImage>
            <View style={[styles.episodeItemInfo, { flexShrink: 1 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.episodeItemTitle}>{name}</Text>
                {item.dvrItemsState && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.statusIcon,
                        iconStyle,
                        { fontSize: 50, marginRight: 5 },
                      ]}
                    >
                      {getFontIcon("pin_digit")}
                    </Text>
                    <Text style={styles.episodeItemMetadata}>
                      {item.dvrItemsState}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.episodeItemMetadata}>{item.metadata}</Text>
              <Text style={styles.episodeItemDescription} numberOfLines={2}>
                {Description}
              </Text>
              {currentEpisode?.Id === item?.Id && (
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
            // disabled={currentEpisode?.Id === item?.Program?.id}
            // focusable={currentEpisode?.Id !== item?.Program?.id}
            ref={index === 0 ? firstEpisodeRef : undefined}
            style={styles.episodeItemShowcard}
          >
            <FastImage
              //@ts-ignore
              source={imageSource}
              style={styles.episodeItemImage}
              fallback
              defaultSource={AppImages.bgPlaceholder}
            >
              {item.episodeInfo && (
                <MFOverlay
                  renderGradiant={true}
                  displayTitle={item.episodeInfo}
                  displayTitleStyles={[
                    styles.seasonNumberTextStyle,
                    { fontSize: 29, margin: 14 },
                  ]}
                  showProgress={item.Bookmark! || item.progress}
                  progress={
                    item?.Bookmark?.TimeSeconds &&
                    item?.Bookmark?.RuntimeSeconds &&
                    (item?.Bookmark?.TimeSeconds /
                      item?.Bookmark?.RuntimeSeconds) *
                      100
                  }
                />
              )}
            </FastImage>
            <View style={[styles.episodeItemInfo, { flexShrink: 1 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.episodeItemTitle}>{name}</Text>
                {item.dvrItemsState && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.statusIcon,
                        iconStyle,
                        { fontSize: 50, marginRight: 5 },
                      ]}
                    >
                      {getFontIcon("pin_digit")}
                    </Text>
                    <Text style={styles.episodeItemMetadata}>
                      {item.dvrItemsState}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.episodeItemMetadata}>{item.metadata}</Text>
              <Text style={styles.episodeItemDescription} numberOfLines={2}>
                {Description}
              </Text>
              {currentEpisode?.Id === item?.Id && (
                <Text style={styles.statusTextStyle} numberOfLines={2}>
                  {statusText}
                </Text>
              )}
            </View>
          </Pressable>
        )}
        <View style={styles.buttonContainer}>
          {isSelectedEpisode && (
            <ScrollView horizontal snapToAlignment={"start"} snapToInterval={0}>
              {ctaButtonList?.length > 0 &&
                ctaButtonList?.map((cta: any, index: number) => {
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
                      key={`ctaBtn_${cta.text}_${index}`}
                      ref={
                        index === 0
                          ? firstButtonRef
                          : (buttonRefObject as any)[cta.text]
                      }
                      focusable
                      iconSource={0}
                      hasTVPreferredFocus={index === 0}
                      imageSource={0}
                      avatarSource={undefined}
                      onFocus={() => {
                        // setOpen(false);
                        // drawerRef.current.close();
                        // drawerRef.current.resetRoutes();
                      }}
                      variant={MFButtonVariant.FontIcon}
                      fontIconSource={cta.icon}
                      fontIconTextStyle={StyleSheet.flatten([
                        styles.textStyle,
                        {
                          fontSize: 90,
                          color: cta.text?.includes("Record")
                            ? globalStyles.fontColors.badge
                            : "white",
                        },
                      ])}
                      onPress={cta.onPress}
                      textStyle={{
                        color: "#EEEEEE",
                        fontFamily: "Inter-SemiBold",
                        fontSize: 25,
                        fontWeight: "600",
                        textAlign: "center",
                        marginLeft: 21,
                      }}
                      textLabel={cta.text}
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
        </View>
      </View>
    );
    // })
    // }
    // );
  };
  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={AppImages.landing_background}
        style={styles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={styles.containerStyle}>
          <View style={styles.firstBlock}>
            <View style={styles.titleBlock}>
              <Text style={[styles.seasonMetadata, { marginBottom: 32 }]}>
                DVR Manager
              </Text>
              <Text style={styles.seasonTitle}>
                {item.title.length > 20
                  ? `${item.title.substr(0, 20)} ...`
                  : item.title}
              </Text>
              <Text style={styles.seasonMetadata}>{item.metadataLine2}</Text>
            </View>
            <View style={styles.flexOne}>
              <ScrollView
                style={styles.seasonScrollView}
                ref={seasonScrollView}
              >
                {renderSeasons()}
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: 50,
              height: SCREEN_HEIGHT,
              backgroundColor: "transparent",
              // position:'absolute'
            }}
            onFocus={() => {
              // Alert.alert('focus is on bar')
              console.log("focus is on bar", ctaButtonList.length);
              if (isSeasonFocused) {
                /** Basically we haven't focused on episodes yet.. so need to focus on episodes */
                firstEpisodeRef?.current?.setNativeProps({
                  hasTVPreferredFocus: true,
                });
                setIsSeasonFocused(false);
              } else {
                /** Coming from Episode list.. need to pick the correct season */
                seasonButtonRef?.current?.setNativeProps({
                  hasTVPreferredFocus: true,
                });
                setIsSeasonFocused(true);
              }
            }}
          />
          <View style={styles.secondBlock}>
            <FlatList
              snapToInterval={scaledSnapToInterval}
              snapToAlignment={lazyListConfig.snapToAlignment || "start"}
              horizontal={lazyListConfig.horizontal || false}
              ref={(ref: any) => {
                episodeFlatList = ref;
              }}
              //   extraData={this.state.ctaList}
              data={mainSeason[Number(currentDvrMenu)]}
              keyExtractor={(item: any) => item.Id}
              renderItem={renderEpisodeContents}
            />
            {/* <Pressable
              style={{
                width: SCREEN_WIDTH * 0.5,
                height: 10,
                backgroundColor: "red",
                alignSelf: "center",
              }}
              onFocus={() => {
                firstButtonRef?.current?.setNativeProps({
                  hasTVPreferredFocus: true,
                });
              }}
            /> */}
          </View>
        </View>
        <DetailsSidePanel
            ref={moreInfoDrawerRef}
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
            closeModal={closeMoreInfoModal}
            screenProps={screenProps}
          />
      </ImageBackground>
    </PageContainer>
  );
};

export default DvrRecordedEpisode;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  containerStyle: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 38,
    paddingLeft: 90,
    paddingRight: 58,
    backgroundColor: globalStyles.backgroundColors.shade1,
    opacity: 0.9,
  },
  firstBlock: {
    width: 543,
  },
  secondBlock: {
    flex: 1,
  },
  titleBlock: {
    marginBottom: 116,
  },
  seasonScrollView: {
    marginBottom: 30,
  },
  seasonTitle: {
    fontFamily: globalStyles.fontFamily.bold,
    fontSize: globalStyles.fontSizes.subTitle1,
    color: globalStyles.fontColors.light,
    marginBottom: 15,
    // width: 400,
    // height: 80,
    // overflow: "visible",
  },
  seasonMetadata: {
    fontFamily: globalStyles.fontFamily.semiBold,
    fontSize: globalStyles.fontSizes.body2,
    color: globalStyles.fontColors.lightGrey,
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
  solidBackground: {
    backgroundColor: globalStyles.backgroundColors.shade4,
  },
  focusedBackground: {
    backgroundColor: globalStyles.backgroundColors.primary1,
  },
  buttonIconContainer: {
    width: 70,
    height: 70,
  },
  ctaButtonStyle: {
    height: 66,
    fontFamily: globalStyles.fontFamily.semiBold,
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
  statusIcon: {
    fontFamily: globalStyles.fontFamily.icons,
  },
  descriptionStyle: {
    color: globalStyles.fontColors.darkGrey,
    fontFamily: globalStyles.fontFamily.regular,
  },
  statusTextStyle: {
    color: globalStyles.fontColors.statusWarning,
    fontFamily: globalStyles.fontFamily.regular,
    fontSize: globalStyles.fontSizes.body2,
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
  textStyle: {
    fontFamily: globalStyles.fontFamily.icons,
    color: globalStyles.fontColors.light,
  },
  separatorTextStyle: {
    color: globalStyles.fontColors.lightGrey,
  },
  focusedUnderLine: {
    backgroundColor: globalStyles.backgroundColors.primary1,
  },
  seasonBlock: {
    height: 62,
    marginBottom: 43,
    alignSelf: "flex-start",
  },
  seasonBlockSelectedHighlight: {
    borderBottomColor: globalStyles.backgroundColors.primary1,
    borderBottomWidth: 4,
  },
  seasonText: {
    fontFamily: globalStyles.fontFamily.regular,
    color: globalStyles.fontColors.darkGrey,
    fontSize: globalStyles.fontSizes.subTitle1,
  },
  seasonTextSelected: {
    fontFamily: globalStyles.fontFamily.bold,
    color: globalStyles.fontColors.light,
    fontSize: globalStyles.fontSizes.subTitle1,
  },
});
