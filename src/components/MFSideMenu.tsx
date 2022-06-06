import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AppImages } from "../config/images";
const menu = [
  {
    title: "Account Settings",
    action: () => {console.log("Account Settings")},
    icon: "",
  },
  {
    title: "Parental Controls",
    action: () => {console.log("Parental Controls")},
    icon: "",
  },
  {
    title: "Display",
    action: () => {console.log('"Display"')},
    icon: "",
  },
  {
    title: "Audio",
    action: () => {console.log("audio")},
    icon: "",
  },
  {
    title: "DVR Settings",
    action: () => {console.log("DVR Settings")},
    icon: "",
  },
  {
    title: "System",
    action: () => {console.log('System')},
    icon: "",
  },
  {
    title: "Developers",
    action: () => {console.log('Developers')},
    icon: "",
  },
];
const MFSideMenu = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  return (
    // <DrawerContentScrollView {...props}>
      <View style={styles.root}>
        <View style={styles.headerContainer}>
        <Text style={styles.titleText}>Settings</Text>
        </View>
        <View style={styles.contentContainer}>
        {menu.map((item, index) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={index === 6 ? ()=>{props.navigation.toggleDrawer(); setFocussed('')} : item.action}
              style={
                index === focussed
                  ? { ...styles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <Text
                style={[
                  styles.listText,
                  { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {item.title}
              </Text>
              <Image source={AppImages.arrow_right} style={{width:15, height: 30}} />
            </Pressable>
          );
        })}
        </View>
      </View>
    // </DrawerContentScrollView>
  );
};

export default MFSideMenu;

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: "#202124",
  },
  headerContainer:{
    width: "100%",
    height:185,
    backgroundColor:'#00030E',
    padding: 50,
    justifyContent:'center'
  },
  contentContainer:{
    width: "100%",
    padding: 50,
  },
  titleText: {
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 55,
    color: "white",
  },
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
  },
  container: {
    width: "100%",
    height: 100,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems:'center',
    padding: 30,
    display:'flex',
    flexDirection:'row'
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
  },
});
