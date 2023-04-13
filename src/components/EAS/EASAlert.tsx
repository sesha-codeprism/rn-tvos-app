import React, { useEffect } from "react";
import { DeviceEventEmitter, StyleSheet, Text, View } from "react-native";
import { getUIdef, scaleAttributes } from "../../utils/uidefinition";
import { globalStyles as g } from "../../config/styles/GlobalStyles";
import { AppStrings } from "../../config/strings";
import AutoScrollingText from "../AutoSizingText";
import SoundPlayer from "react-native-sound-player";

interface EASProps {
  easMessage: any;
}

const EASAlert: React.FunctionComponent<EASProps> = (props) => {
  let audioBaseDynamicUri = "";
  let easAudioURL = "";

  const playEASAudio = async (easDetails: any, localeStr: any) => {
    let currentLocale = (localeStr || "").toLowerCase();
    let audioURL = easDetails?.AudioBaseUri || "";
    if (!currentLocale) {
      return;
    }
    if (audioBaseDynamicUri) {
      audioURL = audioBaseDynamicUri;
    } else if (audioURL) {
      audioURL = audioURL + currentLocale + ".wav";
    }

    if (audioURL) {
      easAudioURL = audioURL;
      //   console.log("Playing audio for", audioURL);
      SoundPlayer.playUrl(audioURL);
      SoundPlayer.setNumberOfLoops(-100);
    }
  };

  useEffect(() => {
    const currentTimeInMilliseconds = new Date().getTime();
    const eventEndTimeInMilliseconds = props.easMessage?.message?.endTime;
    const elapsedEndTimeMs = Math.max(
      0,
      eventEndTimeInMilliseconds - currentTimeInMilliseconds
    );
    audioBaseDynamicUri = props.easMessage?.audioDynamicURL || "";
    playEASAudio(
      props.easMessage?.easDetails,
      props.easMessage?.locale.toLowerCase()
    );
    setTimeout(() => {
      DeviceEventEmitter.emit("EASClose", null);
    }, elapsedEndTimeMs);
    return () => {
      SoundPlayer.stop();
    };
  }, []);

  const parsedMessage =
    (props.easMessage?.message?.localizedMessages &&
      props.easMessage?.message?.localizedMessages[
        props.easMessage.locale?.full?.toLowerCase()
      ]) ||
    props.easMessage?.message?.defaultMessage ||
    "";

  return (
    <View style={styles.container}>
      <Text style={styles.easTitleStyle}>{parsedMessage?.title}</Text>
      <AutoScrollingText
        style={{
          textStyle: styles?.textStyle,
          containerStyle: styles.headerContainerStyle,
        }}
        isHorizontal={false}
        isTopToBottom={false}
        value={parsedMessage?.body}
      />
      <Text style={styles.easfooterStyle}>
        {AppStrings?.str_eas_dismiss_alert}
      </Text>
    </View>
  );
};

export default EASAlert;

const styles: any = StyleSheet.create(
  getUIdef("EasMessage")?.style ||
    scaleAttributes({
      container: {
        flex: 1,
        backgroundColor: g.auxiliaryColors.statusError,
        zIndex: 1200,
        alignItems: "center",
        flexDirection: "column",
      },
      easTitleStyle: {
        fontFamily: g.fontFamily.bold,
        color: g.fontColors.light,
        fontSize: g.fontSizes.heading3,
        marginTop: 120,
        marginBottom: 20,
      },
      easfooterStyle: {
        fontFamily: g.fontFamily.bold,
        color: g.fontColors.light,
        fontSize: g.fontSizes.heading3,
        marginTop: 30,
      },
      textStyle: {
        fontFamily: g.fontFamily.regular,
        color: g.fontColors.light,
        fontSize: g.fontSizes.heading3,
        lineHeight: g.lineHeights.heading3,
      },
      headerContainerStyle: {
        width: "80%",
        height: "60%",
      },
    })
);
