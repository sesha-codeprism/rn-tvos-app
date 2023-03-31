import React, { useEffect, useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MFSelectCheckedBox, MFSelectUnCheckedBox } from "../../../../components/MFSelectBox";
import { AppStrings } from "../../../../config/strings";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";

import { updateStore } from "../../../../utils/helpers";
import { GLOBALS } from "../../../../utils/globals";

export type PlayerSubtitleSideMenuProps = {
    subtitleTracks: { label: string; id: number | string }[];
    audioTracks: { label: string; id: number | string }[];
    curentSubtitleTrack: string | null;
    currentAudioTrack: string | null;
    currentCC: boolean | null;
    setUserSubtitleSelection: (params: any) => {},
    setUserAudioSelection: (params: any) => {},
}

const ccItems = [
    {
        id: 0,
        label: AppStrings?.str_app_on,
        key: "true",
    },
    {
        id: 1,
        label: AppStrings?.str_app_off,
        key: "false",
    },
];

export const PlayerSubtitleSideMenu: React.FunctionComponent<PlayerSubtitleSideMenuProps> = (props: PlayerSubtitleSideMenuProps) => {
    const [focussed, setFocussed] = useState<any>(() => {
        let focused = null;
        if (props.currentCC) {
            if (props.currentCC !== undefined && props.currentCC !== null && props.currentCC === true) {
                focused = { 'cc': 0 };
            } else {
                focused = { 'cc': 1 };
            }
        }
        if (props.curentSubtitleTrack) {
            const found = props.subtitleTracks?.find((subtitle: any) => subtitle.label === props.curentSubtitleTrack);
            if (found) {
                focused = { 'subtitle': found.id };
            } else {
                focused = { 'subtitle': null };
            }
        }
        if (!focused?.subtitle && props.currentAudioTrack) {
            const found = props.audioTracks?.find((audioTrack: any) => audioTrack.label === props.currentAudioTrack);
            if (found) {
                focused = { 'audio': found.id };
            } else {
                focused = { 'audio': null };
            }
        }
        return focused;
    });

    const [selectedSubtitle, setSelectedSubtitle] = useState(props.curentSubtitleTrack);
    const [selectedAudioTrack, setSelectedAudioTrack] = useState(props.currentAudioTrack);
    const [selectedCC, setSelectedCC] = useState(props.currentAudioTrack);

    useEffect(() => {
        // What should it be, from player, or  globals

    }, []);

    const onSubtitlePress = (item: any) => {
        setSelectedSubtitle(item.label);
        GLOBALS.store!.settings.display.subtitleConfig.primary = item.label;
        updateStore(GLOBALS.store);
    }

    const onAudioTrackPress = (item: any) => {
        setSelectedAudioTrack(item.label);
        GLOBALS.store!.settings.audio.audioLanguages.primary = item.label;
        updateStore(GLOBALS.store);
    }

    const onCCPress = (item: any) => {
        setSelectedCC(item.key);
        GLOBALS.store!.settings.display.closedCaption = item.label;
        updateStore(GLOBALS.store);
    }

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
                    {"Primary and secondary preferences can be change under Settings > Audio / Display."}
                </Text>
            </View>
            <View
                style={styles.contentContainer}
            >
                <ScrollView>
                    {ccItems?.map((ccItem: any, index: number) => {
                        return (
                            <>
                                {index === 0 && (
                                    <Text style={{
                                        color: "#EEEEEE",
                                        fontFamily: "Inter",
                                        fontSize: 38,
                                        fontWeight: "bold",
                                        letterSpacing: 0,
                                        lineHeight: 55,
                                        marginBottom: 20
                                    }}>
                                        {
                                            AppStrings?.str_settings_display_closed_captions
                                        }
                                    </Text>
                                )}
                                <Pressable
                                    onFocus={() => {
                                        setFocussed({ 'cc': index });
                                    }}
                                    onPress={() => {
                                        onCCPress(ccItem);
                                    }}
                                    style={
                                        index === focussed['cc']
                                            ? { ...MFSettingsStyles.containerActive, ...styles.container }
                                            : styles.container
                                    }
                                    key={`cc-${index}`}
                                >
                                    <View style={styles.icContainer}>
                                        {ccItem.key === selectedCC ? (
                                            <MFSelectCheckedBox />
                                        ) : (
                                            <MFSelectUnCheckedBox />
                                        )}
                                    </View>
                                    <View style={styles.listContent}>
                                        <Text
                                            style={[
                                                styles.listText,
                                                { color: index === focussed?.['cc'] ? "#EEEEEE" : "#A7A7A7" },
                                            ]}
                                        >
                                            {ccItem.label}
                                        </Text>
                                    </View>
                                </Pressable>
                            </>
                        )
                    })
                    }
                    <Text
                        style={{
                            color: "#EEEEEE",
                            fontFamily: "Inter",
                            fontSize: 38,
                            fontWeight: "bold",
                            letterSpacing: 0,
                            lineHeight: 55,
                            marginBottom: 20
                        }}
                    >
                        {"Subtitle"}
                    </Text>
                    {
                        props.subtitleTracks && props.subtitleTracks.length && (
                            props.subtitleTracks.map((item: any, index: number) => {
                                return (
                                    <Pressable
                                        onFocus={() => {
                                            setFocussed({ 'subtitle': index });
                                        }}
                                        onPress={() => {
                                            onSubtitlePress(item);
                                        }}
                                        style={
                                            index === focussed['subtitle']
                                                ? { ...MFSettingsStyles.containerActive, ...styles.container }
                                                : styles.container
                                        }
                                        key={`subtitle-${index}`}
                                    >
                                        <View style={styles.icContainer}>
                                            {item.label === selectedSubtitle ? (
                                                <MFSelectCheckedBox />
                                            ) : (
                                                <MFSelectUnCheckedBox />
                                            )}
                                        </View>
                                        <View style={styles.listContent}>
                                            <Text
                                                style={[
                                                    styles.listText,
                                                    { color: index === focussed?.['subtitle'] ? "#EEEEEE" : "#A7A7A7" },
                                                ]}
                                            >
                                                {AppStrings?.ISO[item.label]}
                                            </Text>
                                        </View>
                                    </Pressable>
                                )
                            })
                        )
                    }
                    <Text
                        style={{
                            color: "#EEEEEE",
                            fontFamily: "Inter",
                            fontSize: 38,
                            fontWeight: "bold",
                            letterSpacing: 0,
                            lineHeight: 55,
                            marginBottom: 20
                        }}
                    >
                        {"Audio"}
                    </Text>
                    {
                        props.audioTracks && props.audioTracks.length && (
                            props.audioTracks.map((item: any, index: number) => {
                                return (
                                    <Pressable
                                        onFocus={() => {
                                            setFocussed({ 'audio': index });
                                        }}
                                        onPress={() => {
                                            onAudioTrackPress(item);
                                        }}
                                        style={
                                            index === focussed['audio']
                                                ? { ...MFSettingsStyles.containerActive, ...styles.container }
                                                : styles.container
                                        }
                                        key={`audio-${index}`}
                                    >
                                        <View style={styles.icContainer}>
                                            {item.label === selectedAudioTrack ? (
                                                <MFSelectCheckedBox />
                                            ) : (
                                                <MFSelectUnCheckedBox />
                                            )}
                                        </View>
                                        <View style={styles.listContent}>
                                            <Text
                                                style={[
                                                    styles.listText,
                                                    { color: index === focussed?.['audio'] ? "#EEEEEE" : "#A7A7A7" },
                                                ]}
                                            >
                                                {AppStrings?.ISO[item.label]}
                                            </Text>
                                        </View>
                                    </Pressable>
                                )
                            })
                        )
                    }
                </ScrollView>
            </View>
        </View>
    );
}

// assign mock data, in the same format as v2
PlayerSubtitleSideMenu.defaultProps = {
    subtitleTracks: [{ id: 1, label: 'en' }, { id: 2, label: 'fr' }, { id: 4, label: 'fi' }],
    curentSubtitleTrack: 'french',
    audioTracks: [{ id: 1, label: 'es' }, { id: 2, label: 'kn' }],
    currentAudioTrack: 'hindi'
}


const styles = StyleSheet.create({
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
    container: {
        width: "100%",
        height: 100,
        alignContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
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
    listText: {
        fontSize: 29,
        letterSpacing: 0,
        lineHeight: 50,
    }
});