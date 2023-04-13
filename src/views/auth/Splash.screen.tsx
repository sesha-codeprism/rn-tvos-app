//@ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import AnimatedLottieView from "lottie-react-native";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Settings,
  DeviceEventEmitter,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { GLOBALS, resetAuthData } from "../../utils/globals";
import { processBootStrap } from "../../../backend/authentication/authentication";
import { Routes } from "../../config/navigation/RouterOutlet";
import {
  appUIDefinition,
  disableAllWarnings,
  lang,
} from "../../config/constants";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import {
  connectDuplex,
  setGlobalData,
  setNativeModuleData,
} from "../../utils/splash/splash_utils";
import {
  getMovies,
  getStoresOfZones,
  getTVShows,
} from "../../../backend/discovery/discovery";
import useBootstrap from "../../customHooks/useBootstrapData";
import { SourceType } from "../../utils/common";
import { updateStore } from "../../utils/helpers";
import { GlobalContext } from "../../contexts/globalContext";
import {
  invalidateQueryBasedOnSpecificKeys,
  resetCaches,
} from "../../config/queries";
import { useQuery } from "react-query";
import { generateGUID, makeRandomHexString } from "../../utils/guid";
import NotificationType from "../../@types/NotificationType";
import { massageTrendingData } from "../../utils/assetUtils";
import { AppStrings } from "../../config/strings";

import { LogBox } from "react-native";
import {
  EasAlertShortCode,
  isMatch,
  parseMessage,
} from "../../utils/EAS/EASUtils";
import { sourceTypeString } from "../../utils/analytics/consts";
import {
  getNotification,
  setNotification,
} from "../../components/MFNotification/NotificationStore";

// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message

if (disableAllWarnings) {
  LogBox.ignoreAllLogs(); //Ignore all log notifications
}
interface Props {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}
const { width, height } = Dimensions.get("window");
const SplashScreen: React.FunctionComponent<Props> = (props: Props) => {
  const bootstrapData = useBootstrap();
  const [navigateTo, bootstrapUrl, acessToken, response] = bootstrapData || {};

  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDevice] = useState("");
  const currentContext = useContext(GlobalContext);

  const storeResults = useQuery(
    //@ts-ignore
    ["stores", response?.data?.data?.ServiceMap?.Services?.discovery],
    getStoresOfZones,
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      //@ts-ignore
      enabled:
        !!response?.data?.data?.ServiceMap?.Services?.discovery &&
        !!GLOBALS.store?.rightsGroupIds,
    }
  );

  const CreatePlayInfo = (expChannel: any) => {
    if (!expChannel?.channel || !expChannel?.service) {
      return null;
    }
    const nowNext = GLOBALS.nowNextMap[expChannel?.channel.StationId];
    const schedule: any = nowNext && nowNext.now;
    const programId: string = schedule && schedule.ProgramId;

    const iplayInfo: any = {
      CallLetters: expChannel.channel?.CallLetters,
      ChannelInfo: {
        Channel: expChannel.channel,
        Service: expChannel.service,
        Schedule: schedule,
      },
      programId: programId || expChannel.service.Id,
      channelNumber: expChannel.channel.Number,
      channelName: expChannel.channel.Name,
      id: programId,
      networkInfo: "",
      progress: 0,
      metadataLine2: "",
      metadataLine3: "",
      networkLogo: "",
      assetType: generateType(schedule, SourceType.LIVE),
      Schedule: schedule,
    };

    if (expChannel.service && expChannel.service.eas2Level) {
      iplayInfo.eas2Level = expChannel.service.eas2Level;
    }

    if (expChannel.service && expChannel.service.isEasLevel1) {
      iplayInfo.isEasLevel1 = expChannel.service.isEasLevel1;
    }
    return iplayInfo;
  };

  const getExceptionChannel = () => {
    let channelMap = GLOBALS.channelMap;
    let service: any;
    const serviceMap: any = channelMap?.ServiceMap;
    const channels = channelMap?.Channels;
    const collectionIds: any = Object.keys(serviceMap);
    let serviceCollectionId = "";
    let channel: any;
    // Find first exception service
    for (const i of collectionIds) {
      service = serviceMap[i];
      if (service && service.isEasLevel1) {
        serviceCollectionId = i;
        break;
      }
    }
    // Find the channel
    for (const ch of channels) {
      channel = ch;
      if (ch.ServiceCollectionId === serviceCollectionId) {
        break;
      }
    }

    return { channel, service };
  };
  const onDuplexMessage = useCallback(
    (message: any) => {
      console.log("message from op portal", message);
      if (message?.type === NotificationType.DeviceDeleted) {
        const { payload: { deviceId = "" } = {} } = message;
        if (deviceId === GLOBALS.deviceInfo.deviceId) {
          // logout
          const resetStore = resetAuthData();
          updateStore(resetStore);
          resetCaches();
          GLOBALS.rootNavigation.replace(Routes.ShortCode);
        }
      } else if (message?.type === NotificationType.dvrUpdated) {
        invalidateQueryBasedOnSpecificKeys("dvr", "get-all-subscriptionGroups");
      } else if (message?.type === NotificationType.easmessage) {
        const { payload } = message;
        const localeStr =
          GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode ||
          "en-US";
        const easMessage: string = payload;
        const easParsedMessage = parseMessage(
          easMessage,
          lang,
          GLOBALS.bootstrapSelectors?.EasProfile.GeoCode
        );
        const isMatchChecked = isMatch(easParsedMessage.easGeoCodes);
        const displayMessage = async () => {
          //TODO: V2 app is dispatching an Analytics event here..
          if (isMatchChecked && easParsedMessage) {
            // setEASAlertId(easParsedMessage.id);
            const eventStartTimeInMilliseconds =
              easParsedMessage?.startTime.getTime();
            const currentTimeInMilliseconds = new Date().getTime();
            const elapsedStartTimeMs = Math.max(
              0,
              eventStartTimeInMilliseconds - currentTimeInMilliseconds
            );
            const eventEndTimeInMilliseconds =
              easParsedMessage?.endTime.getTime();

            if (EasAlertShortCode[easParsedMessage?.alertShortCode]) {
              let expChannel = getExceptionChannel();
              if (easParsedMessage.alertShortCode === EasAlertShortCode.EAN) {
                let playinfo: any = CreatePlayInfo(expChannel);
                //TODO: If on player, pop the stack
                // if (this.props.currentRoute.name === Routes.VideoPlayer) {
                //   this.props.popRoute();
                // }
                if (expChannel && expChannel.channel.Number) {
                  playinfo["playSource"] = sourceTypeString.LIVE;
                  //TODO: Navigate to player
                  // this.props.pushRoute("VideoPlayer", {
                  //   data: playinfo,
                  //   id: playinfo?.id,
                  // });
                }
              }
            } else if (
              eventEndTimeInMilliseconds >= currentTimeInMilliseconds
            ) {
              setTimeout(() => {
                DeviceEventEmitter.emit("EASReceived", {
                  message: easParsedMessage,
                  easDetails: GLOBALS.bootstrapSelectors?.EasProfile,
                  locale: localeStr,
                });
              }, elapsedStartTimeMs);
            }
            // this.props.clearEASMessage();
          } else {
            // ai.trackEvent(IAnalyticsEvents.EAS_FAILED, {
            //   message: easMessage,
            //   clientCurrentTimeUtcStr: new Date().toLocaleDateString(),
            //   clientGeoCode: "",
            //   payloadSize: easMessage?.length,
            // });
            console.warn("EAS failed", message);
          }
        };
        displayMessage();
      } else if (message?.type === NotificationType.pinUnpinChannel) {
        DeviceEventEmitter.emit("FavoriteChannelUpdated", message);
      } else if (message?.type === NotificationType.UINotification) {
        const notification = getNotification();
        console.log('notification', notification);
        if (
          notification &&
          notification.payload.messageId !== message.payload.messageId
        ) {
          setNotification(message);
          DeviceEventEmitter.emit("createNotification", {
            id:
              message.payload.messageId || AppStrings?.str_pair_device_success,
            iconName: "notification",
            title: message.payload.Title,
            subtitle: message.payload.Description,
          });
        } else if (!notification) {
          setNotification(message);
          DeviceEventEmitter.emit("createNotification", {
            id:
              message.payload.messageId || AppStrings?.str_pair_device_success,
            iconName: "notification",
            title: message.payload.Title,
            subtitle: message.payload.Description,
          });
        }
      }
    },
    [GLOBALS.deviceInfo.deviceId]
  );

  useEffect(() => {
    Settings.set({ SETTINGS_NAVIGATION_HISTORY: undefined });
    setDeviceInfo();
    currentContext.addDuplexMessageHandler(onDuplexMessage);

    () => {
      currentContext.removeDuplexHandler(onDuplexMessage);
    };
  }, []);

  useEffect(() => {
    if (response?.data?.data) {
      setDefaultStore(storeResults?.data?.data, response?.data!.data);
      setGlobalData(response?.data.data);
    }
  }, [response?.data, response?.isSuccess]);

  useEffect(() => {
    //@ts-ignore
    const { data, isSuccess, isError, error } = response || {};
    if (navigateTo === "NOTOKEN") {
      props.navigation.replace(Routes.ShortCode);
    }
    if (isError) {
      const isTokenInvalidError: boolean = error.toString().includes("401");
      if (isTokenInvalidError) {
        let resetStore = resetAuthData();
        updateStore(resetStore);
        console.log("Token is invalid. Taking user to login again");
        props.navigation.replace(Routes.ShortCode);
      }
      setLoading(false);
    }
    if (
      isSuccess &&
      data?.data &&
      navigateTo === "NAVIGATEINNTOAPP" &&
      bootstrapUrl &&
      acessToken &&
      storeResults?.data?.data
    ) {
      processBootStrap(data?.data, "10ft")
        .then(async () => {
          setGlobalData(data?.data).then(async () => {
            await setNativeModuleData();
            // await setLiveData();
            setDefaultStore(storeResults?.data?.data, data?.data);
            connectDuplex(currentContext.duplexMessage);
            setLoading(false);
            getMoviesAndTvShow();
            props.navigation.replace(Routes.WhoIsWatching);
          });
        })
        .catch((err) => console.warn(err));
    }
  }, [
    //@ts-ignore
    response?.data,
    navigateTo,
    bootstrapUrl,
    acessToken,
    storeResults?.data?.data,
  ]);

  const _onAnimationFinish = () => {};

  const setDeviceInfo = async () => {
    const deviceID = DeviceInfo.getUniqueId();
    const isEmulator: boolean = await DeviceInfo.isEmulator();
    if (isEmulator) {
      // If device is running on emulator, mac address is same everrytime
      GLOBALS.deviceInfo.deviceId = generateGUID(makeRandomHexString(11, true));
      setDevice(GLOBALS.deviceInfo.deviceId);
      return true;
    } else {
      // If device is running on real device
      GLOBALS.deviceInfo.deviceId = generateGUID(deviceID);
      setDevice(GLOBALS.deviceInfo.deviceId);
      return true;
    }
  };
  const showAnimation = appUIDefinition.config.useLottieAnimationOnSplash;
  const getMoviesAndTvShow = async () => {
    console.log("getMoviesAndTvShow");
    const movies = await getMovies("", {
      pivots: `LicenseWindow|New|Language|${
        GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split(
          "-"
        )?.[0] || "en"
      }`,
    });
    const TVShow = await getTVShows("", {
      pivots: `LicenseWindow|New|Language|${
        GLOBALS.store?.settings?.display?.onScreenLanguage?.languageCode?.split(
          "-"
        )?.[0] || "en"
      }`,
    });
    const massagedTVData = massageTrendingData(TVShow.data, "tvshows");
    //  massageSubscriberFeed(
    //   { LibraryItems: TVShow.data.Items },
    //   "",
    //   SourceType.VOD
    // );
    const massagedMovieData = massageTrendingData(movies.data, "movies");
    //  massageSubscriberFeed(
    //   { LibraryItems: movies.data.Items },
    //   "",
    //   SourceType.VOD
    // );
    const tvShowsString =
      AppStrings?.str_search_catagory_tvshows || "Trending TV Shows";
    const trendingMovieString =
      AppStrings?.str_search_catagory_movie || "Trending Movies";
    GLOBALS.moviesAndTvShows = [
      //@ts-ignore
      ...massagedTVData,
      ...massagedMovieData,
    ];
    console.log("movies", massageTrendingData(movies.data, "movies"));
    console.log("TVShow", massageTrendingData(TVShow.data, "tvshows"));
  };
  return (
    <View style={styles.container}>
      {showAnimation ? (
        <AnimatedLottieView
          autoPlay
          loop={false}
          source={require(`../../assets/animations/splash.json`)} //${splashAnimation}
          style={{ width: 500, height: 500 }}
          onAnimationFinish={_onAnimationFinish}
        />
      ) : (
        <Image
          style={{ width: width * 0.6, height: height * 0.2 }}
          resizeMode={"contain"}
          source={require(`../../assets/images/logo_white.png`)} //${splashImage}
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoadEnd={() => {
            setTimeout(() => {
              _onAnimationFinish();
            }, 3000);
          }}
        />
      )}
      {
        loading && (
          <AnimatedLottieView
            autoPlay
            loop={true}
            source={require(`../../assets/animations/9379-loader.json`)} //${splashAnimation}
            style={{ width: 500, height: 300 }}
            // onAnimationFinish={_onAnimationFinish}
          />
        )
        // <ActivityIndicator style={{ marginTop: 50 }} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0e0e0e",
  },
});

export default SplashScreen;
