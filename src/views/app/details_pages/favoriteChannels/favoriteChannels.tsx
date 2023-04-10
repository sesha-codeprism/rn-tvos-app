import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PageContainer } from "../../../../components/PageContainer";
import { AppImages } from "../../../../assets/images";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import {
  pinItem,
  unpinItem,
} from "../../../../../backend/subscriber/subscriber";
import NotificationType from "../../../../@types/NotificationType";
import { GLOBALS } from "../../../../utils/globals";
import { DuplexManager } from "../../../../modules/duplex/DuplexManager";
import { getDataFromUDL } from "../../../../../backend";
import _, { cloneDeep } from "lodash";
import { useQuery } from "react-query";
import { GlobalContext } from "../../../../contexts/globalContext";
import { IChannel } from "../../../../utils/live/live";
import { PinnedItemType } from "../../../../utils/pinnedItemType";
import MFEventEmitter from "../../../../utils/MFEventEmitter";

interface FavouriteManagerProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}
const FavoriteChannelsScreen = (props: FavouriteManagerProps) => {
  const favoriteUnselected = getFontIcon("favorite_unselected");
  const favoriteSelected = getFontIcon("favorite_selected");
  const [favList, setFavList] = useState<any>([]);
  const [currentFavItem, setCurrentFavItem] = useState<any>({ Id: undefined });
  const [unfevFavFocus, setUnfevFavFocus] = useState<any>(false);
  const [channelMap, setChannelMap] = useState<any>({});
  const currentContext = useContext(GlobalContext);
  const udlParam = "udl://subscriber/getAllPinnedItems/?types=FavoriteChannel";
  const [favChannelCount, setFavChannelCount] = useState<any>(0);
  const { data: rawFavoriteChannels, isFetched, refetch } = useQuery(
    udlParam,
    () => getDataFromUDL(udlParam),
    { refetchOnMount: "always" }
  );

  // Reset the list on receiving the duplex call.
  const onDuplexMessage = (message: any) => {
    if (message?.type === NotificationType.pinUnpinChannel) {
      refetch();
    }
  };

  useEffect(() => {
    const favoriteChannelUpdatedSubscription = DeviceEventEmitter.addListener("FavoriteChannelUpdated", onDuplexMessage);
    return () => {
      favoriteChannelUpdatedSubscription.remove()
    }
  }, []);

  useEffect(() => {
    if (rawFavoriteChannels?.data) {
      initFavtoChannelMap(getChannelMap());
    }
  }, [isFetched, rawFavoriteChannels?.data]);

  useEffect(() => {
    if (channelMap) {
      setFavList(_.values(channelMap));
    }
  }, [channelMap]);

  const handleFavFocus = (item: any) => {
    setCurrentFavItem(item);
    setUnfevFavFocus(false);
  };

  const initFavtoChannelMap = (chanMap: any) => {
    if (chanMap) {
      rawFavoriteChannels?.data.forEach((element: any) => {
        if (element.Id) {
          chanMap[element.Id].isFavorite = true;
        }
      });
      setFavChannelCount(rawFavoriteChannels?.data.length);
      setChannelMap(chanMap);
    }
  };

  const getChannelMap = (): any => {
    var playableChannels: IChannel[] = GLOBALS.channelMap.filterChannels(
      (channel) =>
        !!channel.IsTif ||
        (channel.isSubscribed &&
          channel.isPermitted &&
          GLOBALS.channelMap.getService(channel) != null)
    );

    const clonedChannelmap =
      GLOBALS.channelMap && cloneDeep(playableChannels);
    const newChannelMap = clonedChannelmap.reduce(function (map, obj) {
      obj.isFavorite = false;
      map[obj.Number] = obj;
      return map;
    }, {});
    return newChannelMap;
  };

  const handleFav = async (data) => {
    let assetId = data.Number;
    const resp = await pinItem(assetId, PinnedItemType.FavoriteChannel);

    if (resp.status >= 200 && resp.status <= 300) {
      DuplexManager.getInstance().sendOrEnqueueMessage(NotificationType.pinUnpinChannel, {
        id: assetId,
        isPinned: true,
        itemType: PinnedItemType.FavoriteChannel,
      });
      const cloneChannelMap = { ...channelMap };
      cloneChannelMap[data.Number].isFavorite = true;
      setFavChannelCount(favChannelCount+1);
      setChannelMap(cloneChannelMap);
    } else {
      Alert.alert("Something went wrong");
    }
  };

  const handleUnfav = async (data) => {
    let assetId = data.Number;
    const resp = await unpinItem(assetId, PinnedItemType.FavoriteChannel);

    if (resp.status >= 200 && resp.status <= 300) {
      DuplexManager.getInstance().sendOrEnqueueMessage(NotificationType.pinUnpinChannel, {
        id: assetId,
        isPinned: false,
        itemType: PinnedItemType.FavoriteChannel,
      });
      const cloneChannelMap = { ...channelMap };
      cloneChannelMap[data.Number].isFavorite = false;
      setFavChannelCount(favChannelCount-1);
      setChannelMap(cloneChannelMap);
    } else {
      Alert.alert("Something went wrong");
    }
  };

  const onSelect = (data: any) => {
    if (data.isFavorite) {
      handleUnfav(data);
    } else {
      handleFav(data);
    }
  };

  const renderFavListItem = (data: any) => {
    const { item, index } = data;

    return (
      <View style={styles.itemContainer}>
        {/* TV preferrable properties.  */}
        <Pressable
          onFocus={() => {
            handleFavFocus(item);
          }}
          onPress={() => {
            onSelect(item);
          }}
          disabled={item?.Number === currentFavItem?.Number}
          hasTVPreferredFocus={index === 0}
          style={styles.itemShowcard}
        >
          {/* Channel Logo Container  */}
          <View style={{ ...styles.itemInfo, flex: 2, flexDirection: "row" }}>
            <View style={styles.channelNumberContainer}>
              <Text style={{ ...styles.itemTitle }}>{item.Number}</Text>
            </View>
            {/* Channel Logo */}
            <Image
              resizeMode="contain"
              style={{ width: 100, marginRight: 30 }}
              defaultSource={AppImages.defalut_channel_logo}
              source={{ uri: item.LogoUri || "/" }}
            />
          </View>

          <View
            style={
              item.Number === currentFavItem.Number && !unfevFavFocus
                ? {
                    ...styles.itemInfo,
                    ...styles.channelInfoContainer,
                    backgroundColor: "#E05153",
                  }
                : {
                    ...styles.itemInfo,
                    ...styles.channelInfoContainer,
                  }
            }
          >
            <View
              style={styles.channelName}
            >
              <Text style={styles.itemTitle}>{item.Name}</Text>
              <Text
                style={
                  item.Number === currentFavItem.Number && !unfevFavFocus
                    ? { ...styles.itemMetadata, color: "#EEEEEE" }
                    : styles.itemMetadata
                }
              >
                {item.StationType}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={styles.icon}>
                {item.isFavorite ? favoriteSelected : favoriteUnselected}
              </Text>
            </View>
          </View>
        </Pressable>
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
              <Text style={styles.title}>{AppStrings.str_guide_labels.favorite_channels}</Text>
            </View>

            <View style={styles.headerUnderLine} />
          </View>
          <View style={styles.favList}>
            <Text
              style={styles.favCount}
            >{`${favChannelCount || 0} Favorites`}</Text>
            <FlatList
              data={favList}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => {
                return renderFavListItem({ item, index });
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </PageContainer>
  );
};

export default FavoriteChannelsScreen;

const styles = StyleSheet.create({
  channelName: {
    alignItems: "flex-start",
    flex: 5,
    flexDirection: "column",
    justifyContent: "center",
  },
  channelInfoContainer: {
    flex: 6,
    flexDirection: "row",
  },
  channelNumberContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
  },
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
  icon: {
    fontSize: 80,
    fontFamily: globalStyles.fontFamily.icons,
    color: globalStyles.fontColors.light,
    textAlign: "center",
  },
  titlePadding: {
    paddingLeft: 88,
    paddingBottom: 10,
    paddingTop: 10,
  },

  title: {
    fontSize: 38,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 55,
    color: "#FFFFFF",
  },
  favCount: {
    width: "70%",
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 55,
    color: globalStyles.fontColors.lightGrey,
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
    paddingBottom: 200,
  },
  itemShowcard: {
    flexDirection: "row",
    height: 143,
    width: 943,
    borderRadius: 6,
    marginTop: 23,
  },
  itemInfo: {
    backgroundColor: "#202124",
    marginLeft: 2,
    borderRadius: 6,
    height: 143,
    justifyContent: "space-evenly",
    flex: 2,
    paddingLeft: 25,
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
});
