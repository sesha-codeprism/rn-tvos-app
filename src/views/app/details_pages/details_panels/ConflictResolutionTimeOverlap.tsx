import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppStrings } from "../../../../config/strings";
import MFButton, { MFButtonVariant } from "../../../../components/MFButton/MFButton";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import React from "react";
import { getMetaDataOfItem } from "../../../../utils/ConflictUtils";
import { ScrollView } from "react-native-gesture-handler";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";

interface Props {
    navigation?: NativeStackNavigationProp<any>;
    route?: any;
    viewData: any;
    scheduleItemsAll: any;
    allSgRefetch: any;
    goBack: any;
    moveToTimeOverlap: any;
}

const styles = StyleSheet.create(
    getUIdef("DVRConflictTimeoverlap")?.style ||
      scaleAttributes({
        conflictSubscriptionTitleContainer: {
          flexDirection: "row" 
          },
        conflictSubscriptionTitle:{
          width: 288,
          height: 50,
          fontSize: 29,
          fontFamily: "Inter-Regular",
          color: "${theme.fontColors.light}"
          },
          conflictSubscriptionConflictIconContainer: {
            backgroundColor: "${theme.fontColors.statusWarning}",
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
          listText: {
            fontSize: 29,
            letterSpacing: 0,
            lineHeight: 50,
            color: "${theme.fontColors.light}", 
            marginBottom: 10 
          },
          seperator: {
            width: "100%",
            opacity: 0.2,
            height: 1,
            borderWidth: 0.4,
            borderColor: "${theme.fontColors.light}",
            backgroundColor: "transparent",
            marginBottom: 10
        },
         conflictFooterButtons:{
          height: 70,
          width: 654,
          backgroundColor: "${theme.fontColors.lightGrey}",
          marginBottom: 10
         },
         conflictFooterButtonTextStyle: {
          height: 38,
          width: 350,
          color: "${theme.fontColors.light}",
          fontFamily: "Inter-Regular",
          fontSize: 25,
          fontWeight: "600",
          letterSpacing: 0,
          lineHeight: 38,
          textAlign: "center",
         }
      })
  );

const ConflictResolutionTimeOverlap: React.FunctionComponent<Props> = (props: Props) => {

    const conflictedtItem = props.viewData[0]?.Items?.find((si: any) => si?.Priority === 1);
    const conflictedtItemToRender = props.scheduleItemsAll?.find((si: any) => si.Id === conflictedtItem?.SubscriptionItemId);
    const conflictedItemMetadata = getMetaDataOfItem(conflictedtItemToRender);

    const listOfItemsToDiscard = props.viewData.map((group: any) => {
        const maxx = group.Items.reduce(function (prev: any, current: any) {
            return (prev.Priority > current.Priority) ? prev : current
        })
        return maxx;
    })
    // find the index of first non resolved group
    let conflictNumber = props.viewData.findIndex((group: any) => !group.resolved);
    conflictNumber++;

    const moveToTimeOverlap = () => {
        props.moveToTimeOverlap && props.moveToTimeOverlap(conflictNumber - 1);
    }

    const moveToConflict = () => {
        return (
            <MFButton
                variant={MFButtonVariant.Contained}
                iconSource={0}
                onPress={() => {
                    moveToTimeOverlap();
                }}
                hasTVPreferredFocus={true}
                focusable={true}
                imageSource={0}
                style={styles?.conflictFooterButtons}
                textStyle={styles?.conflictFooterButtonTextStyle}
                avatarSource={undefined}
                textLabel={`${AppStrings?.str_resolve_conflict_no}${conflictNumber}`}
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
                textLabel={AppStrings?.str_donot_resolve}
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

    const listText = {
        fontSize: 23,
        letterSpacing: 0,
        lineHeight: 38,
    };

    return (
        <SideMenuLayout
            title={AppStrings?.str_dvr_conflict_panel_header}
        >
            <>
                <Text
                    style={[listText]}
                >
                    {AppStrings?.str_dvr_to_record}
                </Text>
                <Pressable style={styles?.seperator}>
                </Pressable>
                <View style={{ display: "flex", flexDirection: "column" }}>
                    <Text
                        style={[
                            styles?.listText
                        ]}
                    >
                        {conflictedItemMetadata.meta1}
                    </Text>
                    <Text
                        style={[
                            styles?.listText
                        ]}
                    >
                        {conflictedItemMetadata.meta2}
                    </Text>
                </View>
                <Pressable style={styles?.seperator}>
                </Pressable>
                <Text
                    style={[styles?.listText]}
                >
                    {AppStrings?.str_dvr_all_conflct_must_be_resolved}
                </Text>
                <Pressable style={styles?.seperator}>
                </Pressable>
                <View style={{ height: '55%' }} >
                    <ScrollView >
                        {
                            listOfItemsToDiscard && listOfItemsToDiscard.length && listOfItemsToDiscard.map((timeSlice: any, index: number) => {
                                const itemToRender = props.scheduleItemsAll?.find((si: any) => si.Id === timeSlice?.SubscriptionItemId);
                                const metadata = getMetaDataOfItem(itemToRender);
                                return (

                                    <View style={{ display: "flex", flexDirection: "column" }}>
                                        <Text
                                            style={[
                                                styles?.listText
                                            ]}
                                        >
                                            {`${AppStrings?.str_dvr_conflict_no} ${index + 1}`}
                                        </Text>
                                        <Text
                                            style={[
                                                styles?.listText
                                            ]}
                                        >
                                            {renderTitle( metadata.meta1)}
                                        </Text>
                                        <Text
                                            style={[
                                                styles?.listText, { color: "#EEEEEE", marginBottom: index === listOfItemsToDiscard.length - 1 ? 60 : 10 }
                                            ]}
                                        >
                                            {metadata.meta2}
                                        </Text>
                                        {index < listOfItemsToDiscard.length - 1 &&
                                            <Pressable style={styles?.seperator}>
                                            </Pressable>}

                                    </View>
                                );
                            })
                        }
                    </ScrollView>
                </View>
                {moveToConflict()}
                {cancelFooterComponent()}
            </>
        </SideMenuLayout>
    )
};

export default ConflictResolutionTimeOverlap;
