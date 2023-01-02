import React from "react";
import { Dimensions } from "react-native";
import MFSearch from "../../components/MFSearch";
import Search from "../../components/MFSearch";

type Props = {};

export default function TestScreen({}: Props) {
  const onChangeText = (event: {
    nativeEvent: { text: React.SetStateAction<string> };
  }) => {
    console.log("Firing..", event.nativeEvent.text);
  };
  return (
    <MFSearch
      style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: "red",
      }}
      onChangeText={onChangeText}
    />
  );
}
