import { DeviceEventEmitter, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS, resetAuthData } from "../../../utils/globals";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { getStore, updateStore } from "../../../utils/helpers";
import { Routes } from "../../../config/navigation/RouterOutlet";
import { resetCaches } from "../../../config/queries";
import { AppStrings } from "../../../config/strings";
import { deleteDevice } from "../../../../backend/subscriber/subscriber";

interface AccountSettingsProps {
  navigation: NativeStackNavigationProp<any>;
}
const AccountSettingsScreen: React.FunctionComponent<AccountSettingsProps> = (
  props
) => {
  const [focussed, setFocussed] = useState(false);
  const [isTesting, setTesting] = useState(false);
  useEffect(() => {}, [props.navigation]);

  const logUserOut = async () => {
    const resp = await deleteDevice();
    console.log("Logout", resp);
    /** Get default store for user */
    const resetStore = resetAuthData();
    console.log("After resetting", resetStore);
    /** Update the current Async NSUserDefaults store with resetStore */
    updateStore(resetStore);
    console.log("Current store after cleanup", getStore());
    /** Reset the Query cache to make sure no cached API data is returned by React-Query */
    resetCaches();
    GLOBALS.userProfile = undefined;
    GLOBALS.rootNavigation.replace(Routes.ShortCode);
  };

  return (
    <>
      <SideMenuLayout
        title={AppStrings.str_settings_account_heading}
        subTitle={AppStrings.str_settings_account_label}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <Text style={[styles.titleText, { fontSize: 29 }]}>
            {AppStrings.str_settings_signout_Account_loginaccount_label}
          </Text>
          <Text style={styles.emailText}>
            {GLOBALS.bootstrapSelectors?.AccountId}
          </Text>
        </View>
        <View>
          <Pressable
            hasTVPreferredFocus={true}
            onFocus={() => {
              setFocussed(true);
            }}
            onBlur={() => {
              setFocussed(false);
            }}
            style={
              focussed
                ? [styles.signoutButton, { backgroundColor: "#053C69" }]
                : styles.signoutButton
            }
            onPress={() => {
              DeviceEventEmitter.emit("openPopup", {
                buttons: [
                  {
                    title: "Yes",
                    onPress: () => {
                      console.log("signout pressed");
                      // Assumes close popup on each action, whether Yes or No or Cancel
                      DeviceEventEmitter.emit("closePopup", null);
                      DeviceEventEmitter.emit("closeSettings", null);
                      logUserOut();

                    },
                  },
                  {
                    title: "Cancel",
                    onPress: () => {
                    // Assumes close popup on each action, whether Yes or No or Cancel
                    DeviceEventEmitter.emit("closePopup", null);
                    },
                  },
                ],
                description: "Are you sure that you want to sign out?"
              });
            }}
          >
            <Text style={[styles.titleText, { fontSize: 29 }]}>
              {AppStrings.str_settings_account_signout}
            </Text>
          </Pressable>
        </View>
      </SideMenuLayout>
    </>
  );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 55,
    color: "white",
  },
  emailText: {
    color: "#A7A7A7",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
  signoutButton: {
    height: 66,
    width: 533,
    borderRadius: 6,
    backgroundColor: "#424242",
    // backgroundColor: "#053C69",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  signoutText: {},
});
