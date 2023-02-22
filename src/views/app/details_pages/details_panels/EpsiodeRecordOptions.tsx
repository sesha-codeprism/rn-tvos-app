import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { AppImages } from "../../../../assets/images";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { AppStrings } from "../../../../config/strings";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { getUIdef } from "../../../../utils/uidefinition";

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

const EpisodeRecordOptions: React.FunctionComponent<
  EpisodeRecordOptionsProps
> = (props) => {
  console.log(props);
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
  const [focused, setFocused] = useState<any>(0);

  return (
    <SideMenuLayout
      title={"Record"}
      contentContainerStyle={{
        padding: 0,
        width: "100%",
        paddintTop: 0,
        height: "80%",
      }}
      isTitleInverted={false}
    >
      <FlatList
        data={options}
        keyExtractor={(item: any) => item.title}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              hasTVPreferredFocus={index === 0 ? true : false}
              onFocus={() => {
                console.log("Focusing on index", index);
                setFocused(index);
              }}
              onPress={() => {
                // if (item.action !== "") {
                //   props.navigation.navigate(item.action);
                // } else if (index === menu.length - 1) {
                //   props.navigation.navigate("app", {
                //     screen: Routes.ShortCode,
                //   });
                // } else {
                //   null;
                // }
              }}
              style={
                index === focused
                  ? {
                      ...MFSettingsStyles.containerActive,
                      ...MFSettingsStyles.container,
                    }
                  : MFSettingsStyles.container
              }
              key={index}
            >
              <Text
                style={[
                  MFSettingsStyles.listText,
                  { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {item.title}
              </Text>
              <Image
                source={AppImages.arrow_right}
                style={{ width: 15, height: 30 }}
              />
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};

const uidefStyles = getUIdef("EpisodeRecordOptions")?.style || {
  container: { flexGrow: 1, paddingVertical: 10 },
  selectButtonContainer: {
    width: "100%",
    height: 100,
    paddingHorizontal: 30,
  },
};

const styles = StyleSheet.create(uidefStyles);

export default EpisodeRecordOptions;
