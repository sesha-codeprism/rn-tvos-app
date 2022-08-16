import {
  Image,
  Pressable,
  Text,
  useTVEventHandler,
  TVEventHandler,
  FlatList,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFSettingsStyles from "../../../config/styles/MFSettingsStyles";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
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
    action: "audio",
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
  // const [lastEventType, setLastEventType] = React.useState("");

  // const myTVEventHandler = (evt: any) => {
  //   setLastEventType(evt.eventType);
  // };

  // useTVEventHandler(myTVEventHandler);
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
      {/* {menu.map((item, index) => {
        return (
          <TouchableOpacity
            // hasTVPreferredFocus={index === 0 ? true : false}
            onFocus={() => {
              console.log("on focus triggered", index, lastEventType);
              setFocussed(index);
            }}
            onBlur={() => {
              console.log("Blur triggered", index, lastEventType);
            }}
            onPress={() => {
              if (item.action !== "") {
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
            // isTVSelectable={true}
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
          </TouchableOpacity>
        );
      })} */}
    </SideMenuLayout>
  );
};

export default SettingsLandingScreen;
