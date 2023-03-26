import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Quality } from "../__types__/waysToWatch";
import mkIcons from "../config/MK-IconCodes.json";
import { generateType } from "../utilities/types";
import { SourceType } from "../MediaFirstClientUDL/src/__types__/common/common";

import { SideMenuRoutes } from "./sideMenu";
import { globals as g } from "../config/Globals";
import { getScaledHeight, getScaledValue } from "../utilities/dimensions";
import { metadataSeparator, Network } from "../utilities/assetUtils";
import { currencies } from "../utilities/currencies";
import { AppStrings } from "../../../config/strings";
import { AppImages } from "../../../assets/images";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { scaleAttributes } from "../../../utils/uidefinition";

type PurchaseOptionsPanelProps = {
    params: {
        panelTitle: string;
        udpAssetData: any;
        confirmPlayCallBack: any;
        selectedNetwork?: Network;
        focusedEpisodeId?: string;
        rerouteToDetails?: any;
    };
};

type PurchaseOptionsPanelState = {
    focused: string | number;
};

let selectedPurchaseOption = "";

const PurchaseOptionsPanelImpl: React.FunctionComponent<PurchaseOptionsPanelProps> = (props: PurchaseOptionsPanelProps) => {

    const [purchaseActions, setPurchaseActions] = useState([]);
    const [isSubscribe, setIsSubscribe] = useState(true);
    const [channelSubscribeActions, setChannelSubscribeActions] = useState([]);
    const [headingLine1, setheadingLine1] = useState("");
    const [headingLine2, setheadingLine2] = useState("");
    const [focused, setFocused] = useState(0);

    const firstButtonRef = useRef<any>(null);
    const invertedHeading = true;

    useEffect(() => {
        setTimeout(() => {
            if (firstButtonRef.current) {
                firstButtonRef.current?.setNativeProps({
                    hasTVPreferredFocus: true,
                });
            }
        }, 0);
    }, []);

    useEffect(() => {
        const purchaseActionsTemp = props.params.udpAssetData.purchasePackage == undefined &&
            props.params.udpAssetData.subscriptionExists == undefined
            ? props.params.udpAssetData.purchaseActions
            : props.params.udpAssetData.subscriptionExists
                ? props.params?.selectedNetwork?.length > 0
                    ? props.params?.selectedNetwork[0]?.purchaseActions
                    : props.params?.udpAssetData?.subscriptionPackages[0]
                        ?.purchaseActions
                : props.params.udpAssetData.purchasePackageActions;

        const isSubscribeTemp =
            props.params.udpAssetData.subscriptionExists ||
                props.params.udpAssetData?.channelActions?.length > 0
                ? true
                : false;

        const channelSubscribeActionsTemp = props.params.udpAssetData.channelActions;

        const headingLine1Temp = props.params.panelTitle;

        const headingLine2Temp = props.params?.udpAssetData.title;
        setPurchaseActions(purchaseActionsTemp);
        setIsSubscribe(isSubscribeTemp);
        setChannelSubscribeActions(channelSubscribeActionsTemp);
        setheadingLine1(headingLine1Temp);
        setheadingLine2(headingLine2Temp);

    }, [props]);



    const getQualityIcon = (quality: Quality): keyof typeof mkIcons | undefined => {
        switch (quality) {
            case "SD":
                return "quality_sd";
            case "HD":
                return "quality_hd";
            case "UHD":
                return "quality_4k";
            case "ReachSD":
                return "quality_sd";
            case "ReachHD":
                return "quality_hd";
            case "ReachUHD":
                return "quality_4k";
            default:
                return undefined;
        }
    };

    const getQualityString = (quality: Quality): string | undefined => {
        switch (quality) {
            case "SD":
                return "SD";
            case "HD":
                return "HD";
            case "UHD":
                return "4K";
            case "ReachSD":
                return "SD";
            case "ReachHD":
                return "HD";
            case "ReachUHD":
                return "4K";
            default:
                return undefined;
        }
    };

    const onPressPurchaseAction = (data: any) => {
        selectedPurchaseOption = data.purchaseAction?.OfferId;

        const headingType =
            data.purchaseAction.TransactionType === "Subscription"
                ? AppStrings?.str_details_cta_subscribe
                : data.purchaseAction.TransactionType ===
                    AppStrings?.str_details_cta_rent
                    ? AppStrings?.str_details_cta_rent
                    : AppStrings?.str_details_cta_buy;

        const subTitle = [];
        subTitle.push(props.params?.udpAssetData?.title);
        subTitle.push(
            getQualityString(data.purchaseAction?.QualityLevels[0])
        );

        props.navigation.pushRoute(SideMenuRoutes.PurchaseInformation, {
            title: headingType,
            subTitle: subTitle.join(metadataSeparator),
            purchaseActions: data.purchaseAction,
            udpAssetData: data.udpAssetData,
            confirmPlayCallBack: props.params.confirmPlayCallBack,
            focusedEpisodeId: props.params.focusedEpisodeId,
            isChannelSubscription:
                channelSubscribeActions?.length > 0 ? true : false,
            rerouteToDetails: props.params.rerouteToDetails,
        });
    };

    const renderPurchaseActions = (
        purchaseActions: any,
        udpData: any,
        networkIHD: any,
        account: any,
        udpAssetData: any,
        isFirstButton: boolean,
        isRentAndBuy: boolean
    ) => {
        const innerScrollViewContainer = isRentAndBuy
            ? purchaseActions.length < 4 && purchaseActions.length > 0
                ? {
                    ...styles.innerScrollViewContainer,
                    height: getScaledHeight(purchaseActions.length * 120),
                }
                : styles.innerScrollViewContainerRentBuy
            : styles.innerScrollViewContainer;

        return (
            <ScrollView
                style={innerScrollViewContainer}
                snapToAlignment={"start"}
                snapToInterval={getScaledValue(60)}
            >
                {purchaseActions?.map(
                    (purchaseAction: any, index: number) => {
                        const centerValue =
                            udpAssetData.purchasePackage !== undefined ||
                                isSubscribe ||
                                channelSubscribeActions?.length > 0
                                ? purchaseAction.PackageName
                                : `${purchaseAction.Currency} ${purchaseAction.Price}`;
                        const rightValue = `${currencies[purchaseAction.Currency]
                                .symbol_native
                            } ${purchaseAction.Price.toFixed(2)} `;
                        const data = {
                            centerValue: centerValue,
                            rightValue: rightValue,
                            assetType: generateType(
                                purchaseAction,
                                SourceType.VOD
                            ),
                            udpData,
                            Entitlements: purchaseAction.Restrictions,
                            networkIHD,
                            account,
                            purchaseAction,
                            udpAssetData,
                        };
                        return (

                            <Pressable
                                hasTVPreferredFocus={isFirstButton}
                                onFocus={() => {
                                    setFocused(index);
                                }}
                                onPress={() => {
                                    onPressPurchaseAction(data)
                                }}
                                style={[
                                    index === focused
                                        ? {
                                            ...styles?.containerActive,
                                            ...styles?.container,
                                        }
                                        : styles?.container,
                                    styles?.containerSpacing
                                ]}
                                key={index}
                                isTVSelectable={true}
                            >

                                <Text
                                    style={[
                                        styles?.listText,
                                        { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                                    ]}
                                >
                                    {getQualityIcon(purchaseAction.QualityLevels[0])}
                                </Text>
                                <Text
                                    style={[
                                        styles?.listText,
                                        { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                                    ]}
                                >
                                    {data.centerValue}
                                </Text>
                                <Text
                                    style={[
                                        styles?.listText,
                                        { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                                    ]}
                                >
                                    {data.rightValue}
                                </Text>

                                <Image
                                    source={AppImages.arrow_right}
                                    style={{ width: 15, height: 30 }}
                                />
                            </Pressable>
                        );
                    }
                )}
            </ScrollView>
        );
    };

    const renderBody = () => {
        const { udpData, networkIHD, account } = props.params.udpAssetData;
        const { udpAssetData } = props.params;
        let [rentPurchaseActions, buyPurchaseActions, subscribeActions] = [
            [],
            [],
            [],
        ];
        if (
            props.params.panelTitle ===
            AppStrings?.str_details_cta_rentbuy ||
            props.params.panelTitle ===
            AppStrings?.str_details_cta_package
        ) {
            purchaseActions.map((purchaseAction: any) => {
                if (
                    purchaseAction.TransactionType ===
                    AppStrings?.str_details_cta_rent
                )
                    /// @ts-ignore
                    rentPurchaseActions.push(purchaseAction);
                else if (purchaseAction.TransactionType === "Purchase")
                    /// @ts-ignore
                    buyPurchaseActions.push(purchaseAction);
            });
        } else if (
            props.params.panelTitle ===
            AppStrings?.str_details_cta_rent
        ) {
            rentPurchaseActions = purchaseActions;
        } else if (
            props.params.panelTitle ===
            AppStrings?.str_details_cta_buy
        ) {
            buyPurchaseActions = purchaseActions;
        } else if (
            props.params.panelTitle ===
            AppStrings?.str_details_cta_subscribe
        ) {
            if (channelSubscribeActions) {
                subscribeActions = channelSubscribeActions;
            } else {
                subscribeActions = purchaseActions;
            }
        }

        const filteredRentPurchaseActions = Array.from(
            new Set(
                rentPurchaseActions.map(
                    (purchaseAction) => purchaseAction?.OfferId
                )
            )
        ).map((OfferId) => {
            return rentPurchaseActions.find(
                (purchaseAction) => purchaseAction?.OfferId === OfferId
            );
        });

        const filteredBuyPurchaseActions = Array.from(
            new Set(
                buyPurchaseActions.map(
                    (purchaseAction) => purchaseAction?.OfferId
                )
            )
        ).map((OfferId) => {
            return buyPurchaseActions.find(
                (purchaseAction) => purchaseAction?.OfferId === OfferId
            );
        });

        const filteredSubscribeAction = Array.from(
            new Set(
                subscribeActions.map(
                    (subscribeAction) => subscribeAction.OfferId
                )
            )
        ).map((OfferId) => {
            return subscribeActions.find(
                (subscribeAction) => subscribeAction.OfferId === OfferId
            );
        });

        const isRentBuy =
            filteredRentPurchaseActions.length > 0 &&
            filteredBuyPurchaseActions.length > 0;

        return (
            <ScrollView>
                {filteredRentPurchaseActions.length > 0 &&
                    !isSubscribe && (
                        <Text style={styles.textStyle}>
                            {AppStrings?.str_details_cta_rent}
                        </Text>
                    )}
                {filteredRentPurchaseActions.length > 0 &&
                    !isSubscribe &&
                    renderPurchaseActions(
                        filteredRentPurchaseActions,
                        udpData,
                        networkIHD,
                        account,
                        udpAssetData,
                        true,
                        isRentBuy
                    )}
                {filteredBuyPurchaseActions.length > 0 && !isSubscribe && (
                    <Text style={styles.textStyle}>
                        {AppStrings?.str_details_cta_buy}
                    </Text>
                )}
                {filteredBuyPurchaseActions.length > 0 &&
                    !isSubscribe &&
                    renderPurchaseActions(
                        filteredBuyPurchaseActions,
                        udpData,
                        networkIHD,
                        account,
                        udpAssetData,
                        filteredRentPurchaseActions.length <= 0 &&
                            filteredBuyPurchaseActions.length > 0
                            ? true
                            : false,
                        isRentBuy
                    )}
                {filteredSubscribeAction.length > 0 && (
                    <View>
                        {props.params.selectedNetwork && (
                            <Text style={styles.textStyle}>
                                {props.params.selectedNetwork.Name}
                            </Text>
                        )}
                        <Text style={styles.subTextStyle}>
                            {
                                AppStrings
                                    ?.str_subscription_select_description
                            }
                        </Text>
                    </View>
                )}
                {filteredSubscribeAction.length > 0 &&
                    renderPurchaseActions(
                        filteredSubscribeAction,
                        udpData,
                        networkIHD,
                        account,
                        udpAssetData,
                        true,
                        isRentBuy
                    )}
            </ScrollView>
        );
    }
    return (
        <SideMenuLayout
            title={headingLine1}
            subTitle={headingLine2}
        >
            {renderBody()}
        </SideMenuLayout>
    )
}



export const PurchaseOptionsPanel = PurchaseOptionsPanelImpl

// getUIdef("PurchaseOptionsPanel")?.style ||
const styles = StyleSheet.create(
    scaleAttributes({
        scrollViewContainer: {
            paddingTop: 34,
            paddingLeft: 40,
            paddingRight: 40,
            marginBottom: 200,
        },
        selectButtonContainer: {
            width: "100%",
            height: 100,
        },
        viewContainer: {
            flex: 1,
        },
        innerScrollViewContainerRentBuy: {
            height: 395,
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 40,
            paddingRight: 40,
        },
        innerScrollViewContainer: {
            height: 800,
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 40,
            paddingRight: 40,
        },
        textStyle: {
            fontFamily: g.fontFamily.bold,
            color: g.fontColors.light,
            fontSize: g.fontSizes.subTitle2,
            marginLeft: 51,
            marginTop: 20,
        },
        subTextStyle: {
            color: g.fontColors.light,
            fontSize: g.fontSizes.body2,
            marginLeft: 51,
            marginTop: 20,
            marginBottom: 40,
        },
    })
);
