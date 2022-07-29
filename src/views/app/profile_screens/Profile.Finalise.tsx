import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import {
  createUserProfile,
  deleteUserProfile,
  updateUserProfile,
} from "../../../../backend/subscriber/subscriber";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import MFLoader from "../../../components/MFLoader";
import MFPopup from "../../../components/MFPopup";
import MFText from "../../../components/MFText";
import { appUIDefinition } from "../../../config/constants";
import { AppImages } from "../../../assets/images";
import { Routes } from "../../../config/navigation/RouterOutlet";
import { MFProfileStyle } from "../../../config/styles/MFProfileStyles";
import { GlobalContext } from "../../../contexts/globalContext";
import { GLOBALS } from "../../../utils/globals";
import { updateStore } from "../../../utils/helpers";
const { width, height } = Dimensions.get("window");

interface ProfileFinalisationScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  mode: "edit" | "create";
  item: any;
}

const ProfileFinalisationScreen: React.FunctionComponent<
  ProfileFinalisationScreenProps
> = (props: any) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [optOutPersonalDataUse, setOptOutPersonalDataUse] = useState(false);
  const [additionalFields, setAdditionalFields] = useState({
    optOutPersonalDataUse: "",
  });
  const [focused, setFocused] = useState<any>("");
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentContext = useContext(GlobalContext);

  console.log("props coming", props.route.params);

  useEffect(() => {
    if (props.route.params.mode === "edit") {
      const { Name, Image, AdditionalFields } = GLOBALS.editUserProfile;
      console.log("GLOBALS.editUserProfile", GLOBALS.editUserProfile);
      // if (Name && Image && AdditionalFields?.optOutPersonalDataUse) {
      setName(Name || props.route.params.item.Name);
      setImage(Image || props.route.params.item.Image);
      setAdditionalFields({
        optOutPersonalDataUse:
          (AdditionalFields?.optOutPersonalDataUse === "true" ? true : false) ||
          props.route.params.item.AdditionalFields.optOutPersonalDataUse,
      });
      setOptOutPersonalDataUse(
        AdditionalFields?.optOutPersonalDataUse === "true" ? true : false
      );
      // }
    } else {
      console.log("in else block");
      const { name, image, optOutPersonalDataUse } = GLOBALS.createUserProfile;
      setName(name);
      setImage(image);
      setOptOutPersonalDataUse(optOutPersonalDataUse);
    }
  }, [
    GLOBALS.editUserProfile.Image,
    GLOBALS.editUserProfile.Name,
    GLOBALS.editUserProfile.AdditionalFields?.optOutPersonalDataUse,
  ]);
  const onFocus = (index: number) => {
    setFocused(index);
  };
  const saveProfile = async () => {
    try {
      setLoading(true);
      const response = await createUserProfile(
        name,
        image,
        optOutPersonalDataUse
      );
      console.log("create profile rsponse", response);
      if (response.status === 201) {
        console.log("create profile success rsponse", response.data);
        GLOBALS.userProfile = response.data;
        GLOBALS.store.userProfile = GLOBALS.userProfile;
        updateStore(JSON.stringify(GLOBALS.store));
        currentContext.setUserProfile(GLOBALS.userProfile);
      }
      setLoading(false);
      // props.navigation.pop(5);
      props.navigation.replace(Routes.Home);
    } catch (error) {
      console.log("error saving profile", error);
      setLoading(false);
    }
  };

  const onPressDone = async () => {
    try {
      setLoading(true);
      const { Id, Name, Image, AdditionalFields } = GLOBALS.editUserProfile;
      const payload = {
        Id,
        Name,
        Image,
        UserCreated: true,
        AdditionalFields: {
          optOutPersonalDataUse: AdditionalFields?.optOutPersonalDataUse,
        },
      };
      const result = await updateUserProfile(payload);
      setLoading(false);
      if (
        result.status === 204 ||
        result.status === 200 ||
        result.status === 201
      ) {
        props.navigation.navigate(Routes.Profile);
      }
      console.log("update user result", result);
    } catch (error) {
      setLoading(false);
      console.log("error updating user", error);
    }
  };
  const onPressDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteUserProfile(id);
      console.log("Delete user response", response.data, response.status);
      setLoading(false);
      if (response.status === 204) {
        props.navigation.navigate(Routes.Profile);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error deleting user", error);
    }
  };
  return (
    <View style={MFProfileStyle.finalise_container}>
      <View style={MFProfileStyle.finalise_profileTitleContainer}>
        <MFText
          shouldRenderText
          displayText={
            props.route.params.mode === "edit"
              ? "Edit Profile"
              : "Create Profile"
          }
          textStyle={MFProfileStyle.finalise_titleTextStyle}
        />
      </View>
      <View style={MFProfileStyle.finalise_mainContainer}>
        <View style={MFProfileStyle.finalise_inputContainer}>
          <View style={{ marginTop: 50 }}>
            <Pressable
              style={MFProfileStyle.finalise_profileStyles}
              onFocus={() => {
                onFocus(1);
              }}
              onPress={() => {
                props.route.params.mode === "edit"
                  ? props.navigation.navigate(Routes.ChooseProfile, {
                      mode: "edit",
                      item: GLOBALS.editUserProfile,
                    })
                  : null;
              }}
            >
              <FastImage
                source={AppImages[image]}
                style={MFProfileStyle.finalise_profileStyles}
              />
              {focused === 1 && props.route.params.mode === "edit" && (
                <View
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 150 / 2,
                    marginLeft: 50,
                    backgroundColor: "black",
                    position: "absolute",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    opacity: 0.6,
                    borderWidth: 5,
                    borderColor: "#053C69",
                  }}
                >
                  <MFButton
                    variant={MFButtonVariant.Icon}
                    iconSource={AppImages.edit}
                    iconStyles={MFProfileStyle.finalise_editIconStyles}
                    avatarSource={{}}
                    imageSource={{}}
                    iconButtonStyles={{ shouldRenderImage: true }}
                  />
                </View>
              )}
            </Pressable>
            <Pressable
              style={MFProfileStyle.finalise_profileStyles}
              onFocus={() => {
                onFocus(2);
              }}
              onPress={() => {
                props.route.params.mode === "edit"
                  ? props.navigation.navigate(Routes.CreateProfile, {
                      mode: "edit",
                      item: GLOBALS.editUserProfile,
                    })
                  : null;
              }}
            >
              <View
                style={
                  focused === 2 && props.route.params.mode === "edit"
                    ? MFProfileStyle.finalise_activeBox
                    : MFProfileStyle.finalise_inActiveBox
                }
              >
                <View style={{ marginLeft: 31, marginTop: 10 }}>
                  <MFText
                    shouldRenderText
                    displayText="Name"
                    textStyle={{
                      fontSize: 23,
                      lineHeight: 38,
                      color: focused === 2 ? "#EEEEEE" : "#828282",
                    }}
                  />
                  <MFText
                    shouldRenderText
                    displayText={name}
                    textStyle={{
                      lineHeight: 50,
                      color: focused === 2 ? "#EEEEEE" : "#828282",
                      fontSize: 31,
                      fontWeight: "600",
                    }}
                  />
                </View>
                {focused === 2 && props.route.params.mode === "edit" && (
                  <MFButton
                    variant={MFButtonVariant.Icon}
                    iconSource={AppImages.edit}
                    iconStyles={MFProfileStyle.finalise_editIconStyles}
                    avatarSource={{}}
                    imageSource={{}}
                    iconButtonStyles={{ shouldRenderImage: true }}
                  />
                )}
              </View>
            </Pressable>

            <Pressable
              style={MFProfileStyle.finalise_profileStyles}
              onFocus={() => {
                onFocus(3);
              }}
              onPress={() => {
                props.route.params.mode === "edit"
                  ? props.navigation.navigate(Routes.PersonlizeProfile, {
                      mode: "edit",
                      item: GLOBALS.editUserProfile,
                    })
                  : null;
              }}
            >
              <View
                style={
                  focused === 3 && props.route.params.mode === "edit"
                    ? MFProfileStyle.finalise_activeBox
                    : MFProfileStyle.finalise_inActiveBox
                }
              >
                <View style={{ marginLeft: 31, marginTop: 10 }}>
                  <MFText
                    shouldRenderText
                    displayText="Profile Personalization"
                    textStyle={{
                      fontSize: 23,
                      lineHeight: 38,
                      color: focused === 3 ? "#EEEEEE" : "#828282",
                    }}
                  />
                  <MFText
                    shouldRenderText
                    displayText={optOutPersonalDataUse ? "Disabled" : "Enabled"}
                    textStyle={{
                      lineHeight: 50,
                      color: focused === 3 ? "#EEEEEE" : "#828282",
                      fontSize: 31,
                      fontWeight: "600",
                    }}
                  />
                </View>
                {focused === 3 && props.route.params.mode === "edit" && (
                  <MFButton
                    variant={MFButtonVariant.Icon}
                    iconSource={AppImages.edit}
                    iconStyles={MFProfileStyle.finalise_editIconStyles}
                    avatarSource={{}}
                    imageSource={{}}
                    iconButtonStyles={{ shouldRenderImage: true }}
                  />
                )}
              </View>
            </Pressable>
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
            textLabel={props.route.params.mode === "edit" ? "Done" : "Save"}
            iconSource={0}
            imageSource={0}
            avatarSource={0}
            onPress={() => {
              props.route.params.mode === "edit"
                ? onPressDone()
                : saveProfile();
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
                hasTVPreferredFocus: true,
                hoverColor: appUIDefinition.theme.colors.secondary,
              },
            }}
            hasTVPreferredFocus={true}
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
              props.route.params.mode === "edit" &&
              currentContext.userProfile.Id !== GLOBALS.editUserProfile.Id
                ? setShowDelete(true)
                : props.navigation.goBack();
            }}
            textLabel={
              props.route.params.mode === "edit" &&
              currentContext.userProfile.Id !== GLOBALS.editUserProfile.Id
                ? "Delete Profile"
                : "Cancel"
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
      {showDelete && (
        <MFPopup
          buttons={[
            {
              title: "Delete",
              onPress: () => {
                onPressDelete(props.route.params.item.Id);
              },
            },
            {
              title: "Cancel",
              onPress: () => {
                setShowDelete(false);
              },
            },
          ]}
          description={" Are you sure you want to delete this profile?"}
        />
      )}
      {loading && (
        <MFLoader transparent={true} />
        // <ActivityIndicator
        //   style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        //   accessible={false}
        // />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProfileFinalisationScreen;
