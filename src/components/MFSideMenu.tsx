import { StyleSheet, Text, View } from "react-native";
import React from "react";
interface Props {
  title?: string;
  subTitle?: string;
  contentContainerStyle?: any;
}

const SideMenuLayout: React.FunctionComponent<Props> = (props) => {
  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <Text style={styles.subTitle}>{props.title}</Text>
        {props.subTitle ? (
          <Text style={styles.titleText}>{props.subTitle}</Text>
        ) : null}
      </View>
      {/* <ScrollView> */}
      <View
        style={
          props.contentContainerStyle
            ? { ...styles.contentContainer, ...props.contentContainerStyle }
            : styles.contentContainer
        }
      >
        {props.children}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default SideMenuLayout;

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    backgroundColor: "#202124",
  },
  headerContainer: {
    width: "100%",
    height: 185,
    backgroundColor: "#00030E",
    padding: 50,
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    padding: 30,
    paddingTop: 10,
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
});
