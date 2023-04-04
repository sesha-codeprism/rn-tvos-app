import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Settings as SettingsRN,
} from "react-native";
import React, { useEffect, useState } from "react";
import MFEventEmitter from "./../utils/MFEventEmitter";
import { useQuery } from "react-query";
import { getPasscodes, PinType } from "../../backend/subscriber/subscriber";
import { getPasscodeHash, isHash } from "../utils/helpers";
import { GLOBALS } from "../utils/globals";
import { defaultQueryOptions } from "../config/constants";
import { AppStrings } from "../config/strings";
import { SCREEN_WIDTH } from "../utils/dimensions";
import MFButton, { MFButtonVariant } from "./MFButton/MFButton";
import { AppImages } from "../assets/images";
import { globalStyles } from "../config/styles/GlobalStyles";
import { metadataSeparator } from "../utils/Subscriber.utils";

interface PinPopupProps {
  title?: string;
  subtitle?: string;
  bodyTitle?: string;
  bodySubitle?: string;
  footerOne?: string;
  footerTwo?: string;
  pinType: PinType;
  onSuccess?: any;
  data?: any;
}

const thirtyMinutes = 1800000;

const numberPad = [1, 2, 3, 4, 5, "del", 6, 7, 8, 9, 0];

const MFPinPopup = (props: PinPopupProps) => {
  const [focused, setFocused] = useState(0);
  const [focussed, setFocussed] = useState<any>("");
  const [pin, setPin] = useState<any>(["", "", "", ""]);
  const [errMessage, setErrMessage] = useState("");
  // TODO
  const [isLockedOut, setLockedOut] = useState(false);
  const [numberOfAttempts, setNumberOfAttempts] = useState(5);
  const [timeLeft, setTimeLeft] = useState(Infinity);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const {
    data: passcodeData,
    isLoading,
    isStale,
    isFetched,
  } = useQuery(["passcode", props.pinType], () => getPasscodes(props.pinType), {
    refetchOnMount: "always",
    ...defaultQueryOptions,
  });

  const onLoad = () => {
    const {
      EpisodeName = undefined,
      EpisodeNumber = undefined,
      SeasonNumber = undefined,
      Name = undefined,
      Title,
    } = props.data?.ProgramDetails ||
    props.data?.ChannelInfo?.Schedule ||
    props.data?.CatalogInfo ||
    {};
    const {
      ReleaseYear = undefined,
      Rating = undefined,
      title,
      Name: programName,
      pinLabelHeader,
      pinLabel,
    } = props.data?.udpData || props.data || {};
    const metadata = [];
    if (SeasonNumber && EpisodeNumber) {
      metadata.push(`S${SeasonNumber} E${EpisodeNumber}`);
    }

    if (metadata?.length && (EpisodeName || Name)) {
      metadata.push(EpisodeName || Name);
    }

    if (!metadata?.length) {
      if (ReleaseYear) {
        metadata.push(ReleaseYear);
      }
      if (Rating) {
        metadata.push(Rating);
      }
    }
    setTitle(title || programName || Title || Name);
    setSubTitle(metadata.join(metadataSeparator));
  };

  useEffect(() => {
    // read lockout
    onLoad();
    const lockoutTime = SettingsRN.get("LOCKOUT_TIME");
    if (lockoutTime) {
      const currentTime = new Date().getTime();
      if (currentTime - lockoutTime < thirtyMinutes) {
        setLockedOut(true);
        setTimeLeft(
          thirtyMinutes / 60000 -
            Math.floor((currentTime - lockoutTime) / 60000)
        );
      }
    }
  }, []);

  const checkPasscode = async (type: PinType) => {
    try {
      const pinInput = pin.join("");
      const hashedPin = getPasscodeHash(
        pinInput,
        GLOBALS.bootstrapSelectors?.OriginalAccountId ||
          GLOBALS.bootstrapSelectors?.AccountId ||
          ""
      );
      const [{ Passcode: passcode }] = passcodeData?.data || {};

      if (
        !isLoading &&
        !isStale &&
        isFetched &&
        passcode &&
        isHash(passcode) &&
        passcode === hashedPin
      ) {
        props.onSuccess ? props.onSuccess() : null;
        MFEventEmitter.emit("closePinVerificationPopup", undefined);
        return true;
      } else {
        setNumberOfAttempts(numberOfAttempts - 1);
        if (numberOfAttempts - 1 < 1) {
          setLockedOut(true);
          SettingsRN.set({ LOCKOUT_TIME: new Date().getTime() });
          setErrMessage("Pin verification will be locked for next 30 mins");
          setTimeout(() => {
            setPin(["", "", "", ""]);
          }, 2000);
        } else {
          setErrMessage(AppStrings.str_settings_wrong_pin);
          setTimeout(() => {
            setPin(["", "", "", ""]);
          }, 2000);
        }
        return false;
      }
    } catch (error) {
      console.log("error getting pin");
    }
  };

  const onPressNumber = async (number: any) => {
    number && setErrMessage("");
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
      ? setTimeout(async () => {
          await checkPasscode(props.pinType);
        }, 500)
      : null;
  };

  const onPressDelete = () => {
    let pinCode = [...pin];
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
    <Modal
      style={[
        {
          position: "absolute",
          // right: 0,
          top: 0,
          width: SCREEN_WIDTH,
          backgroundColor: "green",
        },
        GLOBALS.enableRTL ? { left: 0 } : { right: 0 },
      ]}
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        MFEventEmitter.emit("closePinVerificationPopup", undefined);
      }}
      onDismiss={() => {
        MFEventEmitter.emit("closePinVerificationPopup", undefined);
      }}
      presentationStyle={"overFullScreen"}
    >
      <View style={styles.container}>
        <View style={styles.headerContainerBg}></View>
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>{props.title || title || ""}</Text>

          <Text style={styles.subTitleText}>
            {props.subtitle || subTitle || ""}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.bodyTitle}>
            {props.bodyTitle || AppStrings.str_settings_content_locked}
          </Text>
          <Text style={styles.bodySubitle}>
            {props.bodySubitle || AppStrings.str_pcon_header_text}
          </Text>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <View style={styles.inputContainer}>
              {pin.map((item: any, index: any) => {
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
              })}
            </View>
          </View>
          {errMessage !== "" && (
            <Text style={styles.errMessage}>{errMessage}</Text>
          )}
          {timeLeft < Infinity && (
            <Text
              style={styles.errMessage}
            >{`Pin verification will be locked for next ${timeLeft} mins`}</Text>
          )}
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
                      disabled={isLockedOut}
                      onFocus={() => {
                        !isLockedOut && setFocussed(item);
                      }}
                      key={index}
                      style={
                        item === focussed
                          ? [
                              styles.numberPadItem,
                              { backgroundColor: "#053C69" },
                            ]
                          : styles.numberPadItem
                      }
                      onPress={() => {
                        !isLockedOut && onPressNumber(item);
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
        </View>
        <View style={styles.footerContainer}>
          {/* {props.footerOne && ( */}
          <Text style={styles.text}>
            {props.footerOne || AppStrings.str_settings_setpin_instruction}
          </Text>
          {/* )} */}
          {/* {props.footerTwo && ( */}
          <Text style={styles.bodyTitle}>
            {props.footerTwo || AppStrings.str_settings_setpin_contact}
          </Text>
          {/* )} */}
        </View>
      </View>
    </Modal>
  );
};

export default MFPinPopup;

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    height: 800,
    width: 670,
    borderRadius: 10,
    backgroundColor: "#202124",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",

    // position: "absolute",
  },
  headerContainerBg: {
    height: 165,
    width: 670,
    backgroundColor: globalStyles.backgroundColors.shade1,
    opacity: 0.2,
    position: "absolute",
  },
  headerContainer: {
    height: 165,
    width: 670,
    paddingTop: 32,
    paddingLeft: 67,
  },
  content: {
    width: "100%",
    height: 515,
    paddingTop: 40,
    backgroundColor: globalStyles.backgroundColors.shade2,
    // alignItems: "center",
    // alignSelf: "center",
    // justifyContent: "space-around",
  },
  titleText: {
    color: globalStyles.fontColors.light,
    fontSize: 31,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 50,
  },
  subTitleText: {
    color: globalStyles.fontColors.lightGrey,
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
  },
  bodyTitle: {
    color: globalStyles.fontColors.light,
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
  },
  bodySubitle: {
    color: globalStyles.fontColors.lightGrey,
    fontSize: 25,
    // fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
  },
  footerContainer: {
    width: 670,
    height: 120,
    borderTopWidth: 1,
    borderTopColor: globalStyles.backgroundColors.shade4,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonInactive: {
    height: 62,
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#424242",
    marginTop: 20,
    justifyContent: "center",
  },
  focusedStyle: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
    color: "#EEEEEE",
  },
  text: {
    color: globalStyles.fontColors.light,
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
  seperator: {
    width: "100%",
    opacity: 0.4,
    height: 1,
    borderWidth: 0.4,
    borderColor: "#EEEEEE",
    backgroundColor: "transparent",
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
  inputLebelText: {
    color: "#EEEEEE",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
  },
  errMessage: {
    color: "#B22334",
    fontSize: 23,
    letterSpacing: 0,
    lineHeight: 38,
  },
  numberPadContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 144,
    marginTop: 20,
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
});
