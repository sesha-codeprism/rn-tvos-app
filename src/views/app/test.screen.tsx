import React from "react";
import { Dimensions } from "react-native";
import MFSearch from "../../components/MFSearch";
import Search from "../../components/MFSearch";

type Props = {};

export default function TestScreen({}: Props) {
  return (
    <MFSearch
      style={{
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: "red",
      }}
      onChangeText={(text) => {
        console.log("Got some text");
      }}
    />
  );
}
