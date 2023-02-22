import React, { useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { separator } from "../../../../utils/analytics/consts";
import { ILiveSchedule } from "../../../../utils/live/live";
import { getUIdef } from "../../../../utils/uidefinition";

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
  const [schedules, setSchedules] = useState<Array<ILiveSchedule>>();
  const [recordingOptions, setRecordingOptions] =
    useState<Array<RecordingOptions>>();
  const { metadataSeparator }: any =
    getUIdef("Application")?.config || separator;
  const conflictPopupConfig = getUIdef("DVRConflict")?.config;

  return <SideMenuLayout></SideMenuLayout>;
};

export default RecordingOptions;
