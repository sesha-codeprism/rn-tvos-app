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
import { AppStrings } from "../../../../config/strings";
import { GLOBALS } from "../../../../utils/globals";
import { updateStore } from "../../../../utils/helpers";
import {
  MFSelectCheckedBox,
  MFSelectUnCheckedBox,
} from "../../../../components/MFSelectBox";

import { MFGlobalsConfig } from "../../../../../backend/configs/globals";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const list = MFGlobalsConfig.config.bitrates10ft;

const VideoQualityScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [selectedQyality, setSelectedQyality] = useState<any>({});
  const onPress = (item: any) => {
    setSelectedQyality(item);
    GLOBALS.store!.settings.display.bitrates10ft = item;
    updateStore(GLOBALS.store);
  };
  const getValues = () => {
    setSelectedQyality(GLOBALS.store!.settings.display.bitrates10ft);
  };
  useEffect(() => {
    getValues();
  }, []);
  return (
    <SideMenuLayout
      title={AppStrings.str_settings_home_display}
      subTitle={AppStrings.str_settings_display_video_quality}
    >
      <FlatList
        data={list}
        keyExtractor={(item) => item.localizedText}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                onPress(item);
              }}
              style={
                index === focussed
                  ? { ...MFSettingsStyles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <View style={styles.icContainer}>
                {item.id === selectedQyality.id ? (
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
                  {AppStrings[item.localizedText]}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
      {/* {list.map((item: any, index: any) => {
        return (
          <Pressable
            onFocus={() => {
              setFocussed(index);
            }}
            onPress={() => {
              onPress(item);
            }}
            style={
              index === focussed
                ? { ...MFSettingsStyles.containerActive, ...styles.container }
                : styles.container
            }
            key={index}
          >
            <View style={styles.icContainer}>
              {item.id === selectedQyality.id ? (
                <Image
                  source={AppImages.checked_circle}
                  style={styles.icCircle}
                />
              ) : (
                <Image
                  source={AppImages.unchecked_circle}
                  style={styles.icCircle}
                />
              )}
            </View>
            <View style={styles.listContent}>
              <Text
                style={[
                  styles.listText,
                  { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {AppStrings[item.localizedText]}
              </Text>
            </View>
          </Pressable>
        );
      })} */}
    </SideMenuLayout>
  );
};

export default VideoQualityScreen;

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
