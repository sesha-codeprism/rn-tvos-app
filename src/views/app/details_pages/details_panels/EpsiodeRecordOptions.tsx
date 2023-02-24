import React, { useState } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import MFSelectableButton from "../../../../components/SelectableButtons/MFSelectableButton";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { DetailRoutes } from "../../../../config/navigation/DetailsNavigator";
import { AppStrings } from "../../../../config/strings";
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

  const handleOnPress = (index: number) => {
    const selectedItem = options[index];
    if (selectedItem.type === EpisodeRecordingOptionsEnum.Episode) {
      //@ts-ignore
      props.navigation.navigate(
        DetailRoutes.RecordingOptions,
        //@ts-ignore
        props.route.params
      );
    } else {
      Alert.alert("Series recording not implemented");
    }
  };

  return (
    <SideMenuLayout
      //@ts-ignore
      title={props.route.params.title}
      subTitle={"Record Options"}
      contentContainerStyle={{
        padding: 0,
        width: "100%",
        paddintTop: 0,
        height: "80%",
      }}
      isTitleInverted={true}
    >
      <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
        <FlatList
          data={options}
          keyExtractor={(item: any) => item.title}
          renderItem={({ item, index }) => {
            return (
              <MFSelectableButton
                key={`Index-${index}`}
                title={item.title}
                hasTVPreferredFocus={index === 0}
                onPress={() => {
                  handleOnPress(index);
                }}
              />
              // <Pressable
              //   hasTVPreferredFocus={index === 0 ? true : false}
              //   onFocus={() => {
              //     console.log("Focusing on index", index);
              //     setFocused(index);
              //   }}
              //   onPress={() => {
              //     // if (item.action !== "") {
              //     //   props.navigation.navigate(item.action);
              //     // } else if (index === menu.length - 1) {
              //     //   props.navigation.navigate("app", {
              //     //     screen: Routes.ShortCode,
              //     //   });
              //     // } else {
              //     //   null;
              //     // }
              //   }}
              //   style={
              //     index === focused
              //       ? {
              //           ...MFSettingsStyles.containerActive,
              //           ...MFSettingsStyles.container,
              //         }
              //       : MFSettingsStyles.container
              //   }
              //   key={index}
              // >
              //   <Text
              //     style={[
              //       MFSettingsStyles.listText,
              //       { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
              //     ]}
              //   >
              //     {item.title}
              //   </Text>
              //   <Image
              //     source={AppImages.arrow_right}
              //     style={{ width: 15, height: 30 }}
              //   />
              // </Pressable>
            );
          }}
        />
      </View>
    </SideMenuLayout>
  );
};

const uidefStyles = getUIdef("EpisodeRecordOptions")?.style || {
  selectButtonContainer: {
    width: "100%",
    height: 120,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 30,
    display: "flex",
    flexDirection: "row",
  },
  focusedselectButtonContainer: {
    backgroundColor: "#053C69",
    borderRadius: 6,
    shadowColor: "#0000006b",
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.42,
    shadowRadius: 4.65,
    elevation: 8,
  },
  contentContainer: {
    flex: 0.8,
    flexDirection: "column",
    alignContent: "center",
  },
  chevronContainer: { flex: 0.2 },
  chevronStyles: {
    fontFamily: "MyFontRegular",
    fontSize: 70,
    textAlign: "center",
    color: "#A7A7A7",
    marginBottom: 8,
  },
  focusedText: { color: "#EEEEEE" },
  selectButtonTitle: {
    color: "#A7A7A7",
    fontFamily: "Inter-Regular",
    fontSize: 29,
    paddingVertical: 10,
  },
  selectButtonContent: {
    color: "#A7A7A7",
    fontFamily: "Inter-Regular",
    fontSize: 23,
  },
};

const styles = StyleSheet.create(uidefStyles);

export default EpisodeRecordOptions;
