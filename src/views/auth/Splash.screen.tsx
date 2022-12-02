import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/routers";
import AnimatedLottieView from "lottie-react-native";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Settings,
  Alert,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { GLOBALS, resetAuthData } from "../../utils/globals";
import { getStore, infoLog } from "../../utils/helpers";
import {
  getBootStrap,
  processBootStrap,
} from "../../../backend/authentication/authentication";
import { initUdls } from "../../../backend";
import { Routes } from "../../config/navigation/RouterOutlet";
import { appUIDefinition } from "../../config/constants";
import { duplex } from "../../modules/duplex";
import { generateGUID } from "../../utils/guid";
import { DefaultStore, setDefaultStore } from "../../utils/DiscoveryUtils";
import { connectDuplex, setGlobalData } from "../../utils/splash/splash_utils";
import { getMovies, getTVShows } from "../../../backend/discovery/discovery";

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}
const { width, height } = Dimensions.get("window");
const SplashScreen: React.FunctionComponent<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const testing: boolean = false;

  const checkStore = async () => {
    infoLog("checkStore INIT");
    /** IF-Else added for testing only */
    //TODO: Remove unrequired testing code
    if (__DEV__) {
      /** IF running debug build */
      if (testing) {
        /** IF testing some splash logic */
        console.log("Done");
      } else {
        /** IF not testing any splash logic */
        parseStoreAndNavigate();
      }
    } else {
      /** All other cases */
      parseStoreAndNavigate();
    }
  };

  const parseStoreAndNavigate = async () => {
    if (GLOBALS.store) {
      /** If localstore has some data.. parse and proceed to home; */
      if (GLOBALS.store.accessToken && GLOBALS.store.refreshToken) {
        //Token exists in persistent storage
        //TODO: Check for expiry time. IF token is valid -> Home else shortcode
        GLOBALS.userProfile = GLOBALS.store.userProfile;
        getBootStrap(GLOBALS.store.accessToken)
          .then(({ data }) => {
            processBootStrap(data, "10ft").then(() => {
              setGlobalData(data);
              setLoading(false);
              initUdls();
              setDefaultStore();
              connectDuplex();
              props.navigation.replace(Routes.WhoIsWatching);
            });
          })
          .catch((e) => {
            const isTokenInvalidError: boolean = e.toString().includes("401");
            if (isTokenInvalidError) {
              resetAuthData();
              console.log("Token is invalid. Taking user to login again");
              props.navigation.replace(Routes.ShortCode);
            }
            setLoading(false);
          });
      } else {
        //No Token in persistent storage
        props.navigation.replace(Routes.ShortCode);
      }
    } else {
      infoLog("No data to load...");
      props.navigation.replace(Routes.ShortCode);
      // props.navigation.replace('home');
    }
  };
  const _onAnimationFinish = () => {
    setDeviceInfo()
      .then((_) => {
        checkStore();
        getMoviesAndTvShow();
        // Alert.alert("Animation done");
      })
      .catch((e) => {
        console.log("Setting deice info failed..", e);
      });
  };

  const setDeviceInfo = async () => {
    const isEmulator: boolean = await DeviceInfo.isEmulator();
    if (isEmulator) {
      const deviceID = await DeviceInfo.getDeviceName();
      //If device is running on Emulator
      // Device info details on emulator are useless.. no need of setting values;
      return true;
    } else {
      // If device is running on real device
      const deviceID = DeviceInfo.getUniqueId();
      GLOBALS.deviceInfo.deviceId = deviceID;
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
    GLOBALS.moviesAndTvShows = [
      { TVShow: TVShow.data.Items },
      { Movie: movies.data.Items },
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
