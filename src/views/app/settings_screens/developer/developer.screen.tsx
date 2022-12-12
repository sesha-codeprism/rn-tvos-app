import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Image } from "react-native";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { GLOBALS } from "../../../../utils/globals";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { AppImages } from "../../../../assets/images";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";


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
                title: "User Info",
                description: bootstrap?.AccountId,
            },
            {
                title: "Logging Level",
                description: "None",
            },
            {
                title: "Select Services",
                description: "MR.Dev",
            },
            {
                title: "Current Store Version",
                description: DefaultStore.Id,
            },
            {
                title: "Refresh",
                description: ""
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
        <SideMenuLayout title="Settings" subTitle="Developers">
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
                                    //props.navigation.navigate(item.action);
                                    console.log('Pressed ', item.action)
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
