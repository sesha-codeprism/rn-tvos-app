import React, { useRef, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextStyle,
  View,
  ViewStyle,
  PressableProps,
  TouchableOpacity,
} from "react-native";
import MFButton, { MFButtonVariant } from "../MFButton/MFButton";
import { MFAvatarButtonProps } from "../MFButtonsVariants/MFAvatarButton";
import { MFContainedButtonProps } from "../MFButtonsVariants/MFContainedButton";
import { MFOutlinedButtonProps } from "../MFButtonsVariants/MFOutlinedButton";
import { Source, ImageStyle } from "react-native-fast-image";
import { MFUnderlinedButtonProps } from "../MFButtonsVariants/MFUnderlinedButton";
import { SCREEN_WIDTH } from "../../utils/dimensions";
import { MFFontIconProps } from "../MFButtonsVariants/MFFontIconButton";

/**Interface for textstyles for ButtonText */
export interface MFButtonTextStyle {
  /** Base TextStyles */
  textStyle: StyleProp<TextStyle>;
  /** Text Style when button is focused */
  focusedStyle: StyleProp<TextStyle>;
  /** Text style when button is unfocused */
  unfocusedStyle: StyleProp<TextStyle>;
  /** Text style when for fonticon button */
  fontIconTextStyle?: StyleProp<TextStyle>;
}

/** Props that define the variant of the button in button group */
export interface ButtonVariantProps {
  /** The variant of the button that is rendered */
  variant: MFButtonVariant | any;
  /** Text label that is rendered */
  textLabel: string;
  /** Icon source of the button */
  iconSource?: Source | number | any;
  /** Source of the image that is rendered */
  imageSource?: Source | number | any;
  /** Source of avatar rendered as part of avatar button */
  avatarSource?: Source | number | any;
  /** Styles of image rendered */
  imageStyles?: StyleProp<ImageStyle>;
  /** Styles for the rendered icon */
  iconStyles?: StyleProp<ImageStyle>;
  /** Styles for the avatar rendered */
  avatarStyles?: StyleProp<ImageStyle>;
  /** Source of the fonticon renderedd */
  fontIconSource?: string;
  /** Base style of the button */
  style?: StyleProp<ViewStyle>;
  /** Style of the button when focused */
  focusedStyle?: StyleProp<ViewStyle>;
  /** @param {MFButtonTextStyle} Style of the text label */
  textStyle?: MFButtonTextStyle;
  /** Should RTL be enabled for this button group */
  enableRTL?: boolean;
  /** Should the icon/image/fonicon scaling should be enabled */
  shouldEnableScaling?: boolean;
}
export interface MFButtonGroupProps {
  /** @param {ButtonVariantProps} List of buttons to be rendered in the group */
  buttonsList: Array<ButtonVariantProps>;
  /** Props for avatar variant button */
  avatarButtonProps?: MFAvatarButtonProps;
  /** Props for contained variant button */
  containedButtonProps?: MFContainedButtonProps;
  /** Props of outlined variant button */
  outlinedButtonProps?: MFOutlinedButtonProps;
  /** @deprecated Props for underlined variant button */
  underlinedButtonProps?: MFUnderlinedButtonProps;
  /** Props for Font icon variant buttons */
  fontIconProps?: MFFontIconProps;
  /** Should the button have TVPreferredFocus*/
  hasTVPreferredFocus?: boolean;
  /** Should RTL be enabled */
  enableRTL?: boolean;
  /** Is this ButtonGroup scrolling vertically */
  vertical?: boolean;
  /** @deprecated Styles when button group is focused */
  focusedStyle?: StyleProp<ViewStyle>;
  /** @deprecated Style of buttongroup*/
  style?: StyleProp<ViewStyle>;
  /** @deprecated Function to execute when hubs change */
  onHubChanged: (hubIndex: number) => void;
  /** Function to execute when button is focused in buttongroup */
  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>, hubIndex: number) => void)
    | undefined;
  /** Function to execute when button is blurred in buttongroup */
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>, hubIndex: number) => void)
    | undefined;
  /** Function to execute when button is pressed in button group */
  onPress?:
    | null
    | ((event: GestureResponderEvent, hubIndex: number, param: any) => void)
    | undefined;
  /** Event to setCardFocus when focus moves from button group to carousel card */
  setCardFocus?: any;
}

/**
 * A functional component that renders an a group of MFButtons.
 * @param {MFButtonGroupProps} props - The props required for MFButtonGroup.
 * @returns {JSX.Element} - The rendered MFButtonGroup.
 */
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
              //@ts-ignore
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
              fontIconSource={item.fontIconSource}
              fontIconTextStyle={item.textStyle?.fontIconTextStyle}
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
              fontIconProps={props.fontIconProps}
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
          width: SCREEN_WIDTH,
          marginTop: 50,
        }}
      ></TouchableOpacity>
    </View>
  );
};

export default MFButtonGroup;
