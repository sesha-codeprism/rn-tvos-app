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
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const languages = ["en", "fr", "es", "de", "sa", "hi", "kn", "pt"];
const AudioLanguageScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [selectedLang, setSelectedLang] = useState<any>("");
  const [list, setList] = useState<string[]>([]);
  const onPress = (item: string) => {
    // try {
    //   setSelectedLang(item);
    //   console.log("props.route.params.type", props.route.params.type);
    //   if (props.route.params.type === "primary") {
    //     GLOBALS.store.settings.display.subtitleConfig.primary = item;
    //   } else {
    //     GLOBALS.store.settings.display.subtitleConfig.secondary = item;
    //   }
    //   updateStore(JSON.stringify(GLOBALS.store));
    // } catch (error) {
    //   console.log("error", error);
    // }
  };
  const getValues = () => {
    // const selectedValue =
    //   props.route.params.type === "primary"
    //     ? GLOBALS.store.settings.display.subtitleConfig.primary
    //     : GLOBALS.store.settings.display.subtitleConfig.secondary;
    // setSelectedLang(selectedValue);
  };
  useEffect(() => {
    // const langList = GLOBALS.store.settings.display.subtitleConfig.tracks;
    const langList = languages;
    setList(langList);
    // console.log("lang list", langList);

    getValues();
  }, []);

  return (
    <SideMenuLayout
      title="Audio"
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
                  {AppStrings.ISO[item]}
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
