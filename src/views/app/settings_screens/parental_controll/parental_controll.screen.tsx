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
interface Props {
  navigation: NativeStackNavigationProp<any>;
}

const ParentalControllScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [list, setList] = useState<any[]>([]);

  const formatList = () => {
    try {
      const values = GLOBALS.store.settings.parentalControll;
      const listItem = [
        {
          title: AppStrings.str_settings_pcon_contentlock,
          subTitle: _.isEmpty(values.contentLock)
            ? AppStrings.str_rating_unrestricted
            : AppStrings.str_pcon_challenge_pinLockedState,
          action: "content_lock",
          icon: "",
        },
        {
          title: AppStrings.str_settings_pcon_adultlock_description,
          subTitle:
            values.adultLock["adultContentMasking"] ||
            values.adultLock["allowAdultLocks"]
              ? AppStrings.str_pcon_challenge_pinLockedState
              : AppStrings.str_rating_unrestricted,
          action: "adult_lock",
          icon: "",
        },
        {
          title: AppStrings.str_settings_pcon_purchaselock,
          subTitle: values.purchaseLock["locked"]
            ? AppStrings.str_pcon_challenge_pinLockedState
            : AppStrings.str_rating_unrestricted,
          action: "purchase_lock",
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
      title={AppStrings.str_navigation_settings}
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
        }}
      />
      {/* {list.map((item: any, index: number) => {
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
      })} */}
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
