import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu";
import { AppImages } from "../../../../assets/images";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { Routes } from "../../../../config/navigation/RouterOutlet";
import { AppStrings } from "../../../../config/strings";
import { getList } from "../../../../../backend/udl/provider";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const ContentLockScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [list, setList] = useState<any>([]);
  const listItem = [
    // {
    //   title: "Movie Ratings",
    //   subTitle: "Locked: R and above",
    //   action: "movie_rating",
    //  navigation: "",
    //   icon: "",
    // },
    // {
    //   title: "TV Ratings",
    //   subTitle: "Locked: TV-MA and above",
    //   action: "tv_rating",
    //   navigation: "",
    //   icon: "",
    // },
    {
      title: "Unrated Content",
      subTitle: "Locked",
      action: "unrated_content",
      icon: "",
      navigation: "",
    },
  ];
  const getList = () => {
    const menuList: any = AppStrings.str_rating_providers;
    for (let key in menuList) {
      listItem.unshift({
        title: menuList[key],
        subTitle: "Locked: R and above",
        action: 'ratings',
        navigation: key,
        icon: "",
      });
    }
    setList(listItem.sort());
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <SideMenuLayout
      title="Parental Controls"
      subTitle="Content Locks"
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        {list.map((item: any, index: any) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                item.action !== ""
                  ? props.navigation.navigate(item.action,{action: item.navigation, title: item.title})
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
        })}
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
