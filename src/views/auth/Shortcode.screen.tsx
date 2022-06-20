import React, { useState, useEffect } from "react";
import { Pressable, View } from "react-native";
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
import { duplex } from "../../modules/duplex";
import { setDefaultStore, DefaultStore } from "../../utils/DiscoveryUtils";
import { generateGUID } from "../../utils/guid";

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
  // const queryClient = useQueryClient();
  // const [intervalMs, setIntervalMs] = React.useState(1000);
  const [code, setCode] = useState("");

  const [verificationCode, setVerficationCode] = useState(Array());

  // const { status, data, error, isFetching } = useQuery(
  //   "Fetch code",
  //   async () => {
  //     const { data } = await getShortCodeAuthenticate(GLOBALS.deviceInfo);
  //     const registrationCode: string = data.RegistrationCode;
  //     const currentCode: string = verificationCode.join("");
  //     if (registrationCode && registrationCode !== currentCode) {
  //       setVerficationCode(registrationCode.split(""));
  //     }
  //     if(data.AccessToken){

  //     }
  //   },
  //   {
  //     refetchInterval: intervalMs,
  //   }
  // );

  const makeBackendRequest = async (deviceInfo: MFDeviceInfo) => {
    const { data } = await getShortCodeAuthenticate(deviceInfo);
    console.log(`Short code response:${data}`);
    const registrationCode: string = data.RegistrationCode;

    try {
      if (registrationCode) {
        setCode(registrationCode);
        infoLog(`Set code: ${code}`);
        setVerficationCode(registrationCode.split(""));
        getAccessToken(deviceInfo, data.NextCheckInterval);
      }
    } catch (e) {
      infoLog(`Something went wrong:${e}`);
    }
  };

  const onRefresh = async () => {
    clearInterval(intervalTimer);
    setVerficationCode([]);
    makeBackendRequest(GLOBALS.deviceInfo);
  };

  useEffect(() => {
    makeBackendRequest(GLOBALS.deviceInfo).catch((err) => {
      infoLog(`Something went wrong ${err}`);
    });
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
            //TODO: Check if token and expiry time exist
            clearInterval(intervalTimer);
            GLOBALS.store.accessToken = data.AccessToken;
            GLOBALS.store.refreshToken = data.RefreshToken;
            updateStore(JSON.stringify(GLOBALS.store));
            // Settings.set(GLOBALS.store);
            getBootStrap(GLOBALS.store.accessToken).then(({ data }) => {
              console.log(data);
              GLOBALS.store.rightsGroupIds = data.RightsGroupIds;
              let bootStrapResponse = data;
              GLOBALS.bootstrapSelectors = bootStrapResponse;
              GLOBALS.store.rightsGroupIds = data.RightsGroupIds;
              processBootStrap(data, "10ft").then(() => {
                initUdls();
                setDefaultStore();
                const GUID = generateGUID();
                const duplexEndpoint = `wss://ottapp-appgw-client-a.dev.mr.tv3cloud.com/S1/duplex/?sessionId=${GUID}`;
                if (__DEV__) {
                  console.log(duplexEndpoint);
                  console.log("GLOBALS.Definition", GLOBALS.bootstrapSelectors);
                  console.log("StoreID:", DefaultStore.Id, DefaultStore);
                }
                props.navigation.replace(Routes.WhoIsWatching);
                duplex.initialize(duplexEndpoint);
              });
              props.navigation.replace(Routes.WhoIsWatching);
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
          displayText={AppStrings.pair_device}
          shouldRenderText
          textStyle={ShortCodeStyles.titleTextStyle}
        />
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.pair_directions_1}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.or_string}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.pair_directions_2}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.url_link}
            shouldRenderText
            textStyle={ShortCodeStyles.urlStyles}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.pair_directions_3}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          {verificationCode.map((i, e) => {
            return (
              <Pressable
                key={`Index${e}`}
                style={ShortCodeStyles.verificationCodeTileStyle}
              >
                <MFText
                  shouldRenderText
                  displayText={i}
                  textStyle={ShortCodeStyles.titleTextStyle}
                />
              </Pressable>
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
            containedButtonProps={{
              containedButtonStyle: {
                enabled: true,
                focusedBackgroundColor: appUIDefinition.theme.colors.primary,
                elevation: 5,
                hoverColor: "red",
                unFocusedBackgroundColor: appUIDefinition.theme.colors.primary,
              },
            }}
            textLabel={AppStrings.refresh_code}
            onPress={onRefresh}
          />
        </View>
      </View>
    </View>
  );
};

export default ShortCodeScreen;
