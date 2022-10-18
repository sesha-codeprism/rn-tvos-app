import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { GLOBALS } from "../../../../utils/globals";
import { updateStore } from "../../../../utils/helpers";
import {
  appUIDefinition,
  onscreenLanguageList,
} from "../../../../config/constants";
import { setOnScreenLanguage } from "../../../../config/strings";
import { GlobalContext } from "../../../../contexts/globalContext";
import { OnscreenLanguage } from "../../../../@types/UIDefinition";

interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const list = appUIDefinition.onscreenLanguage;
const OnScreenLanguageScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [selectedLang, setSelectedLang] = useState<any>("");
  const currentContext = useContext(GlobalContext);

  const onPress = (item: OnscreenLanguage) => {
    console.log("first");
    setSelectedLang(item.onScreenName);
    GLOBALS.store.settings.display.onScreenLanguage.title = item.onScreenName;
    GLOBALS.store.settings.display.onScreenLanguage.languageCode =
      item.languageCode;
    GLOBALS.store.settings.display.onScreenLanguage.enableRTL = item.isRTL;
    updateStore(JSON.stringify(GLOBALS.store));
    setOnScreenLanguage(item.languageCode);
    GLOBALS.enableRTL = item.isRTL;
    // currentContext.shouldEnableRTL(item.isRTL);
  };
  const getValues = () => {
    setSelectedLang(GLOBALS.store.settings.display.onScreenLanguage.title);
  };
  useEffect(() => {
    console.log("onscreenLanguageList", onscreenLanguageList);
    getValues();
  }, []);

  return (
    <SideMenuLayout title="Diaplay" subTitle="On Screen Language">
      <FlatList
        data={onscreenLanguageList}
        keyExtractor={(x, i) => i.toString()}
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
                {selectedLang === item.onScreenName ? (
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
                  {item.onScreenName}
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
              onPress(item.title);
            }}
            style={
              index === focussed
                ? { ...MFSettingsStyles.containerActive, ...styles.container }
                : styles.container
            }
            key={index}
          >
            <View style={styles.icContainer}>
              {selectedLang === item.title ? (
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
                {item.title}
              </Text>
            </View>
          </Pressable>
        );
      })} */}
    </SideMenuLayout>
  );
};

export default OnScreenLanguageScreen;

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
