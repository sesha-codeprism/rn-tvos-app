import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MFText from "./MFText";
import { MFTabBarStyles } from "./MFTabBar/MFTabBarStyles";

const MFOverlay = ({ displayString }: { displayString: string }) => {
  return (
    <View
      style={{
        backgroundColor: "#222222",
        alignSelf: "flex-end",
        // marginRight: 30,
        // marginTop: 10,
        // borderRadius: 5,
        padding: 10,
      }}
    >
      <MFText
        displayText={displayString}
        shouldRenderText
        textStyle={[
          MFTabBarStyles.tabBarItemText,
          { alignSelf: "center", color: "white", marginTop: 5 },
        ]}
      />
    </View>
  );
};

export default MFOverlay;

const styles = StyleSheet.create({});
