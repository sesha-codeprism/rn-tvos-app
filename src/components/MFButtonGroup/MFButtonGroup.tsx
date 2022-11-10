import React, { Ref, useEffect, useRef, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextStyle,
  Pressable,
  View,
  ViewStyle,
  PressableProps,
  TouchableOpacity,
  Alert,
} from "react-native";
import MFButton, { MFButtonVariant } from "../MFButton/MFButton";
import { MFAvatarButtonProps } from "../MFButtonsVariants/MFAvatarButton";
import { MFContainedButtonProps } from "../MFButtonsVariants/MFContainedButton";
import { MFOutlinedButtonProps } from "../MFButtonsVariants/MFOutlinedButton";
import { Source, ImageStyle } from "react-native-fast-image";
import { MFUnderlinedButtonProps } from "../MFButtonsVariants/MFUnderlinedButton";
import { GLOBALS } from "../../utils/globals";

export interface MFButtonTextStyle {
  textStyle: StyleProp<TextStyle>;
  focusedStyle: StyleProp<TextStyle>;
  unfocusedStyle: StyleProp<TextStyle>;
}
export interface ButtonVariantProps {
  variant: MFButtonVariant | any;
  textLabel: string;
  iconSource?: Source | number | any;
  imageSource?: Source | number | any;
  avatarSource?: Source | number | any;
  imageStyles?: StyleProp<ImageStyle>;
  iconStyles?: StyleProp<ImageStyle>;
  avatarStyles?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  textStyle?: MFButtonTextStyle;
  enableRTL?: boolean;
  shouldEnableScaling?: boolean;
}
export interface MFButtonGroupProps {
  buttonsList: Array<ButtonVariantProps>;
  avatarButtonProps?: MFAvatarButtonProps;
  containedButtonProps?: MFContainedButtonProps;
  outlinedButtonProps?: MFOutlinedButtonProps;
  underlinedButtonProps?: MFUnderlinedButtonProps;
  hasTVPreferredFocus?: boolean;
  enableRTL?: boolean;
  vertical?: boolean;
  focusedStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  onHubChanged: (hubIndex: number) => void;
  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>, hubIndex: number) => void)
    | undefined;
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>, hubIndex: number) => void)
    | undefined;
  onPress?:
    | null
    | ((event: GestureResponderEvent, hubIndex: number, param: any) => void)
    | undefined;
  setCardFocus?: any;
}

const MFButtonGroup: React.FunctionComponent<MFButtonGroupProps> = (props) => {
  const [index, setIndex] = useState(0);
  const [hubIndex, setHubIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [menuHasFocus, setMenuHasFocus] = useState(true);
  const currentHubRef = Array(20)
    .fill(0)
    .map(() => useRef<PressableProps>(null));
  // console.log("button list in side button group", props.buttonsList);
  // useEffect(() => {
  //   currentHubRef = props.buttonsList.length
  //     ? props.buttonsList.map(() => useRef<PressableProps>(null))
  //     : [];
  // });
  const _onFocus = (
    event: NativeSyntheticEvent<TargetedEvent>,
    index: number
  ) => {
    // console.log('focused hub index', index, props.onFocus)
    setHubIndex(index);
    props.onHubChanged(index);
    props.onFocus && props.onFocus(event, index);
  };
  const _onBlur = (
    event: NativeSyntheticEvent<TargetedEvent>,
    index: number
  ) => {
    setFocused(false);
    props.onBlur && props.onBlur(event, index);
  };
  const _onPress = (
    event: GestureResponderEvent,
    index: number,
    param: any
  ) => {
    setIndex(index);
    props.onPress && props.onPress(event, index, param);
  };
  const onFocusBar = () => {
    console.log("onFocusBar called", hubIndex, "menuHasFocus", menuHasFocus);
    // Alert.alert("Bar focussed");
    if (!menuHasFocus) {
      // @ts-ignore
      currentHubRef[hubIndex].current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
      setMenuHasFocus(true);
    } else {
      console.log("menu has no focus");
      setMenuHasFocus(false);
      props.setCardFocus();
    }
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 70,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: props.vertical
            ? "column"
            : props.enableRTL
            ? "row-reverse"
            : "row",
          // marginTop: 20,
        }}
      >
        <FlatList
          data={props.buttonsList}
          horizontal
          disableIntervalMomentum
          inverted={props.enableRTL}
          keyExtractor={(e, index) => `Index${index}`}
          renderItem={({ item, index }) => (
            <MFButton
              ref={currentHubRef[index]}
              key={`Index${index}`}
              variant={item.variant}
              textLabel={item.textLabel}
              containedButtonProps={props.containedButtonProps}
              outlinedButtonProps={props.outlinedButtonProps}
              avatarButtonProps={props.avatarButtonProps}
              imageStyles={item.imageStyles}
              avatarStyles={item.avatarStyles}
              iconStyles={item.iconStyles}
              textStyle={StyleSheet.flatten([
                item.textStyle?.textStyle,
                hubIndex === index
                  ? item.textStyle?.focusedStyle
                  : item.textStyle?.unfocusedStyle,
              ])}
              focusedStyle={item.focusedStyle}
              onFocus={(event) => {
                _onFocus(event, index);
              }}
              onBlur={(event) => {
                _onBlur(event, index);
              }}
              onPress={(event) => {
                _onPress(event, index, "");
              }}
              style={
                hubIndex === index
                  ? StyleSheet.flatten([item.focusedStyle])
                  : index === index
                  ? StyleSheet.flatten(item.style)
                  : item.style
              }
              iconSource={item.iconSource || {}}
              imageSource={item.imageSource || {}}
              avatarSource={item.avatarSource || {}}
            />
          )}
        />
      </View>
      <TouchableOpacity
        accessible={true}
        onFocus={onFocusBar}
        style={{
          backgroundColor: "transparent",
          height: 20,
          width: "100%",
          marginTop: 50,
        }}
      ></TouchableOpacity>
    </View>
  );
};

export default MFButtonGroup;
