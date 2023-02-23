import React, { useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TargetedEvent,
  Text,
  View,
} from "react-native";
import { getFontIcon } from "../../config/strings";

interface MFSelectableButtonProps {
  title: string;
  subTitle?: string;
  rightIcon?: string;
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

const MFSelectableButton: React.FunctionComponent<MFSelectableButtonProps> = (
  props
) => {
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

  const chevronIcon = props.rightIcon
    ? //@ts-ignore
      getFontIcon(props.rightIcon)
    : getFontIcon("channel_right");
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
            styles.selectButtonTitle,
            focused ? styles.focusedText : {},
          ])}
        >
          {props.title}
        </Text>
        {props.subTitle && (
          <Text
            style={StyleSheet.flatten([
              styles.selectButtonContent,
              focused ? styles.focusedText : {},
            ])}
          >
            {props.subTitle}
          </Text>
        )}
      </View>
      <View style={styles.chevronContainer}>
        <Text
          style={StyleSheet.flatten([
            styles.chevronStyles,
            focused ? styles.focusedText : {},
          ])}
        >
          {chevronIcon}
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
    padding: 30,
    display: "flex",
    flexDirection: "row",
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
    flex: 0.8,
    flexDirection: "column",
    alignContent: "center",
  },
  chevronContainer: { flex: 0.2 },
  chevronStyles: {
    fontFamily: "MyFontRegular",
    fontSize: 70,
    textAlign: "center",
    color: "#A7A7A7",
    marginBottom: 8,
  },
  focusedText: { color: "#EEEEEE" },
  selectButtonTitle: {
    color: "#A7A7A7",
    fontFamily: "Inter-Regular",
    fontSize: 29,
    paddingVertical: 10,
  },
  selectButtonContent: {
    color: "#A7A7A7",
    fontFamily: "Inter-Regular",
    fontSize: 23,
  },
});

export default MFSelectableButton;
