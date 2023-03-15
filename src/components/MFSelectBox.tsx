import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const MFSelectCheckedBox = () => {
  return (
    <View style={styles.container}>
      <View style={styles.filledCircle} />
    </View>
  );
};
export const MFSelectUnCheckedBox = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: 35,
    borderColor: "#EEEEEE",
    borderRadius: 20,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  filledCircle: {
    height: 15,
    width: 15,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    // borderWidth: 3
  },
});
