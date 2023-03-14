//@ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import AnimatedLottieView from "lottie-react-native";
import { View, StyleSheet, Image, Dimensions, Settings } from "react-native";
import DeviceInfo from "react-native-device-info";
import { GLOBALS, resetAuthData } from "../../utils/globals";
import { processBootStrap } from "../../../backend/authentication/authentication";
import { Routes } from "../../config/navigation/RouterOutlet";
import { appUIDefinition, disableAllWarnings } from "../../config/constants";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import {
  connectDuplex,
  setGlobalData,
  setLiveData,
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
  appQueryCache,
  invalidateQueryBasedOnSpecificKeys,
  queryClient,
  resetCaches,
} from "../../config/queries";
import { useQuery } from "react-query";
import { initUdls } from "../../../backend";
import { generateGUID, makeRandomHexString } from "../../utils/guid";
import NotificationType from "../../@types/NotificationType";
import { massageSubscriberFeed } from "../../utils/assetUtils";
import { AppStrings } from "../../config/strings";

import { LogBox } from "react-native";
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

  const onDuplexMessage = useCallback(
    (message: any) => {
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
        console.log("DVR update notification received");
        // queryClient.invalidateQueries(["dvr"]);
        queryClient.invalidateQueries({ queryKey: ["dvr"] });

        // invalidateQueryBasedOnSpecificKeys(
        //   "feed",
        //   "get-all-subscriptionGroups"
        // );
        // setTimeout(() => {
        //   appQueryCache.find("get-UDP-data")?.invalidate();
        // }, 1000);
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
    const massagedTVData = massageSubscriberFeed(
      { LibraryItems: TVShow.data.Items },
      "",
      SourceType.VOD
    );
    const massagedMovieData = massageSubscriberFeed(
      { LibraryItems: movies.data.Items },
      "",
      SourceType.VOD
    );
    const tvShowsString =
      AppStrings?.str_search_catagory_tvshows || "Trending TV Shows";
    const trendingMovieString =
      AppStrings?.str_search_catagory_movie || "Trending Movies";
    GLOBALS.moviesAndTvShows = [
      //@ts-ignore
      { Name: tvShowsString, Elements: massagedTVData },
      { Name: trendingMovieString, Elements: massagedMovieData },
    ];
    console.log("movies", movies);
    console.log("TVShow", TVShow);
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
