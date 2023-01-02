import { StyleSheet, Text, View } from "react-native";
import React, {  } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GLOBALS } from "../../../../utils/globals";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { AppStrings } from "../../../../config/strings";

interface DeveloperCurrentStoreSettingsProps {
  navigation: NativeStackNavigationProp<any>;
}
const DeveloperCurrentStoreSettingsScreen: React.FunctionComponent<DeveloperCurrentStoreSettingsProps> = (
  props
) => {

  return (
    <>
      <SideMenuLayout
        title={AppStrings?.developer_settings}
        subTitle={AppStrings?.developer_settings_current_store}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <Text style={[styles.titleText, { fontSize: 25 }]}>
            {AppStrings?.developer_settings_store_version}
          </Text>
          <Text style={styles.emailText}>
            {GLOBALS?.store?.CurrentStoreID}
          </Text>
        </View>
      </SideMenuLayout>
    </>
  );
};

export default DeveloperCurrentStoreSettingsScreen;

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
