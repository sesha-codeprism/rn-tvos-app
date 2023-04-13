import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { PageContainerWithBackgroundImage } from "../../../../components/PageContainer";
import { AppImages } from "../../../../assets/images";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "react-query";
import { defaultQueryOptions, lang } from "../../../../config/constants";
import { GLOBALS } from "../../../../utils/globals";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { getDataFromUDL, UDLType } from "../../../../../backend";
import {
  ContentType,
  ItemShowType,
  SourceType,
} from "../../../../utils/common";
import {
  format,
  massageDiscoveryFeed,
  massageDiscoveryPackageAsset,
  massageLiveFeed,
} from "../../../../utils/assetUtils";
import { updateVariant } from "../../../../utils/live/LiveUtils";
import {
  assetTypeObject,
  fontIconsObject,
  PinType,
} from "../../../../utils/analytics/consts";
import { isFeatureAssigned } from "../../../../utils/helpers";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { ScrollView } from "react-native-gesture-handler";
import MFSwimLane from "../../../../components/MFSwimLane";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { SCREEN_WIDTH } from "../../../../utils/dimensions";
import { DetailsSidePanel } from "../DetailSidePanel";
import { open } from "fs";
import { DetailRoutes } from "../../../../config/navigation/DetailsNavigator";
import NotificationType from "../../../../@types/NotificationType";
import { invalidateQueryBasedOnSpecificKeys } from "../../../../config/queries";
import { GlobalContext } from "../../../../contexts/globalContext";
import { isPurchaseLocked } from "../../../../utils/pconControls";
const { width, height } = Dimensions.get("window");


interface PackageDetailsProps {
  navigation: NativeStackNavigationProp<any>;
  route?: any;
}
const PackageDetailsScreen: React.FunctionComponent<PackageDetailsProps> = (
  props
) => {
  /** Typecasting  and obtaining the feed from route params */
  const { feed } = props.route.params;
  const type = assetTypeObject[ContentType.PROGRAM];

  /** State management */
  const [backgroundImage, setBackgroundImage] = useState(
    AppImages.landing_background
  );
  const [selectedAsset, setSelectedAsset] = useState<any>();
  const [packageData, setPackageData] = useState<any>();
  const [packageActions, setPackageActions] = useState<any>();
  const [packageTitles, setPackageTitles] = useState<any>();
  const [subscriptionPackageItems, setSubscriptionPackageItems] =
    useState<any>();
  const [inThisPackageSwimlaneKey, setInThisPackageSwimlaneKey] = useState("");
  const [isCTAButtonFocused, setIsCTAButtonFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState(DetailRoutes.MoreInfo);
  const [screenProps, setScreenProps] = useState<any>();
  const currentContext = useContext(GlobalContext);

  /** Variables and consts used throughout the screen */
  const moreInfoIcon = getFontIcon("info");
  const rentBuyIcon = getFontIcon("rent_buy");
  const $skip = 0,
    $top = 25;
  const firstButtonRef = React.createRef<any>();
  const moreInfoButtonRef = React.createRef<any>();

  const hasFeatureIosCarrierBilling = isFeatureAssigned("IOSCarrierBilling");
  const inThisPackageRef: React.MutableRefObject<any> = React.useRef();
  const drawerRef: React.MutableRefObject<any> = React.useRef();

  /** React query section */

  const getPackageData = async () => {
    const udlParam =
      `udl://${UDLType.Discovery}/getpackageDetails/` +
      `?packageId=${feed?.Id}&$groups=${
        GLOBALS.store!.rightsGroupIds
      }&$lang=${lang}&storeId=${DefaultStore.Id}`;
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getPackageActions = async () => {
    const udlParam =
      `udl://${UDLType.Subscriber}/getPackageActions/` +
      `?storeId=${DefaultStore.Id}&packageId=${feed?.Id}`;
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getPackageTitles = async () => {
    const udlParam =
      `udl://${UDLType.Discovery}/getPackageTitles/` +
      `?$skip=${$skip}&$top=${$top}&$lang=${lang}&$groups=${GLOBALS.store?.rightsGroupIds}&storeId=${DefaultStore.Id}&packageId=${feed?.Id}`;
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getPackageItems = async () => {
    const udlParam =
      `udl://${UDLType.Discovery}/getPackageItems/` +
      `?$skip=${$skip}&$top=${$top}&$lang=${lang}$groups=${GLOBALS.store?.rightsGroupIds}&storeId=${DefaultStore.Id}&packageId=${feed?.Id}`;
    const data = await getDataFromUDL(udlParam);
    return data.data;
  };

  const getLiveSchedules = () => {
    const nowNextMap = GLOBALS.nowNextMap;
    let filterdNowNextScheduleMap: any = {};

    filterdNowNextScheduleMap = nowNextMap;
    const variantData = updateVariant(
      GLOBALS.channelMap,
      filterdNowNextScheduleMap,
      //@ts-ignore
      {},
      0,
      0,
      undefined
    );
    return massageLiveFeed(variantData, SourceType.LIVE);
  };

  const packageDataQuery = useQuery(
    ["getPackageData", feed?.Id],
    () => getPackageData(),
    { ...defaultQueryOptions, enabled: !!feed }
  );

  const packageActionsQuery = useQuery(
    ["getPackageActions", feed?.Id],
    () => getPackageActions(),
    { ...defaultQueryOptions, enabled: !!feed }
  );


  const invalidatePackageAction = () => {
    invalidateQueryBasedOnSpecificKeys("getPackageActions", feed?.Id);
  }

  const onDuplexMessage = (message: any) => {
    if (message) {
      switch (message.type) {
        case NotificationType.Purchase:
        case NotificationType.Subscription:
          invalidatePackageAction();
      }
    }
  };

  useEffect(() => {
    const boundDuplexConnector = onDuplexMessage.bind(this);
    currentContext.addDuplexMessageHandler(boundDuplexConnector);
    () => {
      currentContext.removeDuplexHandler(boundDuplexConnector);
    };
  }, []);

  useEffect(() => {
    if (
      packageDataQuery.data &&
      !packageDataQuery.isFetching &&
      packageActionsQuery.data &&
      !packageActionsQuery.isFetching
    ) {
      const packageInfo = massageDiscoveryPackageAsset(
        packageDataQuery.data,
        packageActionsQuery.data,
        type,
        isFeatureAssigned("IOSCarrierBilling")
      );
      setPackageData(packageInfo);
      setPackageActions(packageActionsQuery.data);
    }
  }, [
    packageDataQuery.data,
    packageDataQuery.isSuccess,
    packageActionsQuery.data,
  ]);

  const packageTitlesQuery = useQuery(
    ["getPackageTitles", feed?.Id],
    () => getPackageTitles(),
    { ...defaultQueryOptions, enabled: !!feed }
  );
  useEffect(() => {
    if (packageTitlesQuery.data && !packageTitlesQuery.isFetching) {
      const packageDataItems = packageTitlesQuery.data?.length
        ? massageDiscoveryFeed({ Items: packageTitlesQuery.data }, type)
        : null;
      setPackageTitles(packageDataItems);
    }
  }, [packageTitlesQuery.data, packageTitlesQuery.isFetching]);

  const subscriptionPackageItemsQuery = useQuery(
    ["getPackageItems", feed?.id],
    () => getPackageItems(),
    {
      ...defaultQueryOptions,
      //@ts-ignore
      enabled: !!feed.ItemType === ItemShowType.SvodPackage && !!feed,
    }
  );
  useEffect(() => {
    if (
      subscriptionPackageItemsQuery.data &&
      !subscriptionPackageItemsQuery.isFetching
    ) {
      let subscriptionPackageItems = undefined;
      if (feed.ItemType === ItemShowType.SvodPackage) {
        subscriptionPackageItems = massageDiscoveryFeed(
          {
            Items: subscriptionPackageItemsQuery.data,
          },
          feed?.ShowType === ItemShowType.TVShow
            ? assetTypeObject[ContentType.SERIES]
            : type
        );
        setSubscriptionPackageItems(subscriptionPackageItems);
      }
    }
  }, [
    subscriptionPackageItemsQuery.data,
    subscriptionPackageItemsQuery.isFetching,
  ]);

  const liveSchedulesQuery = useQuery(
    ["getLiveSchedules", feed?.Id],
    () => getLiveSchedules(),
    {
      ...defaultQueryOptions,
      //@ts-ignore
      enabled: !!feed.ItemType === ItemShowType.SvodPackage && !!feed,
    }
  );

  useEffect(() => {
    if (liveSchedulesQuery.data && !liveSchedulesQuery.isFetching) {
      const massagedLiveScheduleObject: any = {};
      let subscriptionSVODPackageItems = [];
      //@ts-ignore
      for (let massagedLiveSchedule of liveSchedulesQuery.data) {
        massagedLiveScheduleObject[massagedLiveSchedule.Schedule.StationId] =
          massagedLiveSchedule;
      }

      if (subscriptionPackageItems) {
        for (let subscriptionPackageItem of subscriptionPackageItems) {
          massagedLiveScheduleObject[subscriptionPackageItem.Id] &&
            subscriptionSVODPackageItems.push({
              ...subscriptionPackageItem,
              ...massagedLiveScheduleObject[subscriptionPackageItem.Id],
            });
        }
      }
      if (subscriptionSVODPackageItems.length) {
        setSubscriptionPackageItems(subscriptionSVODPackageItems);
      }
    }
  }, [liveSchedulesQuery.data, liveSchedulesQuery.isFetching]);

  const featureNotImplementedAlert = (
    title: string = "Missing implementation",
    message: string = "This feature not implemented yet"
  ) => {
    return Alert.alert(title, message);
  };

  const handleRentButtonPress = (panelTitle: string) => {
    DeviceEventEmitter.emit("openPurchase", {
      params:{
          udpAssetData: {
              ...packageData,
              purchasePackage: true,
              purchasePackageActions: packageActions,
        },
        panelTitle: panelTitle,
      },
      drawerPercentage:0.37
    });

    // if (packageActions?.PurchaseActions != undefined) {
    //   this.props.openPanel(true, SideMenuRoutes.PurchaseOptions, {
    //     udpAssetData: {
    //       id: this.props.navigation.params.data.Id,
    //       title: this.props.packageData?.Name,
    //       purchasePackage: true,
    //       purchasePackageActions: this.props.packageActions?.PurchaseActions,
    //       getPackageActions: this.props.reloadPackageActions,
    //     },
    //     panelTitle: panelTitle,
    //   });
    // }
  };

  const toggleSidePanel = () => {
    setScreenProps({
      udpData: packageData,
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

  const closeModal = () => {
    setOpen(false);
  };

  const ctaButtonPress = {
    [AppStrings.str_details_cta_rentbuy]: () =>
      handleRentButtonPress(AppStrings.str_details_cta_rentbuy),
    [AppStrings.str_details_cta_rent]: () =>
      handleRentButtonPress(AppStrings.str_details_cta_rent),
    [AppStrings.str_details_cta_buy]: () =>
      handleRentButtonPress(AppStrings.str_details_cta_buy),
    [AppStrings.str_details_cta_more_info]: toggleSidePanel,
  };

  const renderShowcard = () => {
    const imageSource =
      packageData?.image16x9KeyArtURL ||
      packageData?.image16x9PosterURL ||
      AppImages.placeholder;
    return (
      <View>
        {/* Show card */}
        <ImageBackground
          source={imageSource}
          style={packageDetailsStyle.showcardImage}
        >
          {/* <GradientView
            gradientType={"linear"}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 0, y: 0.9 }}
            startColor={{
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            }}
            endColor={{
              red: 0,
              green: 0,
              blue: 0,
              alpha: 210,
            }}
          /> */}
        </ImageBackground>
      </View>
    );
  };

  const renderRentBuyButton = () => {
    const isRent = packageActions?.PurchaseActions?.find(
      (obj: any) => obj?.TransactionType === "Rent"
    );
    const isBuy = packageActions?.PurchaseActions?.find(
      (obj: any) => obj?.TransactionType === "Purchase"
    );
    if (!hasFeatureIosCarrierBilling) {
      return;
    }
    if (isRent && isBuy) {
      return (
        <MFButton
          ref={firstButtonRef}
          focusable
          iconSource={0}
          imageSource={0}
          avatarSource={undefined}
          hasTVPreferredFocus
          onFocus={() => {
            setIsCTAButtonFocused(true);
          }}
          variant={MFButtonVariant.FontIcon}
          fontIconSource={rentBuyIcon}
          fontIconTextStyle={StyleSheet.flatten([
            packageDetailsStyle.textStyle,
            {
              fontSize: 90,
              color: "white",
            },
          ])}
          textStyle={{
            color: "#EEEEEE",
            fontFamily: "Inter-SemiBold",
            fontSize: 25,
            fontWeight: "600",
            textAlign: "center",
            marginLeft: 21,
          }}
          textLabel={AppStrings.str_details_cta_rentbuy}
          style={{
            height: 62,
            alignSelf: "center",
            padding: 12,
            backgroundColor: "#424242",
            borderRadius: 6,
            paddingHorizontal: 35,
            zIndex: 100,
          }}
          focusedStyle={packageDetailsStyle.focusedBackground}
          fontIconProps={{
            iconPlacement: "Left",
            shouldRenderImage: true,
          }}
          onPress={() =>  {
            if(isPurchaseLocked()){
              DeviceEventEmitter.emit("openPinVerificationPopup", {
                pinType: PinType.purchase,
                data: {
                  udpData: {
                    ...packageData,
                    purchaseActions: packageActions?.PurchaseActions
                  }
                },
                onSuccess: () => {
                  DeviceEventEmitter.emit("openPurchase", {
                    params:{
                      udpAssetData: {
                        ...packageData,
                        purchaseActions: packageActions?.PurchaseActions
                      },
                      panelTitle: AppStrings?.str_details_cta_rentbuy,
                    },
                    drawerPercentage:0.37
                  });
                },
              });
            }
          }}
        />
      );
    } else if (isRent) {
      return (
        <MFButton
          ref={firstButtonRef}
          focusable
          iconSource={0}
          imageSource={0}
          hasTVPreferredFocus
          avatarSource={undefined}
          onFocus={() => {
            setIsCTAButtonFocused(true);
          }}
          variant={MFButtonVariant.FontIcon}
          fontIconSource={rentBuyIcon}
          fontIconTextStyle={StyleSheet.flatten([
            packageDetailsStyle.textStyle,
            {
              fontSize: 90,
              color: "white",
            },
          ])}
          textStyle={{
            color: "#EEEEEE",
            fontFamily: "Inter-SemiBold",
            fontSize: 25,
            fontWeight: "600",
            textAlign: "center",
            marginLeft: 21,
          }}
          textLabel={AppStrings.str_details_cta_rent}
          style={{
            height: 62,
            alignSelf: "center",
            padding: 12,
            backgroundColor: "#424242",
            borderRadius: 6,
            paddingHorizontal: 35,
            zIndex: 100,
          }}
          focusedStyle={packageDetailsStyle.focusedBackground}
          fontIconProps={{
            iconPlacement: "Left",
            shouldRenderImage: true,
          }}
          onPress={() =>  {
            if(isPurchaseLocked()){
              DeviceEventEmitter.emit("openPinVerificationPopup", {
                pinType: PinType.purchase,
                data: {
                  udpData: {
                    ...packageData,
                    purchaseActions: packageActions?.PurchaseActions
                  }
                },
                onSuccess: () => {
                  DeviceEventEmitter.emit("openPurchase", {
                    params:{
                      udpAssetData: {
                        ...packageData,
                        purchaseActions: packageActions?.PurchaseActions
                      },
                      panelTitle: AppStrings?.str_details_cta_rent,
                    },
                    drawerPercentage:0.37
                  });
                },
              });
            }
          }}
        />
      );
    } else if (isBuy) {
      return (
        <MFButton
          ref={firstButtonRef}
          focusable
          iconSource={0}
          imageSource={0}
          avatarSource={undefined}
          hasTVPreferredFocus
          onFocus={() => {
            setIsCTAButtonFocused(true);
          }}
          variant={MFButtonVariant.FontIcon}
          fontIconSource={rentBuyIcon}
          fontIconTextStyle={StyleSheet.flatten([
            packageDetailsStyle.textStyle,
            {
              fontSize: 90,
              color: "white",
            },
          ])}
          textStyle={{
            color: "#EEEEEE",
            fontFamily: "Inter-SemiBold",
            fontSize: 25,
            fontWeight: "600",
            textAlign: "center",
            marginLeft: 21,
          }}
          textLabel={AppStrings.str_details_cta_buy}
          style={{
            height: 62,
            alignSelf: "center",
            padding: 12,
            backgroundColor: "#424242",
            borderRadius: 6,
            paddingHorizontal: 35,
            zIndex: 100,
          }}
          focusedStyle={packageDetailsStyle.focusedBackground}
          fontIconProps={{
            iconPlacement: "Left",
            shouldRenderImage: true,
          }}
          onPress={() =>  {
            if(isPurchaseLocked()){
              DeviceEventEmitter.emit("openPinVerificationPopup", {
                pinType: PinType.purchase,
                data: {
                  udpData: {
                    ...packageData,
                    purchaseActions: packageActions?.PurchaseActions
                  }
                },
                onSuccess: () => {
                  DeviceEventEmitter.emit("openPurchase", {
                    params:{
                      udpAssetData: {
                        ...packageData,
                        purchaseActions: packageActions?.PurchaseActions
                      },
                      panelTitle: AppStrings?.str_details_cta_buy,
                    },
                    drawerPercentage:0.37
                  });
                },
              });
            }
          }}
        />
      );
    }
  };

  const renderAssetInfo = () => {
    const itemCount =
      packageData?.ItemCount === 1
        ? format(
            AppStrings?.str_packageDetails_item_count,
            packageData?.ItemCount.toString()
          )
        : packageData?.ItemCount >= 1
        ? format(
            AppStrings?.str_packageDetails_items_count,
            packageData?.ItemCount.toString()
          )
        : "";

    const qualityLevel =
      packageData?.combinedQualityLevels &&
      packageData?.combinedQualityLevels[0];

    const statusText =
      packageData?.statusText &&
      packageData?.statusText.length &&
      packageData?.statusText[0];

    return (
      <View>
        {/* Title */}
        <Text style={packageDetailsStyle.title}>{packageData?.Name}</Text>

        {/* Metadata: Items Count */}
        <Text style={packageDetailsStyle.metadataLine1}>{itemCount}</Text>

        {/* Quality Indicators */}
        {!!qualityLevel && (
          <Text style={packageDetailsStyle.fontIconStyle}>
            {getFontIcon((fontIconsObject as any)[qualityLevel])}
          </Text>
        )}

        {/* Metadata: Status Text 
            TO DO need to update the status metadata */}
        <Text style={packageDetailsStyle.statusTextStyle}>{statusText}</Text>

        {/* Description */}
        <Text style={packageDetailsStyle.description}>
          {packageData?.Description}
        </Text>
        <View style={packageDetailsStyle.buttonContainer}>
          <ScrollView horizontal>
            {renderRentBuyButton()}
            <MFButton
              ref={moreInfoButtonRef}
              focusable
              iconSource={0}
              imageSource={0}
              avatarSource={undefined}
              onFocus={() => {
                setIsCTAButtonFocused(true);
                setOpen(false);
              }}
              onPress={ctaButtonPress[AppStrings?.str_details_cta_more_info]}
              variant={MFButtonVariant.FontIcon}
              fontIconSource={moreInfoIcon}
              fontIconTextStyle={StyleSheet.flatten([
                packageDetailsStyle.textStyle,
                {
                  fontSize: 90,
                  color: "white",
                },
              ])}
              textStyle={{
                color: "#EEEEEE",
                fontFamily: "Inter-SemiBold",
                fontSize: 25,
                fontWeight: "600",
                textAlign: "center",
                marginLeft: 21,
              }}
              textLabel={AppStrings.str_details_cta_more_info}
              style={{
                height: 62,
                alignSelf: "center",
                padding: 12,
                backgroundColor: "#424242",
                borderRadius: 6,
                paddingHorizontal: 35,
                zIndex: 100,
              }}
              focusedStyle={packageDetailsStyle.focusedBackground}
              fontIconProps={{
                iconPlacement: "Left",
                shouldRenderImage: true,
              }}
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderPackageItems = () => {
    if (!packageTitles?.length && !subscriptionPackageItems?.length) {
      return null;
    }

    return (
      <SafeAreaView style={{ marginTop: -150 }}>
        <MFSwimLane
          ref={inThisPackageRef}
          key={"packageItems"}
          //@ts-ignore
          feed={{ Name: AppStrings?.str_packageDetails_in_this_package }}
          data={packageTitles}
          //@ts-ignore
          navigation={props.navigation}
          swimLaneKey={inThisPackageSwimlaneKey}
          updateSwimLaneKey={setInThisPackageSwimlaneKey}
          limitSwimlane
          ItemsTo={10}
          onPress={(event) => {
            props.navigation.push(Routes.Details, { feed: event });
          }}
        />
      </SafeAreaView>
    );
  };

  const onFocusBar = () => {
    if (isCTAButtonFocused && packageTitles && packageTitles.length) {
      /** Triggered when moving from CTA Button to swimlane */
      const cardToFocus =
        inThisPackageRef.current?.focused || inThisPackageRef.current?.first;
      setIsCTAButtonFocused(false);
      cardToFocus?.setNativeProps({
        hasTVPreferredFocus: true,
      });
    } else if (isCTAButtonFocused && !packageTitles) {
      /** Triggered when trying to move to swimlane from CTA but swimlane doesn't exist */
      firstButtonRef?.current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
    } else if (!isCTAButtonFocused) {
      /** Triggered when trying to move from swimlane to CTA */
      firstButtonRef?.current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
    }
  };

  return (
    <PageContainerWithBackgroundImage
      type="FullPage"
      imageUrl={backgroundImage}
    >
      <View  style={packageDetailsStyle.containerOpacity}>   
        <View style={packageDetailsStyle.detailContainer}>
          {renderShowcard()}

          <View style={packageDetailsStyle.metadataViewStyle}>
            {/* Metada */}
            {renderAssetInfo()}
          </View>
        </View>
        {packageData && (
          <TouchableOpacity
            accessible={true}
            activeOpacity={0.3}
            onFocus={onFocusBar}
            style={
              packageTitles && packageTitles.length
                ? {
                    backgroundColor: "transparent",
                    width: SCREEN_WIDTH,
                    zIndex: 100,
                  }
                : {
                    backgroundColor: "transparent",
                    height: 20,
                    width: SCREEN_WIDTH,
                    marginTop: 50,
                    zIndex: 100,
                    // marginBottom: 60,
                  }
            }
          />
        )}
        <View style={packageDetailsStyle.moreDetailsContainer}>
          {/* Package Itemss */}
          {renderPackageItems()}
        </View>
      </View>
      <DetailsSidePanel
        ref={drawerRef}
        drawerPercentage={37}
        animationTime={200}
        overlay={false}
        opacity={1}
        open={open}
        animatedWidth={width * 0.37}
        // openPage="MoreInfo"
        closeOnPressBack={false}
        navigation={props.navigation}
        drawerContent={false}
        route={route}
        closeModal={closeModal}
        screenProps={screenProps} // moreInfoProps={}
      />
    </PageContainerWithBackgroundImage>
  );
};

const packageDetailsStyle: any = StyleSheet.create(
  getUIdef("PackageDetails.Showcard")?.style ||
    scaleAttributes({
      containerOpacity: {
        flex: 1,
        backgroundColor: globalStyles.backgroundColors.shade1,
        opacity: 0.9,
      },
      title: {
        fontFamily: globalStyles.fontFamily.bold,
        fontSize: globalStyles.fontSizes.heading2,
        color: globalStyles.fontColors.light,
        paddingBottom: 30,
      },
      metadataLine1: {
        fontFamily: globalStyles.fontFamily.semiBold,
        fontSize: globalStyles.fontSizes.body2,
        color: globalStyles.fontColors.lightGrey,
        paddingBottom: 30,
      },
      description: {
        fontFamily: globalStyles.fontFamily.regular,
        fontSize: globalStyles.fontSizes.body2,
        color: globalStyles.fontColors.lightGrey,
        lineHeight: globalStyles.lineHeights.body2,
        textAlign: "justify",
        width: 800,
      },
      showcardImage: {
        height: 330,
        width: 587,
      },
      detailContainer: {
        flexDirection: "row",
        paddingTop: 60,
        paddingLeft: 88,
      },
      metadataViewStyle: {
        paddingLeft: 76,
      },
      moreDetailsContainer: {
        marginTop: 104,
      },
      imageBackgroundStyle: {
        flex: 1,
      },
      bgImageStyle: {
        resizeMode: "stretch",
      },
      textStyle: {
        fontFamily: globalStyles.fontFamily.icons,
        color: globalStyles.fontColors.light,
      },
      statusTextStyle: {
        fontSize: globalStyles.fontSizes.body2,
        color: globalStyles.fontColors.statusWarning,
        paddingBottom: 30,
      },
      fontIconStyle: {
        fontFamily: globalStyles.fontFamily.icons,
        fontSize: 70,
        color: globalStyles.fontColors.light,
        marginRight: 15,
        marginBottom: 23,
      },
      ctaButtonStyle: {
        height: 66,
        fontFamily: globalStyles.fontFamily.semiBold,
        marginRight: 20,
      },
      buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 28,
      },
      focusedBackground:{
        backgroundColor: "#053C69",
        borderRadius: 6,
        shadowColor: "#0000006b",
        shadowOffset: {
          width: 6,
          height: 8
        },
        shadowOpacity: 0.42,
        shadowRadius: 4.65,
        elevation: 8
      }
    })
);

export default PackageDetailsScreen;
