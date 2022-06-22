import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import { BackHandler } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import SideMenuLayout from "../../../../components/MFSideMenu";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const numberPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const ContentLockPinScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [pin, setPin] = useState<any>(["", "", "", ""]);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  }, []);
  const handleBackButtonClick = () => {
    props.navigation.goBack();
    return true;
  };
  const onPressNumber = (number: number) => {
    console.log("number pressed", number);
    let pinCode = pin;
    pin[0] === ""
      ? (pinCode[0] = number)
      : pin[1] === ""
      ? (pinCode[1] = number)
      : pin[2] === ""
      ? (pinCode[2] = number)
      : pin[3] === ""
      ? (pinCode[3] = number)
      : null;
    console.log("pincode", pinCode);
    setPin([...pinCode]);
  };
  const onPressDelete = () => {
    let pinCode = pin;
    console.log("delete pressed", pinCode.length - 1);
    pin[3] !== ""
      ? (pinCode[3] = "")
      : pin[2] !== ""
      ? (pinCode[2] = "")
      : pin[1] !== ""
      ? (pinCode[1] = "")
      : pin[0] !== ""
      ? (pinCode[0] = "")
      : null;
    setPin([...pinCode]);
  };
  return (
    <SideMenuLayout title="Parental Controls" subTitle="Content Locks">
      <Text style={styles.inputLebelText}>Input 4-digit PIN</Text>
      <View style={styles.inputContainer}>
        {pin.map((item: any, index: any) => {
          return (
            <View key={index} style={styles.inputElement}>
              <Text style={styles.inputLebelText}>{item}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.numberPadContainer}>
        <View style={styles.numberPad}>
          {numberPad.map((item, index) => {
            return (
              <Pressable
                hasTVPreferredFocus={index === 1}
                onFocus={() => {
                  setFocussed(index);
                }}
                // onBlur={() => {
                //   index === numberPad.length ? setFocussed("") : null;
                // }}
                key={index}
                style={
                  index === focussed
                    ? [styles.numberPadItem, { backgroundColor: "#053C69" }]
                    : styles.numberPadItem
                }
                onPress={() => {
                  onPressNumber(item);
                }}
              >
                <Text
                  style={
                    index === focussed
                      ? [styles.numberPadText, { color: "white" }]
                      : styles.numberPadText
                  }
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.backBtnContainer}>
          {/* <Image
              source={AppImages.delete_png}
              style={styles.keyboardDelete}
            /> */}
          <View
            style={
              focussed === "D"
                ? [
                    styles.keyboardDeleteContainer,
                    { backgroundColor: "#053C69" },
                  ]
                : styles.keyboardDeleteContainer
            }
          >
            <MFButton
              variant={MFButtonVariant.Image}
              iconSource={0}
              onPress={onPressDelete}
              onFocus={() => {
                setFocussed("D");
              }}
              imageSource={AppImages.delete_png}
              imageStyles={styles.keyboardDelete}
              avatarSource={0}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomTextContainer}>
        <Text style={styles.inputLebelText}>To set or reset PIN</Text>
        <Text
          style={[styles.inputLebelText, { fontWeight: "600", marginTop: 10 }]}
        >
          Please call (333)546-5689
        </Text>
      </View>
    </SideMenuLayout>
  );
};

export default ContentLockPinScreen;

const styles = StyleSheet.create({
  inputLebelText: {
    color: "#EEEEEE",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 18,
  },
  inputElement: {
    height: 90,
    width: 90,
    borderRadius: 4,
    backgroundColor: "#424242",
    marginRight: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  numberPadContainer: {
    display: "flex",
    flexDirection: "row",
    width: 437,
    height: 144,
    // backgroundColor: "red",
    marginTop: 53,
  },
  numberPad: {
    display: "flex",
    flexDirection: "row",
    width: 384,
    height: 144,
    // backgroundColor: "red",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  backBtnContainer: {
    width: 53,
    height: 144,
  },
  numberPadItem: {
    height: 58,
    width: 58,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
    marginTop: 15,
    borderRadius: 4,
  },
  numberPadText: {
    color: "#828282",
    fontSize: 31,
    letterSpacing: 0,
    lineHeight: 50,
  },
  keyboardDeleteContainer: {
    height: 52,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    marginTop: 15,
    borderRadius: 4,
  },
  keyboardDelete: {
    width: 45,
    height: 25,
  },
  bottomTextContainer: {
    marginTop: 84,
  },
});
