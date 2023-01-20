import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageBackground, StyleSheet, View } from "react-native";
import MFText from "../../../../components/MFText";
import { browseType, ItemShowType } from "../../../../utils/analytics/consts";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";
import { getIdFromURI } from "../../../../utils/helpers";
import { getUIdef } from "../../../../utils/uidefinition";
import BrowseCategoryCarousel from "./CategoryCarousel";
import LinearGradient from "react-native-linear-gradient";
import { AppImages } from "../../../../assets/images";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../../utils/globals";
import { MFTabBarStyles } from "../../../../components/MFTabBar/MFTabBarStyles";
import MFLoader from "../../../../components/MFLoader";

interface BrowseCategoryProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const BrowseCategoryScreen: React.FunctionComponent<BrowseCategoryProps> = (
  props
) => {
  const [feedDispatch, setFeedDispatch] = useState<any>();
  const [isFeedDispatchSet, updateIsFeedDispatchSet] = useState(false);
  const { feed } = props.route.params;
  const [top, setTop] = useState(16);
  const [skip, setSkip] = useState(0);

  const browsePageConfig: any = getUIdef("BrowseCategory")?.config;
  let requestedTime: Date | undefined;

  const browseFeedParams = (props: any): any => {
    const { feed } = props.route?.params;
    const browseFeed = { ...feed };
    let browseFeedObject;
    const navigationTargetUri = feed.NavigationTargetUri?.split("?")[0];
    console.log("navigationTargetUri", navigationTargetUri);
    if (feed?.ItemType === ItemShowType.SvodPackage) {
      browseFeedObject = browsePageConfig[ItemShowType.browseSvodPackage];
    } else {
      browseFeedObject = browsePageConfig[navigationTargetUri];
    }
    if (browseFeedObject) {
      let pivots = feed.NavigationTargetUri?.split("?")[1] || undefined;
      if (pivots) {
        pivots = pivots?.replace("=", "|");
      }
      if (browseFeedObject.params && browseFeedObject.params?.baseFilters) {
        pivots = pivots
          ? pivots?.concat(",", browseFeedObject.params?.baseFilters)
          : browseFeedObject.params?.baseFilters;
      }
      if (navigationTargetUri === browseType.restartTv) {
        browseFeed["Uri"] = `${browseFeedObject.uri}${getIdFromURI(feed?.Uri)}`;
      } else {
        browseFeed["Uri"] = browseFeedObject.uri;
      }

      browseFeed["requestedTime"] = requestedTime;
      browseFeed["libraryId"] = browseFeedObject.params.libraryId;
      browseFeed["pivotGroup"] = browseFeedObject.params.pivotGroup;
      browseFeed["pivots"] = pivots && pivots;
      browseFeed["$top"] = browseFeedObject.params.$top;
      browseFeed["$itemsPerRow"] = browseFeedObject.params.$itemsPerRow;
      browseFeed["$skip"] = browseFeedObject.params.$skip;
      browseFeed["client"] = browseFeedObject.params.client;
      return browseFeed;
    } else {
      return undefined;
    }
  };
  useEffect(() => {
    const browseFeed = browseFeedParams(props);
    updateIsFeedDispatchSet(true);
    console.log("BrowsePageConfig", browseFeed);
    const feedDispatch = browseFeed
      ? `${browseFeed.Uri}/?id=${browseFeed.Id}&$top=${top}&skip=${skip}storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${browseFeed.pivots}`
      : null;
    setFeedDispatch(feedDispatch);
  }, []);
  return (
    <View style={[styles.root]}>
      <ImageBackground
        source={AppImages.landing_background}
        style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}
      >
        <LinearGradient
          colors={[
            "rgba(0, 3, 14, 1)",
            "rgba(0, 3, 14, 0.8)",
            "rgba(0, 3, 14, 0.6)",
            "rgba(0,7,32,0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
          locations={[0.2, 0.7, 0.8, 1]}
        >
          <View style={styles.topRow}>
            <View style={styles.titleContainerStyles}>
              <MFText
                shouldRenderText
                displayText={feed.Name}
                textStyle={styles.titleTextStyle}
              />
            </View>
          </View>
          <View style={styles.contentContainerStyles}>
            {feedDispatch !== null &&
            feedDispatch !== undefined &&
            feedDispatch.length > 0 ? (
              <BrowseCategoryCarousel
                feedDispatch={feedDispatch}
                navigation={props.navigation}
              />
            ) : isFeedDispatchSet ? (
              <MFText
                shouldRenderText
                displayText="Couldn't fetch feeds from provided feed information"
                textStyle={[
                  MFTabBarStyles.tabBarItemText,
                  { alignSelf: "center", color: "white", marginTop: 5 },
                ]}
              />
            ) : (
              <MFLoader />
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export const styles = StyleSheet.create({
  root: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#00030E",
    flexDirection: "column",
    paddingBottom: 300,
  },
  topRow: {
    width: SCREEN_WIDTH,
    height: 120,
    borderBottomColor: "#424242",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  contentContainerStyles: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleTextStyle: {
    color: "#EEEEEE",
    height: 55,
    width: 261,
    fontFamily: "Inter-Regular",
    fontSize: 38,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 55,
    marginLeft: 88,
  },
  titleContainerStyles: {
    flex: 0.8,
    justifyContent: "center",
  },
});

export default BrowseCategoryScreen;
