import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { fossLicense } from "../../../../config/constants";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../utils/dimensions";

interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const license = fossLicense;
const FossLicenseScreen: React.FunctionComponent<Props> = (props: any) => {
  return (
    <SideMenuLayout
      title="Settings"
      subTitle="FOSS License"
      contentContainerStyle={{ height: "100%" }}
    >
      {/* <ScrollView style={{width: '100%', height: '100%'}} nestedScrollEnabled> */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.container}
        hasTVPreferredFocus
        showsVerticalScrollIndicator
        isTVSelectable
      >
        <Text style={styles.licenseText}>{fossLicense.licenseText}</Text>
        <Text style={styles.licenseText}>{fossLicense.licenseText}</Text>
      </ScrollView>
      {/* </ScrollView> */}
    </SideMenuLayout>
  );
};
export default FossLicenseScreen;
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignSelf: "center",
    height: SCREEN_HEIGHT,
  },
  licenseText: {
    color: "white",
    //   fontFamily: Inter;
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
});
