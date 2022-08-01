import { Image, Pressable, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../config/styles/MFSettingsStyles";
import SideMenuLayout from "../../../components/MFSideMenu";
import { AppImages } from "../../../assets/images";
import { DrawerActions } from "@react-navigation/native";
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
            // hasTVPreferredFocus={index === 0 ? true : false}
            onFocus={() => {
              console.log("index", index);
              setFocussed(index);
            }}
            onPress={() => {
              if (index === 6) {
                console.log("Props", props.navigation);
                props.navigation.dispatch(DrawerActions.toggleDrawer());
                // if (props.navigation.canGoBack) {
                //   console.log("Can go back");
                //   props.navigation.goBack();
                // } else {
                //   console.log("Can't go back");
                // }
                setFocussed("");
              } else if (item.action !== "") {
                props.navigation.navigate(item.action);
              } else {
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
