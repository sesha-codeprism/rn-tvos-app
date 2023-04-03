import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { scaleAttributes, getUIdef } from "../../../../utils/uidefinition";

import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { AppStrings } from "../../../../config/strings";
import { AppImages } from "../../../../assets/images";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { generateType } from "../../../../utils/Subscriber.utils";
import { SourceType } from "../../../../utils/common";
import { SubscriptionPackages } from "../../../../utils/assetUtils";

type PurchaseNetworkSelectionPanelProps = {
    route: {
        params: {
            panelTitle: string;
            panelSubtitle: string;
            udpAssetData: any;
            confirmPlayCallBack: any;
            focusedEpisodeId?: string;
        };
    },
    navigation: any
    };



const PurchaseNetworkSelectionPanelImpl: React.FunctionComponent<PurchaseNetworkSelectionPanelProps> = (props: PurchaseNetworkSelectionPanelProps) => {
    const invertedHeading = true;

    const headingLine1 = props.route?.params?.panelTitle;

    const headingLine2 = props.route?.params?.panelSubtitle;

    const [focused, setFocused] = useState(0);


    const onPressNetwork = (data: any) => {
        const subscriptions = props.route.params.udpAssetData
            .subscriptionPackages;
        const selectedNetworkPackage = subscriptions.filter(
            (subscriptionPackage: SubscriptionPackages) => {
                return (
                    subscriptionPackage.purchaseNetwork.Id ===
                    data.subscriptionPackage.purchaseNetwork.Id
                );
            }
        );
        props.route.params.udpAssetData["subscriptionExists"] = true;
        props.navigation.push(Routes.PurchaseOptions, {
            panelTitle: AppStrings?.str_details_cta_subscribe,
            subTitle: props.route.params?.udpAssetData?.title,
            selectedNetwork: selectedNetworkPackage,
            udpAssetData: props.route.params?.udpAssetData,
            confirmPlayCallBack: props.route.params.confirmPlayCallBack,
            focusedEpisodeId: props.route.params.focusedEpisodeId,
        });
    };

    const renderBody = () => {
        const {
            subscriptionPackages,
            udpData,
            networkIHD,
            account,
        } = props.route.params.udpAssetData;

        return (
            <ScrollView
                style={styles.scrollViewContainer}
                snapToAlignment={"start"}
            >
                <Text style={styles.statusTextStyle}>
                    {`*${AppStrings?.str_subscription_network_description}`}
                </Text>
                    {subscriptionPackages.map(
                        (subscriptionPackage: any, index: number) => {
                            const data = {
                                centerValue: `${
                                    subscriptionPackage.purchaseNetwork?.Name ||
                                    AppStrings?.str_details_cta_play
                                }`,
                                assetType: generateType(
                                    subscriptionPackage.puchaseAction,
                                    SourceType.VOD
                                ),
                                udpData,
                                networkIHD,
                                account,
                                subscriptionPackage,
                            };
                            return (
                                <Pressable
                                hasTVPreferredFocus={index === 0 ? true : false}
                                onFocus={() => {
                                    setFocused(index)
                                }}
                                onPress={() => {
                                    onPressNetwork(data)
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
                                    {data.centerValue}
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
    }


    return (
        <SideMenuLayout
            title={headingLine1}
            subTitle={headingLine2}
            isTitleInverted={invertedHeading}
        >
            {renderBody()}
        </SideMenuLayout>
    )
}


export const PurchaseNetworkSelectionPanel = PurchaseNetworkSelectionPanelImpl

//   getUIdef("PurchaseNetworkSelectionPanel")?.style ||
const styles = StyleSheet.create(
        scaleAttributes({
            root: {
                paddingTop: 37,
            },
            selectButtonContainer: {
                width: "100%",
                height: 100,
                paddingLeft: 20,
                paddingRight: 20,
            },
            scrollViewContainer: {
                paddingTop: 34,
                paddingLeft: 20,
                paddingRight: 20,
                marginBottom: 200,
            },
            statusTextStyle: {
                color: globalStyles.fontColors.light,
                fontSize: globalStyles.fontSizes.body2,
                marginLeft: 50,
                marginRight: 50,
                marginTop: 20,
                marginBottom: 40,
            },
        })
);
