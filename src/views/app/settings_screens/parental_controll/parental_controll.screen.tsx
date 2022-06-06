import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../config/images";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const listItem = [
  {
    title: "Content Locks",
    subTitle: "Locked",
    action: "accounts_screen",
    icon: "",
  },
  {
    title: "Adult Locks",
    subTitle: "Locked",
    action: "",
    icon: "",
  },
];
const ParentalControllScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");

  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <Text style={styles.subTitle}>Settings</Text>
        <Text style={styles.titleText}>Parental Controls</Text>
      </View>
      <View style={styles.contentContainer}>
        {listItem.map((item, index) => {
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
                  ? { ...styles.containerActive, ...styles.container }
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
        })}
      </View>
    </View>
  );
};

export default ParentalControllScreen;

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
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
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
