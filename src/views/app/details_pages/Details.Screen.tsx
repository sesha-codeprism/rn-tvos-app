import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  SubscriptionPackages,
} from "../../../utils/assetUtils";
import { metadataSeparator } from "../../../utils/Subscriber.utils";
import { getUIdef, scaleAttributes } from "../../../utils/uidefinition";
import { globalStyles as g } from "../../../config/styles/GlobalStyles";
import { PageContainer } from "../../../components/PageContainer";
import { getItemId } from "../../../utils/dataUtils";
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
import { Genre } from "../../../utils/common";
import { useQuery } from "react-query";
import { defaultQueryOptions } from "../../../config/constants";
import { DefaultStore, getEpisodeInfo } from "../../../utils/DiscoveryUtils";
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
import MFSwim from "../../../components/MFSwim";
import { isFeatureAssigned } from "../../../utils/helpers";
import { queryClient } from "../../../config/queries";
import { pinItem, unpinItem } from "../../../../backend/subscriber/subscriber";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

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
  console.log("Feed", feed);
  const drawerRef: React.MutableRefObject<any> = useRef();
  const [similarData, setSimilarData] = useState<any>(undefined);
  const [discoveryProgramData, setdiscoveryProgramData] =
    useState<any>(undefined);
  const [discoverySchedulesData, setdiscoverySchedulesData] =
    useState<any>(undefined);
  const [playActionsData, setplayActionsData] = useState<any>(undefined);
  const [subscriberData, setsubscriberData] = useState<any>(undefined);
  const [udpDataAsset, setUDPDataAsset] = useState<any>();
  const [isCTAButtonFocused, setIsCTAButtonFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [similarItemsSwimLaneKey, setSimilarItemsSwimLaneKey] = useState("");
  const [castnCrewSwimLaneKey, setCastnCrewSwimlaneKey] = useState("");
  const [viewableSubscriptionGroups, setViewableSubscriptionGroups] =
    useState<any>();
  const [scheduledSubScriptionGroups, setScheduledSubScriptionGroups] =
    useState<any>();
  const [allSubscriptionGroups, setAllSubscriptionGroups] = useState<any>();
  const [isItemPinned, setIsItemPinned] = useState(false);

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

  const featureNotImplementedAlert = (
    title: string = "Missing implementation",
    message: string = "This feature not implemented yet"
  ) => {
    return Alert.alert(title, message);
  };

  const toggleSidePanel = () => {
    setOpen(open);
    drawerRef.current.open();
    // drawerRef.current.open();
  };
  const openNewRecording = () => {
    featureNotImplementedAlert();
  };

  const startResolveConflict = () => {
    featureNotImplementedAlert();
  };

  const openEditRecordingsPanel = (data: any) => {
    featureNotImplementedAlert();
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
      featureNotImplementedAlert();
    },
    [AppStrings?.str_details_cta_waystowatch]: () => {
      featureNotImplementedAlert();
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
    const language = languageKey.language + GLOBALS.store.onScreenLanguage.languageCode?.split('-')?.[0] || 'en';

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
  const getAllViewableSubscriptions = async ({ queryKey }: any) => {
    const [, assetData] = queryKey;
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const udlParams = "udl://dvrproxy/viewable-subscription-items/";
    const data = await getDataFromUDL(udlParams);
    const massagedData = getMassagedData(udlParams, data);
    setViewableSubscriptionGroups(massagedData);
    return massagedData;
  };

  const getScheduledSubscriptionGroups = async ({ queryKey }: any) => {
    const [, assetData] = queryKey;
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const udlParams = "udl://dvrproxy/get-scheduled-subscription-groups/";
    const data = await getDataFromUDL(udlParams);
    const massagedData = getMassagedData(udlParams, data);
    setScheduledSubScriptionGroups(massagedData);
    return massagedData;
  };

  const getAllSubscriptionGroups = async ({ queryKey }: any) => {
    const [, assetData] = queryKey;
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const udlParams = "udl://dvrproxy/get-all-subscriptionGroups/";
    const data = await getDataFromUDL(udlParams);
    const massagedData = getMassagedData(udlParams, data);
    setAllSubscriptionGroups(massagedData);
    return massagedData;
  };

  useEffect(() => {
    const status = getItemPinnedStatus();
    console.log("status", status);
    setIsItemPinned(status);
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
    setSimilarData(massagedData);
    return massagedData;
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

    if (isItemPinned) {
      //@ts-ignore
      const resp = await unpinItem(assetId, assetType);
      if (resp.status === 201) {
        setIsItemPinned(false);
      } else {
        Alert.alert("Something went wrong");
      }
    } else {
      //@ts-ignore
      const resp = await pinItem(assetId, assetType);
      if (resp.status >= 200 && resp.status <= 300) {
        setIsItemPinned(true);
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
            // if (__DEV__) {
            //   setTimeout(() => {
            //     ctaButtonRef.current.setNativeProps({
            //       hasTVPreferredFocus: true,
            //     });
            //   }, 2000);
            // }
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
        {/* <MFButton
          ref={listAddButtonRef}
          focusable
          iconSource={0}
          imageSource={0}
          avatarSource={undefined}
          variant={MFButtonVariant.FontIcon}
          fontIconSource={listAdd}
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
              marginLeft: 30,
            },
          ]}
          focusedStyle={styles.focusedBackground}
          fontIconProps={{
            iconPlacement: "Left",
            shouldRenderImage: true,
          }}
        /> */}
        <Pressable
          style={{ width: 20, height: 20 }}
          onFocus={() => {
            if (isCTAButtonFocused) {
              favoriteButtonRef.current?.setNativeProps({
                hasTVPreferredFocus: true,
              });
              setIsCTAButtonFocused(false);
            } else {
              ctaButtonRef.current?.setNativeProps({
                hasTVPreferredFocus: true,
              });
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
      //TODO: Re-implement this once the live api calls are written
      // const { Schedule = undefined } = feed || {};
      // const channelFromEPG = channelByStationId(
      //   this.props.channelMap.Channels,
      //   Schedule
      // );
      // if (channelFromEPG) {
      //   channel = channelFromEPG.channel;
      //   networkInfo = [channel];
      // }
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
        AppStrings.placeholder;
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
            AppStrings.placeholder;
          items.push(
            <Image
              source={networkSource}
              style={[styles.networkImage, styles.marginRight20]}
            />
          );
        }
      }
      return items;
    };

    return (
      <View style={styles.thirdColumn}>
        <View>
          {imageSource ? (
            <View style={styles.networkImageView}>
              <Image source={imageSource} style={styles.networkImage} />
            </View>
          ) : null}
          <Text style={styles.networkTitle}>
            {firstNetwork?.name || firstNetwork?.Name}
          </Text>
        </View>
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
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${
      DefaultStore.Id
    }&$groups=${GLOBALS.store!.rightsGroupIds}&pivots=${
      assetData.pivots
    }&id=${id}&itemType=${assetData.contentTypeEnum}&lang=${GLOBALS.store.onScreenLanguage.languageCode}`;
    const udlParam = "udl://discovery/programSchedules/" + params;
    const data = await getDataFromUDL(udlParam);
    setdiscoverySchedulesData(data.data);
    return data;
  };

  const getDiscoveryProgramData = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?storeId=${DefaultStore.Id}&$groups=${
      GLOBALS.store!.rightsGroupIds
    }&pivots=${assetData.pivots}&id=${id}&lang=${GLOBALS.store.onScreenLanguage.languageCode}`;
    const udlParam = "udl://discovery/programs/" + params;
    const data = await getDataFromUDL(udlParam);
    const massagedData = massageDiscoveryFeedAsset(
      data.data,
      assetTypeObject[assetData.contentTypeEnum]
    );
    setdiscoveryProgramData(massagedData);

    return massagedData;
  };

  const getPlayActions = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?catchup=false&storeId=${DefaultStore.Id}&groups=${
      GLOBALS.store!.rightsGroupIds
    }&id=${id}`;
    const udlParam = "udl://subscriber/programplayactions/" + params;
    const data = await getDataFromUDL(udlParam);
    setplayActionsData(data.data);
    return data;
  };

  const getProgramSubscriberData = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?storeId=${DefaultStore.Id}&id=${id}`;
    const udlParam = "udl://subscriber/getProgramSubscriberData/" + params;
    const data = await getDataFromUDL(udlParam);
    setsubscriberData(data.data);
    return data;
  };

  const getItemPinnedStatus = () => {
    const pinnedItems = queryClient.getQueryData([
      "feed",
      "udl://subscriber/library/Pins",
    ]);
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
    return pinnedItems?.find((element: any) => {
      return element.Id === feed.Id;
    });
  };

  const getUDPData = async () => {
    if (
      !similarDataQuery.data &&
      !discoveryProgramDataQuery.data &&
      !discoverySchedulesQuery.data &&
      !playActionsQuery.data &&
      !subscriberDataQuery.data
    ) {
      console.warn("Data has not been initialised");
      return undefined;
    }
    const assetType =
      //@ts-ignore
      assetTypeObject[feed?.assetType?.contentType] ||
      assetTypeObject[ContentType.PROGRAM];
    const udpData = massageProgramDataForUDP(
      playActionsData,
      subscriberData,
      discoveryProgramData,
      GLOBALS.channelMap,
      discoverySchedulesData,
      undefined,
      allSubscriptionGroups,
      undefined,
      subscriberData,
      undefined,
      viewableSubscriptionGroups,
      scheduledSubScriptionGroups,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      isFeatureAssigned("IOSCarrierBilling")
    );
    console.log("UDP data", udpData);
    setUDPDataAsset(udpData);
    return udpData;
  };

  const getGenreText = (genres?: Genre[]) =>
    genres &&
    genres.map(
      (genre, index) =>
        `${genre.Name}${index === genres.length - 1 ? "" : metadataSeparator}`
    );

  const similarDataQuery = useQuery(
    [`get-similarItems-${assetData?.id}`, assetData],
    getSimilarItemsForFeed,
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const discoveryProgramDataQuery = useQuery(
    ["get-program-data", assetData?.id],
    () => getDiscoveryProgramData(assetData),
    {
      ...defaultQueryOptions,
      refetchOnMount: "always",
    }
  );

  const discoverySchedulesQuery = useQuery(
    ["get-discoveryschedules", assetData?.id],
    () => getDiscoverySchedules(assetData),
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const playActionsQuery = useQuery(
    ["get-playActiosn", assetData?.id],
    () => getPlayActions(assetData),
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const subscriberDataQuery = useQuery(
    ["get-subscriber-data", assetData?.id],
    () => getProgramSubscriberData(assetData),
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const viewableSubscriptionGroupsQuery = useQuery(
    [`get-viewableSubscriptionGroupsQuery-${assetData?.id}`, assetData],
    getAllViewableSubscriptions,
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const getScheduledSubscriptionsQuery = useQuery(
    [`get-getScheduledSubscriptionsQuery-${assetData?.id}`, assetData],
    getScheduledSubscriptionGroups,
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const getAllSubscriptionsQuery = useQuery(
    [`get-getScheduledSubscriptionsQuery-${assetData?.id}`, assetData],
    getAllSubscriptionGroups,
    { ...defaultQueryOptions, refetchOnMount: "always" }
  );

  const { data, isLoading } = useQuery(
    ["get-UDP-data", assetData?.id],
    () => getUDPData(),
    {
      refetchOnMount: "always",
      enabled:
        !!similarData &&
        !!discoveryProgramData &&
        !!discoverySchedulesData &&
        !!discoverySchedulesQuery.data &&
        !!playActionsData &&
        !!subscriberData &&
        !!viewableSubscriptionGroups &&
        !!scheduledSubScriptionGroups,
    }
  );

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
                  }}
                  variant={MFButtonVariant.FontIcon}
                  fontIconSource={cta.iconSource}
                  fontIconTextStyle={StyleSheet.flatten([
                    styles.textStyle,
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
        !props.seriesSubscriberData?.PriorityEpisodeTitle) ||
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
        progressDataSource = props.playActionsData?.Bookmark;
      } else {
        showLiveBadge = sourceType === sourceTypeString.LIVE || isLiveAsset;
      }
    } else if (props?.seriesSubscriberData!) {
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
        const { PriorityEpisodeTitle } = props.seriesSubscriberData!;

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
            progressDataSource.TimeSeconds =
              props.episodeBookmarkData?.TimeSeconds || 0;
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
          <ProgressBar
            styles={{
              progressBarContainer: [
                styles.progressBarContainer,
                { marginTop: 0 },
              ],
            }}
            dataSource={progressDataSource}
            progressInfo={""}
          />
        )}
      </View>
    );
  };

  const renderMoreLikeThis = () => {
    const feed = { Name: "More Like this" };
    return (
      <SafeAreaView>
        <MFSwimLane
          //@ts-ignore
          feed={feed}
          data={similarData}
          swimLaneKey={similarItemsSwimLaneKey}
          updateSwimLaneKey={setSimilarItemsSwimLaneKey}
          limitSwimlane
          ItemsTo={10}
        />
      </SafeAreaView>
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
      <SafeAreaView style={{ marginTop: -150 }}>
        <MFSwimLane
          //@ts-ignore
          feed={feedItem}
          data={roles && massageCastAndCrew(roles, assetTypeObject.PERSON)}
          swimLaneKey={castnCrewSwimLaneKey}
          updateSwimLaneKey={setCastnCrewSwimlaneKey}
        />
      </SafeAreaView>
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
    const [first, second] = feed!.ratingValues || [];
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
  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={AppImages.landing_background}
        style={styles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={styles.containerOpacity}>
          {udpDataAsset ? (
            <ScrollView key={`detailspagekey`} ref={onGetScrollView}>
              <View style={styles.detailsBlock}>
                {renderShowcard()}
                <View style={styles.secondBlock}>
                  <View style={styles.flexRow}>
                    {/* Metadata and CTA */}
                    {renderAssetInfo()}
                  </View>
                  {/* Network Logo */}
                  {renderNetworkInfo()}
                  <View style={styles.ctaButtonGroupBlock}>
                    {/* CTA */}
                    {renderCTAButtonGroup()}
                  </View>
                </View>
              </View>
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
        moreInfoProps={{
          udpData: udpDataAsset,
          networkInfo: networkInfo,
          genres: udpDataAsset?.genre || discoveryProgramData?.genre,
        }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create(
  getUIdef("Details.Showcard")?.style ||
    scaleAttributes({
      detailsBlock: {
        height: 852,
        flexDirection: "row",
      },
      secondBlock: {
        marginTop: 86,
        flexDirection: "column",
        flex: 1,
        height: 627,
      },
      flexRow: {
        flexDirection: "row",
      },
      ctaBlock: {
        flexDirection: "row",
      },
      favoriteBlock: {
        width: 583,
        marginTop: 69,
      },
      ctaButtonGroupBlock: {
        marginTop: 69,
      },
      containerOpacity: {
        backgroundColor: g.backgroundColors.shade1,
        opacity: 0.9,
      },
      firstColumn: {
        width: 583,
        alignItems: "center",
      },
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
        backgroundColor: g.backgroundColors.shade3,
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
      marginRight20: {
        marginRight: 20,
      },
      networkTitle: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body1,
        color: g.fontColors.darkGrey,
      },
      metadataContainer: {
        flexDirection: "row",
        paddingBottom: 23,
      },
      title: {
        fontFamily: g.fontFamily.bold,
        fontSize: g.fontSizes.heading2,
        color: g.fontColors.light,
        paddingBottom: 10,
      },
      hourGlass: {
        width: 16,
        height: 22,
        marginTop: 26,
        marginLeft: 15,
      },
      metadataLine1: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        marginBottom: 25,
      },
      description: {
        fontFamily: g.fontFamily.regular,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        lineHeight: g.lineHeights.body2,
      },
      showcardImage: {
        height: 628,
        width: 419,
      },
      buttonContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonIconContainer: {
        borderRadius: 35,
        width: 70,
        height: 70,
        overflow: "hidden",
        backgroundColor: g.backgroundColors.shade4,
      },
      solidBackground: {
        backgroundColor: g.backgroundColors.shade4,
      },
      moreDetailsContainer: {
        marginTop: 130,
      },
      contentRatingsContainer: {
        flexDirection: "row",
        marginBottom: 25,
      },
      contentRatingsIcon: {
        width: 30,
        height: 30,
      },
      contentRatingText: {
        marginLeft: 10,
      },
      ratingBlock: {
        marginRight: 30,
        flexDirection: "row",
      },
      textStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.light,
      },
      progressBarContainer: {
        height: 3,
      },
      progressInfoText: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        paddingBottom: 30,
        lineHeight: g.lineHeights.body2,
        marginBottom: 20,
      },
      statusTextStyle: {
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.regular,
        color: g.fontColors.statusWarning,
        marginBottom: 25,
      },
      fontIconStyle: {
        fontFamily: g.fontFamily.icons,
        fontSize: 70,
        color: g.fontColors.lightGrey,
        marginRight: 15,
        marginTop: -40,
        marginBottom: 10,
      },
      flexOne: {
        flex: 1,
      },
      ctaButtonStyle: {
        height: 66,
        fontFamily: g.fontFamily.semiBold,
      },
      ctaFontIconStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.statusError,
      },
      buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 40,
      },
      modalContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
      },
      episodeBlockContainer: {
        marginTop: 35.5,
      },
      episodeBlockTitle: {
        marginBottom: 20,
        fontSize: g.fontSizes.body1,
        fontFamily: g.fontFamily.bold,
        color: g.fontColors.light,
      },
      episodeMetadata: {
        marginBottom: 20,
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.semiBold,
        color: g.fontColors.lightGrey,
      },
      badgeStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.badge,
        fontSize: 50,
        marginLeft: 20,
        marginTop: -10,
      },
      marginTop: {
        marginTop: 8,
      },
      descriptionText: {
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.regular,
        color: g.fontColors.lightGrey,
        lineHeight: g.lineHeights.body2,
        marginBottom: 25,
      },
    })
);

export default DetailsScreen;
