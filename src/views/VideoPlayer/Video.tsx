import * as React from 'react';
import { Dimensions, StyleSheet, Text, View, ViewStyle } from "react-native";
import { globalStyles as g } from "../../config/styles/GlobalStyles";
import { useEffect, useState } from "react";

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getScaledHeight } from '../../utils/dimensions';
import { appUIDefinition } from '../../config/constants';
import MFLoader from '../../components/MFLoader';
import MFPopup from '../../components/MFPopup';
import { MockPlayer } from './MockPlayer';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export type VideoPlayerPropsExplicit = {
    server_url?: string;
    live?: boolean;
    user_token?: string;
    stsToken?: string;
    videoURI?: string;
    tenantId?: string;
    locale?: any;
    playerKey?: any;
    debugModeInSimulator: boolean;
    navigation?: NativeStackNavigationProp<any>;
}

export type VideoPlayerProps = (VideoPlayerPropsExplicit & { style: ViewStyle }) | null;

const Video: React.FunctionComponent<VideoPlayerProps> = (
    props: VideoPlayerProps
) => {

    const [plyerBackendConfig, setPlayerBackendConfig] = useState<any | null>(null);
    const [playerSourceConfig, setPlayerSourceConfig] = useState<any | null>(null);
    const [showLoader, setShowLoader] = useState(true); // show loader on open(start  with loader)
    const [error, setError] = useState<{ code: string, message: string } | null>(null);
    const [playerState, setPlayerState] = useState("");


    useEffect(() => {
        if(props?.debugModeInSimulator){
            setTimeout(() =>{
                setShowLoader(false);
            }, 3000);
        }
        
    }, [props?.server_url, props?.videoURI, props?.tenantId, props?.stsToken, props?.user_token])


    // Loader
    const  playbackError = (error: { code: string, message: string }) => {
         console.log('******* Video JSX ******* error => ', JSON.stringify(error));
         setError(error);
    }

    const onPlayingStateUpdate = (state: any) => {
        console.log('******* Video JSX ******* onPlayingStateUpdate => ', JSON.stringify(state));
        if(["playback-start", "playing", "paused", "muted","unmuted"].includes(state)){
            setShowLoader(false);
        }else{
            console.log('Setting loader true for state => ', state);
            setShowLoader(true)
        }
        setPlayerState(state)
    }

    const onStallStarted = (e: any) => {
        setPlayerState('buffering');
        console.log('Setting loader true for state => onStallStarted');
        setShowLoader(true);
    }

    const onStallEnded = (e: any) => {
        console.log('Setting loader false for state => onStallEnded');
        setPlayerState('');
        setShowLoader(false)
    }

    const onSubtitlePressed = () => {
        //open panel
    }
    const onQualityPressed = () => {
        //open panel
    }

    if(showLoader){
        return (
            <MFLoader transparent={false} />
        )
    }
    else if (props?.debugModeInSimulator) {
        return (<MockPlayer onSubtitlePressed={onSubtitlePressed} onQualityPressed={onQualityPressed}/>)
    } else {
        if(props?.style && playerSourceConfig?.sourceUrl && plyerBackendConfig){
            if(!error){
                return (<View style={playerStyles.flexOne}>
                    <MFLoader/> {/**  actual native player, remove loader when  available */}
                    {/* <MKPlayer
                        style={{ width: screenWidth, height: screenHeight }}
                        sourceUrl={playerSourceConfig?.sourceUrl}
                        isLive={playerSourceConfig?.isLive}
                        isAutoplayEnabled={false}
                        backendConfiguration={plyerBackendConfig}
                        isLoggingEnabled={true}
                        key={BITMOVIN_KEY}
                        onPlayerError={playbackError}
                        onPlaybackEnded={() => props.navigation.pop()}
                        onStallStarted={onStallStarted}
                        onStallEnded={onStallEnded}
                    /> */}
                </View>);
            }else {
                return (<MFPopup
                    buttons={[
                      {
                        title: "Ok",
                        onPress: () => {
                          setError(null);
                          props.navigation?.pop();
                        },
                      }
                    ]}
                    description={`Playback error, Code - ${error?.code}: ${error?.message}`}
                  />)
            }
        }else {
            return (
                <View style={playerStyles.containerOpacity}>
                    <MFLoader transparent={false} />
                </View>
                
            )
        }

    }
}

Video.defaultProps  = {
    debugModeInSimulator:true
}
export default Video;

const playerStyles = StyleSheet.create(
    {
        containerOpacity: {
            backgroundColor: g.backgroundColors.shade1,
            opacity: 0.9,
        },
        controlsOverlay: {
            flexDirection: "column",
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        alignCenter: {
            alignItems: "center",
            justifyContent: "center",
        },
        flexOne: {
            flex: 1,
        },
        text: {
            marginBottom: 20,
            fontSize: appUIDefinition.theme.fontSizes.body1,
            fontFamily: appUIDefinition.theme.fontFamily.bold,
            color: g.fontColors.light,
        },
    });