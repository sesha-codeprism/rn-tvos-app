import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Dimensions, FlatList, View } from "react-native";
import FastImage from "react-native-fast-image";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import MFText from "../../../components/MFText";
import { appUIDefinition } from "../../../config/constants";
import { AppImages } from "../../../assets/images";
import { Routes } from "../../../config/navigation/RouterOutlet";
import { GLOBALS } from "../../../utils/globals";
import { MFProfileStyle } from "../../../config/styles/MFProfileStyles";

const { width, height } = Dimensions.get("window");

interface ChooseProfileProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}

interface UserProfileObject {
  image: any;
  title: string;
}

const ChooseProfileScreen: React.FunctionComponent<ChooseProfileProps> = (
  props: any
) => {
  const [selectedImage, setSelectedImage] = useState<UserProfileObject>({
    image: "",
    title: props.route.params.item ? props.route.params.item.Image : "",
  });
  const profiles: Array<UserProfileObject> = [
    { image: AppImages.profile_pic_1, title: "profile_pic_1" },
    { image: AppImages.profile_pic_2, title: "profile_pic_2" },
    { image: AppImages.profile_pic_3, title: "profile_pic_3" },
    { image: AppImages.profile_pic_4, title: "profile_pic_4" },
    { image: AppImages.profile_pic_5, title: "profile_pic_5" },
    { image: AppImages.profile_pic_6, title: "profile_pic_6" },
    { image: AppImages.profile_pic_7, title: "profile_pic_7" },
    { image: AppImages.profile_pic_8, title: "profile_pic_8" },
  ];
  const onPressSave = async () => {
    if (selectedImage.title === "") {
      Alert.alert("OOPS!", "Please select a profile image to proceed", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
    } else {
      GLOBALS.editUserProfile.Image = selectedImage.title;
      props.navigation.navigate(Routes.ProfileFinalise, {
        item: GLOBALS.editUserProfile,
        mode: "edit",
      });
      // try {
      //   const payload = {
      //     Id: props.route.params.item.id,
      //     Image: selectedImage.title,
      //     // UserCreated: true,
      //   };
      //   const result = await updateUserProfile(payload);
      //   console.log("update user result", result);
      // } catch (error) {
      //   console.log("error updating user", error);
      // }
    }
  };

  return (
    <View style={MFProfileStyle.choose_container}>
      <View style={MFProfileStyle.choose_profileTitleContainer}>
        <MFText
          shouldRenderText
          displayText="Choose your profile"
          textStyle={MFProfileStyle.choose_titleTextStyle}
        />
      </View>
      <View style={MFProfileStyle.choose_mainContainer}>
        <View style={MFProfileStyle.choose_inputContainer}>
          <MFText
            shouldRenderText
            displayText="Choose your profile picture"
            textStyle={MFProfileStyle.choose_profileTitleStyle}
          />
          <View style={{ marginTop: 50 }}>
            <FlatList
              data={profiles}
              numColumns={4}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item, index }) => (
                <View
                // style={[
                // MFProfileStyle.imageContainer,
                // {
                //  // borderColor: focused ? "#053C69" : "transparent",
                //   borderWidth: 5,
                //   padding: 5,
                //   borderRadius: 200 / 2,
                // },
                // ]}
                >
                  <MFButton
                    variant={MFButtonVariant.Avatar}
                    avatarSource={item.image}
                    iconSource={0}
                    imageSource={0}
                    avatarStyles={[
                      MFProfileStyle.choose_profileStyles,
                      { width: 140, height: 140, padding: 10 },
                    ]}
                    focusedStyle={MFProfileStyle.choose_activeProfileStyles}
                    style={MFProfileStyle.choose_profileStyles}
                    onPress={() => {
                      GLOBALS.createUserProfile.image = item.title;
                      setSelectedImage(item);
                    }}
                  />
                  {selectedImage.title === item.title && (
                    <View style={MFProfileStyle.choose_activeProfileIndicator}>
                      <FastImage
                        source={AppImages.tick_active}
                        style={
                          MFProfileStyle.choose_activeProfileIndicatorImage
                        }
                      />
                    </View>
                  )}
                </View>
              )}
            />
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
            textLabel={props.route.params.mode === "edit" ? "Save" : "Continue"}
            iconSource={0}
            imageSource={0}
            avatarSource={0}
            onPress={() => {
              if (
                selectedImage.title === "" ||
                !GLOBALS.createUserProfile.image
              ) {
                Alert.alert("Please choose a profile image");
              } else {
                props.route.params.mode === "edit"
                  ? onPressSave()
                  : props.navigation.navigate(Routes.PersonlizeProfile, {
                      mode: "create",
                      item: null,
                    });
              }
              // if (GLOBALS.createUserProfile.image) {
              //   props.navigation.navigate(Routes.PersonlizeProfile);
              // } else {
              //   Alert.alert("Please choose a profile image");
              // }
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
              props.navigation.goBack();
            }}
            textLabel="Cancel"
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
    </View>
  );
};

export default ChooseProfileScreen;
