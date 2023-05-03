import { groupBy } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";
import { getDataFromUDL } from "../../../../../backend";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import MFRadioSelectableButton from "../../../../components/SelectableButtons/MFRadioSelectableButton";
import { defaultQueryOptions } from "../../../../config/constants";
import { queryClient } from "../../../../config/queries";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { getTimeStringFromISOString } from "../../../../utils/dataUtils";
import { getScaledValue } from "../../../../utils/dimensions";
import { DefaultStore } from "../../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../../utils/globals";
import { ILiveSchedule } from "../../../../utils/live/live";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";

interface ChannelAndTimeProps {
  navigation?: any;
  route?: any;
}

const channelAndMapUIDefination: any = getUIdef("ChannelAndTimePanel");
const snapToInterval: number =
  channelAndMapUIDefination?.config?.snapToInterval || getScaledValue(70);

const ChannelAndTime: React.FunctionComponent<ChannelAndTimeProps> = (
  props
) => {
  const { title, subTitle, programId } = props.route.params;

  const [groupedSchedules, setGroupedSchedules] = useState<any>();
  const [sortedDates, setsortedDates] = useState<Array<any>>([]);
  const [selectedItem, setSelectedItem] = useState<any>();

  const headingLine2 = AppStrings?.str_dvr_recording.chanel_and_time;

  const sortByDate = (scheduleDates: string[]) => {
    return scheduleDates.sort((a: string, b: string) => {
      const parsedA = new Date(a);
      const parsedB = new Date(b);
      return parsedA.getTime() - parsedB.getTime();
    });
  };

  const getWeekDaysStrings = () => {
    const dateStings = AppStrings?.str_dates;

    return [
      dateStings.str_sunday,
      dateStings.str_monday,
      dateStings.str_tuesday,
      dateStings.str_wednesday,
      dateStings.str_thursday,
      dateStings.str_friday,
      dateStings.str_saturday,
    ];
  };

  const selectSchedule = (schedule: any) => {
    GLOBALS.recordingData = {
      ...GLOBALS.recordingData,
      Settings: {
        ...GLOBALS.recordingData?.Settings,
        ChannelNumber: schedule.ChannelNumber as number,
        StationId: schedule.StationId,
        StartUtc: schedule.StartUtc,
      },
    };
    setSelectedItem(schedule);
  };

  const getDateText = (dateString: string) => {
    if (new Date(dateString).toDateString() === new Date().toDateString()) {
      return AppStrings?.str_dates.str_today;
    } else {
      const date = new Date(new Date(dateString).toDateString());
      const weekStrings = getWeekDaysStrings();
      const day = date.getDay();
      return `${weekStrings[day]} ${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  const getChannelByNumber = (channelNumber: number) => {
    if (GLOBALS.channelMap.Channels?.length) {
      return GLOBALS.channelMap.Channels.find(
        (channel: any) => channel?.Number === channelNumber
      );
    }
  };

  const getProgramPlayActions = async ({ queryKey }: any) => {
    const playActions = queryClient.getQueryData([
      "get-playActions",
      programId,
    ]);
    if (!playActions) {
      if (!programId) {
        console.log("No asset data to make api call..");
        return undefined;
      }
      const params = `?catchup=true&storeId=${DefaultStore.Id}&groups=${
        GLOBALS.store!.rightsGroupIds
      }&id=${programId}`;
      const udlParam = "udl://subscriber/programplayactions/" + params;
      const data = await getDataFromUDL(udlParam);
      return data.data;
    } else {
      return playActions;
    }
  };

  const {
    data: playOptions,
    isLoading,
    isFetching,
  } = useQuery(
    ["get-program-playActions", programId],
    getProgramPlayActions,
    defaultQueryOptions
  );

  useEffect(() => {
    if (!playOptions) {
      return;
    }
    const groupedSchedules = groupBy(playOptions.Schedules, (schedule) =>
      new Date(schedule.StartUtc).toDateString()
    );
    setGroupedSchedules(groupedSchedules);
    const scheduleDates = Object.keys(groupedSchedules);
    const sortedDates = sortByDate(scheduleDates);
    setsortedDates(sortedDates);
  }, [playOptions, isFetching]);

  return (
    <SideMenuLayout title={title} subTitle={headingLine2} isTitleInverted>
      <ScrollView
        style={styles.container}
        snapToStart
        snapToAlignment="start"
        snapToInterval={snapToInterval}
      >
        {sortedDates.map((date: any, index: any) => {
          const schedules = groupedSchedules[date];
          return (
            <Fragment key={`groupedschedule_${index}`}>
              <View style={styles.dateTextContaier}>
                <Text style={styles.dateText}>{getDateText(date)}</Text>
              </View>
              {schedules.map((schedule: ILiveSchedule) => {
                const channel =
                  schedule?.ChannelNumber &&
                  getChannelByNumber(schedule.ChannelNumber);
                return (
                  <MFRadioSelectableButton
                    selected={
                      schedule.ChannelNumber ===
                        GLOBALS.recordingData?.Settings.ChannelNumber &&
                      schedule.StartUtc ===
                        GLOBALS.recordingData?.Settings.StartUtc
                    }
                    label={`${channel?.Number} ${
                      channel?.CallLetters
                    } · ${getTimeStringFromISOString(schedule.StartUtc)}`}
                    onPress={() => {
                      selectSchedule(schedule);
                    }}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </ScrollView>
    </SideMenuLayout>
  );
};

export default ChannelAndTime;

const styles = StyleSheet.create(
  channelAndMapUIDefination?.style ||
    scaleAttributes({
      container: {
        paddingTop: 10,
        paddingBottom: 10,
      },
      dateText: {
        color: globalStyles.fontColors.light,
        fontSize: globalStyles.fontSizes.body2,
      },
      dateTextContaier: {
        paddingLeft: 56,
        paddingBottom: 17,
        paddingTop: 45,
      },
    })
);
