import React, { useState } from "react";
import { FlatList, StyleSheet, View, Alert, Pressable } from "react-native";
import MFSelectableButton from "../../../../components/SelectableButtons/MFSelectableButton";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { DetailRoutes } from "../../../../config/navigation/DetailsNavigator";
import { AppStrings } from "../../../../config/strings";
import { getUIdef } from "../../../../utils/uidefinition";
import { Definition } from "../../../../utils/common";
import { DvrGroupShowType } from "../../../../utils/DVRUtils";
import { GLOBALS } from "../../../../utils/globals";
import { format } from "../../../../utils/assetUtils";
import { metadataSeparator } from "../../../../utils/Subscriber.utils";

export interface EpisodeRecordOptionsProps {
  isNew: boolean;
  programId: string;
  seriesId: string;
  isGeneric?: boolean;
  onDvrItemSelected?: any;
  programDiscoveryData: any;
  recordingOptions: any;
}
enum EpisodeRecordingOptionsEnum {
  Episode,
  Series,
}
type EpisodeData = {
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string;
};

const EpisodeRecordOptions: React.FunctionComponent<
  EpisodeRecordOptionsProps
> = (props) => {
  console.log("EpisodeRecordOptions props", props);
  const options = [
    {
      title: AppStrings?.str_dvr_recording.only_this_episode,
      type: EpisodeRecordingOptionsEnum.Episode,
    },
    {
      title: AppStrings?.str_dvr_recording.entire_series,
      type: EpisodeRecordingOptionsEnum.Series,
    },
  ];

  let programId: string = props.programId;

  let seriesId: string = props.seriesId;

  let isGeneric: boolean | undefined = props.isGeneric;

  const firstButtonRef = React.createRef();

  const secondButtonRef = React.createRef();

  let focuszoneRef: React.RefObject<any>;
  const [focussed, setFocussed] = useState<any>(0);

  const handleOnPress = (index: number) => {
    const selectedItem = options[index];
    const type = selectedItem.type;
    let programID;
    let schedule;
    let key;
    let isSeries = true;
    let titleString;
    let schedulesArray;
    let definition;
    let showType;
    let airTimeDomain;
    let isSubscriptionItem = false;

    const {
      seriesId,
      programId,
      schedules,
      isGeneric,
      title,
      isNew,
      SubscriptionGroup,
      programDiscoveryData,
    } = props.route.params;

    if (type === EpisodeRecordingOptionsEnum.Episode) {
      programID = programId;
      schedulesArray = schedules;
      key = "ProgramId";
      isSeries = false;
      titleString = programDiscoveryData
        ? getEpisodeTitleString(programDiscoveryData)
        : title;
      definition = Definition.SINGLE_PROGRAM;
      const { SubscriptionItems = [] } = GLOBALS.recordingData || [];
      const [item] = SubscriptionItems;
      isSubscriptionItem =
        SubscriptionItems.length > 0 ? true : item?.IsGeneric ? true : false;
    } else {
      if (seriesId) {
        schedulesArray = schedules;
        programID = seriesId;
      } else {
        programID = programId;
        schedulesArray = schedules;
      }
      key = seriesId ? "TVSeriesId" : "ProgramId";
      titleString = title;
      definition = isGeneric ? Definition.GENERIC_PROGRAM : Definition.SERIES;
      const showTypeOfNonGeneric = seriesId ? DvrGroupShowType.Any : "AnyTime";
      showType = isGeneric ? "Any" : showTypeOfNonGeneric;
      airTimeDomain = "Anytime";
    }

    if (schedulesArray && schedulesArray.length > 0) {
      schedule = schedulesArray[0];
      // overwrite with current schedule if exists
      const channelNumber = GLOBALS.recordingData?.Settings?.ChannelNumber;
      const startUtc = GLOBALS.recordingData?.Settings?.StartUtc;
      if (channelNumber) {
        const selectedSchedule = schedulesArray?.find(
          (s: any) =>
            s?.ChannelNumber === channelNumber && s?.StartUtc === startUtc
        );
        if (selectedSchedule) {
          // overwrite
          schedule = selectedSchedule;
        }
      }
    }

    if (schedule) {
      if (isNew) {
        GLOBALS.recordingData = {
          Definition: definition,
          Parameters: [
            {
              Key: key as string,
              Value: programID,
            },
          ],
          Settings: {
            StationId: schedule.StationId,
            ChannelNumber: schedule.ChannelNumber,
            StartUtc: schedule.StartUtc,
            MaximumViewableShows: undefined,
            EndLateSeconds: GLOBALS.store!.settings.dvr?.stopRecording || 0,
            RecyclingDisabled: false,
            ShowType: showType,
            AirtimeDomain: airTimeDomain,
            ChannelMapId: GLOBALS.userAccountInfo.ChannelMapId.toString(),
            IsMultiChannel: false,
          },
        };
      } else {
        if (isSeries) {
          GLOBALS.recordingData = SubscriptionGroup;
        } else {
          const selectedEpisode = SubscriptionGroup.SubscriptionItems.find(
            (item: any) => {
              return programId == item.ProgramId;
            }
          );
          GLOBALS.recordingData = {
            ...SubscriptionGroup,
            Settings: {
              ...SubscriptionGroup.Settings,
              EndLateSeconds: selectedEpisode?.Settings?.EndLateSeconds,
              RecyclingDisabled: selectedEpisode?.Settings?.RecyclingDisabled,
            },
          };
        }
      }
      const navigationParams = {
        title: titleString,
        isNew: isNew,
        isSeries,
        schedules: schedulesArray,
        programId: programID,
        isGeneric: isGeneric,
        isSubscriptionItem,
        isPopupModal: true,
      };

      props.navigation.navigate(
        DetailRoutes.RecordingOptions,
        navigationParams
      );
    }
  };

  const getEpisodeTitleString = (programDiscoveryData: any) => {
    const episodeData = {
      seasonNumber: programDiscoveryData.SeasonNumber || "",
      episodeNumber: programDiscoveryData.EpisodeNumber || "",
      episodeName:
        programDiscoveryData?.EpisodeName || programDiscoveryData.Name || "",
    };
    const { str_seasonNumber, str_episodeNumber } = AppStrings || {};
    const { episodeName, episodeNumber, seasonNumber } = episodeData;
    const seasonTranslation = seasonNumber
      ? format(str_seasonNumber || "S{0}", seasonNumber.toString()) ||
        `S${seasonNumber}`
      : "";
    const episodeTranslation = episodeNumber
      ? format(str_episodeNumber || "E{0}", episodeNumber.toString()) ||
        `E${episodeNumber}`
      : "";
    const episodeTitle =
      episodeNumber || seasonNumber
        ? `${metadataSeparator}${episodeName}`
        : episodeName;
    return `${seasonTranslation}${episodeTranslation}${episodeTitle}`;
  };

  return (
    <SideMenuLayout
      //@ts-ignore
      title={props.route.params.title}
      subTitle={
        props.route.params.programDiscoveryData
          ? getEpisodeTitleString(props.route.params.programDiscoveryData)
          : "Record Options"
      }
      contentContainerStyle={{
        padding: 0,
        width: "100%",
        paddintTop: 0,
        height: "80%",
      }}
      isTitleInverted={true}
    >
      <View
        style={{
          paddingHorizontal: 30,
          paddingVertical: 10,
        }}
      >
        <FlatList
          data={options}
          keyExtractor={(item: any) => item.title}
          renderItem={({ item, index }) => {
            return (
              <MFSelectableButton
                key={`Index-${index}`}
                title={item.title}
                hasTVPreferredFocus={index === 1}
                onPress={() => {
                  handleOnPress(index);
                }}
                onFocus={() => {
                  setFocussed(index);
                }}
              />
            );
          }}
        />
      </View>
    </SideMenuLayout>
  );
};

// const uidefStyles = getUIdef("EpisodeRecordOptions")?.style || {
//   selectButtonContainer: {
//     width: "100%",
//     height: 120,
//     justifyContent: "space-between",
//     alignContent: "center",
//     alignItems: "center",
//     padding: 30,
//     display: "flex",
//     flexDirection: "row",
//   },
//   focusedselectButtonContainer: {
//     backgroundColor: "#053C69",
//     borderRadius: 6,
//     shadowColor: "#0000006b",
//     shadowOffset: { width: 6, height: 8 },
//     shadowOpacity: 0.42,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   contentContainer: {
//     flex: 0.8,
//     flexDirection: "column",
//     alignContent: "center",
//   },
//   chevronContainer: { flex: 0.2 },
//   chevronStyles: {
//     fontFamily: "MyFontRegular",
//     fontSize: 70,
//     textAlign: "center",
//     color: "#A7A7A7",
//     marginBottom: 8,
//   },
//   focusedText: { color: "#EEEEEE" },
//   selectButtonTitle: {
//     color: "#A7A7A7",
//     fontFamily: "Inter-Regular",
//     fontSize: 29,
//     paddingVertical: 10,
//   },
//   selectButtonContent: {
//     color: "#A7A7A7",
//     fontFamily: "Inter-Regular",
//     fontSize: 23,
//   },
// };

//const styles = StyleSheet.create(uidefStyles);

export default EpisodeRecordOptions;
