import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { Feed } from "../../../@types/HubsResponse";
import { AppImages } from "../../../assets/images";
import MFText from "../../../components/MFText";
import { getMetadataLine2 } from "../../../utils/assetUtils";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../utils/dimensions";
import {
  getImageUri,
  metadataSeparator,
} from "../../../utils/Subscriber.utils";
import { getUIdef, scaleAttributes } from "../../../utils/uidefinition";
import { globalStyles as g } from "../../../config/styles/GlobalStyles";
import { PageContainer } from "../../../components/PageContainer";
import { getItemId } from "../../../utils/dataUtils";
import { getFontIcon } from "../../../config/strings";
import {
  assetTypeObject,
  ContentType,
  fontIconsObject,
  languageKey,
} from "../../../utils/analytics/consts";
import { Genre } from "../../../utils/common";
import { useQuery } from "react-query";
import { defaultQueryOptions } from "../../../config/constants";
import { DefaultStore } from "../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../utils/globals";
import { getDataFromUDL } from "../../../../backend";

interface AssetData {
  id: string;
  assetType: {
    contentType: string;
    itemType: string;
    sourceType: string;
  };
  $top: number;
  $skip: number;
  pivots: string;
  contentTypeEnum: number;
}

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const DetailsScreen: React.FunctionComponent<DetailsScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;

  let scrollViewRef: any = React.createRef<ScrollView>();

  const onGetScrollView = (scrolViewRef: ScrollView | null): void => {
    scrollViewRef = scrolViewRef;
  };
  const updateAssetData = () => {
    //@ts-ignore
    const assetType = feed?.assetType!;
    const id = getItemId(feed);
    const language = languageKey.language + "en";

    return {
      id,
      assetType,
      $top: 10,
      $skip: 0,
      pivots: language,
      contentTypeEnum:
        assetTypeObject[assetType.contentType] ||
        assetTypeObject[ContentType.PROGRAM],
    };
  };
  let assetData: AssetData = updateAssetData();
  console.log(
    "feed info",
    feed,
    getImageUri(feed, "3x4/Poster"),
    getItemId(feed),
    assetData
  );

  const getSimilarItemsForFeed = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${assetData.pivots}&id=${id}&itemType=${assetData.contentTypeEnum}`;
    const udlParam = "udl://subscriber/similarprograms/" + params;
    const data = await getDataFromUDL(udlParam);
    console.log(data);
    return data;
  };

  const getDiscoveryProgramData = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${assetData.pivots}&id=${id}`;
    const udlParam = "udl://discovery/programs/" + params;
    const data = await getDataFromUDL(udlParam);
    console.log(data);
    return data;
  };

  const getGenreText = (genres?: Genre[]) =>
    genres &&
    genres.map(
      (genre, index) =>
        `${genre.Name}${index === genres.length - 1 ? "" : metadataSeparator}`
    );

  const similarDataQuery = useQuery(
    ["get-similarItems", assetData?.id],
    () => getSimilarItemsForFeed(assetData),
    defaultQueryOptions
  );
  useEffect(() => {}, []);

  const renderRatingValues = () => {
    //@ts-ignore
    const [first, second] = feed!.ratingValues || [];
    return (
      <View style={styles.contentRatingsContainer}>
        {first && (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingsIcon}
              source={{
                uri: first.Image,
              }}
            />
            <Text
              style={[styles.metadataLine1, styles.contentRatingText]}
            >{`${first.Score}%`}</Text>
          </View>
        )}
        {second && (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingsIcon}
              source={{
                uri: second.Image,
              }}
            />

            <Text
              style={[styles.metadataLine1, styles.contentRatingText]}
            >{`${second.Score}%`}</Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={AppImages.landing_background}
        style={styles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={styles.containerOpacity}>
          <ScrollView key={`detailspagekey`} ref={onGetScrollView}>
            <View style={styles.detailsBlock}>
              <Text style={{ color: "white", fontSize: 50 }}>
                {getFontIcon((fontIconsObject as any)["quality_4k"])}
              </Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </PageContainer>
  );
};

const styles = StyleSheet.create(
  getUIdef("Details.Showcard")?.style ||
    scaleAttributes({
      detailsBlock: {
        height: 852,
        flexDirection: "row",
      },
      secondBlock: {
        marginTop: 86,
        flexDirection: "column",
        flex: 1,
        height: 627,
      },
      flexRow: {
        flexDirection: "row",
      },
      ctaBlock: {
        flexDirection: "row",
      },
      favoriteBlock: {
        width: 583,
        marginTop: 69,
      },
      ctaButtonGroupBlock: {
        marginTop: 69,
      },
      containerOpacity: {
        backgroundColor: g.backgroundColors.shade1,
        opacity: 0.9,
      },
      firstColumn: {
        width: 583,
        alignItems: "center",
      },
      imageContainer: {
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 86,
        height: 627,
      },
      secondColumn: {
        width: 905,
        height: 627,
        justifyContent: "center",
      },
      thirdColumn: {
        flex: 1,
        paddingRight: 90,
        alignItems: "flex-end",
      },
      networkImageView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: g.backgroundColors.shade3,
        borderRadius: 3,
        height: 111,
        width: 111,
        padding: 25,
        marginBottom: 15,
      },
      networkImage: {
        height: 63,
        width: 85,
        resizeMode: "contain",
      },
      marginRight20: {
        marginRight: 20,
      },
      networkTitle: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body1,
        color: g.fontColors.darkGrey,
      },
      metadataContainer: {
        flexDirection: "row",
        paddingBottom: 23,
      },
      title: {
        fontFamily: g.fontFamily.bold,
        fontSize: g.fontSizes.heading2,
        color: g.fontColors.light,
        paddingBottom: 10,
      },
      hourGlass: {
        width: 16,
        height: 22,
        marginTop: 26,
        marginLeft: 15,
      },
      metadataLine1: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        marginBottom: 25,
      },
      description: {
        fontFamily: g.fontFamily.regular,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        lineHeight: g.lineHeights.body2,
      },
      showcardImage: {
        height: 628,
        width: 419,
      },
      buttonContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonIconContainer: {
        borderRadius: 35,
        width: 70,
        height: 70,
        overflow: "hidden",
        backgroundColor: g.backgroundColors.shade4,
      },
      solidBackground: {
        backgroundColor: g.backgroundColors.shade4,
      },
      moreDetailsContainer: {
        marginTop: 104,
      },
      contentRatingsContainer: {
        flexDirection: "row",
        marginBottom: 25,
      },
      contentRatingsIcon: {
        width: 30,
        height: 30,
      },
      contentRatingText: {
        marginLeft: 10,
      },
      ratingBlock: {
        marginRight: 30,
        flexDirection: "row",
      },
      textStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.light,
      },
      progressBarContainer: {
        height: 3,
      },
      progressInfoText: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        paddingBottom: 30,
        lineHeight: g.lineHeights.body2,
        marginBottom: 20,
      },
      statusTextStyle: {
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.regular,
        color: g.fontColors.statusWarning,
        marginBottom: 25,
      },
      fontIconStyle: {
        fontFamily: g.fontFamily.icons,
        fontSize: 70,
        color: g.fontColors.lightGrey,
        marginRight: 15,
        marginTop: -40,
        marginBottom: 10,
      },
      flexOne: {
        flex: 1,
      },
      ctaButtonStyle: {
        height: 66,
        fontFamily: g.fontFamily.semiBold,
      },
      ctaFontIconStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.statusError,
      },
      buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 40,
      },
      modalContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
      },
      episodeBlockContainer: {
        marginTop: 35.5,
      },
      episodeBlockTitle: {
        marginBottom: 20,
        fontSize: g.fontSizes.body1,
        fontFamily: g.fontFamily.bold,
        color: g.fontColors.light,
      },
      episodeMetadata: {
        marginBottom: 20,
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.semiBold,
        color: g.fontColors.lightGrey,
      },
      badgeStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.badge,
        fontSize: 50,
        marginLeft: 20,
        marginTop: -10,
      },
      marginTop: {
        marginTop: 8,
      },
    })
);

export default DetailsScreen;
