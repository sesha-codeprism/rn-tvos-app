import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  BackHandler,
  TVMenuControl,
  PressableProps,
  TouchableOpacity,
  useTVEventHandler,
} from "react-native";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAllSubscriberProfiles } from "../../../../backend/subscriber/subscriber";
import { UserProfile } from "../../../@types/UserProfile";
import MFText from "../../../components/MFText";
import MFUserProfile from "../../../components/MFUserProfile";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import { AppImages } from "../../../assets/images";
import { TargetedEvent } from "react-native";
import { Routes } from "../../../config/navigation/RouterOutlet";
import MFPopup from "../../../components/MFPopup";
import { EditUserProfileObject, GLOBALS } from "../../../utils/globals";
import { MFProfileStyle } from "../../../config/styles/MFProfileStyles";
import { GlobalContext } from "../../../contexts/globalContext";
const { width, height } = Dimensions.get("window");

interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}

const ProfileScreen: React.FunctionComponent<ProfileScreenProps> = (
  props: any
) => {
  const [userProfiles, setProfiles] = useState(Array<UserProfile>());
  const [editFocused, setEditFocused] = useState(false);
  const [focused, setFocused] = useState<any>("");
  const [lastEventType, setLastEventType] = useState("");
  var lastEvent: any = "";
  const profileRef = Array(8)
    .fill(0)
    .map(() => useRef<PressableProps>(null));
  // const addButtonRef = useRef<PressableProps>(null);
  const currentContext: any = useContext(GlobalContext);
  // console.log('data inside context',currentContext);
  const getProfiles = async () => {
    const profileResponse = await getAllSubscriberProfiles();
    const profilesArray: Array<UserProfile> = profileResponse.data;
    const profiles = profilesArray.filter((profile) => profile.UserCreated);
    // console.log('profile', profiles);
    setProfiles(profiles);
    // return profiles;
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      getProfiles();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  const myTVEventHandler = (evt: {
    eventType: React.SetStateAction<string>;
  }) => {
    // @ts-ignore
    if (!evt.tag && evt.eventType) {
      console.log("evt.eventType", evt);
      editFocused &&
      (evt.eventType === "right" || evt.eventType === "swipeRight")
        ? profileRef[
            focused < userProfiles.length - 1 ? focused + 1 : userProfiles.length
            // @ts-ignore
          ]?.current?.setNativeProps({
            hasTVPreferredFocus: true,
          })
        : editFocused &&
          (evt.eventType === "left" || evt.eventType === "swipeLeft")
        ? // @ts-ignore
          profileRef[focused > 0 ? focused - 1 : 0].current?.setNativeProps({
            hasTVPreferredFocus: true,
          })
        : null;

      lastEvent = evt.eventType;
      setLastEventType(evt.eventType);
    }
  };
  useTVEventHandler(myTVEventHandler);
  const onFocus = (
    event: NativeSyntheticEvent<TargetedEvent>,
    index: number
  ) => {
    setFocused(index);
    setEditFocused(false);
  };

  const _onFocusEdit = () => {
    setEditFocused(true);
  };
  const _onBlurEdit = () => {
    setEditFocused(false);
  };
  const _onEdit = (item: UserProfile) => {
    console.log("edit pressed with data", item);
    GLOBALS.editUserProfile = item;
    props.navigation.navigate(Routes.ProfileFinalise, { item, mode: "edit" });
  };

  const backAction = () => {
    console.log("Capturing hadware back presses on profile screen");
    return null;
  };

  useEffect(() => {
    // console.log("Enabling TVMenuKey");
    TVMenuControl.enableTVMenuKey();
    BackHandler.addEventListener("hardwareBackPress", backAction);
  });
  return (
    <View style={MFProfileStyle.container}>
      <View style={MFProfileStyle.profileTitleContainer}>
        <MFText
          shouldRenderText
          displayText={"Choose Your Profile"}
          textStyle={MFProfileStyle.titleTextStyle}
        />
      </View>
      <View
        style={{
          flex: 7,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          alignSelf: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {userProfiles.map((item, index) => {
            return item.UserCreated ? (
              <View style={{ marginBottom: 120 }} key={`Index${index}`}>
                <MFUserProfile
                  // @ts-ignore
                  ref={profileRef[index]}
                  userProfile={item}
                  navigation={props.navigation}
                  onFocus={(e) => {
                    onFocus(e, index);
                  }}
                  checkedOnFocus={true}
                />
                {focused === index ? (
                  <Pressable
                    onPress={() => {
                      _onEdit(item);
                    }}
                    style={[
                      MFProfileStyle.editIconContainerStyles,
                      editFocused
                        ? StyleSheet.flatten([
                            {
                              ...MFProfileStyle.editIconContainerStyles,
                              borderWidth: 5,
                              borderColor: "#053C69",
                            },
                          ])
                        : StyleSheet.flatten(MFProfileStyle.unfocusedStyle),
                    ]}
                    onFocus={() => {
                      _onFocusEdit();
                    }}
                    onBlur={() => {
                      _onBlurEdit();
                    }}
                  >
                    <MFButton
                      variant={MFButtonVariant.Icon}
                      iconSource={AppImages.edit}
                      iconStyles={[
                        MFProfileStyle.editIconStyles,
                        StyleSheet.flatten(MFProfileStyle.unfocusedStyle),
                      ]}
                      avatarSource={{}}
                      imageSource={{}}
                      iconButtonStyles={{ shouldRenderImage: true }}
                    />
                  </Pressable>
                ) : null}
              </View>
            ) : (
              <View />
            );
          })}
          {userProfiles.length < 8 ? (
            <View style={{ marginBottom: 120 }}>
              <MFUserProfile ref={profileRef[userProfiles.length]} navigation={props.navigation} />
            </View>
          ) : undefined}
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
