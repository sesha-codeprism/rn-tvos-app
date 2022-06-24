import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { GLOBALS } from "../../../../utils/globals";
import { updateStore } from "../../../../utils/helpers";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const list = [
  {
    title: "Hide Adult Store",
    action: "allowAdultLocks",
  },
  {
    title: "Hide Adult Content",
    action: "adultContentMasking",
  },
];
const AdultLockScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const onPress = (item: any) => {
    const selectedItems = selected;
    selectedItems[item.action] !== undefined
      ? (selectedItems[item.action] = !selectedItems[item.action])
      : (selectedItems[item.action] = true);
    setSelected({...selected,...selectedItems});
    GLOBALS.store.settings.parentalControll.adultLock = {...selected,...selectedItems};
    updateStore(JSON.stringify(GLOBALS.store));
  };
  // const onPress = (value: any) => {
  //   try {
  //     setLocked(value);
  //     GLOBALS.store.settings.parentalControll.contentLock &&
  //     GLOBALS.store.settings.parentalControll.purchaseLock["locked"]
  //       ? (GLOBALS.store.settings.parentalControll.purchaseLock[
  //           "locked"
  //         ] = value === 0 ? true : false)
  //       : (GLOBALS.store.settings.parentalControll.purchaseLock = {
  //           ...GLOBALS.store.settings.parentalControll.contentLock,
  //           ["locked"]: value === 0 ? true : false,
  //         });
  //     updateStore(JSON.stringify(GLOBALS.store));
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };
  const getData = () => {
    try {
      const selectedLocks = GLOBALS.store.settings.parentalControll.adultLock;
      setSelected(selectedLocks);
    } catch (error) {}
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <SideMenuLayout
      title="Parental Controls"
      subTitle="Adult Locks"
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <View style={styles.contentTitleContainer}>
          <Text style={styles.contentTitle}>Adult lock options</Text>
        </View>
        <View>
          {list.map((item: any, index: any) => {
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
                    ? {
                        ...MFSettingsStyles.containerActive,
                        ...styles.container,
                      }
                    : styles.container
                }
                key={index}
              >
                <View style={styles.icContainer}>
                  {selected[item.action] === true ? (
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
          })}
        </View>
      </View>
      <View>
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
            props.navigation.navigate(Routes.ContentLockPin);
          }}
        >
          <Text style={styles.changePinText}>Change PIN</Text>
        </Pressable>
      </View>
    </SideMenuLayout>
  );
};

export default AdultLockScreen;

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentTitleContainer: {
    height: 38,
    marginBottom: 16,
    marginTop: 30,
    paddingLeft: 30,
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
    width: "12%",
    height: 83,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    width: "88%",
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
});
