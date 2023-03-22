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
  // {
  //   title: "Save",
  //   action: "",
  //   icon: AppImages.Save_ic,
  // },
  // {
  //   title: "Delete",
  //   action: "",
  //   icon: AppImages.Delete_ic,
  // },
  // {
  //   title: "More Info",
  //   action: "",
  //   icon: AppImages.More_info_ic,
  // },
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

  console.log("props in long press", props.data);
  // const deleteDvrListOrItem = (item: any) => {
  //   setState({
  //     isDeleted: true,
  //   });
  //   let RecordingsToDelete: any = [];
  //   let obj = {
  //     SubscriptionId: item?.SubscriptionId,
  //     SubscriptionItemIds: [item?.Id],
  //     isSeries: false,
  //   };
  //   RecordingsToDelete.push(obj);

  //   props
  //     .deleteRequest({
  //       RecordingsToDelete,
  //     })
  //     .then(() => {
  //       props.getViewableRecordings().then(() => {
  //         setupData();
  //       });
  //     });
  // };

  // const cancelDvrButton = () => {
  //   if (focuszoneRef?.current) {
  //     FocusManager.focus(focuszoneRef?.current);
  //   }
  // };

  // const onPressPlayDVR = (item: any) => {
  //   const channel = findChannelByStationId(
  //     item.StationId,
  //     undefined,
  //     undefined,
  //     props.channelMap
  //   );

  //   const channelInfo = {
  //     Schedule: { ...item }, // to avoid cyclic error in json.stingify used in Video.tsx
  //     Channel: channel,
  //     Service: props.channelMap?.getService(channel?.channel),
  //   };

  //   item["ChannelInfo"] = channelInfo;
  //   (item["assetType"] = generateType(item, SourceType.DVR)),
  //     isPconBlocked(item?.ProgramDetails, props.locale?.full).then(
  //       (isBlocked) => {
  //         if (isBlocked) {
  //           props.navigation.pushRoute("PconDisplay", {
  //             data: item,
  //             onSuccess: playDvr,
  //             pinType: PinType.content,
  //           });
  //         } else {
  //           playDvr(item);
  //         }
  //       }
  //     );
  // };

  const onPressSave = (item: any) => {
    if (item?.Settings) {
      item.Settings.RecyclingDisabled = !item?.Settings?.RecyclingDisabled;
      Alert.alert("To DO Save recording action");
      // props.saveRecordRequest(item?.Id, item?.Settings).then(() => {
      //   props.getViewableRecordings().then(() => {
      //     setupData();
      //   });
      // });
    }
  };

  const onPressMoreInfo = (item: any, isTitle = false) => {
    props.toggleMoreInfo();
    // item.ProgramDetails["description"] =
    //   item?.ProgramDetails?.Description || "";
    // if (isTitle) {
    //   item.ProgramDetails["title"] = item?.ProgramDetails?.Title || "";
    // }
    // Alert.alert("To DO more info action");
    // props.openMoreInfo(true, SideMenuRoutes.MoreInfo, {
    //   udpData: item?.ProgramDetails,
    //   genres: item?.ProgramDetails?.Genres,
    // });
  };

  const deleteDvrPopUp = (item: any) => {
    Alert.alert("To DO Delete action");
    // displayModal({
    //   text: global.lStrings?.str_dvr_delete_warning,
    //   defaultFocusTitle: global.lStrings?.str_profile_button_cancel,
    //   buttonDataSource: [
    //     {
    //       title: global.lStrings?.str_profile_button_delete,
    //       onPress: () => {
    //         deleteDvrListOrItem(item);
    //       },
    //     },
    //     {
    //       title: global.lStrings?.str_profile_button_cancel,
    //       onPress: cancelDvrButton,
    //     },
    //   ],
    // });
  };

  // const editRecording = (subscriptionItem: any) => {
  //   subscriptionItem.Settings.StartUtc =
  //     subscriptionItem.ActualAvailabilityStartUtc;
  //   subscriptionItem.Settings.StationId = subscriptionItem.StationId;
  //   props.setRecordingData(subscriptionItem);
  //   props.toggleSideMenu(true, SideMenuRoutes.DvrRecordingOptions, {
  //     isNew: false,
  //     isSeries: false,
  //     title:
  //       subscriptionItem.ProgramDetails.EpisodeTitle ||
  //       subscriptionItem.ProgramDetails.Title,
  //     programId: subscriptionItem.ProgramId,
  //     isSubscriptionItem: true,
  //     onUpdate: setupData,
  //     isPopupModal: true,
  //   });
  // };

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
    // const entitlements = removeEntitlementsAbbreviationsAndSort(
    //   item.PlayInfo[0].Entitlements
    // );
    let ipStatus = props.account?.ClientIpStatus || {};
    if (!config.inhomeDetection.useSubscriberInHome) {
      // networkIHD data
      const inHomeValue =
        props.networkIHD?.status === "inHome" ||
        config.inhomeDetection.inHomeDefault;
      ipStatus["InHome"] = inHomeValue
        ? RestrictionValue.Yes
        : RestrictionValue.No;
    }
    const ctaButtonList = [];
    if (item.itemType === ItemShowType.DvrRecording) {
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
        text: AppStrings?.str_details_cta_more_info,
        icon: infoIcon,
        onPress: () => onPressMoreInfo(item),
      });
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_profile_button_delete,
        icon: deleteIcon,
        onPress: () => deleteDvrPopUp(item),
      });
    } else {
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_app_edit,
        icon: editIcon,
        onPress: () => {
          Alert.alert("Implementation missing");
          // editRecording(item),
        },
      });
      ctaButtonList.push({
        type: "TextIcon",
        text: AppStrings?.str_details_cta_more_info,
        icon: infoIcon,
        onPress: () => onPressMoreInfo(item, true),
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
            // <MFButton
            //   key={`ctaBtn_${item.txext}_${index}`}
            //   // ref={index === 0 ? firstCtaButtonRef : null}
            //   focusable
            //   iconSource={0}
            //   // hasTVPreferredFocus={swimLaneFocused && index === 0}
            //   imageSource={0}
            //   avatarSource={undefined}
            //   onFocus={() => {
            //     // setOpen(false);
            //     // drawerRef.current.close();
            //     // drawerRef.current.resetRoutes();
            //   }}
            //   variant={MFButtonVariant.FontIcon}
            //   fontIconSource={item.icon}
            //   textLabel={item.text}
            //   fontIconTextStyle={StyleSheet.flatten([
            //     styles.textStyle,
            //     {
            //       fontSize: 90,
            //       color: item.buttonText?.includes("Record")
            //         ? globalStyles.fontColors.badge
            //         : "white",
            //     },
            //   ])}
            //   onPress={item.onPress}
            //   textStyle={
            //     [
            //       styles.listText,
            //       { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
            //     ]
            //     //   {
            //     //   color: "#EEEEEE",
            //     //   fontFamily: "Inter-SemiBold",
            //     //   fontSize: 25,
            //     //   fontWeight: "600",
            //     //   textAlign: "center",
            //     //   marginLeft: 21,
            //     // }
            //   }
            //   style={{
            //     height: 62,
            //     alignSelf: "center",
            //     padding: 12,
            //     backgroundColor: "#424242",
            //     borderRadius: 6,
            //     paddingHorizontal: 35,
            //     zIndex: 100,
            //   }}
            //   focusedStyle={styles.focusedUnderLine}
            //   fontIconProps={{
            //     iconPlacement: "Left",
            //     shouldRenderImage: true,
            //   }}
            // />
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
