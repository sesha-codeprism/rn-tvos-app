import React, { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MFSelectCheckedBox, MFSelectUnCheckedBox } from "../../../../components/MFSelectBox";
import { AppStrings } from "../../../../config/strings";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { NativeModules } from 'react-native';
import { parse, Schema } from 'bcp-47';

import { GLOBALS } from "../../../../utils/globals";
import { MKPAudioTrack, MKPSubtitleTrack } from "./videoDataTypes";
import MFLoader from "../../../../components/MFLoader";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";

export type PlayerSubtitleSideMenuProps = {
    playerManager: typeof NativeModules; // passed in player NativeModule reference
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

// Note globals do not have role in sidepanels, but while initiating playback,  would take  values from globals
export const PlayerSubtitleSideMenu: React.FunctionComponent<PlayerSubtitleSideMenuProps> = (props: PlayerSubtitleSideMenuProps) => {
    const [focussed, setFocussed] = useState<any>(null);
    const [availableSubtitleTracks, setAvailableSubtitleTracks] = useState<MKPSubtitleTrack[] | null>(null);
    const [availableAudioTracks, setAvailableAudioTracks] = useState<MKPAudioTrack | null>(null);
    const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState<MKPSubtitleTrack | null>(null);
    const [currentAudioTrack, setCurrentAudioTrack] = useState<MKPAudioTrack | null>(null);

    const [selectedCC, setSelectedCC] = useState<boolean>(GLOBALS.store!.settings.display.closedCaption);

    useEffect(() => {
        // Value from Player takes prioirty  over  global
        (async () => {
            if (props.playerManager) {
                const availableSubtitleTracksLocal: MKPSubtitleTrack[] = await props.playerManager.getAvailableSubtitleTracks();
                setAvailableSubtitleTracks(availableSubtitleTracksLocal);
                const currentSubtitleTrackLocal: MKPSubtitleTrack = await props.playerManager.getCurrentSubtitleTrack();
                setCurrentSubtitleTrack(currentSubtitleTrackLocal);

                const availableAudioTracksLocal: MKPAudioTrack[] = await props.playerManager.getAvailableAudioTracks();
                setAvailableAudioTracks(availableAudioTracksLocal);
                const currentAudioTrackLocal: MKPAudioTrack = await props.playerManager.getCurrentAudioTrack();
                setCurrentAudioTrack(currentAudioTrackLocal);
            }
        })();
    }, [props.playerManager]);

    const onSubtitlePress = (item: MKPSubtitleTrack) => {
        setCurrentSubtitleTrack(item);
        // Need a player specific global, change in  getStore, and  updateStore
        if (GLOBALS.store && !GLOBALS.store!.playerSessionSettings) {
            GLOBALS.store.playerSessionSettings = {};
        }
        GLOBALS.store!.playerSessionSettings.subtitle = item.label; // no need to update  store, only current  app sesssion
        props.playerManager.setSubtitle(item.identifier)
    }

    const onAudioTrackPress = (item: MKPAudioTrack) => {
        setCurrentAudioTrack(item);
        if (GLOBALS.store && !GLOBALS.store!.playerSessionSettings) {
            GLOBALS.store.playerSessionSettings = {};
        }
        GLOBALS.store!.playerSessionSettings.audioLanguages = item.label; // no need to update  store, only current  app sesssion
        props.playerManager.setAudio(item.identifier)
    }

    const onCCPress = (item: any) => {
        setSelectedCC(item.key);
        if (GLOBALS.store && !GLOBALS.store!.playerSessionSettings) {
            GLOBALS.store.playerSessionSettings = {};
        }
        GLOBALS.store!.playerSessionSettings.closedCaption = item.key; // no need to update  store, only current  app sesssion
    }

    if ((!availableSubtitleTracks || (availableSubtitleTracks && availableSubtitleTracks.length === 0)) &&
        (!availableAudioTracks || (availableAudioTracks && availableAudioTracks.length === 0))) {
        return (<MFLoader />);
    } else return (
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
                    {AppStrings?.str_player_subtitle_panel_header}
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
                        availableSubtitleTracks && availableSubtitleTracks.length && (
                            availableSubtitleTracks.map((item: MKPSubtitleTrack, index: number) => {
                                const lang = item.language;
                                const identifier = item.identifier;
                                const bcp47Tag: Schema = parse(lang);
                                const value = bcp47Tag.language || lang.split('-')?.[0];
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
                                            {identifier === currentSubtitleTrack?.identifier ? (
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
                                                {AppStrings?.ISO[value]}
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
                        availableAudioTracks && availableAudioTracks.length && (
                            availableAudioTracks.map((item: any, index: number) => {
                                const lang = item.language;
                                const identifier = item.identifier;
                                const bcp47Tag: Schema = parse(lang);
                                const value = bcp47Tag.language || lang.split('-')?.[0];
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
                                            {identifier === currentAudioTrack.identifier ? (
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
                                                {AppStrings?.ISO[value]}
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

const styles = StyleSheet.create(
    getUIdef("DvrManager")?.style ||
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
    }));