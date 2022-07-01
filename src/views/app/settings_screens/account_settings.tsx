import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MFPopup from "../../../components/MFPopup";
import { GLOBALS } from "../../../utils/globals";
import SideMenuLayout from "../../../components/MFSideMenu";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const AccountSettingsScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    // const unsubscribe = props.navigation.addListener("beforeRemove", () => {
    //   // do something
    //   console.warn("Warning before removing component acc settings");
    // });
    // return unsubscribe;
  }, [props.navigation]);

  return (
    <SideMenuLayout
      title="Account Settings"
      subTitle="Account Signout"
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <Text style={[styles.titleText, { fontSize: 29 }]}>
          You are currently logged in as:
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
            setShowAlert(true);
          }}
        >
          <Text style={[styles.titleText, { fontSize: 29 }]}>Sign Out</Text>
        </Pressable>
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
    </SideMenuLayout>
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
