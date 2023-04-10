import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { AppStrings } from "../../../../config/strings";
import { GLOBALS } from "../../../../utils/globals";
import {
    MFSelectCheckedBox,
    MFSelectUnCheckedBox,
} from "../../../../components/MFSelectBox";

import { MFGlobalsConfig } from "../../../../../backend/configs/globals";
import { NativeModules } from 'react-native';
import MFLoader from "../../../../components/MFLoader";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";
import MFEventEmitter from "../../../../utils/MFEventEmitter";
import { MKPVideoQuality } from "./videoDataTypes";
interface Props {
    playerManager: typeof NativeModules; // passed in player NativeModule reference
}


const PlayerQualitySideMenu: React.FunctionComponent<Props> = (props: Props) => {
    const [focussed, setFocussed] = useState<any>("");
    const [currentVideoQuality, setCurrentVideoQuality] = useState<MKPVideoQuality | null>(null);
    const [availableVideoQualities, setAvailableVideoQualities] = useState<MKPVideoQuality[] | null>(null)

    useEffect(() => {
        (async () => {
            if (props.playerManager) {
                const aavailableVideoQualitiesLocal: MKPVideoQuality[] = await props.playerManager.availableVideoQualities();
                setAvailableVideoQualities(aavailableVideoQualitiesLocal);
                const currentVideoQualityLocal: MKPVideoQuality = await props.playerManager.videoQuality();
                setCurrentVideoQuality(currentVideoQualityLocal);
            }
        })();
    }, [props.playerManager]);


    const onPress = (item: MKPVideoQuality) => {
        setCurrentVideoQuality(item);
        props.playerManager.maxSelectableBitrate(item.bitrate);
        GLOBALS.store!.playerSessionSettings.bitrates10ft = item.bitrate;
        MFEventEmitter.emit("closePlayerQualityPanel", undefined);
    };

    if (!availableVideoQualities && !currentVideoQuality) {
        return <MFLoader />
    } else
        return (
            <View style={styles.root} pointerEvents="box-none">
                <View style={styles.headerContainer}>
                    <Text
                        style={{
                            color: "#828282",
                            fontFamily: "Inter",
                            fontSize: 29,
                            letterSpacing: 0,
                            lineHeight: 50,
                        }}
                    >
                        {AppStrings?.str_settings_display_video_quality}
                    </Text>
                </View>

                <View
                    style={styles.contentContainer}
                >
                    <FlatList
                        data={availableVideoQualities}
                        keyExtractor={(item) => item.identifier}
                        renderItem={({ item, index }) => {
                            const localizedBitRate = MFGlobalsConfig.config.bitrates10ft.find((bitrate: any) => bitrate.id === item.bitrate);
                            return (
                                <Pressable
                                    onFocus={() => {
                                        setFocussed(index);
                                    }}
                                    onPress={() => {
                                        onPress(item);
                                    }}
                                    style={
                                        index === focussed
                                            ? { ...MFSettingsStyles.containerActive, ...styles.container }
                                            : styles.container
                                    }
                                    key={index}
                                >
                                    <View style={styles.icContainer}>
                                        {item.identifier === currentVideoQuality?.identifier ? (
                                            <MFSelectCheckedBox />
                                        ) : (
                                            <MFSelectUnCheckedBox />
                                        )}
                                    </View>
                                    <View style={styles.listContent}>
                                        <Text
                                            style={[
                                                styles.listText,
                                                { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                                            ]}
                                        >
                                            {AppStrings[localizedBitRate?.localizedText]}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </View>);
};

export default PlayerQualitySideMenu;

const styles = StyleSheet.create(
    getUIdef("VideoQualityPanel")?.style ||
    scaleAttributes({
        root: {
            width: "100%",
            height: "100%",
            backgroundColor: "#00030E",
            display: "flex",
            flexDirection: "column"
        },
        headerContainer: {
            width: "100%",
            height: 185,
            padding: 50,
            justifyContent: "center",
            flexDirection: "row",
            flex: 1,
            flexWrap: 'wrap',
        },
        contentContainer: {
            width: "100%",
            padding: 30,
            paddingTop: 10,
            height: "80%",
            display: "flex",
            flexDirection: "column"
        },
        listText: {
            fontSize: 29,
            letterSpacing: 0,
            lineHeight: 50,
        },
        container: {
            width: "100%",
            height: 100,
            // justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
        },
        containerActive: {
            backgroundColor: "#053C69",
            borderRadius: 6,
        },
        icContainer: {
            width: "15%",
            height: 83,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
        },
        listContent: {
            width: "85%",
            height: 83,
            justifyContent: "center",
        },
    }));
