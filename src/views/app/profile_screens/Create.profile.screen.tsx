import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, View } from "react-native";
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
import { updateUserProfile } from "../../../../backend/subscriber/subscriber";
import { MFProfileStyle } from "../../../config/styles/MFProfileStyles";
const { width, height } = Dimensions.get("window");

const keyboard: FormKeyBoard = require("../../../config/keyboards/FormKeyboard.json");

interface CreateProfileProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  mode: "edit" | "create";
  item: any;
}

const CreateProfileScreen: React.FunctionComponent<CreateProfileProps> = (
  props: any
) => {
  console.log('props coming to create profile', props);
  const [titleString, setTitleString] = useState(
    props.route.params &&
      props.route.params.item &&
      props.route.params.item.Name
      ? props.route.params.item.Name
      :
    ""
  );

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
      GLOBALS.editUserProfile.Name = titleString;
      props.navigation.navigate(Routes.ProfileFinalise, {
        item: GLOBALS.editUserProfile,
        mode: "edit",
      });
    }
    // else {
    //   try {
    //     const payload = { Id: props.route.params.item.id, Name: titleString, UserCreated: true };
    //     const result = await updateUserProfile(payload);
    //     console.log("update user result", result);
    //   } catch (error) {
    //     console.log("error updating user", error);
    //   }
    // }
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
          </View>
          <View style={{ marginTop: 50 }}>
            <FlatList
              hasTVPreferredFocus
              data={keyboard.row1}
              horizontal
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
                        setTitleString(titleString + item.content);
                      }}
                      onFocus={() => {}}
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
                    <MFButton
                      variant={MFButtonVariant.Image}
                      iconSource={0}
                      onPress={() => {
                        if (item.image === "space") {
                          setTitleString(titleString + " ");
                        } else {
                          setTitleString(titleString.slice(0, -1));
                        }
                      }}
                      onFocus={() => {}}
                      imageSource={
                        item.image === "space"
                          ? AppImages.space_png
                          : AppImages.delete_png
                      }
                      imageStyles={
                        item.image === "space"
                          ? MFProfileStyle.create_keyboardSpace
                          : MFProfileStyle.create_keyboardDelete
                      }
                      avatarSource={0}
                    />
                  )}
                </View>
              )}
            />
            <FlatList
              data={keyboard.row2}
              horizontal
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
                        setTitleString(titleString + item.content);
                      }}
                      onFocus={() => {}}
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
              data={keyboard.row3}
              horizontal
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
                        setTitleString(titleString + item.content);
                      }}
                      onFocus={() => {}}
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
          <MFButton
            variant={MFButtonVariant.Contained}
            textLabel={props.route.params.mode === "edit" ? "Done" : "Continue"}
            iconSource={0}
            imageSource={0}
            avatarSource={0}
            onPress={() => {
              if (titleString == "") {
                Alert.alert("Please enter some name");
              } else {
                props.route.params.mode === "edit"
                  ? onPressSave()
                  : ((GLOBALS.createUserProfile.name = titleString),
                    props.navigation.navigate(Routes.ChooseProfile, {
                      mode: "create",
                      item: null,
                    }));
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
                : props.navigation.pop(2);
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
  );
};

export default CreateProfileScreen;
