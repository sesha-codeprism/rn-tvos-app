import React from "react";
import { DeviceEventEmitter, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { getFontIcon } from "../config/strings";
import { globalStyles } from "../config/styles/GlobalStyles";
import { SCREEN_WIDTH } from "../utils/dimensions";
import MFButton, { MFButtonVariant } from "./MFButton/MFButton";
import { TopBarWithTitle } from "./TopBarWithTitle";

type Props = { error: Error; resetError: () => void };

//@ts-ignore
const dismiss_icon = getFontIcon("dismiss");

const ErrorFallbackComponent = (props: Props) => (
  <View style={styles.container}>
    <TopBarWithTitle title=" " />
    <View style={styles.content}>
      <Text style={styles.errorIcon}>{dismiss_icon}</Text>
      {/* <Text style={styles.title}></Text> */}
      {/* <Text style={styles.subtitle}>{"There's an error"}</Text> */}
      <Text style={styles.error}>
        Something went wrong in processing your request.
      </Text>
      {/* <Text style={styles.error}></Text> */}
      <Text style={styles.error}>
        Please return to Homescreen by clicking the button below
      </Text>

      <Text
        style={[styles.error, { color: globalStyles.fontColors.statusError }]}
      >
        {"Message:" + " " + props.error.toString()}
      </Text>

      <MFButton
        variant={MFButtonVariant.Contained}
        iconSource={0}
        imageSource={0}
        avatarSource={undefined}
        hasTVPreferredFocus
        iconStyles={{
          height: 28,
          width: 28,
          marginRight: 20,
        }}
        textLabel="Reset"
        textStyle={styles.buttonText}
        style={styles.button}
        focusedStyle={[
          styles.button,
          { backgroundColor: globalStyles.backgroundColors.primary1 },
        ]}
        onPress={() => DeviceEventEmitter.emit('closeAll',  undefined)}
        iconButtonStyles={{
          shouldRenderImage: true,
          iconPlacement: "Left",
        }}
        containedButtonProps={{
          containedButtonStyle: {
            focusedBackgroundColor: globalStyles.backgroundColors.primary1,
            enabled: true,
            hoverColor: globalStyles.backgroundColors.primary1,
            elevation: 5,
            hasTVPreferredFocus: true,
          },
        }}
      />

      {/* <TouchableOpacity
        style={styles.button}
        onPress={props.resetError}
        activeOpacity={1}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity> */}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyles.backgroundColors.shade1,
    flex: 1,
    justifyContent: "center",
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  content: {
    marginHorizontal: 16,
  },
  errorIcon: {
    fontSize: 200,
    fontFamily: globalStyles.fontFamily.icons,
    color: globalStyles.fontColors.light,
    textAlign: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "300",
    paddingBottom: 16,
    color: globalStyles.fontColors.light,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "800",
    color: globalStyles.fontColors.light,
  },
  error: {
    fontSize: 24,
    fontFamily: globalStyles.fontFamily.regular,
    color: globalStyles.fontColors.light,
    margin: 8,
  },
  button: {
    width: 200,
    height: 62,
    backgroundColor: "#424242",
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 50,
  },
  buttonText: {
    height: 38,
    width: 62,
    color: "#EEEEEE",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center",
  },
});

export default ErrorFallbackComponent;
