import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SCREEN_WIDTH } from "../utils/dimensions";
import { GLOBALS } from "../utils/globals";
import MFEventEmitter from "../utils/MFEventEmitter";
interface MFPopupProps {
  buttons?: Buttons[];
  title?: string;
  description?: string;
  popupId?: string;
}
interface Buttons {
  title: string;
  style?: any;
  onPress?: any;
}
const defaultProps = {
  buttons: [
    {
      title: "OK",
      onPress: () => {},
      style: null,
    },
    {
      title: "CANCEL",
      onPress: () => {},
      style: null,
    },
  ],
  description:
    "Disabling Personalization will erase all  information associated with this profile permanently and you will no longer receive program recommendations. Are you sure you want to Disable Personalization on this profile?",
};
const MFPopup = (props: MFPopupProps) => {
  const [focused, setFocused] = useState(0);
  const _onFocus = () => {};
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
        MFEventEmitter.emit("closePopup", null);
      }}
      onDismiss={() => {
        MFEventEmitter.emit("closePopup", null);
      }}
      presentationStyle={"overFullScreen"}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {props.title && (
            <Text
              style={{
                color: "#EEEEEE",
                fontSize: 48,
                fontWeight: "bold",
                letterSpacing: 0,
                lineHeight: 60,
                textAlign: "center",
              }}
            >
              {props.title}
            </Text>
          )}
          <Text style={styles.text}>
            {props.description ? props.description : "Are you sure ?"}
          </Text>
          <View style={{ width: "100%" }}>
            <FlatList
              data={
                props.buttons && props.buttons.length
                  ? props.buttons
                  : defaultProps.buttons
              }
              keyExtractor={(item, index) =>
                `${props.popupId}-${item.title}-${index}`
              }
              key={props.popupId}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onFocus={() => {
                      setFocused(index);
                    }}
                    key={`${props.popupId}-${item.title}-${index}`}
                    isTVSelectable={true}
                    hasTVPreferredFocus={index === 0 ? true : false}
                    style={
                      focused === index
                        ? [
                            styles.buttonInactive,
                            {
                              ...styles.focusedStyle,
                              backgroundColor: "#053C69",
                            },
                          ]
                        : styles.buttonInactive
                    }
                    onPress={(params: any) => {
                      item.onPress
                        ? item.onPress(params)
                        : console.log("action is not defined for this button");
                    }}
                  >
                    <Text style={styles.buttonText}>{item.title}</Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MFPopup;

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    height: 682,
    width: 900,
    borderRadius: 10,
    backgroundColor: "#202124",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",

    // position: "absolute",
  },
  content: {
    width: 744,
    height: "100%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-around",
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
    color: "#EEEEEE",
    fontSize: 31,
    letterSpacing: 0,
    lineHeight: 50,
  },
});
