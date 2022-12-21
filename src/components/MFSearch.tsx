import React from "react";
import { requireNativeComponent, StyleProp, ViewStyle } from "react-native";

const Search = requireNativeComponent("SearchViewTVOS");
// var Search = requireNativeComponent("RNSearchControllerView");
interface MFSearchProps {
  onChangeText?: null | ((event: any) => void) | undefined;
  style?: StyleProp<ViewStyle>;
}

const MFSearch: React.FunctionComponent<MFSearchProps> = (props) => {
  console.log(Search);
  const onChangeText = (event: {
    nativeEvent: { text: React.SetStateAction<string> };
  }) => {
    console.log("Firing..");
    props.onChangeText!(event);
  };
  return <Search onChangeText={onChangeText} style={props.style} />;
};

export default MFSearch;
