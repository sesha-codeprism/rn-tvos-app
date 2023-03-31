import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { appUIDefinition } from "../../config/constants";
import { getScaledHeight, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";
import { globalStyles as g } from "../../config/styles/GlobalStyles";
import MFButton, { MFButtonVariant } from "../../components/MFButton/MFButton";
import { getFontIcon } from "../../config/strings";

export const MockPlayer: React.FunctionComponent<{onQualityPressed: any, onSubtitlePressed: any}> = (props: {onQualityPressed: any, onSubtitlePressed: any}) => {
    const onSubtitlePressed = () => {
        // currentSubstitleTrackOfVideo: would be provided by the Player
        // allSubtitleTracksOfVideo: would be provided by the Player
        // allAudioTrackOfVideo: would be provided by the Player
        // currentAudioTrackOfVideo:  would be provided by the player
        props.onSubtitlePressed && props.onSubtitlePressed({ 
            currentSubstitleTrackOfVideo: [], 
            allSubtitleTracksOfVideo: [], 
            allAudioTrackOfVideo: [], 
            currentAudioTrackOfVideo: [] });
    }
    const onQualityPressed = () => {
        // videoQualityCatalogue  comes fom App env specific  config file
        // currentQuality should be part of Settings, and available in GLOBALS.store
        props.onQualityPressed && props.onQualityPressed({videoQualityCatalogue: [], currentQuality: ''});
    }
    return (
        <View style={{ display: 'flex', height: SCREEN_HEIGHT, width: SCREEN_WIDTH, backgroundColor: g.backgroundColors.shade1, opacity: 0.9, alignItems: "center", justifyContent: "space-between", }}>
            <View
                key={`mockVideo`}
                style={{
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: (SCREEN_HEIGHT / 2) - 150
                }}
            >
                <Text style={{
                    marginBottom: 20,
                    fontSize: appUIDefinition.theme.fontSizes.body1,
                    fontFamily: appUIDefinition.theme.fontFamily.bold,
                    color: g.fontColors.light,
                }}>
                    {`Source url:  : player_source_url`}
                </Text>
                <Text style={{
                    marginBottom: 20,
                    fontSize: appUIDefinition.theme.fontSizes.body1,
                    fontFamily: appUIDefinition.theme.fontFamily.bold,
                    color: g.fontColors.light,
                }}>
                    {`Is Live:  : false}`}
                </Text>
                <Text style={{
                    marginBottom: 20,
                    fontSize: appUIDefinition.theme.fontSizes.body1,
                    fontFamily: appUIDefinition.theme.fontFamily.bold,
                    color: g.fontColors.light,
                }}>
                    {`Player State - loaded`}
                </Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-around", height: 100, width: SCREEN_WIDTH }}>
                <MFButton
                    focusable
                    iconSource={0}
                    imageSource={0}
                    avatarSource={undefined}
                    onFocus={() => {
                        () => { }
                    }}
                    onPress={onSubtitlePressed}
                    variant={MFButtonVariant.FontIcon}
                    fontIconSource={getFontIcon('closed_captions')}
                    fontIconTextStyle={StyleSheet.flatten([
                        { fontFamily: "MyFontRegular", color: "#EEEEEE" },
                        { fontSize: 70, textAlign: "center", alignSelf: "center" },
                    ])}
                    style={[
                        { width: 70, height: 70 },
                        { backgroundColor: "#424242" },
                        {
                            borderRadius: 35,
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                        },
                    ]}
                    focusedStyle={{ backgroundColor: "#053C69" }}
                    fontIconProps={{
                        iconPlacement: "Left",
                        shouldRenderImage: true,
                    }}
                />

                <MFButton
                    focusable
                    iconSource={0}
                    imageSource={0}
                    avatarSource={undefined}
                    onFocus={() => {
                        () => { }
                    }}
                    onPress={onQualityPressed}
                    variant={MFButtonVariant.FontIcon}
                    fontIconSource={getFontIcon('quality_best')}
                    fontIconTextStyle={StyleSheet.flatten([
                        { fontFamily: "MyFontRegular", color: "#EEEEEE" },
                        { fontSize: 70, textAlign: "center", alignSelf: "center" },
                    ])}
                    style={[
                        { width: 70, height: 70 },
                        { backgroundColor: "#424242" },
                        {
                            borderRadius: 35,
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                        },
                    ]}
                    focusedStyle={{ backgroundColor: "#053C69" }}
                    fontIconProps={{
                        iconPlacement: "Left",
                        shouldRenderImage: true,
                    }}
                />
            </View>
        </View>
    )
}