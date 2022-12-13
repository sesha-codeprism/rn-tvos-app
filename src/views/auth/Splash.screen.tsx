import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import AnimatedLottieView from "lottie-react-native";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { GLOBALS, landingInfo, resetAuthData } from "../../utils/globals";
import {
  processBootStrap,
} from "../../../backend/authentication/authentication";
import { initUdls } from "../../../backend";
import { Routes } from "../../config/navigation/RouterOutlet";
import { appUIDefinition } from "../../config/constants";
import { setDefaultStore } from "../../utils/DiscoveryUtils";
import { connectDuplex, setGlobalData } from "../../utils/splash/splash_utils";
import { getMovies, getTVShows } from "../../../backend/discovery/discovery";
import useBootstrap from "../../customHooks/useBootstrapData";
import { massageSubscriberFeed } from "../../utils/Subscriber.utils";
import { SourceType } from "../../utils/common";
import { updateStore } from "../../utils/helpers";
import { MFGlobalsConfig } from "../../../backend/configs/globals";


interface Props {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}
const { width, height } = Dimensions.get("window");
const SplashScreen: React.FunctionComponent<Props> = (props: Props) => {
  const bootstrapData = useBootstrap();
  const [navigateTo, bootstrapUrl, acessToken, response] = bootstrapData || {};
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDevice ] = useState("");


  useEffect(() => {
    setDeviceInfo();
  }, []);

  useEffect(() => {
    const {data, isSuccess, isError, error } = response || {};
    if(navigateTo === "NOTOKEN"){
     props.navigation.replace(Routes.ShortCode);
    }
    if(isError){
      const isTokenInvalidError: boolean = error.toString().includes("401");
      if (isTokenInvalidError) {
        let resetStore = resetAuthData();
        updateStore(resetStore);
        console.log("Token is invalid. Taking user to login again");
        props.navigation.replace(Routes.ShortCode);
      }
      setLoading(false);
    }
    if(isSuccess && data?.data && navigateTo === "NAVIGATEINNTOAPP" && bootstrapUrl && acessToken){
      processBootStrap(data?.data, "10ft").then(() => {
        setGlobalData(data?.data);
        setLoading(false);
        initUdls();
        setDefaultStore();
        connectDuplex();
        props.navigation.replace(Routes.WhoIsWatching);
      });
    }
  }, [response?.data, navigateTo, bootstrapUrl, acessToken])

  const _onAnimationFinish = () => {
  };

  const setDeviceInfo = async () => {
    const isEmulator: boolean = await DeviceInfo.isEmulator();
    if (isEmulator) {
      const deviceID = await DeviceInfo.getDeviceName();
      // GLOBALS.deviceInfo.deviceId = deviceID;
      // setDevice(GLOBALS.deviceInfo.deviceId);
      //If device is running on Emulator
      // Device info details on emulator are useless.. no need of setting values;
      return true;
    } else {
      // If device is running on real device
      const deviceID = DeviceInfo.getUniqueId();
      GLOBALS.deviceInfo.deviceId = deviceID;
      setDevice(GLOBALS.deviceInfo.deviceId);
      return true;
    }
  };
  const showAnimation = appUIDefinition.config.useLottieAnimationOnSplash;
  const getMoviesAndTvShow = async () => {
    console.log("getMoviesAndTvShow");
    const movies = await getMovies("", {
      pivots: "LicenseWindow",
    });
    const TVShow = await getTVShows("", {
      pivots: "LicenseWindow",
    });
    // GLOBALS.moviesAndTvShows =
    // console.log("movies", movies);
    // console.log("TVShow", TVShow);
    const massagedTVData = massageSubscriberFeed(
      {LibraryItems:TVShow.data.Items},
      "",
      SourceType.VOD
    );
    const massagedMovieData = massageSubscriberFeed(
      {LibraryItems:movies.data.Items},
      "",
      SourceType.VOD
    );
    console.log("movies", movies, "massagedMovieData", massagedMovieData);
    console.log("TVShow", TVShow, "massagedTVData", massagedTVData);
    GLOBALS.moviesAndTvShows = [
      { TVShow: massagedTVData },
      { Movie:  massagedMovieData },
    ];
  };
  // const { data, isLoading } = useQuery(
  //   "getMoviesAndTvShow",
  //   getMoviesAndTvShow,
  //   {
  //     cacheTime: appUIDefinition.config.queryCacheTime,
  //     staleTime: appUIDefinition.config.queryStaleTime,
  //   }
  // );
  // const setMoviesAndTvShow = () => {
  //   GLOBALS.moviesAndTvShows = data;
  // };
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
