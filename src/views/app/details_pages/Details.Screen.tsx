import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { Feed } from "../../../@types/HubsResponse";
import { AppImages } from "../../../assets/images";
import MFText from "../../../components/MFText";
import {
  DateToAMPM,
  getBookmark,
  getChannelName,
  getVodVideoProfileId,
  isExpiringSoon,
  massageCastAndCrew,
  massageDiscoveryFeedAsset,
  massagePreviousDate,
  massageProgramDataForUDP,
  massageSeriesDataForUDP,
  SubscriptionPackages,
  getEpisodeInfo,
  massageDiscoveryFeed,
} from "../../../utils/assetUtils";
import {
  isScheduleCurrent,
  metadataSeparator,
} from "../../../utils/Subscriber.utils";
import { getUIdef, scaleAttributes } from "../../../utils/uidefinition";
import { globalStyles as g } from "../../../config/styles/GlobalStyles";
import { PageContainer } from "../../../components/PageContainer";
import { format, getItemId } from "../../../utils/dataUtils";
import { AppStrings, getFontIcon } from "../../../config/strings";
import {
  assetTypeObject,
  BookmarkType,
  ContentType,
  fontIconsObject,
  itemTypeString,
  languageKey,
  pbr,
  sourceTypeString,
} from "../../../utils/analytics/consts";
import { Genre, ItemShowType, SourceType } from "../../../utils/common";
import { useQuery } from "react-query";
import {
  appUIDefinition,
  defaultQueryOptions,
} from "../../../config/constants";
import { DefaultStore } from "../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../utils/globals";
import { getDataFromUDL, getMassagedData } from "../../../../backend";
import ProgressBar from "../../../components/MFProgress";
import MFLoader from "../../../components/MFLoader";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import MFMenuStyles from "../../../config/styles/MFMenuStyles";
import MFSwimLane from "../../../components/MFSwimLane";
import { ButtonVariantProps } from "../../../components/MFButtonGroup/MFButtonGroup";
import { BookmarkType as udlBookMark } from "../../../utils/Subscriber.utils";
import { DetailsSidePanel } from "./DetailSidePanel";
import { isFeatureAssigned } from "../../../utils/helpers";
import { pinItem, unpinItem } from "../../../../backend/subscriber/subscriber";
import {
  invalidateQueryBasedOnSpecificKeys,
  queryClient,
  appQueryCache,
} from "../../../config/queries";
import { getSubscriberPins } from "../../../../backend/subscriber/subscriber";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routes } from "../../../config/navigation/RouterOutlet";
import { SCREEN_WIDTH } from "../../../utils/dimensions";
const { width, height } = Dimensions.get("window");
import MFProgressBar from "../../../components/MFProgressBar";
import {
  Definition as DefinationOfItem,
  DvrGroupShowType,
  validateEntitlements,
} from "../../../utils/DVRUtils";
import { DetailRoutes } from "../../../config/navigation/DetailsNavigator";
import { GlobalContext } from "../../../contexts/globalContext";
import { DuplexManager } from "../../../modules/duplex/DuplexManager";
import NotificationType from "../../../@types/NotificationType";

interface AssetData {
  id: string;
  assetType: {
    contentType: string;
    itemType: string;
    sourceType: string;
  };
  $top: number;
  $skip: number;
  pivots: string;
  contentTypeEnum: number;
}

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

interface SideMenuState {
  visible: boolean;
  panelName: string;
}

interface DetailsState {
  similarItemsData?: Array<any>;
  discoveryProgramData?: any;
  discoverySeriesData?: any;
  playActionsData?: any;
  discoveryProgramScheduleData?: any;
  discoverySeriesScheduleData?: any;
  subscriberData?: any;
  scheduleCache?: any;
  channelMap?: any;
  channelRightsData?: any;
  viewableSubscriptionGroupsData?: any;
  scheduledSubscriptionGroupsData?: any;
  allSubScriptionsData?: any;
}

const fontSize = { fontSize: 25 };

const DetailsScreen: React.FunctionComponent<DetailsScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;
  const drawerRef: React.MutableRefObject<any> = useRef();

  const castAndCrewRef: React.MutableRefObject<any> = useRef();
  const moreLikeThisRef: React.MutableRefObject<any> = useRef();

  const [similarData, setSimilarData] = useState<any>(undefined);
  const [discoveryProgramData, setdiscoveryProgramData] =
    useState<any>(undefined);
  const [discoverySchedulesData, setdiscoverySchedulesData] =
    useState<any>(undefined);
  const [playActionsData, setplayActionsData] = useState<any>(undefined);
  const [subscriberData, setsubscriberData] = useState<any>(undefined);
  const [udpDataAsset, setUDPDataAsset] = useState<any>();
  const [isCTAButtonFocused, setIsCTAButtonFocused] = useState(false);
  const [isFavoriteButtonFocused, setIsFavoriteButtonFocused] = useState(false);
  const [ctaButtonFocusState, setCTAButtonFocusState] = useState("");
  const [open, setOpen] = useState(false);
  const [similarItemsSwimLaneKey, setSimilarItemsSwimLaneKey] = useState("");
  const [castnCrewSwimLaneKey, setCastnCrewSwimlaneKey] = useState("");
  const [isItemPinned, setIsItemPinned] = useState(false);
  const [route, setRoute] = useState(DetailRoutes.MoreInfo);
  const [screenProps, setScreenProps] = useState<any>();
  const [state, currentState] = useState(false);

  const currentContext = useContext(GlobalContext);

  let scrollViewRef: any = React.createRef<ScrollView>();
  //@ts-ignore
  const favoriteSelected = getFontIcon("favorite_selected");
  //@ts-ignore
  const favoriteUnselected = getFontIcon("favorite_unselected");
  //@ts-ignore
  const listAdd = getFontIcon("list_add");
  //@ts-ignore
  const listAdded = getFontIcon("list_added");
  //@ts-ignore
  const liveIcon = getFontIcon("source_live");

  let buttonRefObject: Record<string, React.RefObject<any>> = {
    [AppStrings?.str_details_cta_subscribe]: React.createRef(),
    [AppStrings?.str_details_cta_play]: React.createRef(),
    [AppStrings?.str_details_cta_resume]: React.createRef(),
    [AppStrings?.str_details_cta_restart]: React.createRef(),
    [AppStrings?.str_details_cta_more_info]: React.createRef(),
    [AppStrings?.str_details_cta_more_episodes]: React.createRef(),
    [AppStrings?.str_details_cta_waystowatch]: React.createRef(),
    [AppStrings?.str_details_program_record_button]: React.createRef(),
    [AppStrings?.str_details_series_record_button]: React.createRef(),
    [AppStrings?.str_dvr_resolve_conflict]: React.createRef(),
    [AppStrings?.str_app_edit]: React.createRef(),
    [AppStrings?.str_details_cta_rent]: React.createRef(),
    [AppStrings?.str_details_cta_buy]: React.createRef(),
    [AppStrings?.str_details_cta_rentbuy]: React.createRef(),
    [AppStrings?.str_details_cta_package]: React.createRef(),
  };

  let ctaButtonRef: React.RefObject<any> = React.createRef();
  const favoriteButtonRef: React.RefObject<any> = React.createRef();
  const listAddButtonRef: React.RefObject<any> = React.createRef();
  const buttonFocuszoneRef: React.RefObject<any> = React.createRef();
  let networkInfo: any;

  const duplexManager: DuplexManager = DuplexManager.getInstance();

  const isSeries = (assetData: AssetData) =>
    assetData.assetType.contentType === ContentType.SERIES ||
    assetData.assetType.contentType === ContentType.EPISODE;

  const isProgramOrGeneric = (assetData: AssetData) =>
    assetData.assetType.contentType === ContentType.PROGRAM ||
    assetData.assetType.contentType === ContentType.GENERIC;

  const featureNotImplementedAlert = (
    title: string = "Missing implementation",
    message: string = "This feature not implemented yet"
  ) => {
    return Alert.alert(title, message);
  };

  const toggleSidePanel = () => {
    setScreenProps({
      udpData: udpDataAsset,
      networkInfo: networkInfo,
      genres: udpDataAsset?.genre || discoveryProgramData?.genre,
    });
    setRoute(DetailRoutes.MoreInfo);
    // drawerRef?.current.pushRoute(DetailRoutes.MoreInfo, {
    //   udpData: udpDataAsset,
    //   networkInfo: networkInfo,
    //   genres: udpDataAsset?.genre || discoveryProgramData?.genre,
    // });
    setOpen(true);
    drawerRef?.current?.open();

    // drawerRef.current.open();
  };
  const openNewRecording = () => {
    //TODO: We have a check for PCON. Need to implement
    const contentType = assetData.assetType?.contentType;
    let { ChannelInfo: { channel: currentChannel = undefined } = {} } =
      feed || {};
    if (
      contentType === ContentType.PROGRAM ||
      contentType === ContentType.GENERIC
    ) {
      let schedule = playActionsData.Schedules?.[0];

      // Get the correct schedule, the one which is shown in UI
      if (
        currentChannel &&
        playActionsData.Schedules &&
        playActionsData.Schedules.length
      ) {
        schedule = playActionsData.Schedules.find(
          (s: any) =>
            s?.ChannelNumber === currentChannel?.Number ||
            s?.ChannelNumber == currentChannel?.number
        );
      }
      if (schedule) {
        if (feed) {
          const {
            //@ts-ignore
            Schedule: {
              channelId: StationIdFromEPGSchedule = "",
              contentType: ContentTypeFromEPGSchedule = "",
            } = {},
            //@ts-ignore
            currentCatchupSchedule,
            //@ts-ignore
            currentCatchupSchedule: { ShowType = undefined } = {},
            //@ts-ignore
            ChannelInfo,
            //@ts-ignore
            currentSchedule,
            //@ts-ignore
            ShowType: ShowTypeSingleProgram = undefined,
            //@ts-ignore
            channel: { id: StationIdFromEPGChannel = "" } = {},
          } = feed;

          if (
            StationIdFromEPGSchedule &&
            ContentTypeFromEPGSchedule === ItemShowType.Movie
          ) {
            const actualSelectedChannel =
              GLOBALS.channelMap?.findChannelByStationId(
                StationIdFromEPGSchedule
              );
            if (actualSelectedChannel) {
              // assign the selected schedule
              const selectedSchedule = playActionsData.Schedules?.find(
                (s: any) =>
                  s?.ChannelNumber === actualSelectedChannel?.channel?.Number
              );
              if (selectedSchedule) {
                // overwrite
                schedule = selectedSchedule;
              }
            }
          }

          if (StationIdFromEPGChannel) {
            let actualSelectedChannel =
              GLOBALS.channelMap?.findChannelByStationId(
                StationIdFromEPGChannel
              );
            if (actualSelectedChannel) {
              // assign the selected schedule
              const selectedSchedule = playActionsData.Schedules?.find(
                (s: any) =>
                  s?.ChannelNumber === actualSelectedChannel?.channel?.Number
              );
              if (selectedSchedule) {
                // overwrite
                schedule = selectedSchedule;
              }
            }
          }

          if (ChannelInfo || currentSchedule) {
            const stationId =
              ChannelInfo?.channel?.StationId ||
              currentSchedule?.StationId ||
              schedule.StationId;

            const channel = playActionsData.Schedules?.find(
              (x: any) => x.StationId === stationId
            );
            const { StationId, ChannelNumber, StartUtc } = channel;
            GLOBALS.recordingData = {
              Definition: DefinationOfItem.SINGLE_PROGRAM,
              Parameters: [
                {
                  Key: "ProgramId",
                  Value: schedule?.ProgramId,
                },
              ],
              Settings: {
                StationId: StationId,
                ChannelNumber: ChannelNumber as number,
                StartUtc: StartUtc,
                EndLateSeconds: 0,
                RecyclingDisabled: false,
                ChannelMapId: GLOBALS.userAccountInfo.ChannelMapId?.toString(),
                IsMultiChannel: false,
              },
            };
            // this.props.setRecordingData();
          } else if (
            ShowType === ItemShowType.Movie ||
            ShowTypeSingleProgram === ItemShowType.Movie
          ) {
            const { StationId, ChannelNumber, CatchupStartUtc, StartUtc } =
              StationIdFromEPGSchedule
                ? schedule || currentCatchupSchedule
                : currentCatchupSchedule || schedule;
            if (ChannelNumber) {
              GLOBALS.recordingData = {
                Definition: DefinationOfItem.SINGLE_PROGRAM,
                Parameters: [
                  {
                    Key: "ProgramId",
                    Value: schedule?.ProgramId,
                  },
                ],
                Settings: {
                  StationId: StationId,
                  ChannelNumber: ChannelNumber as number,
                  StartUtc: CatchupStartUtc || StartUtc,
                  EndLateSeconds: 0,
                  RecyclingDisabled: false,
                  ChannelMapId:
                    GLOBALS.userAccountInfo.ChannelMapId?.toString(),
                  IsMultiChannel: false,
                },
              };
            }
          } else if (schedule) {
            const { StationId, ChannelNumber, StartUtc } = schedule;
            if (ChannelNumber) {
              GLOBALS.recordingData = {
                Definition: DefinationOfItem.SINGLE_PROGRAM,
                Parameters: [
                  {
                    Key: "ProgramId",
                    Value: schedule?.ProgramId,
                  },
                ],
                Settings: {
                  StationId: StationId,
                  ChannelNumber: ChannelNumber as number,
                  StartUtc: StartUtc,
                  EndLateSeconds: 0,
                  RecyclingDisabled: false,
                  ChannelMapId:
                    GLOBALS.userAccountInfo.ChannelMapId?.toString(),
                  IsMultiChannel: false,
                },
              };
              // this.props.setRecordingData();
            }
          }
        }
        let params = undefined;
        if (contentType === ContentType.GENERIC || schedule?.IsGeneric) {
          params = {
            isNew: true,
            isSeries: false,
            title: udpDataAsset.title,
            schedules: discoverySchedulesData,
            programId: schedule?.ProgramId,
            isGeneric: true,
            isPopupModal: true,
          };
          setRoute(DetailRoutes.EpisodeRecordOptions);
          setScreenProps(params);
          drawerRef.current?.open();
        } else {
          params = {
            isNew: true,
            programId: schedule?.ProgramId,
            seriesId: schedule?.SeriesId,
            title: schedule?.Name || "",
            isPopupModal: true,
          };
          setRoute(DetailRoutes.RecordingOptions);
          setScreenProps(params);
          drawerRef.current?.open();
        }
      }
    } else {
      let schedule = discoverySchedulesData[0];

      // Get the correct schedule, the one which is shown in UI
      const { Schedule: { channelId: StationIdFromEPGSchedule = "" } = {} } =
        feed || {};
      let ChannelNumber: any;
      if (StationIdFromEPGSchedule) {
        const actualSelectedChannel =
          GLOBALS.channelMap?.findChannelByStationId(StationIdFromEPGSchedule);

        ({ channel: { Number: ChannelNumber = undefined } = {} } =
          actualSelectedChannel || {});
      }

      if (
        (ChannelNumber || currentChannel) &&
        discoverySchedulesData &&
        discoverySchedulesData.length
      ) {
        schedule = discoverySchedulesData.find(
          (scheduleEntry: any) =>
            scheduleEntry?.ChannelNumber ===
            (ChannelNumber || currentChannel?.Number || currentChannel?.number)
        );
      }
      if (feed?.isFromEPG && StationIdFromEPGSchedule) {
        const currentSchedule = discoverySchedulesData.find(
          (scheduleEntry: any) => {
            return (
              scheduleEntry?.ProgramId === feed?.Schedule?.ProgramId &&
              scheduleEntry?.StationId === StationIdFromEPGSchedule &&
              scheduleEntry?.StartUtc === feed?.Schedule.StartUtc
            );
          }
        );
        if (currentSchedule) {
          schedule = currentSchedule;
        }
      }

      if (!schedule && feed?.Schedule) {
        schedule = feed?.Schedule;
      }
      if (
        udpDataAsset.ctaButtons.some(
          (cta: any) =>
            cta.buttonText === AppStrings?.str_details_program_record_button
        )
      ) {
        if (schedule) {
          GLOBALS.recordingData = {
            Definition: DefinationOfItem.SINGLE_PROGRAM,
            Parameters: [
              {
                Key: "ProgramId",
                Value: schedule?.ProgramId,
              },
            ],
            Settings: {
              StationId: schedule?.StationId,
              ChannelNumber: schedule?.ChannelNumber,
              StartUtc: schedule?.StartUtc,
              MaximumViewableShows: undefined,
              EndLateSeconds: 0,
              RecyclingDisabled: false,
              ShowType: "FirstRunOnly",
              AirtimeDomain: "Anytime",
              ChannelMapId: GLOBALS.userAccountInfo.ChannelMapId?.toString(),
              IsMultiChannel: false,
            },
          };
          setRoute(DetailRoutes.EpisodeRecordOptions);
          setScreenProps({
            programId: schedule?.ProgramId,
            seriesId: schedule?.SeriesId,
            isNew: true,
            schedules: discoverySchedulesData,
            isPopupModal: true,
          });
          drawerRef.current?.open();
        }
      } else {
        if (schedule) {
          GLOBALS.recordingData = {
            Definition: DefinationOfItem.SERIES,
            Parameters: [
              {
                Key: "TVSeriesId",
                Value: schedule?.SeriesId,
              },
            ],
            Settings: {
              StationId: schedule?.StationId,
              ChannelNumber: schedule?.ChannelNumber,
              StartUtc: schedule?.StartUtc,
              MaximumViewableShows: undefined,
              EndLateSeconds: 0,
              RecyclingDisabled: false,
              ShowType: DvrGroupShowType.Any,
              AirtimeDomain: "Anytime",
              ChannelMapId: GLOBALS.userAccountInfo.ChannelMapId?.toString(),
              IsMultiChannel: false,
            },
          };
          setRoute(DetailRoutes.RecordingOptions);
          setScreenProps({
            title: udpDataAsset.title,
            isNew: true,
            schedules: discoverySchedulesData,
            isSeries: true,
            isPopupModal: true,
          });
          drawerRef.current?.open();
        }
      }
    }
  };

  const startResolveConflict = () => {
    featureNotImplementedAlert();
  };

  const openEditRecordingsPanel = (data: any) => {
    console.log("Data in edit", data);
    const currentSubscriptionData = udpDataAsset.ctaButtons.find(
      (e: any) => e.buttonText === AppStrings?.str_app_edit
    );

    let isSeries = false;
    let isGeneric = false;
    let programId;
    if (currentSubscriptionData) {
      const {
        subscription: { SubscriptionGroup, SubscriptionItem } = {
          SubscriptionGroup: null,
          SubscriptionItem: null,
        },
      } = currentSubscriptionData;
      if (SubscriptionGroup && SubscriptionItem) {
        const { Definition, SeriesId } = SubscriptionGroup;
        const { ProgramId, IsGeneric } = SubscriptionItem;
        if (Definition === DefinationOfItem.SINGLE_PROGRAM) {
          isSeries = false;
          programId = ProgramId;
          isGeneric = !!IsGeneric;
        } else if (Definition === DefinationOfItem.SERIES) {
          isSeries = true;
          programId = SeriesId;
          isGeneric = !!IsGeneric;
        } else {
          isSeries = !!SeriesId;
          isGeneric = true;
          programId = isSeries ? SeriesId : ProgramId;
        }

        GLOBALS.recordingData =
          currentSubscriptionData?.subscription?.SubscriptionGroup;
        // this.props?.setRecordingData(data.subscription.SubscriptionGroup);
        let params = undefined;
        let panelName = undefined;
        if (isGeneric && !isSeries) {
          params = {
            isNew: false,
            isSeries,
            title: udpDataAsset.title,
            programId: programId,
            isGeneric,
            isPopupModal: true,
            isSubscriptionItem: true,
          };
          setScreenProps(params);
          if (Definition === DefinationOfItem.SINGLE_PROGRAM) {
            // panelName = SideMenuRoutes.DvrRecordingOptions;
            setRoute(DetailRoutes.RecordingOptions);
          } else {
            // panelName = SideMenuRoutes.DvrEpisodeRecordingOptions;
            setRoute(DetailRoutes.EpisodeRecordOptions);
          }
        } else {
          if (Definition === ItemShowType.SingleProgram) {
            params = {
              isNew: false,
              isSeries,
              programId: programId,
              title: udpDataAsset.title,
              isGeneric,
              isPopupModal: true,
              isSubscriptionItem: true,
              // onDvrItemSelected: this.setFocusBack,
              // onUpdate: this.onDVRUpdated,
            };
            setScreenProps(params);
            setRoute(DetailRoutes.RecordingOptions);
            // panelName = SideMenuRoutes.DvrRecordingOptions;
          } else {
            if (
              udpDataAsset.ctaButtons.some(
                (cta: any) =>
                  cta.buttonText ===
                  AppStrings?.str_details_series_record_button
              )
            ) {
              params = {
                isNew: false,
                programId: programId,
                isGeneric,
                title: udpDataAsset.title,
                isPopupModal: true,
                SubscriptionGroup,
                isSubscriptionItem: true,
                // onDvrItemSelected: this.setFocusBack,
              };
              setScreenProps(params);
              setScreenProps(DetailRoutes.RecordingOptions);
              // panelName = SideMenuRoutes.DvrRecordingOptions;
            } else {
              programId = SubscriptionItem?.ProgramId;
              if (
                feed?.Schedule?.ProgramId &&
                programId !== feed?.Schedule?.ProgramId
              ) {
                programId = feed?.Schedule?.ProgramId;
              }

              params = {
                isNew: false,
                seriesId: SeriesId,
                programId: programId,
                title: udpDataAsset.title,
                isPopupModal: true,
                SubscriptionGroup,
              };
              setScreenProps(params);
              setRoute(DetailRoutes.EpisodeRecordOptions);
              // panelName = SideMenuRoutes.DvrEpisodeRecordingOptions;
            }
          }
        }
        // this.props.openPanel(true, panelName, params);
        drawerRef.current.open();
      }
    }
  };

  const handlePlayDvr = () => {};
  const ctaButtonPress = {
    [AppStrings?.str_details_cta_subscribe]: () => {},
    [AppStrings?.str_details_cta_play]: () => {
      const playAction = getRestrictionsForVod(
        udpDataAsset.usablePlayActions,
        false
      );
      getBookmark(
        getVodVideoProfileId(udpDataAsset.usablePlayActions, false),
        udlBookMark.VOD
      )
        .then((bookmark) => {
          udpDataAsset["playSource"] = sourceTypeString.VOD;
          udpDataAsset["playAction"] = playAction;
          if (
            udpDataAsset?.assetType?.sourceType === sourceTypeString.CATCHUP
          ) {
            udpDataAsset["combinedEntitlements"] = [];
          }
          navigateToPlayer(bookmark);
        })
        .catch(() => {
          udpDataAsset["playSource"] = sourceTypeString.VOD;
          udpDataAsset["playAction"] = playAction;
          if (
            udpDataAsset?.assetType?.sourceType === sourceTypeString.CATCHUP
          ) {
            udpDataAsset["combinedEntitlements"] = [];
          }
          navigateToPlayer();
        });
    },
    [AppStrings?.str_details_cta_trailer]: () => {
      const playAction = getRestrictionsForVod(
        udpDataAsset.usablePlayActions,
        true
      );
      udpDataAsset["playSource"] = sourceTypeString.VOD;
      udpDataAsset["isTrailer"] = true;
      udpDataAsset["playAction"] = playAction;
      navigateToPlayer();
    },
    [AppStrings?.str_details_cta_play_from_beginning]: () => {
      const playAction = getRestrictionsForVod(
        udpDataAsset.usablePlayActions,
        false
      );
      udpDataAsset["restart"] = true;

      udpDataAsset["playSource"] = sourceTypeString.VOD;
      udpDataAsset["playAction"] = playAction;
      if (udpDataAsset?.assetType?.sourceType === sourceTypeString.CATCHUP) {
        udpDataAsset["combinedEntitlements"] = [];
      }
      navigateToPlayer();
    },
    [AppStrings?.str_details_cta_watch_live]: () => {
      let isHDMIblocked = udpDataAsset?.combinedEntitlements?.some(
        (entitlement: string) => entitlement == pbr.RestrictionsType.HI
      );
      if (isHDMIblocked) {
        // displayModal({
        //   text: AppStrings?.str_restrictions.apple_tv_blocked,
        //   defaultFocusTitle: AppStrings?.str_ok,
        //   buttonDataSource: [
        //     {
        //       title: AppStrings?.str_ok,
        //       onPress: setFocusBack,
        //     },
        //   ],
        // });
        return;
      }
      if (udpDataAsset?.ppvInfo?.hasPPV && !udpDataAsset?.ppvInfo?.isinHome) {
        const isOutOfHomeBlocked = udpDataAsset?.ppvInfo?.Entitlement?.some(
          (entitlement: string) =>
            entitlement == pbr.RestrictionsType.OUTOFHOME_BLOCKED ||
            entitlement == pbr.RestrictionsType.OH
        );
        if (isOutOfHomeBlocked) {
          // displayModal({
          //   text: AppStrings?.str_restrictions.oh,
          //   defaultFocusTitle: AppStrings?.str_ok,
          //   buttonDataSource: [
          //     {
          //       title: AppStrings?.str_ok,
          //       onPress: setFocusBack,
          //     },
          //   ],
          // });
          return;
        }
      }
      udpDataAsset["playSource"] = sourceTypeString.LIVE;
      navigateToPlayer();
    },
    [AppStrings?.str_details_cta_restart]: () => {
      const catchupSchedule = udpDataAsset.currentCatchupSchedule?.Schedule;
      getBookmark(
        `${catchupSchedule?.StationId.trim()}_${catchupSchedule?.StartUtc.trim()}_${catchupSchedule?.EndUtc.trim()}`,
        udlBookMark.CATCHUP
      )
        .then((bookmark) => {
          handleRestart(bookmark);
        })
        .catch(() => {
          handleRestart();
        });
    },
    [AppStrings?.str_details_cta_more_info]: toggleSidePanel,
    [AppStrings?.str_details_cta_more_episodes]: () => {
      //@ts-ignore
      const { StationId, Schedule, ChannelInfo, isFromEPG } = feed;
      const StationIdFromEPG = Schedule?.channelId;
      const { combinedEntitlements = [] } = udpDataAsset || {};
      const isRecordingBlocked = !validateEntitlements(
        combinedEntitlements,
        GLOBALS.recorders.recorders
      );
      props.navigation.push(Routes.EpisodeList, {
        discoveryData: discoveryProgramData,
        subscriberData: subscriberData,
        title: discoveryProgramData?.Name,
        udpData: udpDataAsset,
        //TODO: This is not supposed to be undefined. Find and fix the value
        contextualSchedule: undefined,
        stationId:
          StationId ||
          Schedule?.StationId ||
          ChannelInfo?.channel?.StationId ||
          Schedule?.channelId,
        isSeriesRecordingBlocked: isRecordingBlocked,
        isFromEPG,
        StationIdFromEPG,
      });
    },
    [AppStrings?.str_details_cta_waystowatch]: () => {
      featureNotImplementedAlert();
      // const { Schedule } = feed;

      // const episodeNumber = Schedule?.EpisodeNumber;
      // const seasonNumber = Schedule?.SeasonNumber;

      // const title = `${
      //   episodeNumber && seasonNumber
      //     ? `${format(
      //         AppStrings?.str_seasonNumber_episodeNumber || "S{0} E{0}",
      //         seasonNumber.toString(),
      //         episodeNumber.toString()
      //       )}${metadataSeparator}`
      //     : ""
      // }${udpDataAsset?.title}`;

      // const { CatchupSchedules = [], Schedules = undefined } =
      //   playActionsData || {};

      // let catchupSchedules = [];
      // for (const cs of CatchupSchedules) {
      //   if (isScheduleCurrent(cs)) {
      //     catchupSchedules.push(cs);
      //   }
      // }
      // udpDataAsset["Ratings"] = discoveryProgramData?.Ratings || [];
      // setRoute(DetailRoutes.WaysToWatch);
      // const waysToWatchProps = {
      //   title,
      //   subscriberPlayOptionsData: playActionsData,
      //   schedules: discoverySchedulesData,
      //   waysToWatch: udpDataAsset.waysToWatchSchedules,
      //   channelMap: GLOBALS.channelMap,
      //   catchupSchedules,
      //   udpData: udpDataAsset,
      //   networkIHD: undefined,
      //   account: GLOBALS.userAccountInfo,
      // };
      // console.log("waysToWatchProps", waysToWatchProps);
      // setScreenProps(waysToWatchProps);
      // drawerRef?.current?.open();
    },
    [AppStrings?.str_details_program_record_button]: openNewRecording,
    [AppStrings?.str_details_series_record_button]: openNewRecording,
    [AppStrings?.str_dvr_resolve_conflict]: startResolveConflict,
    [AppStrings?.str_app_edit]: openEditRecordingsPanel,
    [AppStrings?.str_details_cta_playdvr]: handlePlayDvr,
    [AppStrings?.str_details_cta_rent]: () => {
      //TODO: Finish implementation of CTA rent
      featureNotImplementedAlert();
    },
    [AppStrings?.str_details_cta_buy]: () => {
      //TODO: Finish implementation of CTA buy
      featureNotImplementedAlert();
    },
    [AppStrings?.str_details_cta_rentbuy]: () => {
      //TODO: Finish implementation of CTA rent-buy
      featureNotImplementedAlert();
    },
    [AppStrings?.str_details_cta_package]: () => {
      udpDataAsset["purchasePackage"] = true;
      //TODO: Finish implementation of Package details
      featureNotImplementedAlert();
    },
    [AppStrings?.str_details_cta_subscribe]: () => {
      const networks = udpDataAsset.subscriptionPackages.filter(
        (network: SubscriptionPackages) => {
          return network.purchaseNetwork != undefined;
        }
      );
      if (networks && networks.length > 0) {
        //TODO: Finish implementation for PurchaseNetwork feature
        // props.openPanel(true, SideMenuRoutes.PurchaseNetwork, {
        //     udpAssetData: udpDataAsset,
        //     panelTitle: AppStrings?.str_details_cta_subscribe,
        //     panelSubtitle: udpDataAsset?.title,
        //     confirmPlayCallBack: ctaButtonPress[
        //         AppStrings?.str_details_cta_play
        //     ],
        // });
      } else {
        udpDataAsset["subscriptionExists"] = true;
        //TODO: Finish implementation of PurchaseOptions
        // props.openPanel(true, SideMenuRoutes.PurchaseOptions, {
        //     udpAssetData: udpDataAsset,
        //     panelTitle: AppStrings?.str_details_cta_subscribe,
        //     confirmPlayCallBack: ctaButtonPress[
        //         AppStrings?.str_details_cta_play
        //     ],
        // });
      }
    },
  };

  const onGetScrollView = (scrolViewRef: ScrollView | null): void => {
    scrollViewRef = scrolViewRef;
  };
  const updateAssetData = () => {
    //@ts-ignore
    const assetType = feed?.assetType!;
    const id = getItemId(feed);
    const language =
      languageKey.language +
        GLOBALS?.store?.onScreenLanguage.languageCode?.split("-")?.[0] || "en";

    return {
      id,
      assetType,
      $top: 10,
      $skip: 0,
      pivots: language,
      contentTypeEnum:
        assetTypeObject[assetType.contentType] ||
        assetTypeObject[ContentType.PROGRAM],
    };
  };
  let assetData: AssetData = updateAssetData();

  const handleBackPress = () => {
    return true;
  };

  const onDuplexMessage = (message: any) => {
    if (message) {
      console.log("Details onMessage", message);
      switch (message.type) {
        case NotificationType.pin:
        case NotificationType.unpin:
          const status = getItemPinnedStatus();
          console.log("status", status);
          setIsItemPinned(status);
          break;
      }
    }
  };
  const getPinnedItemResponse = async () => {
    const udlParam = "udl://subscriber/library/Pins";
    const resp = await getDataFromUDL(udlParam);
    return resp.data;
  };

  const pinnedItemsResponse = useQuery(
    ["feed", "udl://subscriber/library/Pins"],
    getPinnedItemResponse,
    defaultQueryOptions
  );

  // useEffect(() => {
  //   if (
  //     !pinnedItemsResponse.isFetching &&
  //     pinnedItemsResponse.isFetched &&
  //     pinnedItemsResponse.isSuccess &&
  //     pinnedItemsResponse.data
  //   ) {
  //     const status = getItemPinnedStatus();
  //     console.log("status", status);
  //     setIsItemPinned(status);
  //   }
  // }, [
  //   pinnedItemsResponse.isFetched,
  //   pinnedItemsResponse.data,
  //   pinnedItemsResponse.dataUpdatedAt,
  //   pinnedItemsResponse.isSuccess,
  //   pinnedItemsResponse.isFetching,
  // ]);

  useEffect(() => {
    currentContext.addDuplexMessageHandler(onDuplexMessage);
    () => {
      currentContext.removeDuplexHandler(onDuplexMessage);
    };
  }, []);

  const getSimilarItemsForFeed = async ({ queryKey }: any) => {
    console.log("Querykey", queryKey);
    const [, assetData] = queryKey;
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${
      DefaultStore.Id
    }&$groups=${GLOBALS.store!.rightsGroupIds}&pivots=${
      assetData.pivots
    }&id=${id}&itemType=${assetData.contentTypeEnum}`;
    const udlParam = "udl://subscriber/similarprograms/" + params;
    const data = await getDataFromUDL(udlParam);
    const massagedData = getMassagedData(
      "udl://subscriber/similarprograms/",
      data
    );
    return massagedData;
  };

  const channelByStationId = (channels: any[], Schedule: any) => {
    let index;
    const channel = channels.find((element: any, defaultIndex: any) => {
      if (element.StationId == Schedule?.StationId) {
        index = defaultIndex;
        return element;
      }
    });
    return {
      channel,
      channelIndex: index,
    };
  };

  const handleFavoritePress = async () => {
    const seriesId = udpDataAsset?.SeriesId;
    let assetId;
    let assetType;
    if (seriesId) {
      assetId = seriesId;
      assetType = itemTypeString[assetTypeObject.SERIES];
    } else {
      assetId = assetData.id;
      assetType = itemTypeString[assetData.contentTypeEnum];
    }

    const {
      CatchupEndUtc,
      CatchupStartUtc,
      EndUtc,
      StartUtc,
      ProgramId,
      SeriesId,
      ShowType,
    } = udpDataAsset?.ChannelInfo?.Schedule || {};
    const convertedStartDate =
      (StartUtc && new Date(StartUtc)) ||
      (CatchupStartUtc && new Date(CatchupStartUtc));
    const convertedEndDate =
      (EndUtc && new Date(EndUtc)) ||
      (CatchupEndUtc && new Date(CatchupEndUtc));
    const now = Date.now();
    if (now >= convertedStartDate && now <= convertedEndDate) {
      if (ShowType === "TVShow") {
        assetId = SeriesId;
        assetType = "Series";
      } else {
        assetId = ProgramId;
        assetType = "Program";
      }
    }

    if (isItemPinned) {
      //@ts-ignore
      const resp = await unpinItem(assetId, assetType);
      if (resp.status >= 200 && resp.status <= 300) {
        setIsItemPinned(false);
        duplexManager.sendOrEnqueueMessage(NotificationType.unpin, {
          id: assetId,
          isPinned: false,
          itemType: assetId,
        });
        invalidateQueryBasedOnSpecificKeys(
          "feed",
          "udl://subscriber/library/Pins"
        );
      } else {
        Alert.alert("Something went wrong");
      }
    } else {
      //@ts-ignore
      const resp = await pinItem(assetId, assetType);
      if (resp.status >= 200 && resp.status <= 300) {
        setIsItemPinned(true);
        duplexManager.sendOrEnqueueMessage(NotificationType.pin, {
          id: assetId,
          isPinned: true,
          itemType: assetId,
        });
        invalidateQueryBasedOnSpecificKeys(
          "feed",
          "udl://subscriber/library/Pins"
        );
      } else {
        Alert.alert("Something went wrong");
      }
    }
  };

  const renderFavoriteButton = () => {
    return (
      <View style={[styles.buttonContainerStyle]}>
        <MFButton
          ref={favoriteButtonRef}
          focusable
          iconSource={0}
          imageSource={0}
          avatarSource={undefined}
          onFocus={() => {
            setIsFavoriteButtonFocused(true);
          }}
          onPress={handleFavoritePress}
          variant={MFButtonVariant.FontIcon}
          fontIconSource={isItemPinned ? favoriteSelected : favoriteUnselected}
          fontIconTextStyle={StyleSheet.flatten([
            styles.textStyle,
            { fontSize: 70, textAlign: "center", alignSelf: "center" },
          ])}
          style={[
            styles.buttonIconContainer,
            styles.solidBackground,
            {
              borderRadius: 35,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            },
          ]}
          focusedStyle={styles.focusedBackground}
          fontIconProps={{
            iconPlacement: "Left",
            shouldRenderImage: true,
          }}
        />
        <Pressable
          style={{
            width: 10,
            height: 10,
            marginLeft: 20,
            backgroundColor: "transparent",
          }}
          onFocus={() => {
            if (isCTAButtonFocused) {
              favoriteButtonRef.current?.setNativeProps({
                hasTVPreferredFocus: true,
              });
              setIsCTAButtonFocused(false);
              setIsFavoriteButtonFocused(true);
            } else {
              ctaButtonRef.current?.setNativeProps({
                hasTVPreferredFocus: true,
              });
              setIsFavoriteButtonFocused(false);
              setIsCTAButtonFocused(true);
            }
          }}
        />
      </View>
    );
  };

  const renderNetworkInfo = () => {
    const { ChannelInfo = undefined, isFromEPG = false } = feed;

    let { channel = undefined } = feed;
    if (!isFromEPG) {
      let channelInfo =
        ChannelInfo?.channel || udpDataAsset?.ChannelInfo?.Channel;
      networkInfo = (channelInfo && [channelInfo]) || udpDataAsset?.networkInfo;
    } else {
      const { Schedule = undefined } = feed || {};
      const channelFromEPG = channelByStationId(
        GLOBALS.channelMap.Channels,
        Schedule
      );
      if (channelFromEPG) {
        channel = channelFromEPG.channel;
        networkInfo = [channel];
      }
    }

    if (!networkInfo || !networkInfo.length) {
      return null;
    }

    if (
      channel &&
      networkInfo?.Number &&
      networkInfo.Number?.toString() !== channel.number
    ) {
      networkInfo = [channel];
    }

    const firstNetwork = networkInfo[0];
    if (firstNetwork && !firstNetwork?.name) {
      firstNetwork["name"] = getChannelName(firstNetwork);
    }

    let imageSource: any = null;
    if (firstNetwork) {
      imageSource =
        firstNetwork.logoUri ||
        channel?.logoUri ||
        feed?.channel?.logoUri ||
        firstNetwork.tenFootLargeURL ||
        firstNetwork.twoFootLargeURL ||
        firstNetwork.oneFootLargeURL ||
        firstNetwork.tenFootSmallURL ||
        firstNetwork.twoFootSmallURL ||
        firstNetwork.oneFootSmallURL ||
        AppImages.placeholder;
    }

    const renderNetworkLogos = () => {
      let items = [];
      if (networkInfo && networkInfo.length > 1) {
        const networkInfoLength = networkInfo.length;
        for (let i = 1; i < networkInfoLength; i++) {
          let networkData = networkInfo[i];
          let networkSource =
            networkData?.logoUri ||
            channel?.logoUri ||
            networkData?.tenFootLargeURL ||
            networkData?.twoFootLargeURL ||
            networkData?.oneFootLargeURL ||
            networkData?.tenFootSmallURL ||
            networkData?.twoFootSmallURL ||
            networkData?.oneFootSmallURL ||
            AppImages.placeholder;
          items.push(
            <Image source={networkSource} style={styles.networkImage} />
          );
        }
      }
      return items;
    };

    return (
      <View style={styles.thirdColumn}>
        {imageSource ? (
          <View style={styles.networkImageView}>
            <Image source={imageSource} style={styles.networkImage} />
          </View>
        ) : null}
        <Text style={styles.networkTitle}>
          {firstNetwork?.name || firstNetwork?.Name}
        </Text>
        <View style={{ flexDirection: "row" }}>{renderNetworkLogos()}</View>
      </View>
    );
  };

  const getCTAButtonDetails = (ctaList: Array<any>) => {
    return ctaList.map((cta: any) => {
      const element: ButtonVariantProps = {
        variant: MFButtonVariant.FontIcon,
        iconSource: 0,
        imageSource: 0,
        avatarSource: 0,
        textLabel: cta.buttonText,
        enableRTL: GLOBALS.enableRTL,
        fontIconSource: cta.iconSource,
        textStyle: {
          textStyle: {
            color: "#EEEEEE",
            fontFamily: "Inter-SemiBold",
            fontSize: 25,
            fontWeight: "600",
            textAlign: "center",
            marginLeft: 21,
          },
          focusedStyle: StyleSheet.flatten([MFMenuStyles.focusedTextStyle]),
          unfocusedStyle: StyleSheet.flatten([MFMenuStyles.textStyle]),
          fontIconTextStyle: StyleSheet.flatten([
            styles.textStyle,
            { fontSize: 70 },
          ]),
        },
        style: {
          width: 175,
          height: 62,
          backgroundColor: "#424242",
          borderRadius: 6,
          paddingHorizontal: 35,
        },
        focusedStyle: styles.focusedBackground,
      };
      return element;
    });
  };

  const navigateToPlayer = (bookmark?: any) => {
    //TODO: Finish implementation of navigate to player..
    featureNotImplementedAlert();
  };

  const handleRestart = (bookmark?: any) => {
    featureNotImplementedAlert();
    //TODO: Finish implementation of Handle restart..
  };

  const getDiscoverySchedules = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    let udlParam: string = "";
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${
      DefaultStore.Id
    }&$groups=${GLOBALS.store!.rightsGroupIds}&pivots=${
      assetData.pivots
    }&id=${id}&itemType=${assetData.contentTypeEnum}&lang=${
      GLOBALS.store!.onScreenLanguage.languageCode
    }`;
    if (isSeries(assetData)) {
      udlParam = "udl://discovery/seriesSchedules/" + params;
    } else if (isProgramOrGeneric(assetData)) {
      udlParam = "udl://discovery/programSchedules/" + params;
    }
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getDiscoveryProgramData = async (assetData: AssetData) => {
    let udlParam: string = "";
    const id = getItemId(feed);
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

  const getPlayActions = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id =
      isSeries(assetData) || feed?.isFromEPG
        ? feed?.Schedule?.ProgramId || feed?.ProgramId || feed?.Id
        : feed?.Id;
    const params = `?catchup=true&storeId=${DefaultStore.Id}&groups=${
      GLOBALS.store!.rightsGroupIds
    }&id=${id}`;
    const udlParam = "udl://subscriber/programplayactions/" + params;
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getProgramSubscriberData = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    let udlParam: string = "";
    const id = getItemId(feed);
    const params = `?storeId=${DefaultStore.Id}&id=${id}`;
    if (isSeries(assetData)) {
      udlParam = "udl://subscriber/getSeriesSubscriberData/" + params;
    } else if (isProgramOrGeneric(assetData)) {
      udlParam = "udl://subscriber/getProgramSubscriberData/" + params;
    }
    const data = await getDataFromUDL(udlParam);
    setsubscriberData(data.data);
    return data;
  };

  const getItemPinnedStatus = async () => {
    let pinnedItems = queryClient.getQueryData([
      "feed",
      "udl://subscriber/library/Pins",
    ]);
    if (!pinnedItems) {
      console.log("No current pinnedItems in cache..");
      pinnedItems = await getPinnedItemResponse();
    }
    ///@ts-ignore
    const pinnedItem = getPinnedItem(pinnedItems, feed);
    if (pinnedItem) {
      return true;
    } else {
      return false;
    }
  };

  const getPinnedItem = (pinnedItems: Array<any>, feed: any) => {
    if (!pinnedItems) {
      return undefined;
    }
    console.log(pinnedItems);
    const Id = getItemId(feed);
    return pinnedItems?.find((element: any) => {
      const elementId = getItemId(element);
      return elementId === Id;
    });
  };

  const getUDPData = async () => {
    console.log("Fetching UDP data");
    if (
      !similarItemsData &&
      !discoveryProgramQueryData &&
      !discoverySchedulesQueryData &&
      !playActionsQuery.data &&
      !subscriberDataQuery.data
    ) {
      console.warn("Data has not been initialised");
      return undefined;
    }

    const allSubcriptionGroups = {
      ...(GLOBALS.scheduledSubscriptionGroup || {}),
      SubscriptionGroups: [
        ...((GLOBALS.scheduledSubscriptionGroup &&
          GLOBALS.scheduledSubscriptionGroup.SubscriptionGroups) ||
          []),
        ...((GLOBALS.viewableSubscriptions &&
          GLOBALS.viewableSubscriptions.SubscriptionGroups) ||
          []),
      ],
    };
    const { startTime = 0, endTime = 0 } = feed?.Schedule || feed!;
    const startDateFromEPG = new Date(startTime * 1000);
    const endDateFromEPG = new Date(endTime * 1000);
    const udpData = isSeries(assetData)
      ? massageSeriesDataForUDP(
          subscriberData,
          discoveryProgramData,
          discoverySchedulesData,
          GLOBALS.channelMap,
          feed,
          GLOBALS.currentSlots,
          allSubcriptionGroups,
          GLOBALS.viewableSubscriptions,
          GLOBALS.scheduledSubscriptions,
          GLOBALS.userAccountInfo,
          GLOBALS.recorders,
          playActionsData,
          undefined,
          startDateFromEPG,
          endDateFromEPG,
          GLOBALS.channelRights,
          feed?.isFromEPG || false,
          feed?.Schedule?.channel.StationId,
          isFeatureAssigned("IOSCarrierBilling")
        )
      : massageProgramDataForUDP(
          playActionsData,
          feed,
          discoveryProgramData,
          GLOBALS.channelMap,
          discoverySchedulesData,
          GLOBALS.currentSlots,
          allSubcriptionGroups,
          GLOBALS.userAccountInfo,
          subscriberData,
          undefined,
          GLOBALS.viewableSubscriptions,
          GLOBALS.scheduledSubscriptions,
          GLOBALS.recorders,
          undefined,
          undefined,
          undefined,
          startDateFromEPG,
          endDateFromEPG,
          GLOBALS.channelRights,
          feed?.isFromEPG || false,
          feed?.Schedule?.channel.StationId,
          isFeatureAssigned("IOSCarrierBilling")
        );
    console.log("UDP data", udpData);
    setUDPDataAsset(udpData);
    currentState(!state);
    return udpData;
  };

  const getGenreText = (genres?: Genre[]) =>
    genres &&
    genres.map(
      (genre, index) =>
        `${genre.Name}${index === genres.length - 1 ? "" : metadataSeparator}`
    );

  const {
    data: similarItemsData,
    isLoading: isLoadingSimilarItems,
    isFetching: isFetchingSimilarItems,
  } = useQuery(
    [`get-similarItems-${assetData?.id}`, assetData],
    getSimilarItemsForFeed,
    { ...defaultQueryOptions }
  );

  useEffect(() => {
    if (similarItemsData && !isFetchingSimilarItems) {
      setSimilarData(similarItemsData);
    }
  }, [similarItemsData, isFetchingSimilarItems]);

  const {
    data: discoveryProgramQueryData,
    isLoading: isLoadingDiscoveryProgramQueryData,
    isFetching: isFetchingDiscoveryProgramQueryData,
  } = useQuery(
    ["get-program-data", assetData?.id],
    () => getDiscoveryProgramData(assetData),
    {
      ...defaultQueryOptions,
    }
  );

  useEffect(() => {
    if (discoveryProgramQueryData && !isFetchingDiscoveryProgramQueryData) {
      setdiscoveryProgramData(discoveryProgramQueryData);
    }
  }, [discoveryProgramQueryData, isFetchingDiscoveryProgramQueryData]);

  const {
    data: discoverySchedulesQueryData,
    isLoading: isLoadingDiscoverySchedulesQueryData,
    isFetching: isFetchingDiscoverySchedulesQueryData,
  } = useQuery(
    ["get-discoveryschedules", assetData?.id],
    () => getDiscoverySchedules(assetData),
    { ...defaultQueryOptions }
  );

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (discoverySchedulesQueryData && !isFetchingDiscoverySchedulesQueryData) {
      setdiscoverySchedulesData(discoverySchedulesQueryData);
    }
  }, [discoverySchedulesQueryData, isFetchingDiscoverySchedulesQueryData]);
  const playActionsQuery = useQuery(
    ["get-playActions", assetData?.id],
    () => getPlayActions(assetData),
    { ...defaultQueryOptions }
  );

  useEffect(() => {
    if (playActionsQuery.data && !playActionsQuery.isFetching) {
      setplayActionsData(playActionsQuery.data);
    }
  }, [playActionsQuery.data, playActionsQuery.isFetching]);

  const subscriberDataQuery = useQuery(
    ["get-subscriber-data", assetData?.id],
    () => getProgramSubscriberData(assetData),
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const { data, isLoading, refetch } = useQuery(
    ["get-UDP-data", assetData?.id],
    () => getUDPData(),
    {
      refetchOnMount: "always",
      enabled:
        !!similarData &&
        !!discoveryProgramData &&
        !!discoverySchedulesData &&
        !!playActionsData &&
        !!subscriberData,
    }
  );
  useEffect(() => {
    appQueryCache.subscribe((event) => {
      console.log(event);
      if (event?.type === "queryUpdated") {
        if (event.query.queryHash?.includes("get-all-subscriptionGroups")) {
          // const recordButton = udpDataAsset.ctaButtons.filter(
          //   (e: any) =>
          //     (e.buttonText = AppStrings?.str_details_program_record_button)
          // )[0];

          setTimeout(() => {
            refetch();
          }, 1000);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (ctaButtonRef) {
      ctaButtonRef.current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
    }
    setIsCTAButtonFocused(true);
  }, [udpDataAsset?.ctaButtons?.length]);

  const getRestrictionsForVod = (
    usablePlayActions: any,
    isTrailer: boolean
  ) => {};

  const renderCTAButtonGroup = () => {
    // const { visible, panelName } = sidePanelState;
    // const focusable = !(visible && panelName);
    // const fontProps = getCTAButtonDetails(udpDataAsset.ctaButtons);
    // console.log("CTA Props", fontProps);

    return (
      <View style={[styles.buttonContainer]}>
        <ScrollView horizontal nestedScrollEnabled>
          {udpDataAsset.ctaButtons?.length &&
            udpDataAsset.ctaButtons?.map((cta: any, index: number) => {
              let fontIconStyle: { [key: string]: any };
              if (
                cta?.buttonAction ===
                  AppStrings.str_details_program_record_button ||
                cta?.buttonAction ===
                  AppStrings?.str_details_series_record_button
              ) {
                fontIconStyle = styles.ctaFontIconStyle;
              }
              return (
                <MFButton
                  key={`ctaBtn_${cta.buttonText}_${index}`}
                  ref={
                    index === 0
                      ? ctaButtonRef
                      : (buttonRefObject as any)[cta.buttonText]
                  }
                  focusable
                  iconSource={0}
                  imageSource={0}
                  avatarSource={undefined}
                  onFocus={() => {
                    setOpen(false);
                    drawerRef.current.close();
                    drawerRef.current.resetRoutes();
                    setCTAButtonFocusState(cta.buttonText);
                  }}
                  variant={MFButtonVariant.FontIcon}
                  fontIconSource={cta.iconSource}
                  fontIconTextStyle={StyleSheet.flatten([
                    styles.textStyle,
                    {
                      fontSize: 90,
                      color: cta.buttonText?.includes("Record")
                        ? g.fontColors.badge
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
                  focusedStyle={styles.focusedBackground}
                  fontIconProps={{
                    iconPlacement: "Left",
                    shouldRenderImage: true,
                  }}
                />
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const renderShowcard = () => {
    const { image2x3PosterURL = undefined, image2x3KeyArtURL = undefined } =
      udpDataAsset || {};
    const imageSource =
      image2x3KeyArtURL || image2x3PosterURL || AppImages.placeholder;
    return (
      <View style={styles.firstColumn}>
        <View style={styles.imageContainer}>
          <ImageBackground source={imageSource} style={styles.showcardImage} />
        </View>
        <View style={styles.favoriteBlock}>{renderFavoriteButton()}</View>
      </View>
    );
  };
  const renderMetadata = () => {
    const {
      durationMinutesString = undefined,
      seasonsCount = undefined,
      genre = undefined,
      ReleaseYear = undefined,
      Rating = undefined,
    } = udpDataAsset || {};
    const genereText = getGenreText(genre)?.join("");
    const metadataArray = [
      durationMinutesString,
      seasonsCount,
      genereText,
      ReleaseYear,
      Rating,
    ];
    const metadataLine = metadataArray.filter(Boolean).join(metadataSeparator);

    return (
      <View style={styles.metadataContainer}>
        <Text style={styles.metadataLine1}>{metadataLine}</Text>
      </View>
    );
  };

  const renderEpisodeDetails = () => {
    const {
      ChannelInfo: { Schedule = undefined } = {},
      playDvr = undefined,
      Bookmark = undefined,
      assetType: { sourceType = undefined } = {},
      subscriptionItemForProgram: { ProgramDetails = undefined } = {},
      currentCatchupSchedule = undefined,
      ppvInfo = undefined,
      SourceIndicators = undefined,
    } = udpDataAsset || {};

    const isLiveAsset = SourceIndicators
      ? Object.keys(SourceIndicators).includes("IsLive")
      : false;

    const {
      hasPPV = false,
      isPPVWatchable = false,
      currentSelectedSchedule = undefined,
    } = ppvInfo || {};

    if (
      !hasPPV &&
      ((!currentCatchupSchedule &&
        !Schedule &&
        !playDvr &&
        !subscriberData?.PriorityEpisodeTitle) ||
        (Bookmark && Schedule?.playSource !== sourceTypeString.UPCOMING))
    ) {
      return;
    }

    let episodeNumber;
    let seasonNumber;
    let episodeName;
    let name;
    let startUtc;
    let endUtc;
    let CatchupStartUtc;
    let CatchupEndUtc;
    let parsedStartTime;
    let parsedEndTime;
    let startEpoc;
    let endEpoc;
    let progressDataSource = {
      RuntimeSeconds: 0,
      TimeSeconds: 0,
      BookmarkType: "",
      Id: "",
      ProgramId: "",
    };
    let isLive = false;
    let showLiveBadge = true;
    let programId;

    const {
      Schedule: dataSchedule = undefined,
      assetType = undefined,
      Bookmark: dataBookmark = playActionsData?.Bookmark || undefined,
      CatalogInfo = undefined,
      isFromEPG = false,
      ItemType = "",
    } = feed || {};

    if (Schedule || dataSchedule || currentCatchupSchedule) {
      if (isFromEPG && assetType?.sourceType === sourceTypeString.CATCHUP) {
        ({
          EpisodeNumber: episodeNumber,
          SeasonNumber: seasonNumber,
          EpisodeName: episodeName,
          Name: name,
          StartUtc: startUtc,
          EndUtc: endUtc,
          ProgramId: programId,
          CatchupStartUtc: CatchupStartUtc,
          CatchupEndUtc: CatchupEndUtc,
        } = currentCatchupSchedule?.Schedule || currentCatchupSchedule || {});
      } else if (assetType?.sourceType === sourceTypeString.UPCOMING) {
        ({
          episode: episodeNumber,
          season: seasonNumber,
          episodeTitle: episodeName,
          title: name,
          StartUtc: startUtc,
          EndUtc: endUtc,
          ProgramId: programId,
          CatchupStartUtc: CatchupStartUtc,
          CatchupEndUtc: CatchupEndUtc,
        } = Schedule || dataSchedule || currentCatchupSchedule || {});
      } else {
        ({
          EpisodeNumber: episodeNumber,
          SeasonNumber: seasonNumber,
          EpisodeName: episodeName,
          Name: name,
          StartUtc: startUtc,
          EndUtc: endUtc,
          ProgramId: programId,
          CatchupStartUtc: CatchupStartUtc,
          CatchupEndUtc: CatchupEndUtc,
        } = Schedule || dataSchedule || currentCatchupSchedule || {});
      }

      let convertedStartDate =
        (startUtc && new Date(startUtc)) ||
        (CatchupStartUtc && new Date(CatchupStartUtc));
      let convertedEndDate =
        (endUtc && new Date(endUtc)) ||
        (CatchupEndUtc && new Date(CatchupEndUtc));
      startEpoc = Date.parse(startUtc || CatchupStartUtc);
      endEpoc = Date.parse(endUtc || CatchupEndUtc);

      parsedStartTime = convertedStartDate && DateToAMPM(convertedStartDate);
      parsedEndTime = convertedEndDate && DateToAMPM(convertedEndDate);

      progressDataSource.BookmarkType = sourceTypeString.LIVE as BookmarkType;
      if (startEpoc && endEpoc) {
        progressDataSource.RuntimeSeconds = endEpoc - startEpoc;

        if (sourceType !== sourceTypeString.CATCHUP) {
          progressDataSource.TimeSeconds = new Date().getTime() - startEpoc;
        }
      }
      isLive = true;
      const now = new Date();
      if (sourceType === sourceTypeString.DVR) {
        if (convertedEndDate < now || convertedStartDate > now) {
          showLiveBadge = false;
        }
      } else if (
        sourceType === sourceTypeString.CATCHUP &&
        playActionsData?.Bookmark
      ) {
        if (convertedEndDate < now || convertedStartDate > now) {
          showLiveBadge = false;
        }
        progressDataSource = playActionsData?.Bookmark;
      } else {
        showLiveBadge = sourceType === sourceTypeString.LIVE || isLiveAsset;
      }
    } else if (subscriberData!) {
      if (assetType?.contentType === ContentType.EPISODE) {
        if (CatalogInfo) {
          ({
            EpisodeNumber: episodeNumber,
            SeasonNumber: seasonNumber,
            EpisodeName: episodeName,
            Name: name,
            StartUtc: startUtc,
            EndUtc: endUtc,
            ProgramId: programId,
          } = CatalogInfo);
        }

        progressDataSource.BookmarkType = sourceTypeString.VOD as BookmarkType;
        if (dataBookmark) {
          const { RuntimeSeconds, TimeSeconds } = dataBookmark;
          progressDataSource.RuntimeSeconds = RuntimeSeconds || 0;
          progressDataSource.TimeSeconds = TimeSeconds || 0;
        }
      } else {
        const { PriorityEpisodeTitle } = subscriberData!;

        if (PriorityEpisodeTitle) {
          const { CatalogInfo = {} } = PriorityEpisodeTitle || {};
          ({
            EpisodeNumber: episodeNumber = undefined,
            SeasonNumber: seasonNumber = undefined,
            EpisodeName: episodeName = undefined,
            Name: name = undefined,
            StartUtc: startUtc = undefined,
            EndUtc: endUtc = undefined,
            ProgramId: programId = undefined,
          } = CatalogInfo || {});

          if (PriorityEpisodeTitle?.Bookmark) {
            progressDataSource = PriorityEpisodeTitle?.Bookmark;
          } else {
            progressDataSource.BookmarkType =
              sourceTypeString.VOD as BookmarkType;
            progressDataSource.RuntimeSeconds = CatalogInfo.RuntimeSeconds || 0;
            //TODO:Fix this up
            // progressDataSource.TimeSeconds =
            //   props.episodeBookmarkData?.TimeSeconds || 0;
          }
        }
      }
    }

    // DVR Details
    if (playDvr && ProgramDetails) {
      seasonNumber = ProgramDetails?.SeasonNumber;
      episodeNumber = ProgramDetails?.EpisodeNumber;
      episodeName = ProgramDetails?.EpisodeTitle;
    }

    const metadata = [];
    if (seasonNumber || episodeNumber) {
      metadata.push(
        getEpisodeInfo({
          SeasonNumber: seasonNumber,
          EpisodeNumber: episodeNumber,
        })
      );
    }
    if (episodeName || name) {
      metadata.push(episodeName || name);
    }

    // PPV

    if (hasPPV) {
      //@ts-ignore
      const isFromLibrary = feed.libraryId === "Library";
      const { StartUtc, EndUtc, ChannelNumber } = currentSelectedSchedule;
      isLive = isPPVWatchable;
      metadata.push(`Airs on ${ChannelNumber}`);
      if (!isFromLibrary) {
        startUtc = StartUtc;
        endUtc = EndUtc;
        let convertedStartDate = startUtc && new Date(startUtc);
        let convertedEndDate = endUtc && new Date(endUtc);
        parsedStartTime = convertedStartDate && DateToAMPM(convertedStartDate);
        parsedEndTime = convertedEndDate && DateToAMPM(convertedEndDate);
      }
      showLiveBadge = isLive;
    }
    // PPV

    console.log(
      "Progress",
      progressDataSource.TimeSeconds / progressDataSource.RuntimeSeconds
    );

    return (
      <View style={styles.episodeBlockContainer}>
        <View style={styles.flexRow}>
          <Text style={styles.episodeBlockTitle}>
            {metadata.join(metadataSeparator)}
          </Text>
        </View>
        {(!!isLive || !!hasPPV) && !!parsedStartTime && (
          <View style={styles.flexRow}>
            <Text style={styles.episodeMetadata}>
              {startUtc && massagePreviousDate(startUtc, hasPPV)}
              {metadataSeparator}
              {parsedStartTime} - {parsedEndTime}
            </Text>

            {!!showLiveBadge && (
              <View>
                <Text style={styles.badgeStyle}>{liveIcon}</Text>
              </View>
            )}
          </View>
        )}
        {!!progressDataSource && (
          <MFProgressBar
            backgroundColor={"#424242"}
            foregroundColor={"#E7A230"}
            toValue={
              (progressDataSource.TimeSeconds /
                progressDataSource.RuntimeSeconds) *
              100
            }
            maxHeight={15}
            maxWidth={350}
          />
        )}
      </View>
    );
  };

  const renderMoreLikeThis = () => {
    const feed = { Name: AppStrings.str_details_more_like_this };
    return (
      similarData.length > 0 && (
        <SafeAreaView>
          <MFSwimLane
            ref={moreLikeThisRef}
            //@ts-ignore
            feed={feed}
            data={similarData}
            swimLaneKey={similarItemsSwimLaneKey}
            updateSwimLaneKey={setSimilarItemsSwimLaneKey}
            limitSwimlane
            ItemsTo={10}
            onPress={(event) => {
              props.navigation.push(Routes.Details, { feed: event });
            }}
            navigation={props.navigation}
          />
        </SafeAreaView>
      )
    );
  };

  const renderCastAndCrew = () => {
    let roles: any = [];
    if (
      assetData.assetType?.contentType === ContentType.PROGRAM ||
      assetData.assetType?.contentType === ContentType.GENERIC
    ) {
      roles = discoveryProgramData?.Roles;
    } else {
      //TODO: This should actually be: {this.props.seriesDiscoveryData}.. fix it ASAP
      roles = discoveryProgramData?.Roles;
    }

    const feedItem = { Name: "Cast and Crew" };
    return (
      roles && (
        <SafeAreaView style={{ marginTop: -70 }}>
          <MFSwimLane
            ref={castAndCrewRef}
            //@ts-ignore
            feed={feedItem}
            data={
              roles !== undefined
                ? massageCastAndCrew(roles, assetTypeObject.PERSON)
                : []
            }
            swimLaneKey={castnCrewSwimLaneKey}
            updateSwimLaneKey={setCastnCrewSwimlaneKey}
            cardStyle="3x4"
            navigation={props.navigation}
          />
        </SafeAreaView>
      )
    );
  };

  const renderIndicators = () => {
    let {
      locale,
      statusText,
      combinedQualityLevels,
      combinedAudioIndicator,
      combinedAudioTags,
    } = udpDataAsset;
    const langaugeIndicator = locale?.split("-")[0];
    const qualityLevel = combinedQualityLevels && combinedQualityLevels[0];
    const audioTags =
      (combinedAudioIndicator?.length && combinedAudioIndicator) ||
      (combinedAudioTags?.length && combinedAudioTags) ||
      [];
    const statusTextItem = (statusText?.length && statusText[0]) || "";
    // Schedules
    return (
      <View>
        <View style={styles.flexRow}>
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

          {audioTags?.map((audioIndicator: any) => {
            return (
              <Text style={styles.fontIconStyle} key={audioIndicator}>
                {getFontIcon((fontIconsObject as any)[audioIndicator])}
              </Text>
            );
          })}
        </View>
        <Text style={styles.statusTextStyle}>{statusTextItem}</Text>
      </View>
    );
  };

  const renderAssetInfo = () => {
    const { title, description, ratingValues, subscriptionItemForProgram } =
      udpDataAsset;
    const shouldShowExpiringIcon: boolean = isExpiringSoon(
      subscriptionItemForProgram
    );
    return (
      <View style={styles.secondColumn}>
        <View style={{ flexDirection: "row" }}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          {shouldShowExpiringIcon ? (
            <FastImage
              source={AppImages.placeholder}
              style={styles.hourGlass}
            ></FastImage>
          ) : null}
        </View>

        {/* Metadata */}
        {renderMetadata()}

        {/* Quality, Language, Audio, Dolby Indicator */}
        {renderIndicators()}
        {description ? (
          <MFText
            shouldRenderText
            displayText={description}
            textStyle={styles.descriptionText}
            adjustsFontSizeToFit={false}
            numberOfLines={5}
          />
        ) : null}
        {/* Content Ratings */}
        {ratingValues && ratingValues?.length > 0 && renderRatingValues()}
        {/* Progress bar */}
        {renderEpisodeDetails()}
      </View>
    );
  };

  const renderRatingValues = () => {
    //@ts-ignore
    const [first, second] = udpDataAsset!.ratingValues || [];
    return (
      <View style={styles.contentRatingsContainer}>
        {first && (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingsIcon}
              source={{
                uri: first.Image,
              }}
            />
            <Text
              style={[styles.metadataLine1, styles.contentRatingText]}
            >{`${first.Score}%`}</Text>
          </View>
        )}
        {second && (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingsIcon}
              source={{
                uri: second.Image,
              }}
            />

            <Text
              style={[styles.metadataLine1, styles.contentRatingText]}
            >{`${second.Score}%`}</Text>
          </View>
        )}
      </View>
    );
  };

  const onFocusBar = () => {
    console.log(ctaButtonFocusState);
    if (isFavoriteButtonFocused) {
      /** If user is on Favorite button and presses down, navigate to current swimlane and focus on first element */
      if (similarData && moreLikeThisRef?.current) {
        const cardToFocus =
          moreLikeThisRef.current?.focused || moreLikeThisRef.current?.first;
        cardToFocus?.setNativeProps({
          hasTVPreferredFocus: true,
        });
        setIsFavoriteButtonFocused(false);
      } else if (discoveryProgramData && castAndCrewRef?.current) {
        const cardToFocus =
          castAndCrewRef.current?.focused || castAndCrewRef.current?.first;
        cardToFocus?.setNativeProps({
          hasTVPreferredFocus: true,
        });
        setIsFavoriteButtonFocused(false);
      } else {
        /** if no  swimlane exists  remain in fav */
        favoriteButtonRef.current?.setNativeProps({
          hasTVPreferredFocus: true,
        });
      }
    } else if (isCTAButtonFocused) {
      if (similarData && moreLikeThisRef?.current) {
        const cardToFocus =
          moreLikeThisRef.current?.focused || moreLikeThisRef.current?.first;
        cardToFocus?.setNativeProps({
          hasTVPreferredFocus: true,
        });
        setIsCTAButtonFocused(false);
      } else if (discoveryProgramData && castAndCrewRef?.current) {
        const cardToFocus =
          castAndCrewRef.current?.focused || castAndCrewRef.current?.first;
        cardToFocus?.setNativeProps({
          hasTVPreferredFocus: true,
        });
        setIsCTAButtonFocused(false);
      } else {
        /** if no  swimlane exists  focus on the first  button */
        if (buttonRefObject[ctaButtonFocusState]?.current) {
          buttonRefObject[ctaButtonFocusState]?.current?.setNativeProps({
            hasTVPreferredFocus: true,
          });
          setIsCTAButtonFocused(true);
        } else if (ctaButtonRef?.current) {
          ctaButtonRef.current?.setNativeProps({
            hasTVPreferredFocus: true,
          });
          setIsCTAButtonFocused(true);
        }
      }
    } else {
      console.log("From else condition.. trying to navigate from SwimLane");
      if (ctaButtonRef?.current) {
        ctaButtonRef.current?.setNativeProps({
          hasTVPreferredFocus: true,
        });
        setIsCTAButtonFocused(true);
      }
    }
  };

  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={AppImages.landing_background}
        style={styles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={styles.containerOpacity}>
          {udpDataAsset ? (
            <ScrollView key={`detailspagekey`} ref={scrollViewRef}>
              <View style={styles.detailsBlock}>
                {renderShowcard()}
                <View style={styles.secondBlock}>
                  <View style={styles.flexRow}>
                    {/* Metadata and CTA */}
                    {renderAssetInfo()}
                    {/* Network Logo */}
                    {renderNetworkInfo()}
                  </View>
                  <View style={styles.ctaButtonGroupBlock}>
                    {/* CTA */}
                    {renderCTAButtonGroup()}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                accessible={true}
                activeOpacity={0.3}
                onFocus={onFocusBar}
                style={
                  similarData && similarData.length
                    ? {
                        backgroundColor: "transparent",
                        height: 20,
                        width: SCREEN_WIDTH,
                        marginTop: 50,
                      }
                    : {
                        backgroundColor: "transparent",
                        height: 20,
                        width: SCREEN_WIDTH,
                        marginTop: 50,
                        marginBottom: 60,
                      }
                }
              ></TouchableOpacity>
              {similarData && renderMoreLikeThis()}
              {/* Cast and Crew */}
              {discoveryProgramData && renderCastAndCrew()}
            </ScrollView>
          ) : (
            <MFLoader />
          )}
        </View>
      </ImageBackground>
      <DetailsSidePanel
        ref={drawerRef}
        drawerPercentage={37}
        animationTime={200}
        overlay={false}
        opacity={1}
        open={open}
        animatedWidth={width * 0.37}
        closeOnPressBack={false}
        navigation={props.navigation}
        drawerContent={false}
        route={route}
        closeModal={closeModal}
        screenProps={screenProps}
      />
    </PageContainer>
  );
};

const styles: any = StyleSheet.create(
  getUIdef("Details.Showcard")?.style ||
    scaleAttributes({
      detailsBlock: { height: 852, flexDirection: "row" },
      secondBlock: {
        marginTop: 86,
        flexDirection: "column",
        flex: 1,
        height: 627,
      },
      flexRow: { flexDirection: "row" },
      ctaBlock: { flexDirection: "row" },
      favoriteBlock: { width: 583, marginTop: 69 },
      ctaButtonGroupBlock: { marginTop: 69 },
      containerOpacity: {
        backgroundColor: "#00030E",
        opacity: 0.9,
      },
      firstColumn: { width: 583, alignItems: "center" },
      imageContainer: {
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 86,
        height: 627,
      },
      secondColumn: {
        width: 905,
        height: 627,
        justifyContent: "center",
      },
      thirdColumn: {
        flex: 1,
        paddingRight: 90,
        alignItems: "flex-end",
      },
      networkImageView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#282828",
        borderRadius: 3,
        height: 111,
        width: 111,
        padding: 25,
        marginBottom: 15,
      },
      networkImage: {
        height: 63,
        width: 85,
        resizeMode: "contain",
      },
      marginRight20: { marginRight: 20 },
      networkTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 29,
        color: "#6D6D6D",
        paddingTop: 18,
      },
      metadataContainer: {
        flexDirection: "row",
        paddingBottom: 23,
      },
      title: {
        fontFamily: "Inter-Bold",
        fontSize: 57,
        color: "#EEEEEE",
        paddingBottom: 10,
      },
      metadataLine1: {
        fontFamily: "Inter-SemiBold",
        fontSize: 25,
        color: "#A7A7A7",
        marginBottom: 25,
      },
      description: {
        fontFamily: "Inter-Regular",
        fontSize: 25,
        color: "#A7A7A7",
        lineHeight: 38,
      },
      showcardImage: { height: 628, width: 419 },
      buttonContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonIconContainer: { width: 70, height: 70 },
      solidBackground: { backgroundColor: "#424242" },
      focusedBackground: { backgroundColor: "#053C69" },
      moreDetailsContainer: { marginTop: 104 },
      contentRatingsContainer: {
        flexDirection: "row",
        marginBottom: 25,
      },
      contentRatingsIcon: { width: 30, height: 30 },
      contentRatingText: { marginLeft: 10 },
      ratingBlock: { marginRight: 30, flexDirection: "row" },
      textStyle: { fontFamily: "MyFontRegular", color: "#EEEEEE" },
      progressBarContainer: { height: 3 },
      progressInfoText: {
        fontFamily: "Inter-SemiBold",
        fontSize: 25,
        color: "#A7A7A7",
        paddingBottom: 35,
        lineHeight: 38,
        marginBottom: 20,
      },
      statusTextStyle: {
        fontSize: 25,
        fontFamily: "Inter-Regular",
        color: "#E7A230",
        marginBottom: 25,
      },
      fontIconStyle: {
        fontFamily: "MyFontRegular",
        color: "#A7A7A7",
        fontSize: 70,
        marginRight: 15,
        marginTop: -40,
        marginBottom: 10,
      },
      flexOne: { flex: 1 },
      ctaButtonStyle: { height: 66, fontFamily: "Inter-SemiBold" },
      ctaFontIconStyle: {
        fontFamily: "MyFontRegular",
        color: "#E15554",
      },
      buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      modalContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
      },
      episodeBlockContainer: { marginTop: 35.5 },
      episodeBlockTitle: {
        marginBottom: 20,
        fontSize: 29,
        fontFamily: "Inter-Bold",
        color: "#EEEEEE",
      },
      episodeMetadata: {
        marginBottom: 20,
        fontSize: 25,
        fontFamily: "Inter-SemiBold",
        color: "#A7A7A7",
      },
      badgeStyle: {
        fontFamily: "MyFontRegular",
        color: "#E15554",
        fontSize: 50,
        marginLeft: 20,
        marginTop: -10,
      },
      marginTop: { marginTop: 8 },
      hourGlass: {
        width: 16,
        height: 22,
        marginTop: 26,
        marginLeft: 15,
      },
    })
);

export default DetailsScreen;
