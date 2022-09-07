import { Image, Pressable, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../config/styles/MFSettingsStyles";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { AppImages } from "../../../assets/images";
import { Routes } from "../../../config/navigation/RouterOutlet";
import { AppStrings } from "../../../config/strings";
interface Props {
  navigation?: NativeStackNavigationProp<any>;
}
const SettingsLandingScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focused, setFocused] = useState<any>(0);
  const menu = [
    {
      title: AppStrings.str_settings_account_label,
      action: "accounts_screen",
      icon: "",
    },
    {
      title: AppStrings.str_settings_pcon_label,
      action: "parental_controll",
      icon: "",
    },
    {
      title: AppStrings.str_settings_display_label,
      action: "display",
      icon: "",
    },
    {
      title: AppStrings.str_playback_audio_title,
      action: "audio",
      icon: "",
    },
    {
      title: AppStrings.str_menu_dvr,
      action: "dvr_settings",
      icon: "",
    },
    {
      title: AppStrings.str_settings_system_tab_label,
      action: "system_settings",
      icon: "",
    },
    // {
    //   title: "Developers",
    //   action: "shortCode",
    //   icon: "",
    // },
  ];

  useEffect(() => {}, [AppStrings]);
  return (
    <SideMenuLayout subTitle={AppStrings.str_navigation_settings}>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          console.log(item.title);
          return (
            <Pressable
              hasTVPreferredFocus={index === 0 ? true : false}
              onFocus={() => {
                setFocused(index);
              }}
              onPress={() => {
                if (item.action !== "") {
                  props.navigation.navigate(item.action);
                } else if (index === menu.length - 1) {
                  props.navigation.navigate("app", {
                    screen: Routes.ShortCode,
                  });
                } else {
                  null;
                }
              }}
              style={
                index === focused
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
                  { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
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
