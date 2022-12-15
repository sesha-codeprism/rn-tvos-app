import React, { useState, useEffect, useContext } from "react";
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
import {
  processBootStrap,
} from "../../../backend/authentication/authentication";
import { infoLog, updateStore } from "../../utils/helpers";
import { GLOBALS, resetAuthData } from "../../utils/globals";
import { initUdls } from "../../../backend";
import { Routes } from "../../config/navigation/RouterOutlet";
import { appUIDefinition } from "../../config/constants";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import {
  connectDuplex,
  setGlobalData,
  verifyAccountAndLogin,
} from "../../utils/splash/splash_utils";
import useLanding from "../../customHooks/useLandingData";
import useBootstrap from "../../customHooks/useBootstrapData";
import useShortCode from "../../customHooks/useShortCode";
import { resetCaches, resetSpecificQuery } from "../../config/queries";
import { GlobalContext } from "../../contexts/globalContext";

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
  const [latestToken, setLatestToken ] = useState(null);

  const landingResponse = useLanding();
  const shortCodeData = useShortCode();
  const bootstrapData = useBootstrap(latestToken);
  const currentContext = useContext(GlobalContext);
  
 
  const [navigateTo, bootstrapUrl, acessToken, response] = bootstrapData || {};


  const onRefresh = async () => {
    resetSpecificQuery(['shotcode',landingResponse, GLOBALS.deviceInfo])
  };

  useEffect(() => {
    const onDuplexMessage = (message: any) => {
      if(message?.type === "DeviceDeleted"){
        const { payload : {deviceId = ""}  = {} } = message;
        if(deviceId === GLOBALS.deviceInfo.deviceId){
          // logout
          const resetStore = resetAuthData();
          updateStore(resetStore);
          resetCaches();
          GLOBALS.rootNavigation.replace(Routes.ShortCode);
        }
      }
    }
    currentContext.addOnDuplexMessageHandlers([...currentContext.onDuplexMessageHandlers, onDuplexMessage]);
  }, []);

  useEffect(() => {
    if(shortCodeData?.data?.RegistrationCode){
      setVerficationCode(shortCodeData?.data?.RegistrationCode?.split(''));
    }
  }, [shortCodeData?.data?.RegistrationCode]);

  useEffect(() => {
    if(GLOBALS.store && shortCodeData?.data?.AccessToken &&  shortCodeData?.data?.RefreshToken){
      GLOBALS.store.accessToken = shortCodeData?.data?.AccessToken;
      GLOBALS.store.refreshToken = shortCodeData?.data?.RefreshToken;
      setLatestToken(shortCodeData?.data?.AccessToken);
      updateStore(GLOBALS.store);
    }
  }, [shortCodeData?.data?.AccessToken]);

  useEffect(() => {
    const {data, isSuccess, isError, error } = response || {};
    if(isSuccess && data?.data && navigateTo === "NAVIGATEINNTOAPP" && bootstrapUrl && acessToken && GLOBALS.deviceInfo){
      processBootStrap(data?.data, "10ft").then(() => {
        setGlobalData(data?.data);
        initUdls();
        setDefaultStore();
        var value = verifyAccountAndLogin();
        console.log("verifyAccountAndLogin", value);
        connectDuplex(currentContext.duplexMessagee);
        props.navigation.replace(Routes.WhoIsWatching);
      });
    }
  }, [response?.data, navigateTo, bootstrapUrl, acessToken, shortCodeData?.data?.AccessToken])

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
          adjustsFontSizeToFit={false}
        />
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.pair_directions_1}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
            adjustsFontSizeToFit={false}
            numberOfLines={2}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.or_string}
            shouldRenderText
            textStyle={ShortCodeStyles.subtitleText}
            adjustsFontSizeToFit={false}
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
            adjustsFontSizeToFit={false}
          />
        </View>
        <View style={ShortCodeStyles.textViewStyle}>
          <MFText
            displayText={AppStrings.pair_directions_3}
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
            textLabel={AppStrings.refresh_code}
            onPress={onRefresh}
          />
        </View>
      </View>
    </View>
  );
};

export default ShortCodeScreen;
