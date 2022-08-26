import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { fossLicense } from "../../../../config/constants";


interface Props {
    navigation: NativeStackNavigationProp<any>;
  }
const license = fossLicense;
const FossLicenseScreen: React.FunctionComponent<Props> = (props: any) => {
    return (
        <SideMenuLayout title="Settings" subTitle="FOSS License">
            {/* <ScrollView style={{width: '100%', height: '100%'}} nestedScrollEnabled> */}
            <View style={styles.container}>
                <Text style={styles.licenseText}>{fossLicense.licenseText}</Text>
                <Text style={styles.licenseText}>{fossLicense.licenseText}</Text>
            </View>
            {/* </ScrollView> */}
        </SideMenuLayout>
    )
}
export default FossLicenseScreen;
const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      width: 603,
      alignSelf: "center",
      display: "flex",
    },
    licenseText: {
        color: "white",
        //   fontFamily: Inter;
        fontSize: 25,
        letterSpacing: 0,
        lineHeight: 38,
      },
});