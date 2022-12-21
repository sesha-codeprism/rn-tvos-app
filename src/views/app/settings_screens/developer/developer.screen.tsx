import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Image } from "react-native";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { GLOBALS } from "../../../../utils/globals";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { AppImages } from "../../../../assets/images";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { AppStrings } from "../../../../config/strings";
import { parseUri } from "../../../../../backend/utils/url/urlUtil";

const serviceList = AppStrings?.str_selectServices;
const loggingLevelList = AppStrings?.str_selectLogginLevel;

interface Props {
    navigation: NativeStackNavigationProp<any>;
}

const DeveloperScreen: React.FunctionComponent<Props> = (
    props: any
) => {
    const [list, setList] = useState<any[]>([]);
    const [focussed, setFocussed] = useState<any>(0);



    const formatList = async () => {
        const bootstrap = GLOBALS.bootstrapSelectors;
        const listItem = [
            {
                title: AppStrings?.developer_settings_user_info,
                subTitle: bootstrap?.AccountId,
                action: "developer_user_info_settings"
            },
            {
                title: AppStrings?.developer_settings_logging_level,
                subTitle: (loggingLevelList.find((level: any) => level.value === GLOBALS.store?.loggingLevel))?.name || App,
                action: "developer_logging_level"
            },
            {
                title: AppStrings?.developer_settings_select_service,
                subTitle: (serviceList.find((env: any) => parseUri(env.path) === parseUri(GLOBALS.store?.MFGlobalsConfig?.url)))?.name || "MR.dev",
                action: "developer_select_service_settings"
            },
            {
                title: AppStrings?.developer_settings_current_store,
                subTitle: DefaultStore.Id,
                action: "developer_current_store_settings"
            }
        ];
        return setList([...listItem]);
    };
    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", () => {
            console.log("focussed fired in display screen");
            // The screen is focused
            // Call for action
            formatList()
                .then(() => {
                    console.log("FormatList done");
                })
                .catch((err) => {
                    console.log("Encountered some error during formatList", err);
                });
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, []);
    return (
        <SideMenuLayout title={AppStrings?.str_settings_home_heading} subTitle={AppStrings?.developer_settings}>
            <FlatList
                style={styles.container}
                data={list}
                keyExtractor={(item) => item.title}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable
                            hasTVPreferredFocus={index === 0 ? true : false}
                            style={
                                index === focussed
                                    ? {
                                        ...MFSettingsStyles.containerActive,
                                        ...MFSettingsStyles.container,
                                    }
                                    : MFSettingsStyles.container
                            }
                            onFocus={() => {
                                setFocussed(index);
                            }}
                            onPress={() => {
                                if (item.action !== "") {
                                    props.navigation.navigate(item.action);
                                } else {
                                    null;
                                }
                            }}
                            key={index}
                            isTVSelectable={true}
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.listText,
                                        { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                                    ]}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={[
                                        styles.listText,
                                        {
                                            color: index === focussed ? "#EEEEEE" : "#A7A7A7",
                                            fontSize: 23,
                                        },
                                    ]}
                                >
                                    {item.subTitle}
                                </Text>
                            </View>
                            <Image
                                source={AppImages.arrow_right}
                                style={{ width: 15, height: 30 }}
                            />
                        </Pressable>
                    );
                }}
            />
        </SideMenuLayout>
    );
};
export default DeveloperScreen;
const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        width: 603,
        alignSelf: "center",
        display: "flex",
    },
    listText: {
        fontSize: 29,
        letterSpacing: 0,
        lineHeight: 35,
    },
});
