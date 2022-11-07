import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MFText from "../../components/MFText";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/dimensions";

interface RouteFallBackProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

const RouteFallBackScreen: React.FunctionComponent<RouteFallBackProps> = (
  props
) => {
  const routeParams = props.route.params;
  const displayString = `NavTarget "${props.route.params.navigationTargetUri}" not implemented yet`;
  console.log(props.navigation.getState());
  return (
    <View style={styles.root}>
      <View style={styles.topRow} />
      <View style={styles.contentContainerStyles}>
        <MFText
          shouldRenderText
          displayText={displayString}
          textStyle={styles.titleTextStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#00030E",
    flexDirection: "column",
    paddingBottom: 150,
  },
  topRow: {
    width: SCREEN_WIDTH,
    height: 120,
    borderBottomColor: "#424242",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  contentContainerStyles: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleTextStyle: {
    height: 60,
    width: 727,
    color: "#EEEEEE",
    fontFamily: "Inter",
    fontSize: 40,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 60,
  },
});

export default RouteFallBackScreen;
