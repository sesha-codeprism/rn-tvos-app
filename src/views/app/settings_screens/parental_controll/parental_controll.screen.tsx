import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { GLOBALS } from "../../../../utils/globals";
import _ from "lodash";
import { AppStrings } from "../../../../config/strings";
import { Routes } from "../../../../config/navigation/RouterOutlet";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
export enum PinActionTypes {
  "CREATE" = "create",
  "VERIFY" = "verify",
  "UPDATE" = "update",
  "CONFIRM" = "confirm",
}
const ParentalControllScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [list, setList] = useState<any[]>([]);

  const formatList = () => {
    try {
      const values = GLOBALS.store.settings.parentalControll;
      const listItem = [
        {
          title: AppStrings.str_settings_content_locks,
          subTitle: _.isEmpty(values.contentLock)
            ? AppStrings.str_settings_unrestricted
            : AppStrings.str_settings_locked,
          action: "pin_lock",
          screenTarget: Routes.ContentLock,
          icon: "",
        },
        {
          title: AppStrings.str_settings_adult_locks,
          subTitle:
            values.adultLock["adultContentMasking"] ||
            values.adultLock["allowAdultLocks"]
              ? AppStrings.str_settings_locked
              : AppStrings.str_settings_unrestricted,
          action: "pin_lock",
          screenTarget: Routes.AdultLock,
          icon: "",
        },
        {
          title: AppStrings.str_settings_content_purchase_locks,
          subTitle: values.purchaseLock["locked"]
            ? AppStrings.str_settings_locked
            : AppStrings.str_settings_unrestricted,
          action: "pin_lock",
          screenTarget: Routes.PurchaseLock,
          icon: "",
        },
      ];
      setList(listItem);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      formatList();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [
    GLOBALS.store.settings.parentalControll.adultLock,
    GLOBALS.store.settings.parentalControll.contentLock,
    GLOBALS.store.settings.parentalControll.purchaseLock,
  ]);

  return (
    <SideMenuLayout
      title={AppStrings.str_settings_parental_controls}
      subTitle={AppStrings.str_settings_pcon_label}
    >
      <FlatList
        data={list}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                item.action === "pin_lock"
                  ? props.navigation.navigate(item.action, {
                      screenName: item.title,
                      pinType:
                        item.title === AppStrings.str_settings_pcon_contentlock
                          ? "parentalcontrol"
                          : item.title ===
                            AppStrings.str_settings_pcon_purchaselock
                          ? "purchase"
                          : item.title ===
                            AppStrings.str_settings_pcon_adultlock_description
                          ? "adult"
                          : "",
                      action: PinActionTypes["VERIFY"],
                      label: "Input 4-digit PIN",
                      screenTarget: item.screenTarget,
                    })
                  : item.action !== "" && item.action !== "pin_lock"
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
        }}
      />
    </SideMenuLayout>
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
