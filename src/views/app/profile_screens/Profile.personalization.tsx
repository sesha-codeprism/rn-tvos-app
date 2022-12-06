import React, { ReactNode, useEffect, useState } from "react";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Alert, StyleSheet, Dimensions, Pressable } from "react-native";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import MFText from "../../../components/MFText";
import { appUIDefinition } from "../../../config/constants";
import { AppImages } from "../../../assets/images";
import { GLOBALS } from "../../../utils/globals";
import { Routes } from "../../../config/navigation/RouterOutlet";
import MFPopup from "../../../components/MFPopup";
import { updateUserProfile } from "../../../../backend/subscriber/subscriber";
import { MFProfileStyle } from "../../../config/styles/MFProfileStyles";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

interface ProfilePersonalizationScreen {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  mode: "edit" | "create";
  item: any;
  children?: ReactNode;
}

const ProfilePersonalizationScreen: React.FunctionComponent<
  ProfilePersonalizationScreen
> = (props: any) => {
  const [shouldRenderImage, toggleShouldRenderImage] = useState(
    props.route.params &&
      props.route.params.item &&
      props.route.params.item.AdditionalFields.optOutPersonalDataUse === "true"
      ? false
      : true
  );
  const [showClearHistory, setShowClearHistory] = useState(false);
  const [showPersonalizationPopup, setShowPersonalizationPopup] =
    useState(false);
  const [focused, setFocus] = useState(false);
  console.log("props in personalization", props);
  const onpressDisable = () => {
    GLOBALS.editUserProfile.AdditionalFields = {
      optOutPersonalDataUse: "true",
    };
    props.navigation.navigate(Routes.ProfileFinalise, {
      item: GLOBALS.editUserProfile,
      mode: "edit",
    });
  };
  const clearHistory = async () => {
    try {
      const payload = {
        Id: GLOBALS.editUserProfile.Id,
        AdditionalFields: {
          optOutPersonalDataUse:
            GLOBALS.editUserProfile.AdditionalFields?.optOutPersonalDataUse,
          optOutPersonalDataUseDate: new Date().toString(),
        },
      };
      const result = await updateUserProfile(payload);
      if (
        result.status === 204 ||
        result.status === 200 ||
        result.status === 201
      ) {
        props.navigation.navigate(Routes.Profile);
      }
    } catch (error) {
      console.log("Clear Profile History Failed:", error);
    }
  };
  return (
    <View style={MFProfileStyle.personalize_container}>
      <View style={MFProfileStyle.personalize_profileTitleContainer}>
        <MFText
          shouldRenderText
          displayText={
            props.route.params.mode === "create"
              ? "Create Profile"
              : "Manage Profile"
          }
          textStyle={MFProfileStyle.personalize_titleTextStyle}
        />
      </View>
      <View style={MFProfileStyle.personalize_mainContainer}>
        <View style={MFProfileStyle.personalize_inputContainer}>
          <MFText
            shouldRenderText
            displayText="Profile personalization"
            textStyle={MFProfileStyle.personalize_profileTitleStyle}
          />
          <View style={{ marginTop: 80 }}>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                hasTVPreferredFocus
                onFocus={() => {
                  setFocus(true);
                }}
                onBlur={() => {
                  setFocus(false);
                }}
                onPress={() => {
                  toggleShouldRenderImage(!shouldRenderImage);
                  !shouldRenderImage
                    ? setShowPersonalizationPopup(true)
                    : false;
                }}
                style={{ height: "100%" }}
              >
                {shouldRenderImage ? (
                  <FastImage
                    source={AppImages.selected}
                    style={
                      focused
                        ? {
                            ...MFProfileStyle.personalize_imageStyles,
                            ...MFProfileStyle.personalize_activeProfileStyles,
                          }
                        : MFProfileStyle.personalize_imageStyles
                    }
                  />
                ) : (
                  <View style={MFProfileStyle.personalize_placeholderStyles} />
                )}
              </Pressable>
              <View>
                <MFText
                  textStyle={MFProfileStyle.personalize_titleStyles}
                  shouldRenderText={true}
                  displayText={"Allow Profile Personalization"}
                />

                <MFText
                  textStyle={MFProfileStyle.personalize_subTitleStyles}
                  shouldRenderText={true}
                  displayText={
                    "Enabling Profile Personalization will allow the system to to improve the viewing experience for ndividual profiles. It is highly recommended that you enable this feature for the best viewing experience."
                  }
                  adjustsFontSizeToFit={false}
                  numberOfLines={3}
                />
              </View>
            </View>
            {/* <MFButton
              variant={MFButtonVariant.Icon}
              iconSource={AppImages.selected}
              imageSource={0}
              avatarSource={0}
              iconStyles={MFProfileStyle.personalize_imageStyles}
              focusedStyle={MFProfileStyle.personalize_activeProfileStyles}
              textLabel="Allow Profile Personalization"
              textStyle={MFProfileStyle.personalize_titleStyles}
              onPress={() => {
                toggleShouldRenderImage(!shouldRenderImage);
                !shouldRenderImage ? setShowPersonalizationPopup(true) : false;
              }}
              iconButtonStyles={{
                iconPlacement: "Left",
                subTextStyle: MFProfileStyle.personalize_subTitleStyles,
                subTextLabel:
                  "Enabling Profile Personalization will allow the system to  to improve the viewing experience for ndividual profiles. It is highly recommended that you enable this feature for the best viewing experience.",
                shouldRenderImage: shouldRenderImage,
                placeholderStyles: MFProfileStyle.personalize_placeholderStyles,
              }}
            /> */}
          </View>
        </View>
        <View
          style={{
            width: "20%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <MFButton
            variant={MFButtonVariant.Contained}
            textLabel={
              props.route.params.mode === "create"
                ? "Continue"
                : shouldRenderImage
                ? "Done"
                : "Cancel"
            }
            iconSource={0}
            imageSource={0}
            avatarSource={0}
            onPress={() => {
              if (props.route.params.mode === "create") {
                GLOBALS.createUserProfile.optOutPersonalDataUse =
                  !shouldRenderImage;
                console.log(GLOBALS.createUserProfile);
                props.navigation.navigate(Routes.ProfileFinalise, {
                  mode: "create",
                  item: null,
                });
              } else if (
                shouldRenderImage &&
                props.route.params.mode === "edit"
              ) {
                GLOBALS.editUserProfile.AdditionalFields = {
                  optOutPersonalDataUse: shouldRenderImage ? "false" : "true",
                };
                props.navigation.navigate(Routes.ProfileFinalise, {
                  mode: "edit",
                  item: GLOBALS.editUserProfile,
                });
              } else {
                props.navigation.navigate(Routes.ProfileFinalise, {
                  mode: "edit",
                  item: GLOBALS.editUserProfile,
                });
              }
            }}
            style={{ width: 274, height: 62, margin: 20 }}
            focusedStyle={{ width: 274, height: 62 }}
            textStyle={{
              color: "white",
              fontSize: 25,
              textAlign: "center",
              fontWeight: "600",
            }}
            containedButtonProps={{
              containedButtonStyle: {
                unFocusedTextColor: "white",
                enabled: true,
                elevation: 5,
                focusedBackgroundColor: "#053C69",
                unFocusedBackgroundColor: "#424242",
                hoverColor: appUIDefinition.theme.colors.secondary,
              },
            }}
          />
          <MFButton
            variant={MFButtonVariant.Contained}
            iconSource={0}
            style={{ width: 274, height: 62, margin: 20 }}
            focusedStyle={{ width: 274, height: 62 }}
            textStyle={{
              color: "white",
              fontSize: 25,
              textAlign: "center",
              fontWeight: "600",
            }}
            onPress={() => {
              props.route.params.mode === "create"
                ? props.navigation.goBack()
                : setShowClearHistory(true);
            }}
            textLabel={
              props.route.params.mode === "create" ? "Cancel" : "Clear History"
            }
            imageSource={0}
            avatarSource={0}
            containedButtonProps={{
              containedButtonStyle: {
                unFocusedTextColor: "white",
                enabled: true,
                elevation: 5,
                focusedBackgroundColor: "#053C69",
                unFocusedBackgroundColor: "#424242",
                hoverColor: appUIDefinition.theme.colors.secondary,
              },
            }}
          />
        </View>
      </View>
      {!shouldRenderImage && showPersonalizationPopup && (
        <MFPopup
          buttons={[
            {
              title: "Disable Personalization",
              onPress: onpressDisable,
            },
            {
              title: "Cancel",
              onPress: () => {
                toggleShouldRenderImage(true);
              },
            },
          ]}
          description={
            "Disabling Personalization will erase all  information associated with this profile permanently and you will no longer receive program recommendations. Are you sure you want to Disable Personalization on this profile?"
          }
        />
      )}
      {showClearHistory && (
        <MFPopup
          buttons={[
            {
              title: "Clear Profile History",
              onPress: clearHistory,
            },
            {
              title: "Cancel",
              onPress: () => {
                setShowClearHistory(false);
              },
            },
          ]}
          description={
            "Clearing Profile History will erase all viewing history associated with this profile up to this point in time. Are you sure you want to proceed?"
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProfilePersonalizationScreen;
