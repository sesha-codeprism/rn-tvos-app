import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
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
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>
            {props.description ? props.description : "Are you sure ?"}
          </Text>
          <View style={{ width: "100%" }}>
            <FlatList data={props.buttons && props.buttons.length
              ? props.buttons
              : defaultProps.buttons}
              keyExtractor={(item, index)=> `${props.popupId}-${item.title}-${index}`}
              key={props.popupId}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    onFocus={() => {
                      setFocused(index);
                    }}
                    key={`${props.popupId}-${item.title}-${index}`}
                    isTVSelectable={true}
                    hasTVPreferredFocus={index === 0 ? true: false}
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
                    onPress={
                      item.onPress
                        ? item.onPress
                        : () => {
                            console.log("action is not defined for this button");
                          }
                    }
                  >
                    <Text style={styles.buttonText}>{item.title}</Text>
                  </Pressable>
                );
              }} />
            {/* {(props.buttons && props.buttons.length
              ? props.buttons
              : defaultProps.buttons
            ).map((item, index) => {
              return (
                <Pressable
                  onFocus={() => {
                    setFocused(index);
                  }}
                  key={index}
                  hasTVPreferredFocus={index === 0 ? true: false}
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
                  onPress={
                    item.onPress
                      ? item.onPress
                      : () => {
                          console.log("action is not defined for this button");
                        }
                  }
                >
                  <Text style={styles.buttonText}>{item.title}</Text>
                </Pressable>
              );
            })} */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MFPopup;

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "#00030E",
    justifyContent:'center',
    alignItems: "center",
    alignSelf: "center",
  },
  container: {
    height: 682,
    width: 700,
    borderRadius: 10,
    backgroundColor: "#202124",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",

    // position: "absolute",
  },
  content: {
    width: 596,
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
