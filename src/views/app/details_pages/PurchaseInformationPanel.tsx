import { View, Text, StyleSheet } from "react-native";
import { scaleAttributes, getUIdef } from "../../../utils/uidefinition";

import { replacePlaceHoldersInTemplatedString } from "../../../utils/strings";
import {
    formatDate,
    format,
    convertSecondsToHours,
    durationStringToSeconds,
} from "../../../utils/dataUtils";

import { assetTypeObject, pbr, PinType } from "../../../utils/analytics/consts";
import { getRestrictionsText } from "../../../utils/assetUtils";;
import { currencies } from "../../../utils/currencies";
import { AppStrings } from "../../../config/strings";
import MFEventEmitter from "../../../utils/MFEventEmitter";
import { GLOBALS } from "../../../utils/globals";
import { purchaseItem } from "../../../../backend/subscriber/subscriber";
import React, { useState } from "react";
import MFLoader from "../../../components/MFLoader";
import MFButton, { MFButtonVariant } from "../../../components/MFButton/MFButton";
import { globalStyles } from "../../../config/styles/GlobalStyles";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { Routes } from "../../../config/navigation/RouterOutlet";

type PurchaseInfromationPanelProps = {
    params: {
        title: string;
        subTitle: string;
        purchaseActions: any;
        udpAssetData: any;
        confirmPlayCallBack: any;
        focusedEpisodeId?: string;
        isChannelSubscription?: boolean;
        rerouteToDetails?: any;
        playOptionRefetch?: any;
        packageActionRefetch?: any;
    },
    navigation: any
}


const PurchaseInformationPanelImpl: React.FunctionComponent<PurchaseInfromationPanelProps> = (props: PurchaseInfromationPanelProps) => {
    const [loader, setLoader] = useState(false);
    const headingLine1 = props.route.params.title;
    const headingLine2 = props.route.params.subTitle;
    const invertedHeading = true;

    const isPurchaseLocked = () => {
        return GLOBALS?.store?.settings?.parentalControll?.purchaseLock &&
            GLOBALS?.store?.settings?.parentalControll?.purchaseLock["locked"]
            ? true
            : false;
    }

    const checkPurchaseLockAndProceed = (callBack: any) => {
        const data = {
            title: props.route.params?.subTitle,
            pinLabelHeader:
                AppStrings?.str_settings_content_purchase_locked,
            pinLabel: AppStrings?.str_pcon_header_purchase_text,
        };

        if (isPurchaseLocked()) {
            MFEventEmitter.emit("closeClosePurchase", undefined);
            MFEventEmitter.emit("OpenPurchasePIN", {
                screenName: "Purchase Pin",
                action: "validate_pin",
                label: "Enter Purchase PIN",
                onClose: () => callBack(),
                pinType: PinType.purchase,
            });
        } else {
            callBack();
        }
    };

    // TBD: after notifications story
    const showNotification = () => {
        // this.props.createNotification({
        //     id: AppStrings?.str_subscription_success_notification,
        //     iconName: "subscribe",
        //     subtitle: AppStrings?.str_subscription_success_notification,
        // });
    };

    const onPressConfirm = () => {
        checkPurchaseLockAndProceed(() => {
            purchaseItem(
                props.route.params?.purchaseActions?.OfferId,
                props.route.params?.purchaseActions?.Price
            )
                .then(() => {
                    MFEventEmitter.emit("closeClosePurchase", undefined);

                    /* - Channel subscription not in scope right now
                    // same reload channel rights,  set to guide, remake live feed
                    if (this.props.route.params.isChannelSubscription) {
                        this.props.reloadChannelRights();
                        this.props.route.params.rerouteToDetails(true);
                    }
                    */
                })
                .then(() => {
                    if (
                        props.route.params?.purchaseActions?.ResourceType ===
                        "Subscription"
                    ) {
                        showNotification();
                    }

                })
                .catch((error: any) => {
                    MFEventEmitter.emit("closeClosePurchase", undefined);
                    MFEventEmitter.emit("openPopup", {
                        buttons: [
                            {
                                title: "OK",
                                onPress: () => {
                                    MFEventEmitter.emit("closeAll", undefined);

                                },
                            }
                        ],
                        description: AppStrings?.str_purchase_failed_message
                    });
                });
        });
    };

    const confirmPlayCallBack = () => {

    }

    const onPressConfirmAndPlay = () => {
        setLoader(true);
        checkPurchaseLockAndProceed(() => {
            purchaseItem(
                props.route.params?.purchaseActions?.OfferId,
                props.route.params?.purchaseActions?.Price
            )
                .then(() => {
                    MFEventEmitter.emit("closeClosePurchase", undefined);
                    setLoader(false);
                    confirmPlayCallBack();
                })
                .then(() => {
                    if (
                        props.route.params?.purchaseActions?.ResourceType ===
                        "Subscription"
                    ) {
                        showNotification();
                    }
                })
                .catch((error: any) => {
                    MFEventEmitter.emit("closeClosePurchase", undefined);
                    MFEventEmitter.emit("openPopup", {
                        buttons: [
                            {
                                title: "OK",
                                onPress: () => {
                                    MFEventEmitter.emit("closeAll", undefined);

                                },
                            }
                        ],
                        description: AppStrings?.str_purchase_failed_message
                    });
                });
        });
    };

    const onPressTerms = (data: any) => {
        props.navigation.push(Routes.TermsAndConditions, {
            title: AppStrings?.str_terms_and_conditions,
            subTitle: props.route.params?.subTitle,
            terms: props.route.params?.purchaseActions?.Terms,
        });
    };

    const renderRentalWindowText = () => {
        let status = "";
        const rentalWindow = convertSecondsToHours(
            durationStringToSeconds(
                props.route.params?.purchaseActions?.RentalWindow
            )
        ),
            days = Math.floor(rentalWindow / 24),
            hours = rentalWindow <= 24 ? rentalWindow : rentalWindow % 24,
            str_day = AppStrings?.str_days_long,
            daysStr = format(str_day, days.toString()),
            str_hr = AppStrings?.str_hours_long,
            hoursStr = format(str_hr, hours.toString());

        // Show Year(s), when days is greater then 365
        if (days > 365) {
            const year = Math.floor(days / 365),
                str_yr = AppStrings?.str_year_long,
                yearStr = format(str_yr, year.toString());
            status += format(
                AppStrings?.str_purchase_panel_watch_within,
                yearStr
            );
        } else if (rentalWindow >= 48) {
            // Show day(s) incase more than 2 days or less than a year
            status += format(
                AppStrings?.str_purchase_panel_watch_within,
                daysStr
            );
        } else if (rentalWindow > 24 && rentalWindow < 48) {
            // Show 1 day, hour(s) incase less than 2 days
            status += format(
                AppStrings?.str_purchase_panel_watch_within,
                daysStr,
                hoursStr
            );
        } else if (rentalWindow <= 24 && rentalWindow > 1) {
            //Show in hour(s),incase equal or less than 24
            status += format(
                AppStrings?.str_purchase_panel_watch_within,
                hoursStr
            );
        } else if (rentalWindow <= 1) {
            //Show in min(s),incase less than 1
            const mins =
                durationStringToSeconds(
                    props.route.params?.purchaseActions.RentalWindow
                ) / 60,
                str_min = AppStrings?.str_minutes_long,
                minsStr = format(str_min, mins.toString());
            status += format(
                AppStrings?.str_purchase_panel_watch_within,
                minsStr.toString()
            );
        }
        return status;
    };

    const renderAvailableUntilText = () => {
        return replacePlaceHoldersInTemplatedString(
            AppStrings?.str_purchase_vod_available_period_message,
            {
                Time: formatDate(
                    new Date(props.route.params.purchaseActions.ExpirationUtc)
                ),
            }
        );
    };

    const renderBody = () => {
        const statusText =
            renderRentalWindowText() +
            " " +
            renderAvailableUntilText();

        const data = {
            centerValue: AppStrings?.str_terms_and_conditions,
            purchaseAction: props.route.params?.purchaseActions,
        };

        const validRestrictions = props.route.params?.purchaseActions.Restrictions?.filter((restriction: string) => {
            if(pbr.RestrictionsType[restriction] || pbr.RestrictionsType[restriction.toUpperCase()] || pbr.AbbreviatedRestrictions[restriction] || pbr.AbbreviatedRestrictions[restriction.toUpperCase()]){
                return true;
            }else  {
                return false;
            }
        })
        return (
            <View style={style.container}>
                <Text style={style.qualityPriceText}>
                    {`${currencies[props.route.params?.purchaseActions.Currency]
                        .symbol_native
                        } ${props.route.params?.purchaseActions.Price}`}
                </Text>
                <Text style={style.statusTextStyle}>{statusText}</Text>
                {
                validRestrictions && validRestrictions.length  > 0 && validRestrictions.map(
                    (restriction: any, index:number) => {
                            return (
                                <Text
                                    key={restriction}
                                    style={style.restrictionTextStyle}
                                >
                                    {`* ${getRestrictionsText(restriction)}`}
                                </Text>
                            );
                    }
                )}
                <View
                    style={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                    }}
                >
                    <MFButton
                        variant={MFButtonVariant.Contained}
                        iconSource={0}
                        onPress={onPressConfirm}
                        imageSource={0}
                        style={style?.footerButtons}
                        textStyle={style?.footerButtonTextStyle}
                        avatarSource={undefined}
                        textLabel={AppStrings?.str_purchase_confirm}
                        containedButtonProps={{
                            containedButtonStyle: {
                                unFocusedBackgroundColor:
                                    globalStyles.backgroundColors.shade3,
                                elevation: 0,
                                enabled: true,
                                focusedBackgroundColor:
                                    globalStyles.backgroundColors.primary1,
                                hoverColor: "red",
                                hasTVPreferredFocus: false,
                                unFocusedTextColor: globalStyles.fontColors.lightGrey,
                            },
                        }}
                    />
                    {/* {!this.state.loader &&
                        !this.props.route.params.isChannelSubscription && (
                            <MFButton
                                buttonType="Text"
                                dataSource={{
                                    buttonText:
                                        AppStrings
                                            ?.str_purchase_confirm_and_play,
                                }}
                                buttonStyle={{
                                    buttonContainerStyle: style.confirmButton,
                                    textStyle: style.textStyle,
                                }}
                                focusable={!this.state.loader}
                                onButtonPress={this.onPressConfirmAndPlay}
                            />
                        )} */}
                    {loader && (<MFLoader />)}

                    <MFButton
                        variant={MFButtonVariant.Contained}
                        iconSource={0}
                        onPress={() => onPressTerms(data)}
                        imageSource={0}
                        style={style?.footerButtons}
                        textStyle={style?.footerButtonTextStyle}
                        avatarSource={undefined}
                        textLabel={AppStrings?.str_terms_and_conditions}
                        containedButtonProps={{
                            containedButtonStyle: {
                                unFocusedBackgroundColor:
                                    globalStyles.backgroundColors.shade3,
                                elevation: 0,
                                enabled: true,
                                focusedBackgroundColor:
                                    globalStyles.backgroundColors.primary1,
                                hoverColor: "red",
                                hasTVPreferredFocus: false,
                                unFocusedTextColor: globalStyles.fontColors.lightGrey,
                            },
                        }}
                    />
                </View>
            </View>
        );
    }

    const body = renderBody();
    console.log('body ', body);
    return (
        <SideMenuLayout
            title={headingLine1}
            subTitle={headingLine2}
        >
            {body}
        </SideMenuLayout>
    )
}



export const PurchaseInformationPanel = PurchaseInformationPanelImpl;

// getUIdef("PurchaseInformationPanel")?.style ||
const style = StyleSheet.create(
    scaleAttributes({
        container: {
            flexGrow: 1,
        },
        confirmButton: {
            height: 70,
            width: 533,
            marginHorizontal: 90,
            marginBottom: 30,
        },
        loaderButton: {
            height: 70,
            width: 300,
            marginHorizontal: 90,
            marginBottom: 30,
            alignSelf: "center",
        },
        textStyle: {
            fontFamily: "Inter-SemiBold",
        },
        statusTextStyle: {
            fontSize: 25,
            fontFamily: "Inter-Regular",
            color: "#E7A230",
            marginBottom: 25,
            marginLeft: 54,
            marginTop: 25,
        },
        qualityPriceText: {
            fontSize: 29,
            fontFamily: "Inter-Bold",
            color: "#EEEEEE",
            marginBottom: 25,
            marginLeft: 54,
            marginTop: 25,
        },
        selectButtonContainer: {
            width: "100%",
            height: 100,
            paddingLeft: 20,
            paddingRight: 20,
        },
        restrictionTextStyle: {
            fontSize: 25,
            fontFamily: "Inter-Regular",
            color: "#A7A7A7",
            marginBottom: 15,
            marginLeft: 54,
            marginTop: 15,
        },
        footerButtons: {
            height: 70,
            width: 654,
            backgroundColor: "#EEEEEE",
            marginBottom: 10
        },
        footerButtonTextStyle: {
            height: 38,
            width: 350,
            color: "#EEEEEE",
            fontFamily: "Inter-Regular",
            fontSize: 25,
            fontWeight: "600",
            letterSpacing: 0,
            lineHeight: 38,
            textAlign: "center"
        }
    })
);
