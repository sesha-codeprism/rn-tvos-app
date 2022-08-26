import { Image, Pressable, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../config/styles/MFSettingsStyles";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { AppImages } from "../../../assets/images";
import { Routes } from "../../../config/navigation/RouterOutlet";
const menu = [
  {
    title: "Account Settings",
    action: "accounts_screen",
    icon: "",
  },
  {
    title: "Parental Controls",
    action: "parental_controll",
    icon: "",
  },
  {
    title: "Display",
    action: "display",
    icon: "",
  },
  {
    title: "Audio",
    action: "audio",
    icon: "",
  },
  {
    title: "DVR Settings",
    action: "dvr_settings",
    icon: "",
  },
  {
    title: "System",
    action: "system_settings",
    icon: "",
  },
  // {
  //   title: "Developers",
  //   action: "shortCode",
  //   icon: "",
  // },
];
interface Props {
  navigation?: NativeStackNavigationProp<any>;
}
const SettingsLandingScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>(0);

  useEffect(() => {
    // const unsubscribe = props.navigation.addListener("beforeRemove", () => {
    //   // do something
    //   // console.warn("Warning before removing component");
    // });
    // return unsubscribe;
  }, []);
  return (
    <SideMenuLayout subTitle="Settings">
      <FlatList
        data={menu}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              hasTVPreferredFocus={index === 0 ? true : false}
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                if (item.action !== "") {
                  props.navigation.navigate(item.action);
                } 
                else if (index === menu.length - 1) {
                  props.navigation.navigate('app', { screen: Routes.ShortCode })
                }
                 else {
                  null;
                }
              }}
              style={
                index === focussed
                  ? {
                      ...MFSettingsStyles.containerActive,
                      ...MFSettingsStyles.container,
                    }
                  : MFSettingsStyles.container
              }
              key={index}
              isTVSelectable={true}
            >
              <Text
                style={[
                  MFSettingsStyles.listText,
                  { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {item.title}
              </Text>
              <Image
                source={AppImages.arrow_right}
                style={{ width: 15, height: 30 }}
              />
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default SettingsLandingScreen;
