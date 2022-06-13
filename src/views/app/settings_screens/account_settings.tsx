import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFPopup from "../../../components/MFPopup";
import { GLOBALS } from "../../../utils/globals";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const AccountSettingsScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <Text style={styles.subTitle}>Account Settings</Text>
        <Text style={styles.titleText}>Account Signout</Text>
      </View>
      <View style={styles.contentContainer}>
        <View>
          <Text style={[styles.titleText, { fontSize: 29 }]}>
            You are currently logged in as:
          </Text>
          <Text style={styles.emailText}>{GLOBALS.bootstrapSelectors?.AccountId}</Text>
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
              setShowAlert(true);
            }}
          >
            <Text style={[styles.titleText, { fontSize: 29 }]}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
      {showAlert && (
        <MFPopup
          buttons={[
            {
              title: "Yes",
              onPress: () => {
                console.log("signout pressed");
                setShowAlert(false);
                props.navigation.goBack();
              },
            },
            {
              title: "Cancel",
              onPress: () => {
                setShowAlert(false);
              },
            },
          ]}
          description={"Are you sure that you want to sign out?"}
        />
      )}
    </View>
  );
};

export default AccountSettingsScreen;

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: "#202124",
  },
  headerContainer: {
    width: "100%",
    height: "20%",
    backgroundColor: "#00030E",
    padding: 50,
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    padding: 50,
    height: "80%",
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
  subTitle: {
    color: "#A7A7A7",
    fontSize: 31,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 50,
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
