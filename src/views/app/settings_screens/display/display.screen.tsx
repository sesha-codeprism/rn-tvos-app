import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import SideMenuLayout from "../../../../components/MFSideMenu";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { GLOBALS } from "../../../../utils/globals";
import { AppStrings } from "../../../../config/strings";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const DiaplayScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [list, setList] = useState<any[]>([]);
  const formatList = () => {
    const values = GLOBALS.store.settings.display;
    const listItem = [
      {
        title: "On Screen Language",
        subTitle: values.onScrreenLanguage,
        action: "on_screen_language",
        icon: "",
      },
      {
        title: "Closed Captions",
        subTitle: values.closedCaption,
        action: "closed_caption",
        icon: "",
      },
      {
        title: "Primary Subtitle Language",
        subTitle: AppStrings.ISO[values.subtitleConfig.primary],
        action: "subtitle_language",
        type: "primary",
        icon: "",
      },
      {
        title: "Secondary Subtitle Language",
        subTitle:
          values.subtitleConfig.secondary !== "None"
            ? AppStrings.ISO[values.subtitleConfig.secondary]
            : values.subtitleConfig.secondary,
        action: "subtitle_language",
        type: "secondary",
        icon: "",
      },
      {
        title: "Video Quality",
        subTitle: AppStrings[values.bitrates10ft.localizedText],
        action: "video_quality",
        icon: "",
      },
    ];
    setList([...listItem]);
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      formatList();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);
  return (
    <SideMenuLayout title="Settings" subTitle="Display">
      {list.map((item, index) => {
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
                ? item.type
                  ? props.navigation.navigate(item.action, {
                      type: item.type,
                    })
                  : props.navigation.navigate(item.action)
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
