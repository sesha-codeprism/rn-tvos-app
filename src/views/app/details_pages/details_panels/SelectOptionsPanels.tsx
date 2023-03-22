import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import MFRadioSelectableButton from "../../../../components/SelectableButtons/MFRadioSelectableButton";
import { DVRAnyTimeAnyChannel } from "../../../../utils/analytics/consts";
import { GLOBALS } from "../../../../utils/globals";
import { RecordingOptionsEnum } from "./RecordingOptions";

interface SelectOptionsPanelProps {
  navigation?: NativeStackNavigationProp<any>;
  route?: any;
}

const SelectOptionsPanel: React.FunctionComponent<SelectOptionsPanelProps> = (
  props
) => {
  const { title, subTitle, options = [] } = props.route.params;
  const [selectedItem, setSelectedItem] = useState("");

  const mapCurrentElementToValue = () => {
    const currentData = GLOBALS.recordingData;
    if (subTitle.toLowerCase().includes("keep")) {
      // Currently trying to set options for Keep Until
      const currentSelected = options.filter(
        (e: any) => e.key == currentData.Settings.RecyclingDisabled
      );
      setSelectedItem(currentSelected[0].title);
    } else if (subTitle.toLowerCase().includes("stop")) {
      // Currently trying to set options for Strop recording after..
      const currentSelected = options.filter(
        (e: any) => e.key === currentData.Settings.EndLateSeconds
      );
      setSelectedItem(currentSelected[0].title);
    } else if (subTitle.toLowerCase().includes("show")) {
      const currentSelected = options.filter(
        (e: any) => e.key === currentData.Settings.ShowType
      );
      setSelectedItem(currentSelected[0].title);
    } else if (subTitle.toLowerCase().includes("channel")) {
      const channelInfo = GLOBALS.recordingData.Settings.ChannelNumber;
      let channelNumber: any;
      if (typeof channelInfo === "string") {
        channelNumber = channelInfo.split("-")[1];
      } else if (typeof channelInfo === "number") {
        channelNumber = channelInfo;
      }
      const currentSelected = options.filter(
        (e: any) => e.key === Number.parseInt(channelNumber)
      );
      setSelectedItem(currentSelected[0].title);
    } else if (subTitle.toLowerCase().includes("time")) {
      const currentSelected = options.filter(
        (e: any) => e.key === currentData.Settings.AirtimeDomain
      );
      setSelectedItem(currentSelected[0].title);
    }
  };

  useEffect(() => {
    mapCurrentElementToValue();
  }, []);

  const handleOnPress = (index: number) => {
    console.log(options[index]);
    let currentData = GLOBALS.recordingData;
    const element = options[index];
    if (subTitle.toLowerCase().includes("keep")) {
      if (GLOBALS.recordingData) {
        GLOBALS.recordingData = {
          ...currentData,
          Settings: {
            ...currentData.Settings,
            RecyclingDisabled: element.key,
          },
        };
      }
      setSelectedItem(element.title);
    } else if (subTitle.toLowerCase().includes("stop")) {
      GLOBALS.recordingData = {
        ...currentData,
        Settings: {
          ...currentData.Settings,
          EndLateSeconds: element.key,
        },
      };
      setSelectedItem(element.title);
    } else if (subTitle.toLowerCase().includes("show")) {
      if (GLOBALS.recordingData) {
        GLOBALS.recordingData = {
          ...currentData,
          Settings: {
            ...currentData.Settings,
            ShowType: element.key,
          },
        };
        setSelectedItem(element.title);
      }
    } else if (subTitle.toLowerCase().includes("channel")) {
      const { recordingOptions } = props.route.params;
      if (element.key === DVRAnyTimeAnyChannel) {
        const currentChannnel = recordingOptions.find(
          (options: any) => options?.key === RecordingOptionsEnum.Channel
        );
        if (GLOBALS.recordingData) {
          GLOBALS.recordingData = {
            ...GLOBALS.recordingData,
            Settings: {
              ...GLOBALS.recordingData?.Settings,
              ChannelNumber: `${DVRAnyTimeAnyChannel}-${currentChannnel?.channelNumber}`,
              IsMultiChannel: true,
            },
          };
        }
      } else {
        if (GLOBALS.recordingData) {
          GLOBALS.recordingData = {
            ...GLOBALS.recordingData,
            Settings: {
              ...GLOBALS.recordingData?.Settings,
              ChannelNumber: element.key,
              IsMultiChannel: false,
            },
          };
        }
      }
      setSelectedItem(element.title);
    } else if (subTitle.toLowerCase().includes("time")) {
      if (GLOBALS.recordingData) {
        GLOBALS.recordingData = {
          ...currentData,
          Settings: {
            ...currentData.Settings,
            AirtimeDomain: element.key,
          },
        };
        setSelectedItem(element.title);
      }
    }
  };

  return (
    <SideMenuLayout title={title} subTitle={subTitle} isTitleInverted>
      <FlatList
        data={options}
        renderItem={({ item, index }) => {
          return (
            <MFRadioSelectableButton
              selected={item.title === selectedItem}
              label={item.title}
              onPress={() => {
                handleOnPress(index);
              }}
            />
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default SelectOptionsPanel;
