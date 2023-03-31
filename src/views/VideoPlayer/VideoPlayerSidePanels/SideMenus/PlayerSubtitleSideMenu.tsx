import React, { useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MFSelectCheckedBox, MFSelectUnCheckedBox } from "../../../../components/MFSelectBox";
import { AppStrings } from "../../../../config/strings";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";

import { updateStore } from "../../../../utils/helpers";
import { GLOBALS } from "../../../../utils/globals";
import { AudioTracks, PlayerSlidePanelTracks } from "../../../../utils/assetUtils";

export type PlayerSubtitleSideMenuProps = {
    subtitleTracks: PlayerSlidePanelTracks[];
    audioTracks: string[];
    curentSubtitleTrack: any;
    currentAudioTrack: string;
    setUserSubtitleSelection: (params: any) => {},
    setUserAudioSelection: (params: any) => {},
}

// assign mock data, in the same format as v2
PlayerSubtitleSideMenu.defaultProps = {

}

export const PlayerSubtitleSideMenu: React.FunctionComponent<PlayerSubtitleSideMenuProps> = (props: PlayerSubtitleSideMenuProps) => {
    const [focussed, setFocussed] = useState({ 'subtitle': 0, 'audio': 0 });
    const [selectedSubtitle, setSelectedSubtitle] = useState(props.curentSubtitleTrack);
    const [selectedAudioTrack, setSelectedAudioTrack] = useState(props.currentAudioTrack);

    const onSubtitlePress = (item: any) => {

    }

    const onAudioTrackPress = (item: any) => {

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
                        lineHeight: 50
                    }
                    }
                >
                    {"Primary and secondary preferences can be change under Settings > Audio / Display."}
                </Text>

            </View>
            <View
                style={styles.contentContainer}
            >
                <ScrollView>
                    <Text
                        style={{
                            color: "#EEEEEE",
                            fontFamily: "Inter",
                            fontSize: 38,
                            fontWeight: "bold",
                            letterSpacing: 0,
                            lineHeight: 55
                        }
                        }
                    >
                        {"Subtitle"}
                    </Text>
                    <FlatList
                        data={props.subtitleTracks}
                        keyExtractor={(item) => item.localizedText}
                        renderItem={({ item, index }) => {
                            return (
                                <Pressable
                                    onFocus={() => {
                                        setFocussed({ ...focussed, 'subtitle': index });
                                    }}
                                    onPress={() => {
                                        onSubtitlePress(item);
                                    }}
                                    style={
                                        index === focussed['subtitle']
                                            ? { ...MFSettingsStyles.containerActive, ...styles.container }
                                            : styles.container
                                    }
                                    key={index}
                                >
                                    <View style={styles.icContainer}>
                                        {item.id === selectedSubtitle.id ? (
                                            <MFSelectCheckedBox />
                                        ) : (
                                            <MFSelectUnCheckedBox />
                                        )}
                                    </View>
                                    <View style={styles.listContent}>
                                        <Text
                                            style={[
                                                styles.listText,
                                                { color: index === focussed['subtitle'] ? "#EEEEEE" : "#A7A7A7" },
                                            ]}
                                        >
                                            {AppStrings[item.localizedText]}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                    <Text
                        style={{
                            color: "#EEEEEE",
                            fontFamily: "Inter",
                            fontSize: 38,
                            fontWeight: "bold",
                            letterSpacing: 0,
                            lineHeight: 55
                        }
                        }
                    >
                        {"Audio"}
                    </Text>
                    <FlatList
                        data={props.audioTracks}
                        keyExtractor={(item) => item.localizedText}
                        renderItem={({ item, index }) => {
                            return (
                                <Pressable
                                    onFocus={() => {
                                        setFocussed({ ...focussed, 'audio': index });
                                    }}
                                    onPress={() => {
                                        onAudioTrackPress(item);
                                    }}
                                    style={
                                        index === focussed['audio']
                                            ? { ...MFSettingsStyles.containerActive, ...styles.container }
                                            : styles.container
                                    }
                                    key={index}
                                >
                                    <View style={styles.icContainer}>
                                        {item.id === selectedAudioTrack.id ? (
                                            <MFSelectCheckedBox />
                                        ) : (
                                            <MFSelectUnCheckedBox />
                                        )}
                                    </View>
                                    <View style={styles.listContent}>
                                        <Text
                                            style={[
                                                styles.listText,
                                                { color: index === focussed['audio'] ? "#EEEEEE" : "#A7A7A7" },
                                            ]}
                                        >
                                            {AppStrings[item.localizedText]}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                </ScrollView>
            </View>
            {/* </ScrollView> */}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "100%",
        backgroundColor: "#00030E",
        display: "flex"
    },
    headerContainer: {
        width: "100%",
        height: 185,
        padding: 50,
        justifyContent: "center",
    },
    contentContainer: {
        width: "100%",
        padding: 30,
        paddingTop: 10,
        height: "80%",
        display: "flex",
        flexDirection: "row"
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