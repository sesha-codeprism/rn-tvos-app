import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { AppStrings, getFontIcon } from "../../../config/strings";
import { AppImages } from "../../../assets/images";
import {
  findChannelByStationId,
  isInHome,
  removeEntitlementsAbbreviationsAndSort,
} from "../../../utils/assetUtils";
import { RestrictionValue } from "../../../utils/analytics/consts";
import { ItemShowType, SourceType } from "../../../utils/common";
import { config } from "../../../config/config";
import { generateType } from "../../../utils/Subscriber.utils";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import { ISubscriptionSetting } from "../../../utils/DVRUtils";
import { GLOBALS } from "../../../utils/globals";
import axios from "axios";
import {
  IBatchDeleteRequest,
  IRecordingToDelete,
} from "../../../@types/subscriptionGroup";
interface Props {
  data: any;
  toggleMoreInfo?: any;
}
const menuItems = [
  {
    type: "TextIcon",
    icon: AppImages.Play_ic,
    text: AppStrings.str_details_cta_playdvr,
    onPress: () => {},
  },
  
];
const deleteIcon = AppImages.Delete_ic; // getFontIcon("delete");
const editIcon = AppImages.More_info_ic; // getFontIcon("edit");
const infoIcon = AppImages.More_info_ic; //getFontIcon("info");
const playIcon = AppImages.Play_ic;
const savedIcon = AppImages.Save_ic; // getFontIcon("dvr_saved");
const unSavedIcon = AppImages.Save_ic; // getFontIcon("dvr_unsaved");

export default function LongPressMenu(props: any) {
  const [focused, setFocused] = useState<any>(0);
  const [listItems, setListItems] = useState(menuItems);

  const onPressSave = (item: any) => {
    console.log("onPressSave", item);
    const id: string = item.UniversalProgramId || item.Id;
    
    const serviceMap = GLOBALS.bootstrapSelectors?.ServiceMap.Services; //bootstrapBootstrapSelectors.serviceMap(getState());
    if (!serviceMap) {
      throw "No serviceMap or axios instance.";
    }
    return axios
      .put(
        `${serviceMap.dvr}v1/scheduled-items/${id}/settings`,
        item.dvrSetting
      )
      .then((response: any) => {
        console.log("response coming in save item", response);
        if (response?.data?.State === "Completed") {
        }
      })
      .catch((err: any) => {
        console.log("POST METHOD ERROR: ", err);
      });
  };

 

  const deleteDvrPopUp = (item: any) => {
    Alert.alert(AppStrings?.str_dvr_delete_warning, "", [
      {
        text: AppStrings?.str_profile_button_delete,
        onPress: () => {
          deleteRecording(item);
        },
      },
      {
        text: AppStrings?.str_profile_button_cancel,
        onPress: () => {},
      },
    ]);

   
  };
  const deleteRecording = (item: any) => {
    console.log("item to delete", item);
    const { SeriesId, SeasonNumber, EpisodeNumber } =
      item?.ProgramDetails || {};
    const isSeries = !!(SeriesId || SeasonNumber || EpisodeNumber);
    const objRecorded: IRecordingToDelete = {
      SubscriptionId: item?.SubscriptionId,
      SubscriptionItemIds: [item?.Id || item.UniversalProgramId],
      isSeries: isSeries,
    };
    // const recordDetails: IBatchDeleteRequest = [[objRecorded]];

    const serviceMap = GLOBALS.bootstrapSelectors?.ServiceMap.Services; //bootstrapBootstrapSelectors.serviceMap(getState());
    // const axios = sdkConfigSelectors.api(getState());
    if (!serviceMap) {
      throw "No serviceMap or axios instance.";
    }
    return axios
      .post(`${serviceMap.dvr}v1/batch-delete-request`, [objRecorded])
      .then((response: any) => {
        if (response?.data?.State === "Completed") {
          // dispatch(initData.actionCreators.request());
        }
      })
      .catch((err: any) => {
        console.log("POST METHOD ERROR: ", err);
      });
  };
  
  // const playDvr = (item: any) => {
  //   item["playSource"] = sourceTypeString.DVR;
  //   let Bookmark = props.allRecordingBookmarks.find(
  //     (b: any) => b.RecordingId === item.Id
  //   );
  //   if (Bookmark) {
  //     props.navigation.pushRoute("VideoPlayer", {
  //       data: { ...item, Bookmark },
  //       id: item.ProgramId,
  //     });
  //   } else {
  //     const {
  //       Id,
  //       ProgramId,
  //       ScheduledRuntimeSeconds,
  //       ProgramDetails: { SeasonId = "" } = {},
  //     } = item || {};
  //     if (Id && ProgramId && ScheduledRuntimeSeconds) {
  //       const subscriptionGroup =
  //         props.viewableRecordings?.SubscriptionGroups?.find((sg: any) =>
  //           sg?.SubscriptionItems?.some((si: any) => si.Id === item.Id)
  //         );
  //       const { SeriesDetails: { SeriesId = "" } = {} } =
  //         subscriptionGroup || {};
  //       Bookmark = {
  //         SeriesId: SeriesId,
  //         RecordingId: Id,
  //         OriginalProgramId: ProgramId,
  //         TimeSeconds: 0,
  //         ProgramId: ProgramId,
  //         RuntimeSeconds: ScheduledRuntimeSeconds,
  //         SeasonId: SeasonId,
  //       };
  //       props.navigation.pushRoute("VideoPlayer", {
  //         data: { ...item, Bookmark },
  //         id: item.ProgramId,
  //       });
  //     } else {
  //       props.navigation.pushRoute("VideoPlayer", {
  //         data: item,
  //         id: item.ProgramId,
  //       });
  //     }
  //   }
  // };

  const getCtaButtons = (item: any) => {
    console.log("Item in get ctas", item);
    // const entitlements = removeEntitlementsAbbreviationsAndSort(
    //   item.PlayInfo[0].Entitlements
    // );
    // let ipStatus = props.account?.ClientIpStatus || {};
    // if (!config.inhomeDetection.useSubscriberInHome) {
    //   // networkIHD data
    //   const inHomeValue =
    //     props.networkIHD?.status === "inHome" ||
    //     config.inhomeDetection.inHomeDefault;
    //   ipStatus["InHome"] = inHomeValue
    //     ? RestrictionValue.Yes
    //     : RestrictionValue.No;
    // }
    const ctaButtonList = [];
    if (item.ItemType === ItemShowType.DvrRecording) {
      // if (
      //   item?.PlayInfo &&
      //   item.PlayInfo?.length &&
      //   isInHome(entitlements, ipStatus)
      // ) {
      //   ctaButtonList.push({
      //     type: "TextIcon",
      //     text: AppStrings?.str_details_cta_playdvr,
      //     icon: playIcon,
      //     onPress: () => {
      //       // onPressPlayDVR(item)
      //       Alert.alert('Implementation missing')
      //     },
      //   });
      // }
      ctaButtonList.push({
        type: "TextIcon",
        text: item?.Settings?.RecyclingDisabled
          ? AppStrings?.str_dvr_saved
          : AppStrings?.str_profile_button_save,
        icon: item?.Settings?.RecyclingDisabled ? savedIcon : unSavedIcon,
        onPress: () => onPressSave(item),
      });
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_profile_button_delete,
        icon: deleteIcon,
        onPress: () => deleteDvrPopUp(item),
      });
    }
    setListItems(ctaButtonList);
  };
  const getFormatedDate = (date: string) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "long" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };
  useEffect(() => {
    const buttons = getCtaButtons(props.data);
    console.log("cta buttons to render", buttons);
  }, []);
  return (
    <SideMenuLayout title={props.data.title} subTitle={props.data.episodeInfo}>
      {props.data.ItemState === "Recorded" ? (
        <Text style={styles.recordedText}>{`${
          AppStrings.str_recorded_on
        } ${getFormatedDate(props.data.ActualAvailabilityEndUtc)}`}</Text>
      ) : (
        <View />
      )}
      <FlatList
        data={listItems}
        keyExtractor={(item) => item.text}
        renderItem={({ item, index }) => {
          // console.log(item.title);
          return (
            <Pressable
              hasTVPreferredFocus={index === 0 ? true : false}
              onFocus={() => {
                setFocused(index);
              }}
              onPress={item.onPress}
              style={
                index === focused
                  ? {
                      ...styles.containerActive,
                      ...styles.btnContainer,
                    }
                  : styles.btnContainer
              }
              key={index}
              isTVSelectable={true}
            >
              <Image
                source={item.icon}
                style={{ width: 35, height: 35, marginRight: 26 }}
              />
              <Text
                style={[
                  styles.listText,
                  { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {item.text}
              </Text>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#202124",
  },
  root: {
    width: 714,
    height: "100%",
    backgroundColor: "#202124",
  },
  headerContainer: {
    width: "100%",
    height: 185,
    backgroundColor: "#00030E",
    padding: 50,
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    padding: 50,
    height: "90%",
  },
  content: {
    width: "100%",
    height: "100%",
  },
  titleText: {
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 55,
    color: "white",
  },
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
  },
  btnContainer: {
    width: "100%",
    height: 100,
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
    padding: 30,
    display: "flex",
    flexDirection: "row",
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
    shadowColor: "#0000006b",
    shadowOffset: {
      width: 6,
      height: 8,
    },
    shadowOpacity: 0.42,
    shadowRadius: 4.65,
    elevation: 8,
  },
  recordedText: {
    color: "#A7A7A7",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 31,
    marginBottom: 31,
    marginLeft: 10,
  },
});
