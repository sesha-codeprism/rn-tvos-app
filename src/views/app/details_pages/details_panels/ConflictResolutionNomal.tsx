import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import MFButton, { MFButtonVariant } from "../../../../components/MFButton/MFButton";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { useState } from "react";
import React from "react";
import { getMetaDataOfItem } from "../../../../utils/ConflictUtils";
import { ScrollView } from "react-native-gesture-handler";
import { submitSolutionForConflicts } from "../../../../../backend/dvrproxy/dvrproxy";
import { invalidateQueryBasedOnSpecificKeys } from "../../../../config/queries";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";

interface Props {
    navigation?: NativeStackNavigationProp<any>;
    route?: any;
    viewData: any;
    scheduleItemsAll: any;
    allSgRefetch: any;
    goBack: any;
    timeOverlapConflictIndex?: number;
}

const styles = StyleSheet.create(
    getUIdef("DVRConflictSubscription")?.style ||
      scaleAttributes({
        conflictSubscriptionTitleContainer: { 
          flexDirection: "row" 
          },
        conflictSubscriptionTitle:{
          width: 288,
          height: 50,
          fontSize: 29,
          fontFamily: "Inter-Regular",
          color: "#EEEEEE"
          },
        conflictSubscriptionConflictIconContainer: {
            backgroundColor: "#E7A230",
            borderRadius: 15,
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center"
          },
        conflictSubscriptionTitleIcon: {
          fontSize: 20,
          fontFamily: "Inter-Bold",
          color: "#000"
          },
        conflictSubscriptionScollAreaContainer: {
           display: "flex", 
           flexDirection: "column", 
           width: "70%", 
           paddingTop: 23, 
           paddingBottom: 23 
          },
        itemLineOne:{ 
          color: "#EEEEEE", 
          fontFamily: "Inter-Regular", 
          fontSize: 29 
        },
        itemLineTwo:{ 
          color: "#EEEEEE", 
          fontFamily: "Inter-Regular", 
          fontSize: 23, 
          marginTop: 22 
        },
        conflictSubscriptionPriorityButtonContainer: {
          height: 90, 
          width: 90, 
          alignSelf: "center", 
          justifyContent: "flex-start" 
        },
        conflictSubscriptionPriorityButton:{
          fontFamily: "MyFontRegular",
          fontSize: 200,
          textAlign: "justify",
          includeFontPadding: false,
          textAlignVertical: "center",
          lineHeight: 140,
          color: "#EEEEEE",
          backgroundColor: "transparent",
          height: 90,
          width: 90
        },
        priorityButtonFocussed: { color: "#053C69" },
        priorityButtonUnFocussed: { color: "#EEEEEE" },
        seperator: {
          width: "100%",
          opacity: 0.4,
          height: 1,
          borderWidth: 0.4,
          borderColor: "#EEEEEE",
          backgroundColor: "transparent"
        },
        warningText:{
          marginTop: 20,
          fontSize: 25,
          fontWeight: "bold",
          textAlign: "center",
          color: "#EEEEEE",
          alignSelf: "flex-start"
         },
         conflictedItemContainer: { 
            display: "flex", 
            flexDirection: "row", 
            marginTop: 25, 
            marginBottom: 25, 
            justifyContent: "space-between" 
           },
         conflictedItemTitleContainer: { 
          display: "flex", 
          flexDirection: "column", 
          width: "70%", 
          paddingTop: 23, 
          paddingBottom: 23 
         },
         conflictedItemSubtitle: { 
          color: "#EEEEEE", 
          fontFamily: "Inter-Regular", 
          fontSize: 23, 
          marginTop: 22 
         },
         conflictFooterButtons:{
          height: 70,
          width: 654,
          backgroundColor: "#EEEEEE",
          marginBottom: 10
         },
         conflictFooterButtonTextStyle: {
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
  
const title = AppStrings.str_dvr_conflict_panel_header;


const ConflictResolutionNormal: React.FunctionComponent<Props> = (props: Props) => {
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [state, setState] = useState([...props.viewData || undefined]);
    const [focused, setFocussed] = useState(props.viewData?.[0]?.SubscriptionItemId || null);
    const originalConflictedItemBeforeDirty = [...props.viewData || undefined].find((cnf: any) => cnf?.discardCandidate);

    const dvr_priorityup = getFontIcon("dvr_priorityup");
    const dvr_prioritydown = getFontIcon("dvr_prioritydown");


    const submitSolution = async () => {
        const itemsToRenderInFlatList = state.filter((cnf: any) => !cnf?.discardCandidate);
        const result = await submitSolutionForConflicts(originalConflictedItemBeforeDirty?.SubscriptionItemId, itemsToRenderInFlatList.map((si: any) => si?.SubscriptionItemId));
        if (result && result.status >= 200 && result.status <= 300) {
            invalidateQueryBasedOnSpecificKeys('dvr', 'get-all-subscriptionGroups');
            props.goBack && props.goBack({ resolved: originalConflictedItemBeforeDirty, timeOverlapConflictIndex: props.timeOverlapConflictIndex });
        }
    }

    const saveFooterComponent = () => {
        return (
            <MFButton
                disabled={!isDirty}
                variant={MFButtonVariant.Contained}
                iconSource={0}
                onPress={() => {
                    submitSolution();
                }}
                imageSource={0}
                style={styles?.conflictFooterButtons}
                textStyle={styles?.conflictFooterButtonTextStyle}
                avatarSource={undefined}
                textLabel={AppStrings?.str_dvr_btn_save_changes}
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
        );
    }

    const nonDiscardClicked = (conflict: any) => {
        setIsDirty(true);
        const discardCandidate = state.find((cnf: any) => cnf?.discardCandidate);
        setState(state.map((cnf: any) => {
            if (cnf.SubscriptionItemId == conflict.SubscriptionItemId) {
                return { ...discardCandidate, discardCandidate: false };
            } else if (cnf.SubscriptionItemId == discardCandidate.SubscriptionItemId) {
                return { ...conflict, discardCandidate: true }
            } else return cnf;
        }));
    }

    const discardClicked = (discardCandidate: any) => {
        setIsDirty(true);
        const first = state[0];
        const withoutDiscardAndFirst = state.filter((cnf: any) => !cnf?.discardCandidate && cnf.SubscriptionItemId !== first.SubscriptionItemId);
        setState([
            { ...discardCandidate, discardCandidate: false },
            ...withoutDiscardAndFirst,
            { ...first, discardCandidate: true }
        ]);
    }

    const cancel = () => {
        props.goBack && props.goBack();
    }

    const cancelFooterComponent = () => {
        return (
            <MFButton
                variant={MFButtonVariant.Contained}
                iconSource={0}
                onPress={() => {
                    cancel()
                }}
                imageSource={0}
                style={styles?.conflictFooterButtons}
                textStyle={styles?.conflictFooterButtonTextStyle}
                avatarSource={undefined}
                textLabel={AppStrings?.str_app_cancel}
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
        );
    }

    const ci = state.find((cnf: any) => cnf?.discardCandidate);
    const conflictedItem = props.scheduleItemsAll?.find((si: any) => si.Id === ci.SubscriptionItemId);
    const conflictedItemMetadata = getMetaDataOfItem(conflictedItem);

    const airTime = new Date(conflictedItem?.StartTime);
    const day = airTime.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = airTime.toLocaleString("default", { month: "short" });
    const dayOfWeek = airTime.toLocaleDateString("en-GB", {
        weekday: "long",
    });
    const twelveHourTime = airTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    const headingLine = `${AppStrings?.str_dvr_conflict_header} ${twelveHourTime}`;

    const itemsToRenderInFlatList = state.filter((cnf: any) => !cnf?.discardCandidate);

    const renderTitle = (title: string) => {
        return (
            <View style={styles?.conflictSubscriptionTitleContainer}>
                <Text style={styles?.conflictSubscriptionTitle}>{title}</Text>
                
                    <View style={styles?.conflictSubscriptionConflictIconContainer}>
                        <Text style={styles?.conflictSubscriptionTitleIcon}>!</Text>
                    </View>
                
            </View>
        );
    }

    return (
        <SideMenuLayout
            title={title}
            subTitle={headingLine}

        >
            <View style={{ height: '80%' }} >
                <ScrollView >
                    {
                        itemsToRenderInFlatList && itemsToRenderInFlatList.length &&
                        itemsToRenderInFlatList.map((conflict: any, index: number) => {
                            const itemToRender = props.scheduleItemsAll?.find((si: any) => si.Id === conflict.SubscriptionItemId);
                            const metadataLine1 = getMetaDataOfItem(itemToRender);
                            return (
                                <View key={`${conflict?.SubscriptionItemId}-${index}`} style={styles?.conflictedItemContainer}>
                                    <View style={styles?.conflictedItemTitleContainer} >
                                        <Text style={styles?.itemLineOne}>{metadataLine1?.meta1}</Text>
                                        <Text style={styles?.itemLineTwo}>{metadataLine1?.meta2}</Text>
                                    </View>
                                    <Pressable style={{ "height": 90, width: 90, alignSelf: "center", justifyContent: "flex-start" }} onFocus={() => { setFocussed(conflict.SubscriptionItemId) }} onPress={() => nonDiscardClicked(conflict)}>
                                        <Text
                                            style={StyleSheet.flatten([
                                                styles?.conflictSubscriptionPriorityButton,
                                                focused === conflict.SubscriptionItemId ? styles?.priorityButtonFocussed : styles?.priorityButtonUnFocussed
                                            ])}
                                        >
                                            {dvr_prioritydown}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })
                    }
                    <View style={styles?.seperator}>
                    </View>
                    <Text
                        style={StyleSheet.flatten([
                            styles?.warningText
                        ])}
                    >
                        {AppStrings?.str_dvr_conflict_show_not_record}
                    </Text>
                    <View style={styles?.conflictedItemContainer}>
                        <View style={styles?.conflictSubscriptionScollAreaContainer}>
                            {renderTitle(conflictedItemMetadata?.meta1)}
                            <Text style={styles?.itemLineTwo}>{conflictedItemMetadata?.meta2}</Text>
                        </View>
                        <Pressable style={styles?.conflictSubscriptionPriorityButtonContainer}
                            onFocus={() => {
                                setFocussed(conflictedItem.Id)
                            }} onPress={() =>
                                discardClicked({ SubscriptionItemId: conflictedItem.Id, discardCandidate: true })
                            }>
                            <Text
                                style={StyleSheet.flatten([
                                    styles?.conflictSubscriptionPriorityButton,
                                    focused === conflictedItem.Id ? styles?.priorityButtonFocussed : styles?.priorityButtonUnFocussed
                                ])}
                            >
                                {dvr_priorityup}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
            {saveFooterComponent()}
            {cancelFooterComponent()}
        </SideMenuLayout>
    )
};

export default ConflictResolutionNormal;
