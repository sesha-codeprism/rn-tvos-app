import React, { useState, useEffect } from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import MFText from "../../components/MFText";
import { MFThemeObject } from "../../@types/MFTheme";
import MFButton, { MFButtonVariant } from "../../components/MFButton/MFButton";
import { AppStrings } from "../../config/strings";
import { AppImages } from "../../assets/images";
import { ShortCodeStyles } from "./shortCode.style";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import { MFDeviceInfo } from "../../../backend/@types/globals";
import {
  getShortCodeAuthenticate,
  getBootStrap,
  processBootStrap,
} from "../../../backend/authentication/authentication";
import { infoLog, updateStore } from "../../utils/helpers";
import { GLOBALS } from "../../utils/globals";
import { initUdls } from "../../../backend";
import { Routes } from "../../config/navigation/RouterOutlet";
import { appUIDefinition } from "../../config/constants";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import {
  connectDuplex,
  setGlobalData,
  verifyAccountAndLogin,
} from "../../utils/splash/splash_utils";

const MFTheme: MFThemeObject = require("../../config/theme/theme.json");

/**Props to be sent for Short code screen */
export interface ShortCodeScreenProps {
  /** Verification code to be displayed. Can be sent via navigation props also */
  verificationCode?: string;
  /** Navigation params. Used to send verification code. */
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}
/** Screen to render short code auth screen */
const ShortCodeScreen: React.FunctionComponent<ShortCodeScreenProps> = (
  props
) => {
  let intervalTimer: NodeJS.Timer;
  const [code, setCode] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [verificationCode, setVerficationCode] = useState(Array());

  const makeBackendRequest = async (deviceInfo: MFDeviceInfo) => {
    const { data } = await getShortCodeAuthenticate(deviceInfo);
    const registrationCode: string = data.RegistrationCode;
    try {
      if (registrationCode) {
        setCode(registrationCode);
        setVerficationCode(registrationCode.split(""));
        getAccessToken(deviceInfo, data.NextCheckInterval);
      }
    } catch (e) {
      infoLog(`Something went wrong:${e}`);
    }
  };

  const onRefresh = async () => {
    if (__DEV__ && isTesting) {
      console.log("Testing..");
      setVerficationCode([]);
      setTimeout(() => {
        setVerficationCode("TESTIN".split(""));
      }, 1000);
    } else {
      clearInterval(intervalTimer);
      setVerficationCode([]);
      makeBackendRequest(GLOBALS.deviceInfo);
    }
  };

  useEffect(() => {
    if (__DEV__ && isTesting) {
      console.log("Testing right now..");
      setVerficationCode("TESTIN".split(""));
    } else {
      console.log("Dev build.. so testing for now");
      makeBackendRequest(GLOBALS.deviceInfo).catch((err) => {
        infoLog(`Something went wrong ${err}`);
      });
    }
  }, []);

  const getAccessToken = async (
    deviceInfo: MFDeviceInfo,
    retryInterval: number
  ) => {
    if (!intervalTimer) {
      intervalTimer = setInterval(async () => {
        try {
          const { data } = await getShortCodeAuthenticate(deviceInfo);
          if (data.AccessToken) {
            clearInterval(intervalTimer);
            GLOBALS.store.accessToken = data.AccessToken;
            GLOBALS.store.refreshToken = data.RefreshToken;
            updateStore(JSON.stringify(GLOBALS.store));
            getBootStrap(GLOBALS.store.accessToken).then(({ data }) => {
              setGlobalData(data);
              processBootStrap(data, "10ft").then(() => {
                setGlobalData(data);
                initUdls();
                setDefaultStore();
                var value = verifyAccountAndLogin();
                console.log("verifyAccountAndLogin", value);
                connectDuplex();
                props.navigation.replace(Routes.WhoIsWatching);
              });
            });
          } else {
            const registrationCode: string = data.RegistrationCode;
            const currentCode: string = verificationCode.join("");
            if (registrationCode && registrationCode !== currentCode) {
              setVerficationCode(registrationCode.split(""));
            }
          }
        } catch (e) {
          console.log(`Something went wrong:${e}`);
        }
      }, retryInterval * 1000);
    } else {
      infoLog("Timer exists..no resetting required");
    }
  };
  return (
    <View style={ShortCodeStyles.root} testID="root">
      <View style={ShortCodeStyles.scrollbarView} testID="imageView">
        <View style={ShortCodeStyles.logoView}>
          <FastImage
            source={AppImages.logo}
            style={ShortCodeStyles.logoStyles}
          />
        </View>
      </View>
      <View style={ShortCodeStyles.codeView}>
        <MFText
          displayText={AppStrings.str_login_pair_device_title}
          shouldRenderText
          textStyle={ShortCodeStyles.titleTextStyle}
          adjustsFontSizeToFit={false}
        />
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.str_login_pair_device_instruction_line2}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
            adjustsFontSizeToFit={false}
            numberOfLines={2}
          />
          <MFText
            displayText={AppStrings.str_login_pair_device_instruction_line3}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
            adjustsFontSizeToFit={false}
            numberOfLines={2}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.str_login_pair_device_instruction_line4}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
            adjustsFontSizeToFit={false}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.str_login_pair_device_instruction_line5}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.str_login_pair_device_instruction_line6}
            shouldRenderText
            textStyle={ShortCodeStyles.urlStyles}
            adjustsFontSizeToFit={false}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.str_login_pair_device_instruction_line7}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
            adjustsFontSizeToFit={false}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          {verificationCode.map((i, e) => {
            return (
              <View
                key={`Index${e}`}
                style={ShortCodeStyles.verificationCodeTileStyle}
              >
                <MFText
                  shouldRenderText
                  displayText={i}
                  textStyle={ShortCodeStyles.titleTextStyle}
                />
              </View>
            );
          })}
        </View>
        <View>
          <MFButton
            variant={MFButtonVariant.Contained}
            style={ShortCodeStyles.refreshCodePressableStyles}
            focusedStyle={ShortCodeStyles.refreshCodePressableStyles}
            avatarSource={AppImages.settings}
            imageSource={AppImages.settings}
            iconSource={AppImages.search}
            hasTVPreferredFocus
            containedButtonProps={{
              containedButtonStyle: {
                enabled: true,
                focusedBackgroundColor: appUIDefinition.theme.colors.primary,
                elevation: 5,
                hoverColor: "red",
                unFocusedBackgroundColor: appUIDefinition.theme.colors.primary,
              },
            }}
            textLabel={AppStrings.str_login_refresh_code}
            onPress={onRefresh}
          />
        </View>
      </View>
    </View>
  );
};

export default ShortCodeScreen;
