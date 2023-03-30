import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { AppStrings } from "../../../../config/strings";
import { GLOBALS } from "../../../../utils/globals";

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const SystemInformationScreen: React.FunctionComponent<Props> = (
  props: any
) => {
  const [list, setList] = useState<any[]>([]);
  const formatList = async () => {
    const ipAddress = await DeviceInfo.getIpAddress();
    console.log("ipAddress", ipAddress);
    const bootstrap = GLOBALS.bootstrapSelectors;
    console.log("bootstrap", bootstrap);
    const listItem = [
      {
        title: "Network Info",
        description: ipAddress,
      },
      {
        title: "In Home Status",
        description: GLOBALS.networkIHD?.status === "inHome"
        ? AppStrings?.str_settings_about_inhome
        : AppStrings?.str_settings_about_out_of_home  
      },
      {
        title: "Device ID",
        description: bootstrap?.DeviceId
          ? bootstrap?.DeviceId.toString()
          : "NA",
      },
      {
        title: "Experience Group",
        description:
          bootstrap?.ExperienceGroup?.toString() ||
          "No experience group details found",
      },
      {
        title: "Channel Map",
        description: bootstrap?.ChannelMapGroupName
          ? bootstrap?.ChannelMapGroupName.toString()
          : "NA",
      },
      {
        title: "Player Version",
        description: "NA",
      },
      {
        title: "App Version",
        description: "NA",
      },
      {
        title: "API Version",
        description: "NA",
      },
    ];
    return setList([...listItem]);
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      console.log("focussed fired in display screen");
      // The screen is focused
      // Call for action
      formatList()
        .then(() => {
          console.log("FormatList done");
        })
        .catch((err) => {
          console.log("Encountered some error during formatList", err);
        });
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);
  return (
    <SideMenuLayout
      title={AppStrings.str_settings_home_system}
      subTitle={AppStrings.str_settings_system_information}
    >
      <FlatList
        style={styles.container}
        data={list}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              //   isTVSelectable={
              //     index === 0 && index === list.length - 1 ? true : false
              //   }
              hasTVPreferredFocus={index === 0 ? true : false}
              style={styles.listItemContainer}
            >
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};
export default SystemInformationScreen;
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    width: 603,
    alignSelf: "center",
    display: "flex",
  },
  listItemContainer: {
    marginTop: 30,
  },
  titleText: {
    color: "#A7A7A7",
    //   fontFamily: Inter;
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
  descriptionText: {
    color: "white",
    //   fontFamily: Inter;
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
});
