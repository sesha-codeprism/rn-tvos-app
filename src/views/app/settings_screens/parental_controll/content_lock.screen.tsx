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
import { AppImages } from "../../../../assets/images";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { AppStrings } from "../../../../config/strings";
import { getList } from "../../../../../backend/udl/provider";
import { GLOBALS } from "../../../../utils/globals";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const ContentLockScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [list, setList] = useState<any>([]);
  const getList = () => {
    const listItem: any[] = [];
    const menuList: any = AppStrings.str_rating_providers;
    const data = GLOBALS.store.settings.parentalControll.contentLock;
    for (let key in menuList) {
      const selectedList = data[key];
      const item = {
        title: menuList[key],
        subTitle:
          selectedList && selectedList.length
            ? selectedList.length === 1
              ? `Locked: ${selectedList[selectedList.length - 1].title}`
              : `Locked: ${
                  selectedList[selectedList.length - 1].title
                } and above`
            : "Unrestricted",
        action: "ratings",
        navigation: key,
        icon: "",
      };
      console.log(
        "selected list in content lock ",
        selectedList,
        listItem.some((value) => value.title === item.title)
      );

      listItem.some((value) => value.title === item.title)
        ? null
        : listItem.unshift(item);
    }
    setList([
      ...listItem,
      {
        title: "Unrated Content",
        subTitle:
          data["lockUnratedContent"] === true ? "Locked" : "Unrestricted",
        action: "unrated_content",
        icon: "",
        navigation: "",
      },
    ]);
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      getList();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [GLOBALS.store.settings.parentalControll.contentLock]);

  return (
    <SideMenuLayout
      title="Parental Controls"
      subTitle="Content Locks"
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
                item.action !== ""
                  ? props.navigation.navigate(item.action, {
                      action: item.navigation,
                      title: item.title,
                    })
                  : null;
              }}
              style={
                index === focussed
                  ? { ...MFSettingsStyles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <View>
                <Text
                  style={[
                    styles.listText,
                    { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.listText,
                    {
                      color: index === focussed ? "#EEEEEE" : "#A7A7A7",
                      fontSize: 23,
                    },
                  ]}
                >
                  {item.subTitle}
                </Text>
              </View>
              <Image
                source={AppImages.arrow_right}
                style={{ width: 15, height: 30 }}
              />
            </Pressable>
          );
        }}
      />
      {/* <View> */}
      {/* {list.map((item: any, index: any) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                item.action !== ""
                  ? props.navigation.navigate(item.action, {
                      action: item.navigation,
                      title: item.title,
                    })
                  : null;
              }}
              style={
                index === focussed
                  ? { ...MFSettingsStyles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <View>
                <Text
                  style={[
                    styles.listText,
                    { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.listText,
                    {
                      color: index === focussed ? "#EEEEEE" : "#A7A7A7",
                      fontSize: 23,
                    },
                  ]}
                >
                  {item.subTitle}
                </Text>
              </View>
              <Image
                source={AppImages.arrow_right}
                style={{ width: 15, height: 30 }}
              />
            </Pressable>
          );
        })} */}
      {/* </View> */}
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

export default ContentLockScreen;

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 35,
  },
  container: {
    width: "100%",
    height: 120,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 30,
    display: "flex",
    flexDirection: "row",
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
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
