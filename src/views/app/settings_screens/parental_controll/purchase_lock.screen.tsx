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
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { PinActionTypes } from "./parental_controll.screen";
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
const PurchaseLockScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [locked, setLocked] = useState<any>("");

  const onPress = (value: any) => {
    try {
      setLocked(value);
      GLOBALS.store.settings.parentalControll.purchaseLock &&
      GLOBALS.store.settings.parentalControll.purchaseLock["locked"]
        ? (GLOBALS.store.settings.parentalControll.purchaseLock["locked"] =
            value === 0 ? true : false)
        : (GLOBALS.store.settings.parentalControll.purchaseLock = {
            ...GLOBALS.store.settings.parentalControll.purchaseLock,
            ["locked"]: value === 0 ? true : false,
          });
      updateStore(JSON.stringify(GLOBALS.store));
    } catch (error) {
      console.log("Error", error);
    }
  };
  const getData = () => {
    try {
      const selected =
        GLOBALS.store.settings.parentalControll.purchaseLock &&
        GLOBALS.store.settings.parentalControll.purchaseLock["locked"] !==
          undefined
          ? GLOBALS.store.settings.parentalControll.purchaseLock["locked"] ===
            true
            ? 0
            : 1
          : "";
      setLocked(selected);
    } catch (error) {}
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      getData();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [GLOBALS.store.settings.parentalControll.purchaseLock]);

  return (
    <SideMenuLayout
      title="Parental Controls"
      subTitle="Purchase Locks"
      contentContainerStyle={styles.contentContainer}
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
        contentContainerStyle={{
          height: "70%",
          width: "100%",
          justifyContent: "space-between",
        }}
        ListFooterComponentStyle={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
        }}
        ListFooterComponent={() => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed("cp");
              }}
              // onBlur={() => {
              //   setFocussed(false);
              // }}
              style={
                focussed === "cp"
                  ? [styles.changePinButton, { backgroundColor: "#053C69" }]
                  : styles.changePinButton
              }
              onPress={() => {
                props.navigation.navigate(Routes.PinLock, {
                  screenName: "Purchase Lock",
                  pinType: "purchase",
                  action:  PinActionTypes['UPDATE'],
                  label: "Input 4-digit PIN",
                });
              }}
            >
              <Text style={styles.changePinText}>Change PIN</Text>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default PurchaseLockScreen;

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
  changePinButton: {
    height: 66,
    width: 533,
    borderRadius: 6,
    backgroundColor: "#424242",
    // backgroundColor: "#053C69",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  changePinText: {
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
    color: "#EEEEEE",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
