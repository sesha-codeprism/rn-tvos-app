import { Image, Pressable, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../config/styles/MFSettingsStyles";
import SideMenuLayout from "../../../components/MFSideMenu";
import { AppImages } from "../../../assets/images";
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
    action: "",
    icon: "",
  },
  {
    title: "DVR Settings",
    action: "",
    icon: "",
  },
  {
    title: "System",
    action: "",
    icon: "",
  },
  {
    title: "Developers",
    action: "",
    icon: "",
  },
];
interface Props {
  navigation?: NativeStackNavigationProp<any>;
}
const SettingsLandingScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>(0);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("beforeRemove", () => {
      // do something
      console.warn("Warning before removing component");
    });
    return unsubscribe;
  }, [props.navigation]);
  return (
    <SideMenuLayout subTitle="Settings">
      {menu.map((item, index) => {
        return (
          <Pressable
            hasTVPreferredFocus={index === 0 ? true : false}
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
                ? {
                    ...MFSettingsStyles.containerActive,
                    ...MFSettingsStyles.container,
                  }
                : MFSettingsStyles.container
            }
            key={index}
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
      })}
    </SideMenuLayout>
  );
};

export default SettingsLandingScreen;
