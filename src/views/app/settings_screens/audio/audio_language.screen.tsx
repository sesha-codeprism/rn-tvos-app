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
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const AudioLanguageScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [selectedLang, setSelectedLang] = useState<any>("");
  const [list, setList] = useState<string[]>([]);
  const primary = GLOBALS.store!.settings.audio.audioLanguages.primary;
  const onPress = (item: string) => {
    try {
      setSelectedLang(item);
      console.log("props.route.params.type", props.route.params.type);
      if (props.route.params.type === "primary") {
        GLOBALS.store!.settings.audio.audioLanguages.primary = item;
      } else {
        GLOBALS.store!.settings.audio.audioLanguages.secondary = item;
      }
      updateStore(GLOBALS.store);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getValues = () => {
    const selectedValue =
      props.route.params.type === "primary"
        ? GLOBALS.store!.settings.audio.audioLanguages.primary
        : GLOBALS.store!.settings.audio.audioLanguages.secondary;
    setSelectedLang(selectedValue);
  };
  useEffect(() => {
    const langList = GLOBALS.store!.settings.audio.audioLanguages.tracks;

    setList(langList);
    // console.log("lang list", langList);

    getValues();
  }, []);

  return (
    <SideMenuLayout
      title={AppStrings.str_settings_home_audio}
      subTitle={`${
        props.route.params.type === "primary" ? "Primary" : "Secondary"
      } Audio Language`}
    >
      <FlatList
        data={list}
        keyExtractor={(item) => item}
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
                {selectedLang === item ? (
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
                  {item === primary && !(props.route.params.type === "primary")
                    ? `${AppStrings.ISO[item]} - Primary`
                    : AppStrings.ISO[item]}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default AudioLanguageScreen;

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
