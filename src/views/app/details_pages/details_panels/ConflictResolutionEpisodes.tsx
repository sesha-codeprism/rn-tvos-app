import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AppStrings } from "../../../../config/strings";
import { useState } from "react";
import React from "react";
import { getMetaDataOfItem } from "../../../../utils/ConflictUtils";
import { ScrollView } from "react-native-gesture-handler";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { AppImages } from "../../../../assets/images";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import MFButton, { MFButtonVariant } from "../../../../components/MFButton/MFButton";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";

interface Props {
    navigation?: NativeStackNavigationProp<any>;
    route?: any;
    viewData: any;
    scheduleItemsAll: any;
    moveToEpisode: any;
    goBack: any;
}

const styles = StyleSheet.create(
    getUIdef("DVRConflictEpisodes")?.style ||
      scaleAttributes({
        conflictFooterButtons:{
          height: 70,
          width: 654,
          backgroundColor: "#A7A7A7",
          marginBottom: 10
         },
         conflictFooterButtonTextStyle: {
          height: 38,
          width: 200,
          color: "#EEEEEE",
          fontFamily: "Inter-Regular",
          fontSize: 25,
          fontWeight: "600",
          letterSpacing: 0,
          lineHeight: 38,
          textAlign: "center"
        },
        containerActive: {
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
        },
        container: {
          width: "100%",
          height: 100,
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          padding: 30,
          display: "flex",
          flexDirection: "row"
        },
        containerSpacing: { padding: 10, marginBottom: 30 },
        itemContainer: { display: "flex", flexDirection: "row" },
        itemTextContainer: { display: "flex", flexDirection: "column", "width": "95%" },
        listText: {
          fontSize: 29,
          letterSpacing: 0,
          lineHeight: 50
        }
      })
  );
  

const title = AppStrings.str_dvr_conflict_panel_header;

const ConflictResolutionEpisodes: React.FunctionComponent<Props> = (props: Props) => {
    const [focused, setFocused] = useState(0);

    const moveToEpisode = (conflictId: string) => {
        props.moveToEpisode && props.moveToEpisode(conflictId);
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
    return props.viewData.length < 1 ? (<></>) : (
        <SideMenuLayout
            title={title}
        >
            <View style={{ height: '80%' }} >
                <ScrollView>
                    {
                        props.viewData && props.viewData.length && props.viewData.map((episode: any, index: number) => {
                            const itemToRender = props.scheduleItemsAll?.find((si: any) => si.Id === episode);
                            const metadata = getMetaDataOfItem(itemToRender);
                            return (
                                <Pressable
                                    hasTVPreferredFocus={index === 0 ? true : false}
                                    onFocus={() => {
                                        setFocused(index);
                                    }}
                                    onPress={() => {
                                        moveToEpisode(episode)
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
                                    <View style={styles?.itemContainer}>
                                        <View style={styles?.itemTextContainer}>
                                            <Text
                                                style={[
                                                    styles?.listText,
                                                    { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                                                ]}
                                            >
                                                {metadata.meta1}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles?.listText,
                                                    { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                                                ]}
                                            >
                                                {metadata.meta2}
                                            </Text>
                                        </View>

                                    </View>
                                    <Image
                                        source={AppImages.arrow_right}
                                        style={{ width: 15, height: 30 }}
                                    />
                                </Pressable>
                            );
                        })
                    }
                </ScrollView>
            </View>
            {cancelFooterComponent()}
        </SideMenuLayout>
    )
};

export default ConflictResolutionEpisodes;
