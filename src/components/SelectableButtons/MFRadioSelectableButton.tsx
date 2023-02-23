import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  TargetedEvent,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { getFontIcon } from "../../config/strings";

interface MFRadioSelectableButtonProps {
  selected: boolean;
  label: string;
  selectedIcon?: string;
  unSelectedIcon?: string;
  hasTVPreferredFocus?: boolean;
  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered with unfocused */
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered with selected */
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
}

const MFRadioSelectableButton: React.FunctionComponent<
  MFRadioSelectableButtonProps
> = (props) => {
  const [focused, setFocused] = useState(false);
  const _onFocus = (event: any) => {
    setFocused(true);
    props.onFocus && props.onFocus(event);
  };

  const _onBlur = (event: any) => {
    setFocused(false);
    props.onBlur && props.onBlur(event);
  };

  const _onPress = (event: any) => {
    props.onPress && props.onPress(event);
  };

  const radio_selected = props.selectedIcon
    ? //@ts-ignore
      getFontIcon(props.selectedIcon)
    : //@ts-ignore
      getFontIcon("radio_selected");

  const radio_unselected = props.unSelectedIcon
    ? //@ts-ignore
      getFontIcon(props.unSelectedIcon)
    : //@ts-ignore
      getFontIcon("radio_unselected");

  return (
    <Pressable
      hasTVPreferredFocus={props.hasTVPreferredFocus}
      onFocus={_onFocus}
      onBlur={_onBlur}
      onPress={_onPress}
      style={StyleSheet.flatten([
        styles.selectButtonContainer,
        focused
          ? styles.focusedselectButtonContainer
          : styles.selectButtonContainer,
      ])}
    >
      <View style={styles.contentContainer}>
        <Text
          style={StyleSheet.flatten([
            styles.chevronStyles,
            focused ? styles.focusedText : {},
          ])}
        >
          {props.selected ? radio_selected : radio_unselected}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        <Text
          style={StyleSheet.flatten([
            styles.selectButtonTitle,
            focused ? styles.focusedText : {},
          ])}
        >
          {props.label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  selectButtonContainer: {
    width: "100%",
    height: 120,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    // padding: 30,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 30,
  },
  focusedselectButtonContainer: {
    backgroundColor: "#053C69",
    borderRadius: 6,
    shadowColor: "#0000006b",
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.42,
    shadowRadius: 4.65,
    elevation: 8,
  },
  contentContainer: {
    flex: 0.1,
    flexDirection: "column",
    alignContent: "center",
  },
  chevronContainer: { flex: 0.9 },
  chevronStyles: {
    fontFamily: "MyFontRegular",
    fontSize: 80,
    textAlign: "center",
    color: "#A7A7A7",
  },
  focusedText: { color: "#EEEEEE" },
  selectButtonTitle: {
    color: "#A7A7A7",
    fontFamily: "Inter-Regular",
    fontSize: 29,
    marginLeft: 20,
  },
  selectButtonContent: {
    color: "#A7A7A7",
    fontFamily: "Inter-Regular",
    fontSize: 23,
  },
});

export default MFRadioSelectableButton;
