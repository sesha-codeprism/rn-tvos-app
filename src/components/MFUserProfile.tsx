import React, { useContext, useState } from "react";
import { UserProfile } from "../@types/UserProfile";
import {
  NativeSyntheticEvent,
  TargetedEvent,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Text,
} from "react-native";
import FastImage from "react-native-fast-image";
import { AppImages } from "../assets/images";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../config/navigation/RouterOutlet";
import { appUIDefinition } from "../config/constants";
import { GLOBALS } from "../utils/globals";
import { GlobalContext } from "../contexts/globalContext";
import { updateStore } from "../utils/helpers";
import { queryClient } from "../config/queries";

interface MFUserProfileProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  userProfile?: UserProfile;
  onFocus?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Event to be triggered with unfocused */
  onBlur?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onFocusEdit?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  onBlurEdit?:
    | null
    | ((event: NativeSyntheticEvent<TargetedEvent>) => void)
    | undefined;
  /** Render style of MFButton*/
  style?: StyleProp<ViewStyle>;
  /** Style of MFButton when focused*/
  focusedStyle?: StyleProp<ViewStyle>;
  /** Focus on first element */
  focusOnFirstElement?: boolean;
  /** Event to be triggered with selected */
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  onEdit?: null | ((item: any) => void) | undefined;
  checkedOnFocus?: boolean;
}

const MFUserProfile: React.FunctionComponent<MFUserProfileProps> =
  React.forwardRef(({ ...props }, ref: any) => {
    const [focused, setFocused] = useState(false);
    const currentContext: any = useContext(GlobalContext);

    const _onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(true);
      console.log("_onFocus called");
      props.onFocus && props.onFocus(event);
    };
    const _onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocused(false);
      console.log("_onBlur called");
      props.onBlur && props.onBlur(event);
    };

    const _onPress = (event: GestureResponderEvent) => {
      if (props.onPress) {
        props.onPress(event);
      } else {
        if (props.userProfile) {
          console.log("Userprofile found");
          GLOBALS.userProfile = props.userProfile;
          GLOBALS.store!.userProfile = GLOBALS.userProfile;
          updateStore(GLOBALS.store);
          currentContext.setUserProfile(GLOBALS.userProfile);
          props.navigation.reset({
            index: 0,
            routes: [{ name: Routes.Home }],
          });
          queryClient.invalidateQueries();
        } else {
          console.log("No user profile");
          props.navigation.navigate(Routes.CreateProfile, {
            item: null,
            mode: "create",
          });
        }
      }
    };

    return (
      <Pressable
        ref={ref}
        hasTVPreferredFocus={
          props.focusOnFirstElement
            ? true
            : GLOBALS.userProfile &&
              GLOBALS.userProfile?.Id === props.userProfile?.Id
            ? true
            : false
          // GLOBALS.userProfile?.Id === props.userProfile?.Id
          //   ? true
          //   : props.focusOnFirstElement
          //   ? true
          //   : false
        }
        style={[
          styles.rootContainer,
          StyleSheet.flatten(
            (styles.unfocusedStyle, styles.rootContainer, props.focusedStyle)
          ),
        ]}
        onFocus={_onFocus}
        onBlur={_onBlur}
        onPress={_onPress}
      >
        <View
          style={[
            styles.imageContainer,
            {
              borderColor: focused ? "#053C69" : "#151214",
              borderWidth: 5,
              padding: 5,
              borderRadius: 220 / 2,
              backgroundColor: !props.userProfile ? "grey" : "transparent",
            },
          ]}
        >
          <FastImage
            source={
              props.userProfile
                ? //@ts-ignore
                  AppImages[props.userProfile.Image]
                : AppImages.icon_add
            }
            style={
              !focused
                ? !focused
                  ? {
                      width: props.userProfile ? 200 : 62,
                      height: props.userProfile ? 200 : 62,
                      borderRadius: props.userProfile ? 200 / 2 : 62 / 2,
                    }
                  : {
                      width: props.userProfile ? 180 : 62,
                      height: props.userProfile ? 180 : 62,
                      borderRadius: 180 / 2,
                    }
                : {
                    width: props.userProfile ? 180 : 62,
                    height: props.userProfile ? 180 : 62,
                    borderRadius: 180 / 2,
                  }
            }
          />
          {props.userProfile &&
          props.userProfile.Id === GLOBALS.userProfile?.Id &&
          props.checkedOnFocus ? (
            <View style={styles.activeProfileIndicator}>
              <FastImage
                source={AppImages.tick_active}
                style={styles.activeProfileIndicatorImage}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={
              focused ? styles.focusedTextStyle : styles.unFocusedTextStyle
            }
          >
            {props.userProfile ? props.userProfile.Name : "New"}
          </Text>
        </View>
      </Pressable>
    );
  });

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: "column",
    margin: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  focusedStyle: {
    transform: [
      {
        scale: 1.2,
      },
    ],
  },
  unfocusedStyle: {
    transform: [
      {
        scale: 1,
      },
    ],
  },
  textContainer: {
    marginTop: 20,
  },
  focusedTextStyle: {
    fontSize: 38,
    color: appUIDefinition.theme.backgroundColors.white,
    lineHeight: 55,
    width: 200,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  unFocusedTextStyle: {
    fontSize: 31,
    color: "#828282",
    lineHeight: 55,
    fontFamily: "Inter-Regular",
    width: 200,
    textAlign: "center",
  },
  activeProfileIndicator: {
    width: 46,
    height: 46,
    position: "absolute",
    bottom: 0,
    right: 20,
  },
  activeProfileIndicatorImage: {
    width: 46,
    height: 46,
    backgroundColor: "black",
    borderRadius: 46 / 2,
  },
  editIconContainerStyles: {
    height: 65,
    width: 65,
    borderRadius: 50,
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "#282828",
    top: 350,
    left: 80,
  },
  editIconStyles: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
});

export default MFUserProfile;
