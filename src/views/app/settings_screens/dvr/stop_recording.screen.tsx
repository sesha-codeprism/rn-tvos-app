import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { GLOBALS } from "../../../../utils/globals";
import { updateStore } from "../../../../utils/helpers";
import { AppStrings } from "../../../../config/strings";
import { MFSelectCheckedBox, MFSelectUnCheckedBox } from "../../../../components/MFSelectBox";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const list = [
  {
    title: "At scheduled end time",
    action: "",
    value: 0,
  },
  {
    title: "5 min after",
    action: "",
    value: 300,
  },
  {
    title: "15 min after",
    action: "",
    value: 900,
  },
  {
    title: "30 min after",
    action: "",
    value: 1800,
  },
  {
    title: "1 hr after",
    action: "",
    value: 3600,
  },
  {
    title: "2 hrs after",
    action: "",
    value: 7200,
  },
  {
    title: "3 hrs after",
    action: "",
    value: 10800,
  },
];
const StopRecordingScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [selectedItem, setSelectedItem] = useState<any>("");
  const onPress = (item: string) => {
    setSelectedItem(item);
    GLOBALS.store!.settings.dvr ? GLOBALS.store!.settings.dvr.stopRecording = item : GLOBALS.store!.settings.dvr = {stopRecording: item}
    updateStore(GLOBALS.store);
  };
  const getValues = () => {
    setSelectedItem(GLOBALS.store!.settings.dvr?.stopRecording);
  };
  useEffect(() => {
    getValues();
  }, []);

  return (
    <SideMenuLayout
      title={AppStrings.str_settings_home_dvr}
      subTitle={"Stop Recording"}
    >
      <FlatList
        data={list}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                onPress(item.value);
              }}
              style={
                index === focussed
                  ? { ...MFSettingsStyles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <View style={styles.icContainer}>
                {selectedItem === item.title ? (
                  <MFSelectCheckedBox />
                ) : (
                  <MFSelectUnCheckedBox />
                )}
              </View>
              <View style={styles.listContent}>
                <Text
                  style={[
                    styles.listText,
                    { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default StopRecordingScreen;

const styles = StyleSheet.create({
  contentTitleContainer: {
    height: 38,
    marginBottom: 16,
  },
  contentTitle: {
    color: "#EEEEEE",
    lineHeight: 38,
    fontSize: 28,
    letterSpacing: 0,
  },
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
  },
  icCircle: { width: 35, height: 35 },
  container: {
    width: "100%",
    height: 100,
    // justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
  },
  icContainer: {
    width: "15%",
    height: 83,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    width: "85%",
    height: 83,
    // alignContent: "center",
    // alignItems: "center",
    justifyContent: "center",
  },
});
