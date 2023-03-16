import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import {
  DVRAnyTimeAnyChannel,
  ItemShowType,
  separator,
} from "../../../../utils/analytics/consts";
import { GLOBALS } from "../../../../utils/globals";
import { ILiveSchedule } from "../../../../utils/live/live";
import { getUIdef } from "../../../../utils/uidefinition";
import {
  DvrGroupShowType,
  filterLiveSchedules,
  Definition as DefinitionString,
  getStopRecordingOptions,
} from "../../../../utils/DVRUtils";
import { queryClient } from "../../../../config/queries";
import { DvrCapabilityType, format } from "../../../../utils/assetUtils";
import { groupBy, uniq, uniqBy, values } from "lodash";
import { DvrItemState } from "../../../../utils/common";
import { getTimeStringFromISOString } from "../../../../utils/dataUtils";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { DetailRoutes } from "../../../../config/navigation/DetailsNavigator";
import { saveRecordingToBackend } from "../../../../../backend/dvrproxy/dvrproxy";

enum RecordingOptionsEnum {
  ShowType,
  KeepAtMost,
  ChannelAndTime,
  StopRecordings,
  KeepUntil,
  Channel,
  Time,
}

enum RecordingTimeOptionsEnum {
  AnyDayAnyTime = "Anytime",
  AnyDayAround = "CanonicalTime",
  AnyDayAnyTimeOncePerDay = "AnytimeOncePerDay",
}

interface RecordingOptionsProps {
  navigation?: any;
  route?: any;
}

interface RecordingOptions {
  key: RecordingOptionsEnum;
  title: string;
  value?: any;
  channelNumber?: any;
  AnyTimeAnyChannel?: boolean;
}

const RecordingOptions: React.FunctionComponent<RecordingOptionsProps> = (
  props
) => {
  const [schedulesArray, setSchedules] = useState<Array<ILiveSchedule>>();
  const [recordingOptions, setRecordingOptions] =
    useState<Array<RecordingOptions>>();
  const [focussed, setFocussed] = useState<any>("");
  const recordButtonRef = React.createRef<any>();
  const { metadataSeparator }: any =
    getUIdef("Application")?.config || separator;
  const conflictPopupConfig = getUIdef("DVRConflict")?.config;
  const chevronIcon = getFontIcon("channel_right");
  const { isGeneric, isSeries, isNew, isSubscriptionItem, title, schedules } =
    props.route.params;
  let seriesEntry: any;
  let programEntry: any;
  let seriesId: any;
  let programId: any;

  const { Definition, SeriesDetails, Parameters, ProgramId, Id } =
    GLOBALS.recordingData;

  if (Parameters) {
    Parameters.forEach((entry: any) => {
      if (entry.Key === "TVSeriesId") {
        seriesEntry = entry;
      } else if (entry.Key === "ProgramId") {
        programEntry = entry;
      }
    });
  } else {
    if (isSeries && Definition && SeriesDetails) {
      seriesId = SeriesDetails?.SeriesId ? SeriesDetails?.SeriesId : Id;
    } else if (!GLOBALS.recordingData?.Definition) {
      programId = ProgramId;
    }
  }

  const getSchedules = async (id: any) => {
    const data = queryClient.getQueryData(["get-discoveryschedules", id]);
    if (!data) {
      console.warn("No schedules data");
    }
    return data;
  };

  const isMultiChannelNeeded = (): boolean => {
    if (!schedulesArray?.length) {
      return false;
    }
    const schedulesByStationId = groupBy(
      schedulesArray,
      (schedule) => schedule?.StationId
    );
    let IsMultiChannelNeeded = true;
    let schedulesById = values(schedulesByStationId);
    schedulesById.forEach((schedule: any) => {
      // All-Channels functionality is needed only for not generic series and its episode
      if (schedule.some((item: any) => item.IsGeneric || !item.SeriesId)) {
        IsMultiChannelNeeded = false;
      }
    });
    return IsMultiChannelNeeded;
  };

  const getTimeOptions = () => {
    const timeString = getTimeStringFromISOString(
      GLOBALS.recordingData?.Settings.StartUtc as string
    );

    return [
      {
        title: AppStrings?.str_dvr_recording.Anyday_Anytime,
        key: RecordingTimeOptionsEnum.AnyDayAnyTime,
      },
      {
        title: format(AppStrings?.str_dvr_recording.Anyday_Around, timeString),
        key: RecordingTimeOptionsEnum.AnyDayAround,
      },
      {
        title: AppStrings?.str_dvr_recording.Anyday_Anytime_OncePerDay,
        key: RecordingTimeOptionsEnum.AnyDayAnyTimeOncePerDay,
      },
    ];
  };

  const setTimeSettingValue = (value: RecordingTimeOptionsEnum) => {
    if (GLOBALS.recordingData) {
      GLOBALS.recordingData = {
        ...GLOBALS.recordingData,
        Settings: {
          ...GLOBALS.recordingData.Settings,
          AirtimeDomain: value,
        },
      };
    }

    return Promise.resolve();
  };

  const keepUntilOptions = () => [
    {
      title: AppStrings?.str_dvr_recording.keep_until_space_needed,
      key: false,
    },
    {
      title: AppStrings?.str_dvr_recording.keep_until_deleted,
      key: true,
    },
  ];

  const stopRecordingOptions = () => {
    return [
      {
        title: AppStrings?.str_dvr_recording.stop_recording_at_scheduled_time,
        key: 0,
      },
      {
        title: format(
          AppStrings?.str_dvr_recording.stop_recording_after_minutes,
          "5"
        ),
        key: 300, // seconds
      },
      {
        title: format(
          AppStrings?.str_dvr_recording.stop_recording_after_minutes,
          "15"
        ),
        key: 900, // seconds
      },
      {
        title: format(
          AppStrings?.str_dvr_recording.stop_recording_after_minutes,
          "30"
        ),
        key: 1800, // seconds
      },
      {
        title: format(
          AppStrings?.str_dvr_recording.stop_recording_after_hours,
          "1"
        ),
        key: 3600,
      },
      {
        title: format(
          AppStrings?.str_dvr_recording.stop_recording_after_hours,
          "2"
        ),
        key: 7200,
      },
      {
        title: format(
          AppStrings?.str_dvr_recording.stop_recording_after_hours,
          "3"
        ),
        key: 10800,
      },
    ];
  };

  const getChannelOptions = () => {
    if (GLOBALS.channelMap && GLOBALS.channelMap.Channels) {
      //   const { channelMap, channels, account } = this.props;

      const channelsByStationId = groupBy(
        GLOBALS.channelMap?.getChannels(),
        (channel) => channel?.StationId
      );
      const serviceMap = GLOBALS.channelMap?.ServiceMap;
      const schedules = filterLiveSchedules(
        schedulesArray,
        GLOBALS.recorders?.recorders,
        channelsByStationId,
        serviceMap,
        GLOBALS.userAccountInfo?.DvrCapability === DvrCapabilityType.CLOUDDVR
      );

      const uniqSchedules = uniqBy(schedules, "ChannelNumber");
      // Select only future schedule
      const stationIds = uniqSchedules
        .filter((schd) => {
          const schEndDate = new Date(schd?.EndUtc);
          const now = new Date();
          return schEndDate >= now;
        })
        .map((schedules) => schedules?.StationId);
      const uniqueStationIds = uniq(stationIds);
      if (GLOBALS.channelMap.Channels?.length) {
        let filteredChannels = uniqueStationIds
          .map((stationId) => {
            const channel = GLOBALS.channelMap.Channels?.find(
              (channel: any) => channel.StationId === stationId
            );
            if (channel) {
              return {
                key: channel.Number,
                title: `${channel.Number} ${channel.Name}`,
              };
            }
          })
          .filter((channel) => channel);
        if (schedulesArray && isMultiChannelNeeded()) {
          filteredChannels.push({
            key: DVRAnyTimeAnyChannel,
            title: AppStrings?.str_dvr_multichannel,
          });
        }
        return filteredChannels;
      }
    }
  };

  const saveRecording = async () => {
    //TODO: Need to handle conflicts.. currently just go ahead and save it
    if (GLOBALS.recordingData) {
      let isAnyTimeAnyChannel = false;
      let selectedChannel = GLOBALS.recordingData.Settings?.ChannelNumber;
      if (
        selectedChannel.startsWith &&
        selectedChannel.startsWith(DVRAnyTimeAnyChannel)
      ) {
        selectedChannel = selectedChannel.split("-")?.[1];
        isAnyTimeAnyChannel = true;
      }
      const channel = GLOBALS.channelMap
        ?.getChannels()
        .find((channel: any) => channel.Number === parseInt(selectedChannel));
      const recording = {
        ...GLOBALS.recordingData,
        Settings: {
          ...GLOBALS.recordingData.Settings,
          IsMultiChannel: isAnyTimeAnyChannel,
          ChannelNumber: isAnyTimeAnyChannel
            ? channel?.Number
            : GLOBALS.recordingData.Settings?.ChannelNumber,
        },
      };
      recording.Settings.StationId = channel?.StationId;
      //TODO: V2 app is sending Analytics call.. check if that is needed and implement it
      const response = await saveRecordingToBackend(recording);
      if (response?.status! >= 200 && response?.status! <= 300) {
        props.route.params.closePanel();
      }
    }
  };

  const getRecordingOptions = () => {
    let recordingOptions = [];
    if (GLOBALS.recordingData && GLOBALS.recordingData.Settings) {
      const { Settings, SubscriptionItems } = GLOBALS.recordingData;
      const {
        ShowType,
        AirtimeDomain,
        StartUtc,
        EndLateSeconds,
        RecyclingDisabled,
        IsMultiChannel,
      } = Settings;
      let { ChannelNumber } = Settings;
      if (ChannelNumber) {
        let isAnyTimeAnyChannel = false;
        if (
          ChannelNumber.startsWith &&
          ChannelNumber.startsWith(DVRAnyTimeAnyChannel)
        ) {
          ChannelNumber = ChannelNumber.split("-")?.[1];
          isAnyTimeAnyChannel = true;
        }
        let channel = getChannelByNumber(parseInt(ChannelNumber));
        if (isSeries) {
          if (!isGeneric) {
            recordingOptions.push({
              key: RecordingOptionsEnum.ShowType,
              title: AppStrings?.str_dvr_recording.show_type,
              value:
                DvrGroupShowType.FirstRunOnly === ShowType
                  ? AppStrings?.str_dvr_filter_head_FirstRunOnly
                  : AppStrings?.str_dvr_recording.show_type_first_run_rerun,
            });
          }
          if (channel) {
            if (schedules && schedules.length) {
              const validChannels = getChannelOptions();
              if (
                validChannels &&
                validChannels.length &&
                !validChannels?.some((c: any) => c.key === ChannelNumber)
              ) {
                channel = getChannelByNumber(validChannels?.[0]?.key);
              }
            }
            recordingOptions.push({
              key: RecordingOptionsEnum.Channel,
              title: AppStrings?.str_dvr_recording.channel,
              value: `${channel?.Number} ${channel?.Name}`,
              channelNumber: channel?.Number,
              AnyTimeAnyChannel: isAnyTimeAnyChannel || IsMultiChannel,
            });

            const timeOptions = getTimeOptions();
            let selectedTimeOption = timeOptions.find(
              (option) => option.key === AirtimeDomain
            );
            const [{ IsGeneric = undefined } = {}] = SubscriptionItems || [];
            if (
              !selectedTimeOption &&
              IsGeneric &&
              timeOptions &&
              timeOptions.length
            ) {
              selectedTimeOption = timeOptions[0];
            }
            recordingOptions.push({
              key: RecordingOptionsEnum.Time,
              title: AppStrings?.str_dvr_recording.time,
              value: selectedTimeOption?.title,
            });
          }
        } else if (!isGeneric && isNew && channel) {
          recordingOptions.push({
            key: RecordingOptionsEnum.ChannelAndTime,
            title: AppStrings?.str_dvr_recording.chanel_and_time,
            value: `${channel?.Number} ${
              channel?.CallLetters
            }${metadataSeparator}${getTimeStringFromISOString(
              StartUtc as string
            )}`,
          });
        } else if (SubscriptionItems && SubscriptionItems.length) {
          const { ProgramDetails, ItemState } = SubscriptionItems[0];
          if (
            ProgramDetails &&
            ProgramDetails.ShowType === ItemShowType.Movie &&
            ItemState === DvrItemState.SCHEDULED
          ) {
            recordingOptions.push({
              key: RecordingOptionsEnum.ChannelAndTime,
              title: AppStrings?.str_dvr_recording.chanel_and_time,
              value: `${channel?.ChannelNumber} ${
                channel?.CallLetters
              }${metadataSeparator}${getTimeStringFromISOString(
                StartUtc as string
              )}`,
            });
          }
        }

        //for single program which are recorded(Edit Mode), only show KeepUntil, StopRecording option is not applicable
        const [{ ItemState = undefined } = {}] = SubscriptionItems || [];
        if (
          !isNew &&
          GLOBALS.recordingData?.Definition === ItemShowType.SingleProgram &&
          ItemState === DvrItemState.RECORDED
        ) {
          recordingOptions.push({
            key: RecordingOptionsEnum.KeepUntil,
            title: AppStrings?.str_dvr_recording.keep_until,
            value:
              RecyclingDisabled === true
                ? AppStrings?.str_dvr_recording.keep_until_deleted
                : AppStrings?.str_dvr_recording.keep_until_space_needed,
          });
        } else {
          recordingOptions.push({
            key: RecordingOptionsEnum.StopRecordings,
            title: AppStrings?.str_dvr_recording.stop_recordings,
            value: getStopRecordingOptions().find(
              (option) => option.key === EndLateSeconds
            )?.title,
          });

          recordingOptions.push({
            key: RecordingOptionsEnum.KeepUntil,
            title: AppStrings?.str_dvr_recording.keep_until,
            value:
              RecyclingDisabled === true
                ? AppStrings?.str_dvr_recording.keep_until_deleted
                : AppStrings?.str_dvr_recording.keep_until_space_needed,
          });
        }
      }
    }
    setRecordingOptions(recordingOptions);
  };

  const getChannelByNumber = (channelNumber: number) => {
    if (GLOBALS.channelMap.Channels?.length) {
      return GLOBALS.channelMap.Channels.find(
        (channel: any) => channel.Number === channelNumber
      );
    }
  };

  const getShowTypeOptions = () => {
    return [
      {
        title: AppStrings?.str_dvr_recording.show_type_first_run_rerun,
        key: DvrGroupShowType.Any,
      },
      {
        title: AppStrings?.str_dvr_filter_head_FirstRunOnly,
        key: DvrGroupShowType.FirstRunOnly,
      },
    ];
  };

  const handleSelection = (selection: any) => {
    const currentChannnel = recordingOptions?.find(
      (options: any) => options?.key === RecordingOptionsEnum.Channel
    );
    const { channelNumber, AnyTimeAnyChannel } = currentChannnel || {};
    console.log(channelNumber, AnyTimeAnyChannel, currentChannnel);
    switch (selection.key) {
      case RecordingOptionsEnum.KeepUntil:
        props.navigation.navigate(DetailRoutes.SelectOptions, {
          title: props.route.params.title,
          subTitle: selection.title,
          options: keepUntilOptions(),
        });
        break;
      case RecordingOptionsEnum.StopRecordings:
        props.navigation.navigate(DetailRoutes.SelectOptions, {
          title: props.route.params.title,
          subTitle: selection.title,
          options: stopRecordingOptions(),
        });
        break;
      case RecordingOptionsEnum.ShowType:
        props.navigation.navigate(DetailRoutes.SelectOptions, {
          title: props.route.params.title,
          subTitle: selection.title,
          options: getShowTypeOptions(),
        });
      case RecordingOptionsEnum.Time:
        props.navigation.navigate(DetailRoutes.SelectOptions, {
          title: props.route.params.title,
          subTitle: selection.title,
          options: getTimeOptions(),
        });
        break;
      case RecordingOptionsEnum.Channel:
        props.navigation.navigate(DetailRoutes.SelectOptions, {
          title: props.route.params.title,
          subTitle: AppStrings?.str_dvr_recording.channel,
          options: getChannelOptions(),
          initialValue: AnyTimeAnyChannel
            ? DVRAnyTimeAnyChannel
            : channelNumber,
        });
        break;
      case RecordingOptionsEnum.ChannelAndTime:
        props.navigation.navigate(DetailRoutes.ChannelAndTime, {
          title: props.route.params.title,
          subTitle: selection.title,
          programId: props.route.params.programId,
        });
        break;
    }
  };
  const loadSchedules = async () => {
    if (!schedulesArray?.length) {
      let schedules;
      if (isSeries || SeriesDetails) {
        if (seriesEntry || seriesId) {
          if (
            Definition === DefinitionString.GENERIC_PROGRAM &&
            SeriesDetails &&
            SeriesDetails?.SeriesId // GenericProgram with recurring schedule
          ) {
            // Only Edit scenerio
            schedules = await getSchedules(seriesId);
          } else if (Definition === DefinitionString.GENERIC_PROGRAM) {
            // Non recurring
            schedules = await getSchedules(seriesEntry?.Value || seriesId);
          } else {
            // Series
            schedules = await getSchedules(seriesEntry?.Value || seriesId);
          }
        } else {
          // Program
          schedules = await getSchedules(programEntry?.Value || programId);
        }
      } else {
        schedules = await getSchedules(programEntry?.Value || programId);
      }
      if (
        //@ts-ignore
        (!schedules || schedules.length === 0) &&
        [
          DefinitionString.GENERIC_PROGRAM,
          DefinitionString.SINGLE_PROGRAM,
        ].includes(Definition) &&
        !ProgramId &&
        programId
      ) {
        schedules = await getSchedules(programId);
      }
      setSchedules(schedules);
      getRecordingOptions();
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      console.log("Refresh due to focus", GLOBALS.recordingData);
      getRecordingOptions();
    });

    return unsubscribe;
  }, [props.navigation]);

  //   useEffect(() => {

  //   }, []);
  const footerComponnt = () => {
    return (
      <View
        style={[styles.buttonContainer, { alignSelf: "flex-end", bottom: 0 }]}
      >
        {isNew ? (
          <MFButton
            ref={recordButtonRef}
            onFocus={() => {
              setFocussed(undefined);
            }}
            variant={MFButtonVariant.Contained}
            iconSource={0}
            imageSource={0}
            avatarSource={undefined}
            onPress={() => {
              saveRecording();
              //   props.navigation.pop(5);
            }}
            focusable
            textStyle={{
              height: 38,
              width: 100,
              color: "#EEEEEE",
              fontFamily: "Inter",
              fontSize: 25,
              fontWeight: "600",
              letterSpacing: 0,
              lineHeight: 38,
              textAlign: "center",
            }}
            style={styles.saveButton}
            textLabel={AppStrings?.str_details_program_record_button}
            containedButtonProps={{
              containedButtonStyle: {
                unFocusedBackgroundColor: globalStyles.backgroundColors.shade3,
                elevation: 100,
                enabled: true,
                focusedBackgroundColor: globalStyles.backgroundColors.primary1,
                hoverColor: "red",
                hasTVPreferredFocus: false,
                unFocusedTextColor: globalStyles.fontColors.lightGrey,
              },
            }}
          />
        ) : (
          <React.Fragment>
            <MFButton
              ref={recordButtonRef}
              variant={MFButtonVariant.Contained}
              iconSource={0}
              onFocus={() => {
                setFocussed(undefined);
              }}
              imageSource={0}
              style={styles.saveButton}
              textStyle={{
                height: 38,
                width: 100,
                color: "#EEEEEE",
                fontFamily: "Inter",
                fontSize: 25,
                fontWeight: "600",
                letterSpacing: 0,
                lineHeight: 38,
                textAlign: "center",
              }}
              avatarSource={undefined}
              textLabel={AppStrings?.str_dvr_btn_save_changes}
              containedButtonProps={{
                containedButtonStyle: {
                  unFocusedBackgroundColor:
                    globalStyles.backgroundColors.shade3,
                  elevation: 0,
                  enabled: true,
                  focusedBackgroundColor:
                    globalStyles.backgroundColors.primary1,
                  hoverColor: "red",
                  hasTVPreferredFocus: false,
                  unFocusedTextColor: globalStyles.fontColors.lightGrey,
                },
              }}
            />
          </React.Fragment>
        )}
      </View>
    );
  };

  return (
    <SideMenuLayout
      title={props.route.params.title || "Some title"}
      subTitle={
        props.route.params.isSeries
          ? AppStrings.str_dvr_recording.entire_series
          : AppStrings.str_dvr_recording.only_this_episode
      }
      isTitleInverted
    >
      <>
        <FlatList
          style={{
            width: "100%",
            height: "100%",
          }}
          contentContainerStyle={{ width: "100%", height: "100%" }}
          ListFooterComponentStyle={{
            justifyContent: "flex-end",
            bottom: 0,
            flexGrow: 1,
            alignSelf: "center",
          }}
          data={recordingOptions}
          keyExtractor={(x, i) => `${x.key}-${i}`}
          renderItem={({ item: option, index }) => (
            <Pressable
              key={`Index${index}`}
              hasTVPreferredFocus={index === 0}
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                handleSelection(option);
              }}
              style={StyleSheet.flatten([
                styles.selectButtonContainer,
                focussed === index
                  ? styles.focusedselectButtonContainer
                  : styles.selectButtonContainer,
              ])}
            >
              <View style={styles.contentContainer}>
                <Text
                  style={StyleSheet.flatten([
                    styles.selectButtonTitle,
                    focussed === index ? styles.focusedText : {},
                  ])}
                >
                  {option.title}
                </Text>
                <Text
                  style={StyleSheet.flatten([
                    styles.selectButtonContent,
                    focussed === index ? styles.focusedText : {},
                  ])}
                >
                  {option.value}
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Text
                  style={StyleSheet.flatten([
                    styles.chevronStyles,
                    focussed === index ? styles.focusedText : {},
                  ])}
                >
                  {chevronIcon}
                </Text>
              </View>
            </Pressable>
          )}
          ListFooterComponent={footerComponnt}
        />
      </>
    </SideMenuLayout>
  );
};
//@ts-ignore
const styles: any = StyleSheet.create(getUIdef("RecordingOptions")?.style);

export default RecordingOptions;
