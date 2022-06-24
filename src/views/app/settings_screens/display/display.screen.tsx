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
    title: "On Screen Language",
    subTitle: "English (US)",
    action: "on_screen_language",
    icon: "",
  },
  {
    title: "Closed Captions",
    subTitle: "On",
    action: "closed_caption",
    icon: "",
  },
  {
    title: "Primary Subtitle Language",
    subTitle: "English",
    action: "subtitle_language",
    type: "primary",
    icon: "",
  },
  {
    title: "Secondary Subtitle Language",
    subTitle: "None",
    action: "subtitle_language",
    type: "secondary",
    icon: "",
  },
  {
    title: "Video Quality",
    subTitle: "Better",
    action: "video_quality",
    icon: "",
  },
];
const DiaplayScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");

  return (
    <SideMenuLayout title="Settings" subTitle="Display">
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
  );
};

export default DiaplayScreen;

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
