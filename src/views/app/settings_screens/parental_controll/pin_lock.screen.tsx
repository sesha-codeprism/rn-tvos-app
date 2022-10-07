import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import { BackHandler } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import {
  changePasscodes,
  createPasscodes,
  getPasscodes,
  PinType,
} from "../../../../../backend/subscriber/subscriber";
import { getPasscodeHash } from "../../../../utils/helpers";
import { GLOBALS } from "../../../../utils/globals";
import { PinActionTypes } from "./parental_controll.screen";
interface PinProps {
  screenName: string;
  pinType: PinType;
  action: "validate_pin" | "change_pin";
  label: string;
}
interface Props {
  navigation: NativeStackNavigationProp<any>;
  pinProps: PinProps;
}
const numberPad = [1, 2, 3, 4, 5, "del", 6, 7, 8, 9, 0];
const PinLockScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [pin, setPin] = useState<any>(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState<any>(["", "", "", ""]);
  const [subTitle, setSubTitle] = useState(props.route.params.screenName);
  const [label, setLabel] = useState(props.route.params.label);
  const [actionType, setActionType] = useState(props.route.params.action);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    getPassword(props.route.params.pinType)
      .then((res: Array<any>) => {
        console.log("res inside useEffect", res);
        if (res.length === 0) {
          setLabel("Enter the new PIN");
          setActionType(PinActionTypes["CREATE"]);
        } else {
          const password = res.find((item) => {
            item.PasscodeType === props.route.params.pinType;
          });
          if (password) {
            checkPasscode(password.Passcode, props.route.params.pinType);
          }
        }
      })
      .catch((error) => {
        console.log("error inside catch", error);
      });
    console.log("props inside pin screen", props.route.params);
    return;
    // BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  }, []);

  // const handleBackButtonClick = () => {
  //   props.navigation.goBack();
  //   return true;
  // };
  const onSubmit = async (type: string) => {
    try {
      console.log("action type ", actionType);
      // If pin action type is create then it will ask for pin confirmation
      if (
        actionType === PinActionTypes["CREATE"] ||
        actionType === PinActionTypes["UPDATE"]
      ) {
        setActionType(PinActionTypes["CONFIRM"]);
        setLabel("Re-enter the new PIN");
        // if pin action type is confirm
      } else if (
        actionType === PinActionTypes["CONFIRM"] &&
        props.route.params.pinType !== PinActionTypes["UPDATE"]
      ) {
        console.log("pin", pin, "pinConfirm", pinConfirm);
        if (pin.join() === pinConfirm.join()) {
          setErrMessage("");
          const res = setPasscode(props.route.params.pinType);
          console.log("setpin response", res);
        } else {
          setErrMessage("Pin Mismatch");
          setPinConfirm(["", "", "", ""]);
        }
      } else if (
        actionType === PinActionTypes["CONFIRM"] &&
        props.route.params.pinType === PinActionTypes["UPDATE"]
      ) {
        if (pin.join() === pinConfirm.join()) {
          const res = updatePasscode(props.route.params.pinType);
          console.log("change pin response", res);
        }
      }
    } catch (error) {}
  };

  const getPassword = async (type: PinType) => {
    try {
      const res = await getPasscodes(type);
      console.log("res in get password", res);
      return res.data;
    } catch (error) {
      console.log("error getting password", error);
    }
  };

  const checkPasscode = async (passcode: string, type: PinType) => {
    try {
      const pinInput = pin.join();
      const hashedPin = getPasscodeHash(
        pinInput,
        GLOBALS.bootstrapSelectors?.AccountId
          ? GLOBALS.bootstrapSelectors?.AccountId
          : ""
      );
      // const data = await getPassword(type);
      if (passcode === hashedPin) {
        console.log("password matching");
        return true;
      } else {
        console.log("incorrect password");
        setErrMessage("Incorrect Password");
        return false;
      }
    } catch (error) {
      console.log("error getting pin");
    }
  };

  const setPasscode = async (type: PinType) => {
    try {
      console.log("setPasscode", type);
      const pinInput = pin.join();
      const hashedPin = getPasscodeHash(
        pinInput,
        GLOBALS.bootstrapSelectors?.AccountId
          ? GLOBALS.bootstrapSelectors?.AccountId
          : ""
      );
      const res = await createPasscodes(type, hashedPin);
      console.log("Create password response", res?.data);
      return res?.data;
    } catch (error: any) {
      console.log("error in setting pin", error);
      Alert.alert(error.message);
    }
  };

  const updatePasscode = async (type: PinType) => {
    try {
      const pinInput = pin.join();
      const hashedPin = getPasscodeHash(
        pinInput,
        GLOBALS.bootstrapSelectors?.AccountId
          ? GLOBALS.bootstrapSelectors?.AccountId
          : ""
      );
      const res = await changePasscodes(type, hashedPin);
      console.log("update password response", res.data);
      return res.data;
    } catch (error) {
      console.log("error in updating pin");
    }
  };

  const onPressNumber = async (number: any) => {
    console.log("number pressed", number);
    if (
      actionType === PinActionTypes["CREATE"] ||
      actionType === PinActionTypes["VERIFY"]
    ) {
      console.log("inside create block", actionType);
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
      setPin([...pinCode]);
      pinCode[0] !== "" &&
      pinCode[1] !== "" &&
      pinCode[2] !== "" &&
      pinCode[3] !== ""
        ? await onSubmit(actionType)
        : null;
      console.log("pincode", pinCode);
    } else {
      console.log("inside confirm block", actionType);
      let pinCode = pinConfirm;
      pinConfirm[0] === ""
        ? (pinCode[0] = number)
        : pinConfirm[1] === ""
        ? (pinCode[1] = number)
        : pinConfirm[2] === ""
        ? (pinCode[2] = number)
        : pinConfirm[3] === ""
        ? (pinCode[3] = number)
        : null;
      setPinConfirm([...pinCode]);
      pinCode[0] !== "" &&
      pinCode[1] !== "" &&
      pinCode[2] !== "" &&
      pinCode[3] !== ""
        ? await onSubmit(PinActionTypes["CONFIRM"])
        : null;
      console.log("pinconfirm code", pinCode);
    }
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
    <SideMenuLayout title="Parental Controls" subTitle={subTitle}>
      <Text style={styles.inputLebelText}>{label}</Text>
      <View style={styles.inputContainer}>
        {(actionType === "create" ? pin : pinConfirm).map(
          (item: any, index: any) => {
            return (
              <View key={index} style={styles.inputElement}>
                {item !== "" ? (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: "#EEEEEE",
                    }}
                  />
                ) : (
                  <Text style={styles.inputLebelText}>{item}</Text>
                )}
              </View>
            );
          }
        )}
      </View>
      {errMessage !== "" && <Text style={styles.errMessage}>{errMessage}</Text>}
      <View style={styles.numberPadContainer}>
        <View style={styles.numberPad}>
          <FlatList
            data={numberPad}
            keyExtractor={(item) => item.toString()}
            nextFocusDown={1}
            numColumns={6}
            renderItem={({ item, index }) => {
              return item === "del" ? (
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
              ) : (
                <Pressable
                  hasTVPreferredFocus={index === 1}
                  onFocus={() => {
                    setFocussed(item);
                  }}
                  // onBlur={() => {
                  //   index === numberPad.length ? setFocussed("") : null;
                  // }}
                  key={index}
                  style={
                    item === focussed
                      ? [styles.numberPadItem, { backgroundColor: "#053C69" }]
                      : styles.numberPadItem
                  }
                  onPress={() => {
                    onPressNumber(item);
                  }}
                >
                  <Text
                    style={
                      item === focussed
                        ? [styles.numberPadText, { color: "white" }]
                        : styles.numberPadText
                    }
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
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

export default PinLockScreen;

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
    // marginTop: 53,
  },
  numberPad: {
    display: "flex",
    flexDirection: "row",
    width: 437,
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
    marginRight: 19,
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
  errMessage: {
    color: "#B22334",
    fontSize: 23,
    letterSpacing: 0,
    lineHeight: 38,
  },
});
