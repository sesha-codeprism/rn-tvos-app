//@ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import MFText from "../../components/MFText";
import { MFThemeObject } from "../../@types/MFTheme";
import { AppStrings } from "../../config/strings";
import { AppImages } from "../../assets/images";
import { ShortCodeStyles } from "./shortCode.style";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import { processBootStrap } from "../../../backend/authentication/authentication";
import { updateStore } from "../../utils/helpers";
import { GLOBALS } from "../../utils/globals";
import { initUdls } from "../../../backend";
import { Routes } from "../../config/navigation/RouterOutlet";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import {
  connectDuplex,
  setGlobalData,
  setLiveData,
  setNativeModuleData,
  verifyAccountAndLogin,
} from "../../utils/splash/splash_utils";
import useLanding from "../../customHooks/useLandingData";
import useBootstrap from "../../customHooks/useBootstrapData";
import useShortCode from "../../customHooks/useShortCode";
import { resetSpecificQuery } from "../../config/queries";
import { GlobalContext } from "../../contexts/globalContext";
import { useQuery } from "react-query";
import { getStoresOfZones } from "../../../backend/discovery/discovery";

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
  const [verificationCode, setVerficationCode] = useState(Array());
  const [latestToken, setLatestToken] = useState(null);
  const [latestRefreshToken, setLatestRefreshToken] = useState(null);
  //@ts-ignore
  const landingResponse = useLanding(GLOBALS.store?.MFGlobalsConfig?.url);
  //@ts-ignore
  const shortCodeData = useShortCode(GLOBALS.store?.MFGlobalsConfig?.url);
  const bootstrapData = useBootstrap(latestToken, latestRefreshToken);
  const currentContext = useContext(GlobalContext);

  const [navigateTo, bootstrapUrl, acessToken, response] = bootstrapData || {};
  const rightsGroupIds = GLOBALS.store?.rightsGroupIds;

  const storeResults = useQuery(
    //@ts-ignore
    ["stores", response?.data?.data?.ServiceMap?.Services?.discovery],
    getStoresOfZones,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      //@ts-ignore
      enabled: !!(
        response?.data?.data?.ServiceMap?.Services?.discovery && rightsGroupIds
      ),
    }
  );

  const onRefresh = async () => {
    resetSpecificQuery(["shotcode", landingResponse, GLOBALS.deviceInfo]);
  };

  useEffect(() => {
    // bootstrap response arrived
    if (response?.data?.data) {
      setGlobalData(response?.data?.data);
    }
  }, [response?.data, response?.isSuccess]);


  useEffect(() => {
    //@ts-ignore
    if (shortCodeData?.data?.RegistrationCode) {
      //@ts-ignore
      setVerficationCode(shortCodeData?.data?.RegistrationCode?.split(""));
      //@ts-ignore
      GLOBALS.deviceInfo.regCode = shortCodeData?.data?.RegistrationCode;
    }
    //@ts-ignore
  }, [shortCodeData?.data?.RegistrationCode]);

  useEffect(() => {
    if (
      GLOBALS.store &&
      shortCodeData?.data?.AccessToken &&
      shortCodeData?.data?.RefreshToken
    ) {
      GLOBALS.store.accessToken = shortCodeData?.data?.AccessToken;
      GLOBALS.store.refreshToken = shortCodeData?.data?.RefreshToken;
      setLatestToken(shortCodeData?.data?.AccessToken);
      setLatestRefreshToken(shortCodeData?.data?.RefreshToken);
      updateStore(GLOBALS.store);
    }
  }, [shortCodeData?.data?.AccessToken]);

  useEffect(() => {
    const { data, isSuccess, isError, error } = response || {};
    if (
      isSuccess &&
      data?.data &&
      navigateTo === "NAVIGATEINNTOAPP" &&
      bootstrapUrl &&
      acessToken &&
      GLOBALS.deviceInfo &&
      storeResults?.data?.data
    ) {
      processBootStrap(data?.data, "10ft").then(() => {
        setGlobalData(data?.data).then(async () => {
          setNativeModuleData().then(async () => {
            initUdls();
            await setLiveData();
            setDefaultStore(storeResults?.data?.data, data?.data);
            setGlobalData(data?.data);
            var value = verifyAccountAndLogin();
            console.log("verifyAccountAndLogin", value);
            connectDuplex(currentContext.duplexMessage);
            props.navigation.replace(Routes.WhoIsWatching);
          });
        });
      });
    }
  }, [
    response?.data,
    navigateTo,
    bootstrapUrl,
    acessToken,
    shortCodeData?.data?.AccessToken,
    storeResults?.data?.data,
  ]);

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
          {verificationCode?.map((i, e) => {
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
      </View>
    </View>
  );
};

export default ShortCodeScreen;
