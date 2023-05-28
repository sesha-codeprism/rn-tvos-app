import * as React from "react";
import { Dimensions, Image, StyleSheet, Text, ViewStyle } from "react-native";
import { globalStyles } from "../../config/styles/GlobalStyles";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { requireNativeComponent, View } from "react-native";
import MFLoader from "../MFLoader";
import mockData from "./mockData";
import MFLibraryCard, { TitlePlacement } from "../MFLibraryCard";
import { HomeScreenStyles } from "../../views/app/Homescreen.styles";
import MFButton, { MFButtonVariant } from "../MFButton/MFButton";
import { appUIDefinition } from "../../config/constants";
import { AppImages } from "../../assets/images";
import { getRenderImageURI } from "./PlayerUtils";
import { event } from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
const MKPlayerView = requireNativeComponent("MKPlayer");

// use ViewManager
//const MKPlayerManager = NativeModules.MKGuideManager;

export type VideoPlayerPropsExplicit = {
  route: {
    params: {
      server_url: string;
      live: boolean;
      stsToken: string;
      tenantId: string;
      playbackUri: string;
      locale: string;
      ownerUID: string;
      bookmarkPosition: number;
      userToken: string;
      mediaUID: string;
      appToken: string;
      primaryAccount: string;
      subtitleTrack: string;
      ccEnabled: string;
      audioTrack: string;
      maxBitrate: string;
      catalogInfo: any;
      schedule: any;
    };
  };
  navigation: NativeStackNavigationProp<any>;
};

type VideoPlayerStateExplicit = {
  server_url?: string;
  live?: boolean;
  stsToken?: string;
  tenantId?: string;
  playbackUri?: string;
  locale?: string;
  ownerUID?: string;
  bookmarkPosition?: number;
  userToken?: string;
  mediaUID?: string;
  appToken?: string;
  primaryAccount?: string;
  subtitleTrack?: string;
  ccEnabled?: string;
  audioTrack?: string;
  maxBitrate?: string;
  catalogInfo?: any;
  schedule?: any;
};

export type VideoPlayerProps =
  | (VideoPlayerPropsExplicit & { style: ViewStyle })
  | null;

const Video: React.FunctionComponent<VideoPlayerProps> = (
  props: VideoPlayerProps
) => {
  const [showBingeBar, setShowBingeBar] = useState(false);
  const [s_player_config, setPlayerConfig] =
    useState<VideoPlayerStateExplicit | null>(null);

  const {
    server_url,
    live,
    stsToken,
    tenantId,
    playbackUri,
    locale,
    ownerUID,
    bookmarkPosition,
    userToken,
    mediaUID,
    appToken,
    primaryAccount,
    subtitleTrack,
    ccEnabled,
    audioTrack,
    maxBitrate,
    catalogInfo,
    schedule,
  } = props?.route.params || {};

  const onExit = (event: { nativeEvent: { program: any } }) => {
    props?.navigation.pop();
  };
  const onSubtitlePressed = (event: { nativeEvent: { program: any } }) => {
    props?.navigation.pop();
  };
  const onBitratePressed = (event: { nativeEvent: { program: any } }) => {
    props?.navigation.pop();
  };
  const onAudioPressed = (event: { nativeEvent: { program: any } }) => {
    props?.navigation.pop();
  };
  const onGuidePressed = (event: { nativeEvent: { program: any } }) => {
    props?.navigation.pop();
  };

  /// only for testing
  // useEffect(() => {
  //     const timer = setTimeout(() => {
  //         setShowBingeBar(true)
  //     }, 5000);
  //     return () => {
  //         clearTimeout(timer);
  //     }
  // }, []);

  // useEffect(() => {
  //     setPlayerConfig({
  //         server_url,
  //         live,
  //         stsToken,
  //         tenantId,
  //         playbackUri,
  //         locale,
  //         ownerUID,
  //         bookmarkPosition,
  //         userToken,
  //         mediaUID,
  //         appToken,
  //         primaryAccount,
  //         subtitleTrack,
  //         ccEnabled,
  //         audioTrack,
  //         maxBitrate,
  //         catalogInfo,
  //         schedule
  //     })
  // }, [server_url, live, stsToken, tenantId, playbackUri,  locale,  ownerUID, bookmarkPosition, userToken, mediaUID, appToken, primaryAccount,  subtitleTrack, ccEnabled, audioTrack, maxBitrate, catalogInfo, schedule]);

  console.log(
    ">>>>>>>>>>>>>>>>>>>>>> Player Logs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
  );
  console.log("Received following data for playback");
  console.log("server_url = ", server_url);
  console.log("live = ", live);
  console.log("stsToken = ", stsToken);
  console.log("tenantId = ", tenantId);
  console.log("playbackUri = ", playbackUri);
  console.log("locale = ", locale);
  console.log("ownerUID = ", ownerUID);
  console.log("bookmarkPosition = ", bookmarkPosition);
  console.log("userToken = ", userToken);
  console.log("mediaUID = ", mediaUID);
  console.log("appToken = ", appToken);
  console.log("primaryAccount = ", primaryAccount);
  console.log("subtitleTrack = ", subtitleTrack);
  console.log("ccEnabled = ", ccEnabled);
  console.log("audioTrack = ", audioTrack);
  console.log("maxBitrate = ", maxBitrate);
  console.log("catalogInfo = ", catalogInfo);
  console.log("schedule = ", schedule);
  const playback =
    "http://vsppvmproda1.cloudapp.net:5555/shls/AVE_906/index.m3u8?device=mf_dash_abr_clear_enc";

  return (
    <View style={playerStyles.playerContainer}>
      {/* {
            !(s_player_config?.mediaUID || s_player_config?.playbackUri) && (
                <MFLoader/>
            ) 
        } */}
      {(mediaUID || playbackUri) && (
        <MKPlayerView
          style={playerStyles.player}
          playerConfig={{
            server_url,
            live,
            stsToken,
            tenantId,
            playback,
            locale,
            ownerUID,
            bookmarkPosition,
            userToken,
            mediaUID,
            appToken,
            primaryAccount,
            subtitleTrack,
            ccEnabled,
            audioTrack,
            maxBitrate,
            catalogInfo,
            schedule,
          }}
          onExit={onExit}
          onSubtitlePressed={onSubtitlePressed}
          onBitratePressed={onBitratePressed}
          onAudioPressed={onAudioPressed}
          onGuidePressed={onGuidePressed}
        />
      )}
      {showBingeBar && (
        <View style={playerStyles.bingeBarStyle}>
          <Image
            source={
              getRenderImageURI("16x9", mockData) || AppImages.bgPlaceholdere
            }
            style={HomeScreenStyles.landScapeCardImageStyles}
          />
          <View
            style={{
              width: (appUIDefinition.config.height16x9 * 16) / 9,
              display: "flex",
              flexDirection: "row",
              alignContent: "space-around",
            }}
          >
            <MFButton
              variant={MFButtonVariant.Contained}
              iconSource={0}
              onPress={() => {
                console.log("Continue Clicked");
              }}
              onFocus={() => {
                console.log("Continue Focussed");
              }}
              imageSource={0}
              style={{
                height: 70,
                width: 180,
                backgroundColor: "#EEEEEE",
                marginBottom: 10,
              }}
              textStyle={{
                height: 38,
                width: 150,
                color: "#EEEEEE",
                fontFamily: "Inter-Regular",
                fontSize: 25,
                fontWeight: "600",
                letterSpacing: 0,
                lineHeight: 38,
                textAlign: "center",
              }}
              avatarSource={undefined}
              textLabel={"Continue"}
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
            <MFButton
              variant={MFButtonVariant.Contained}
              iconSource={0}
              onPress={() => {
                console.log("Dissmiss Clicked");
              }}
              onFocus={() => {
                console.log("Dissmiss Focussed");
              }}
              imageSource={0}
              style={{
                height: 70,
                width: 180,
                backgroundColor: "#EEEEEE",
                marginBottom: 10,
              }}
              textStyle={{
                height: 38,
                width: 150,
                color: "#EEEEEE",
                fontFamily: "Inter-Regular",
                fontSize: 25,
                fontWeight: "600",
                letterSpacing: 0,
                lineHeight: 38,
                textAlign: "center",
              }}
              avatarSource={undefined}
              textLabel={"Dissmiss"}
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
          </View>
        </View>
      )}
    </View>
  );
};

export default Video;

const playerStyles = StyleSheet.create({
  playerContainer: {
    alignContent: "center",
    alignItems: "center",
    padding: 0,
  },
  player: {
    width: screenWidth,
    height: screenHeight,
  },
  bingeBarStyle: {
    flexDirection: "column",
    position: "absolute",
    bottom: 50,
    right: 100,
    paddingBottom: 47,
    backgroundColor: "blue",
  },
});
