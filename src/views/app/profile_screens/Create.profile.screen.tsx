import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import MFButton from "../../../components/MFButton/MFButton";
import MFText from "../../../components/MFText";
import { MFButtonVariant } from "../../../components/MFButton/MFButton";
import { appUIDefinition } from "../../../config/constants";
import { FormKeyBoard } from "../../../@types/FomKeyBoard";
import { AppImages } from "../../../assets/images";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Routes } from "../../../config/navigation/RouterOutlet";
import { GLOBALS } from "../../../utils/globals";
import { MFProfileStyle } from "../../../config/styles/MFProfileStyles";
import FastImage from "react-native-fast-image";
import { FakeCaret } from "../../../components/FakeCaret";
import { getAllSubscriberProfiles } from "../../../../backend/subscriber/subscriber";
import { UserProfile } from "../../../@types/UserProfile";

const keyboard: FormKeyBoard = require("../../../config/keyboards/FormKeyboard.json");

interface CreateProfileProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  mode: "edit" | "create";
  item: any;
}

const CreateProfileScreen: React.FunctionComponent<CreateProfileProps> = (
  props: any
) => {
  const maxProfileNameLength = appUIDefinition.config.maxProfileNameLength;
  console.log("props coming to create profile", props);
  const keys = keyboard;
  const CaretComponent = () => {
    return (
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 40,
          marginBottom: 5,
          color: "#c5c5c6",
        }}
      >
        {"|"}
      </Text>
    );
  };
  const refCaret = useRef();
  const [titleString, setTitleString] = useState(
    props.route.params &&
      props.route.params.item &&
      props.route.params.item.Name
      ? props.route.params.item.Name
      : ""
  );
  const [focus, setFocus] = useState("");

  const onPressSave = async () => {
    if (props.route.params.item.Name === titleString) {
      Alert.alert(
        "OOPS!",
        "Provided Name is same as previous profile name, please select another name",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ]
      );
    } else {
      //TODO: Fill this section up
      continueProfileCreation();
    }
  };

  const continueProfileCreation = () => {
    GLOBALS.editUserProfile.Name = titleString;
    props.navigation.navigate(Routes.ProfileFinalise, {
      item: GLOBALS.editUserProfile,
      mode: "edit",
    });
  };

  const createProfile = async () => {
    try {
      const profileResponse = await getAllSubscriberProfiles();
      const profilesArray: Array<UserProfile> = profileResponse.data;
      const isNameAlreadyTaken = profilesArray.some(
        (profile) => profile.Name === titleString
      );
      console.log("isNameAlreadyTaken", isNameAlreadyTaken);
      if (isNameAlreadyTaken) {
        Alert.alert(
          `Name already taken`,
          `Profile name "${titleString}" is already taken. Please enter some other name`
        );
      } else {
        (GLOBALS.createUserProfile.name = titleString),
          props.navigation.navigate(Routes.ChooseProfile, {
            mode: "create",
            item: null,
          });
      }
    } catch (e) {
      console.log("Something went wrong", e);
      Alert.alert("Something went wrong.. Please contact support");
    }
  };

  return (
    <View style={MFProfileStyle.create_container}>
      <View style={MFProfileStyle.create_profileTitleContainer}>
        <MFText
          shouldRenderText
          displayText={
            props.route.params.mode === "edit"
              ? "Manage Profile"
              : "Create Profile"
          }
          textStyle={MFProfileStyle.create_titleTextStyle}
        />
      </View>
      <View style={MFProfileStyle.create_mainContainer}>
        <View style={MFProfileStyle.create_inputContainer}>
          <MFText
            shouldRenderText
            displayText="Name this profile"
            textStyle={MFProfileStyle.create_profileTitleStyle}
          />
          <View style={MFProfileStyle.create_textInput}>
            <MFText
              shouldRenderText
              displayText={titleString}
              textStyle={MFProfileStyle.create_titleTextStyle}
            />
            <FakeCaret ref={refCaret} CaretComponent={CaretComponent} />
          </View>
          <View style={{ marginTop: 50 }}>
            <FlatList
              data={keys.row1}
              horizontal
              initialNumToRender={10}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: "row" }}>
                  {item.type === "number" || item.type === "text" ? (
                    <View style={MFProfileStyle.create_keyboardButton}>
                      <MFButton
                        iconSource={0}
                        imageSource={0}
                        avatarSource={0}
                        style={MFProfileStyle.create_keyboardButton}
                        variant={MFButtonVariant.Contained}
                        textLabel={item.content?.toString()}
                        textStyle={MFProfileStyle.create_keyboardButtonText}
                        onPress={() => {
                          if (titleString.length < maxProfileNameLength) {
                            setTitleString(titleString + item.content);
                          } else {
                            if (__DEV__) {
                              console.log(
                                "Max length reached.. Stop hurting the keyboard.."
                              );
                            }
                          }
                        }}
                        onFocus={() => {
                          setFocus("");
                        }}
                        containedButtonProps={{
                          containedButtonStyle: {
                            enabled: true,
                            focusedBackgroundColor: "#053C69",
                            unFocusedBackgroundColor: "transparent",
                            elevation: 5,
                            unFocusedTextColor: "grey",
                            hoverColor: "transparent",
                          },
                        }}
                      />
                    </View>
                  ) : (
                    <Pressable
                      style={{
                        height: 70,
                        width: 70,
                        // padding: 10,
                        marginLeft: 25,
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        // alignSelf: "center",
                        backgroundColor:
                          focus === item.image?.split("")[0]
                            ? "#053C69"
                            : "transparent",
                      }}
                      onFocus={() => {
                        setFocus(item.image === "space" ? "s" : "d");
                      }}
                      onPress={() => {
                        if (item.image === "space") {
                          if (titleString.length < maxProfileNameLength) {
                            setTitleString(titleString + " ");
                          }
                        } else {
                          setTitleString(titleString.slice(0, -1));
                        }
                      }}
                      // onBlur={()=>{setFocus('')}}
                    >
                      <FastImage
                        source={
                          item.image === "space"
                            ? AppImages.space_png
                            : AppImages.delete_png
                        }
                        style={
                          item.image === "space"
                            ? MFProfileStyle.create_keyboardSpace
                            : MFProfileStyle.create_keyboardDelete
                        }
                      />
                    </Pressable>
                  )}
                </View>
              )}
            />
            <FlatList
              data={keys.row2}
              horizontal
              initialNumToRender={10}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={MFProfileStyle.create_keyboardButton}>
                  {item.type === "number" || item.type === "text" ? (
                    <MFButton
                      iconSource={0}
                      imageSource={0}
                      avatarSource={0}
                      style={MFProfileStyle.create_keyboardButton}
                      variant={MFButtonVariant.Contained}
                      textLabel={item.content?.toString()}
                      textStyle={MFProfileStyle.create_keyboardButtonText}
                      onPress={() => {
                        if (titleString.length < maxProfileNameLength) {
                          setTitleString(titleString + item.content);
                        } else {
                          if (__DEV__) {
                            console.log(
                              "Max name length reached.. Stop typing"
                            );
                          }
                        }
                      }}
                      onFocus={() => {
                        setFocus("");
                      }}
                      containedButtonProps={{
                        containedButtonStyle: {
                          enabled: true,
                          focusedBackgroundColor: "#053C69",
                          unFocusedBackgroundColor: "transparent",
                          elevation: 5,
                          unFocusedTextColor: "grey",
                          hoverColor: "transparent",
                        },
                      }}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              )}
            />
            <FlatList
              data={keys.row3}
              horizontal
              initialNumToRender={10}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View style={MFProfileStyle.create_keyboardButton}>
                  {item.type === "number" || item.type === "text" ? (
                    <MFButton
                      iconSource={0}
                      imageSource={0}
                      avatarSource={0}
                      style={MFProfileStyle.create_keyboardButton}
                      variant={MFButtonVariant.Contained}
                      textLabel={item.content?.toString()}
                      textStyle={MFProfileStyle.create_keyboardButtonText}
                      onPress={() => {
                        if (titleString.length < maxProfileNameLength) {
                          setTitleString(titleString + item.content);
                        } else {
                          if (__DEV__) {
                            console.log("Stop typing, hotshot..");
                          }
                        }
                      }}
                      onFocus={() => {
                        setFocus("");
                      }}
                      containedButtonProps={{
                        containedButtonStyle: {
                          enabled: true,
                          focusedBackgroundColor: "#053C69",
                          unFocusedBackgroundColor: "transparent",
                          elevation: 5,
                          unFocusedTextColor: "grey",
                          hoverColor: "transparent",
                        },
                      }}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              )}
            />
          </View>
        </View>
        <View
          style={{
            // backgroundColor: "yellow",
            width: "20%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ marginTop: 70, alignSelf: "center" }}>
            <MFButton
              variant={MFButtonVariant.Contained}
              textLabel={
                props.route.params.mode === "edit" ? "Done" : "Continue"
              }
              iconSource={0}
              imageSource={0}
              avatarSource={0}
              onFocus={() => {
                setFocus("");
              }}
              onPress={() => {
                if (titleString.trim() === "") {
                  Alert.alert("Please enter some name");
                } else {
                  props.route.params.mode === "edit"
                    ? onPressSave()
                    : createProfile();
                }
              }}
              style={{ width: 274, height: 62, margin: 20 }}
              focusedStyle={{ width: 274, height: 62 }}
              textStyle={{ color: "white", fontSize: 25, textAlign: "center" }}
              containedButtonProps={{
                containedButtonStyle: {
                  unFocusedTextColor: "grey",
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
              textStyle={{ color: "white", fontSize: 25, textAlign: "center" }}
              onPress={() => {
                props.route.params.mode === "edit"
                  ? props.navigation.goBack()
                  : props.navigation.pop();
              }}
              textLabel="Cancel"
              imageSource={0}
              avatarSource={0}
              containedButtonProps={{
                containedButtonStyle: {
                  unFocusedTextColor: "grey",
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
      </View>
    </View>
  );
};

export default CreateProfileScreen;
