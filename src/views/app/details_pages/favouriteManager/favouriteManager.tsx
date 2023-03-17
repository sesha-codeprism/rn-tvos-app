import {
  Alert,
  FlatList,
  ImageBackground,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  invalidateQueryBasedOnSpecificKeys,
  queryClient,
} from "../../../../config/queries";
import { PageContainer } from "../../../../components/PageContainer";
import { AppImages } from "../../../../assets/images";
import { SCREEN_WIDTH } from "../../../../utils/dimensions";
import MFSwimLane from "../../../../components/MFSwimLane";
import { AppStrings } from "../../../../config/strings";
import FastImage from "react-native-fast-image";
import { getImageUri } from "../../../../utils/Subscriber.utils";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { unpinItem } from "../../../../../backend/subscriber/subscriber";
import NotificationType from "../../../../@types/NotificationType";
import { getItemId } from "../../../../utils/dataUtils";
import { Feed } from "../../../../@types/HubsResponse";
import { ContentType } from "../../../../utils/common";
import { GLOBALS } from "../../../../utils/globals";
import { DuplexManager } from "../../../../modules/duplex/DuplexManager";
import {
  assetTypeObject,
  itemTypeString,
} from "../../../../utils/analytics/consts";
import { PinnedItemType } from "../../../../utils/pinnedItemType";
interface FavouriteManagerProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}
const FavouriteManagerScreen = (props: FavouriteManagerProps) => {
  const [favList, setFevList] = useState<any>([]);
  const [currentFavItem, setCurrentFavItem] = useState<any>({ Id: undefined });
  const [unfevFavFocus, setUnfevFavFocus] = useState<any>(false);

  const duplexManager: DuplexManager = DuplexManager.getInstance();
  console.log("props.route.params.feed in fav manager", props.route.params);

  const getItemPinned = () => {
    const pinnedItems = queryClient.getQueryData([
      "feed",
      "udl://subscriber/library/Pins",
    ]);
    setFevList(pinnedItems);
    console.log("pinnedItems in fav list:", pinnedItems);
  };
  useEffect(() => {
    getItemPinned();
  }, []);
  const handleFavFocus = (item: any) => {
    console.log("Current focussed item", item);
    setCurrentFavItem(item);
    setUnfevFavFocus(false);
  };

  const handleUnfav = async () => {
    let assetId = getItemId(currentFavItem);
    let assetType: any =
      itemTypeString[assetTypeObject[currentFavItem.assetType.contentType]];
    console.log("assetId", assetId, "assetType", assetType);
    const resp = await unpinItem(assetId, assetType);

    if (resp.status >= 200 && resp.status <= 300) {
      // setIsItemPinned(false);
      duplexManager.sendOrEnqueueMessage(NotificationType.unpin, {
        id: assetId,
        isPinned: false,
        itemType: assetId,
      });
      invalidateQueryBasedOnSpecificKeys(
        "feed",
        "udl://subscriber/library/Pins"
      );
      setTimeout(() => {
        getItemPinned();
      }, 500);
    } else {
      Alert.alert("Something went wrong");
    }
  };

  const renderFavListItem = (data: any) => {
    console.log("data inside render item", data);
    const { item, index } = data;
    const statusText = item?.statusText || "";
    const imageSource =
      getImageUri(item?.CatalogInfo, "16x9/Poster") ||
      getImageUri(item?.CatalogInfo, "16x9/KeyArt") ||
      AppImages.bgPlaceholder;

    return (
      <View
        style={{
          flexDirection: "row",
          // width: "100%",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onFocus={() => {
            handleFavFocus(item);
          }}
          onPress={() => {}}
          disabled={item?.Id === currentFavItem?.Id}
          hasTVPreferredFocus={index === 0}
          // focusable={currentEpisode?.ProgramId !== episode?.Program?.id}
          // ref={index === 0 ? firstEpisodeRef : undefined}
          style={
            item.Id === currentFavItem.Id && !unfevFavFocus
              ? { ...styles.itemShowcard, backgroundColor: "#E05153" }
              : styles.itemShowcard
          }
        >
          <FastImage
            //@ts-ignore
            source={imageSource}
            style={styles.itemImage}
            fallback
            defaultSource={AppImages.bgPlaceholder}
          />
          <View style={[styles.itemInfo, { flexShrink: 1 }]}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text
              style={
                item.Id === currentFavItem.Id && !unfevFavFocus
                  ? { ...styles.itemMetadata, color: "#EEEEEE" }
                  : styles.itemMetadata
              }
            >
              {item.metadataLine2}
            </Text>
            {/* <Text style={styles.itemDescription} numberOfLines={2}>
            {Description}
          </Text> */}
            {currentFavItem?.Id === item?.Id && (
              <Text
                style={
                  currentFavItem?.Id === item?.Id && !unfevFavFocus
                    ? { ...styles.statusTextStyle, color: "#EEEEEE" }
                    : styles.statusTextStyle
                }
                numberOfLines={2}
              >
                {statusText}
              </Text>
            )}
          </View>
        </Pressable>
        {item.Id === currentFavItem.Id && (
          <Pressable
            onFocus={() => {
              setUnfevFavFocus(true);
            }}
            onPress={() => {
              handleUnfav();
            }}
            style={
              unfevFavFocus
                ? {
                    ...styles.unFavBtn,
                    backgroundColor: "#E05153",
                  }
                : styles.unFavBtn
            }
          >
            <Text
              style={
                unfevFavFocus
                  ? {
                      ...styles.unFavText,
                      color: "#EEEEEE",
                    }
                  : styles.unFavText
              }
            >
              Unfavorite
            </Text>
          </Pressable>
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
        <View style={styles.backgroundPosterStyle}>
          <View style={styles.header}>
            <View style={styles.titlePadding}>
              <Text style={styles.title}>My List</Text>
            </View>

            <View style={styles.headerUnderLine} />
          </View>

          <View style={styles.favList}>
            <FlatList
              data={favList}
              keyExtractor={(x, i) => i.toString()}
              // ItemSeparatorComponent={(x, i) => (
              //   <View
              //     style={{
              //       backgroundColor: "transparent",
              //       height: 5,
              //       width: SCREEN_WIDTH,
              //     }}
              //   />
              // )}
              renderItem={
                ({ item, index }) => {
                  return renderFavListItem({ item, index });
                }
                // return (
                //   <MFSwimLane
                //     ref={index === 0 ? firstCardRef : null}
                //     key={index}
                //     //@ts-ignore
                //     feed={{ Name: "All Recordings" }}
                //     data={favList}
                //     limitSwimlaneItemsTo={10}
                //     swimLaneKey={swimLaneKey}
                //     updateSwimLaneKey={updateSwimLaneKey}
                //     cardStyle={"16x9"}
                //     onPress={(event) => {
                //       console.log("event", event);
                //     }}
                //     onFocus={() => {
                //       setTimeout(() => {
                //         setSwimLaneFocused(true);
                //       }, 500);
                //     }}
                //   />
                // );
              }
            />
          </View>
        </View>
      </ImageBackground>
    </PageContainer>
  );
};

export default FavouriteManagerScreen;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  header: {
    width: "100%",
  },
  backgroundPosterStyle: {
    backgroundColor: "#00030E",
    opacity: 0.9,
    height: "100%",
    width: "100%",
  },
  titlePadding: {
    paddingLeft: 88,
    paddingBottom: 20,
    paddingTop: 40,
  },

  title: {
    fontSize: 38,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 55,
    color: "#FFFFFF",
  },
  headerUnderLine: {
    width: 1920,
    opacity: 0.4,
    height: 1,
    borderWidth: 0.4,
    borderColor: "#A0A0A0",
    backgroundColor: "#A0A0A0",
    alignSelf: "center",
  },
  favList: {
    width: "70%",
    height: "100%",
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 25,
    paddingBottom:200,
  },
  itemShowcard: {
    flexDirection: "row",
    height: 143,
    width: 943,
    borderRadius: 6,
    marginTop: 23,
    backgroundColor: "#202124",
    // opacity:.8
  },

  itemImage: {
    height: 143,
    width: 256,
    marginRight: 30,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  itemInfo: {
    height: 143,
    justifyContent: "center",
    flex: 1,
    // paddingLeft: 25,
    // paddingRight: 25,
  },
  itemTitle: {
    color: "#EEEEEE",
    fontSize: 31,
    lineHeight: 50,
    fontWeight: "bold",
  },
  itemMetadata: {
    color: "#A7A7A7",
    fontSize: 25,
    lineHeight: 38,
    fontWeight: "bold",
  },
  itemDescription: {
    color: "#6D6D6D",
    fontSize: 25,
    lineHeight: 38,
  },
  statusTextStyle: {
    color: globalStyles.fontColors.statusWarning,
    fontFamily: globalStyles.fontFamily.regular,
  },
  unFavBtn: {
    height: 62,
    width: 187,
    borderRadius: 6,
    marginLeft: 23,
    backgroundColor: "#424242",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  unFavText: {
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
  },
});