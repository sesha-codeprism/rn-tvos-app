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
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const list = [
  {
    title: "Yes",
    action: true,
  },
  {
    title: "No",
    action: false,
  },
];
const UnratedContentScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [locked, setLocked] = useState<any>("");

  const onPress = (value: any) => {
    try {
      setLocked(value);
      GLOBALS.store.settings.parentalControll.contentLock &&
      GLOBALS.store.settings.parentalControll.contentLock["lockUnratedContent"]
        ? (GLOBALS.store.settings.parentalControll.contentLock[
            "lockUnratedContent"
          ] = value === 0 ? true : false)
        : (GLOBALS.store.settings.parentalControll.contentLock = {
            ...GLOBALS.store.settings.parentalControll.contentLock,
            ["lockUnratedContent"]: value === 0 ? true : false,
          });
      updateStore(GLOBALS.store);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const getData = () => {
    try {
      const selected =
        GLOBALS.store.settings.parentalControll.contentLock &&
        GLOBALS.store.settings.parentalControll.contentLock[
          "lockUnratedContent"
        ] !== undefined
          ? GLOBALS.store.settings.parentalControll.contentLock[
              "lockUnratedContent"
            ] === true
            ? 0
            : 1
          : "";
      setLocked(selected);
    } catch (error) {}
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <SideMenuLayout title="Content Locks" subTitle="Unrated Content">
      <View style={styles.contentTitleContainer}>
        <Text style={styles.contentTitle}>Lock unrated content</Text>
      </View>
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
                onPress(index);
              }}
              style={
                index === focussed
                  ? { ...MFSettingsStyles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <View style={styles.icContainer}>
                {locked === index ? (
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
        }}
      />
      {/* {list.map((item: any, index: any) => {
        return (
          <Pressable
            onFocus={() => {
              setFocussed(index);
            }}
            onPress={() => {
              onPress(index);
            }}
            style={
              index === focussed
                ? { ...MFSettingsStyles.containerActive, ...styles.container }
                : styles.container
            }
            key={index}
          >
            <View style={styles.icContainer}>
              {locked === index ? (
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

export default UnratedContentScreen;

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
