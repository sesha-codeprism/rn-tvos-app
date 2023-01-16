//@ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import AnimatedLottieView from "lottie-react-native";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Settings,
  NativeModules,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { GLOBALS, resetAuthData } from "../../utils/globals";
import { processBootStrap } from "../../../backend/authentication/authentication";
import { Routes } from "../../config/navigation/RouterOutlet";
import { appUIDefinition } from "../../config/constants";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import {
  connectDuplex,
  setGlobalData,
  setLiveData,
} from "../../utils/splash/splash_utils";
import {
  getMovies,
  getStoresOfZones,
  getTVShows,
} from "../../../backend/discovery/discovery";
import useBootstrap from "../../customHooks/useBootstrapData";
import { massageSubscriberFeed } from "../../utils/Subscriber.utils";
import { SourceType } from "../../utils/common";
import { updateStore } from "../../utils/helpers";
import { GlobalContext } from "../../contexts/globalContext";
import { resetCaches } from "../../config/queries";
import { useQuery } from "react-query";
import { initUdls } from "../../../backend";
import { generateGUID, makeRandomHexString } from "../../utils/guid";
import useCurrentSlots from "../../customHooks/useCurrentSlots";

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

  useEffect(() => {
    setDeviceInfo();
    const onDuplexMessage = (message: any) => {
      if (message?.type === "DeviceDeleted") {
        const { payload: { deviceId = "" } = {} } = message;
        if (deviceId === GLOBALS.deviceInfo.deviceId) {
          // logout
          const resetStore = resetAuthData();
          updateStore(resetStore);
          resetCaches();
          GLOBALS.rootNavigation.replace(Routes.ShortCode);
        }
      }
    };
    // proper way of adding handler
    currentContext.addOnDuplexMessageHandlers([
      ...currentContext.onDuplexMessageHandlers,
      onDuplexMessage,
    ]);
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
          initUdls();
          // await setLiveData();
          setDefaultStore(storeResults?.data?.data, data?.data);
          setGlobalData(data?.data);
          connectDuplex(currentContext.duplexMessage);
          setLoading(false);
          getMoviesAndTvShow();
          props.navigation.replace(Routes.WhoIsWatching);
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
    const deviceID = await DeviceInfo.getUniqueId;
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
      pivots: "LicenseWindow|Trending",
    });
    const TVShow = await getTVShows("", {
      pivots: "LicenseWindow|Trending",
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
    GLOBALS.moviesAndTvShows = [
      { TVShow: massagedTVData },
      { Movie: massagedMovieData },
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
