import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import SideMenuLayout from "../../../../components/MFSideMenu";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const listItem = [
  {
    title: "Content Locks",
    subTitle: "Locked",
    action: "content_lock",
    icon: "",
  },
  {
    title: "Adult Locks",
    subTitle: "Locked",
    action: "adult_lock",
    icon: "",
  },
  {
    title: "Purchase Locks",
    subTitle: "Locked",
    action: "content_lock_pin",
    icon: "",
  },
];
const ParentalControllScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");

  return (
    <SideMenuLayout title="Settings" subTitle="Parental Controls">
      {listItem.map((item, index) => {
        return (
          <Pressable
            onFocus={() => {
              setFocussed(index);
            }}
            onPress={() => {
              index === 6
                ? () => {
                    props.navigation.toggleDrawer();
                    setFocussed("");
                  }
                : item.action !== ""
                ? props.navigation.navigate(item.action)
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
    </SideMenuLayout>
    // <View style={styles.root}>
    //   <View style={styles.headerContainer}>
    //     <Text style={styles.subTitle}>Settings</Text>
    //     <Text style={styles.titleText}>Parental Controls</Text>
    //   </View>
    //   <View style={styles.contentContainer}>

    //   </View>
    // </View>
  );
};

export default ParentalControllScreen;

const styles = StyleSheet.create({
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
});
