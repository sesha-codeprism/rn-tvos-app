import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS } from "../../../../utils/globals";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import useLanding from "../../../../customHooks/useLandingData";
import { AppStrings } from "../../../../config/strings";

interface DeveloperUserInfoSettingsProps {
  navigation: NativeStackNavigationProp<any>;
}
const DeveloperUserInfoSettingsScreen: React.FunctionComponent<
  DeveloperUserInfoSettingsProps
> = (props) => {
  const landingResponse = useLanding(GLOBALS.store?.MFGlobalsConfig?.url);

  return (
    <>
      <SideMenuLayout
        title={AppStrings?.developer_settings}
        subTitle={AppStrings?.developer_settings_user_info}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_user_info_account}
          </Text>
          <Text style={styles.emailText}>
            {GLOBALS.bootstrapSelectors?.AccountId}
          </Text>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_user_info_userid}
          </Text>
          <Text style={styles.emailText}>
            {GLOBALS.bootstrapSelectors?.UserId}
          </Text>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_user_info_subscriber_group}
          </Text>
          <Text style={styles.emailText}>
            {GLOBALS.bootstrapSelectors?.SubscriberGroupIds}
          </Text>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_user_info_subscriber_local}
          </Text>
          <Text style={styles.emailText}>
            {GLOBALS.store?.onScreenLanguage?.languageCode}
          </Text>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_user_info_subscriber_acceptLaguage}
          </Text>
          <Text style={styles.emailText}>
            {landingResponse.data?.data?.acceptLanguage}
          </Text>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_user_info_subscriber_acceptLaguage}
          </Text>
          <Text style={styles.emailText}>
            {landingResponse.data?.data?.acceptLanguage}
          </Text>
        </View>
      </SideMenuLayout>
    </>
  );
};

export default DeveloperUserInfoSettingsScreen;

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
