import { Dimensions, StyleSheet } from "react-native";
import { appUIDefinition } from "../constants";
const { width, height } = Dimensions.get("window");
export const MFProfileStyle = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "#151214",
    padding: 20,
    justifyContent: "center",
  },
  profileTitleContainer: {
    flex: 0.6,
    borderBottomColor: "#424242",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  titleTextStyle: {
    color: "#c5c5c6",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 70,
  },
  addProfile: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: "#424242",
    borderColor: "blue",
    margin: 20,
  },
  focusedStyle: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
  unfocusedStyle: {
    transform: [
      {
        scale: 1,
      },
    ],
  },
  editIconContainerStyles: {
    height: 65,
    width: 65,
    borderRadius: 50,
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "#282828",
    top: 350,
    left: 80,
  },
  editIconStyles: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  choose_container: {
    width: width,
    height: height,
    backgroundColor: "#00030E",
    padding: 20,
  },
  choose_mainContainer: {
    flex: 7,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
  },
  choose_inputContainer: {
    width: "70%",
    height: "100%",
    paddingLeft: width * 0.15,
    paddingTop: height * 0.15,
    borderRightColor: "#424242",
    borderWidth: StyleSheet.hairlineWidth,
  },
  choose_profileTitleContainer: {
    flex: 0.6,
    borderBottomColor: "#424242",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  choose_titleTextStyle: {
    color: "#c5c5c6",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 70,
  },
  choose_profileTitleStyle: {
    fontSize: 31,
    lineHeight: 50,
    fontWeight: "600",
    color: appUIDefinition.theme.backgroundColors.white,
  },
  choose_addProfile: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: "#424242",
    borderColor: "blue",
    margin: 20,
  },
  choose_textInput: {
    backgroundColor: "#424242",
    height: 90,
    fontSize: 32,
    fontWeight: "300",
    marginBottom: 28,
    width: 837,
    borderRadius: 4,
    marginTop: 50,
    justifyContent: "center",
  },
  choose_keyboardButton: {
    width: 46,
    height: 46,
    margin: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  choose_keyboardButtonText: {
    width: 46,
    height: 46,
    color: "#6D6D6D",
    lineHeight: 37,
    fontSize: 31,
    textAlign: "center",
  },
  choose_keyboardImage: {
    width: 70,
    height: 9,
  },
  choose_keyboardSpace: {
    height: 9,
    width: 70,
    marginTop: 15,
    marginRight: 15,
  },
  choose_keyboardDelete: {
    height: 26,
    width: 48,
    marginLeft: 50,
  },
  choose_profileStyles: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    margin: 20,
  },
  choose_activeProfileStyles: {
    transform: [
      {
        scale: 1.1,
      },
    ],
    borderColor: appUIDefinition.theme.colors.blue,
    borderWidth: 10,
  },
  choose_activeProfileIndicator: {
    width: 46,
    height: 46,
    position: "absolute",
    bottom: 25,
    right: 10,
  },
  choose_activeProfileIndicatorImage: {
    width: 40,
    height: 40,
    backgroundColor: "black",
    borderRadius: 40 / 2,
  },
  choose_imageContainer: {
    width: 200,
    height: 200,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
  create_container: {
    width: width,
    height: height,
    backgroundColor: "#00030E",
    padding: 20,
  },

  create_mainContainer: {
    flex: 7,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
  },
  create_inputContainer: {
    width: "70%",
    height: "100%",
    paddingLeft: width * 0.15,
    paddingTop: height * 0.15,
    borderRightColor: "#424242",
    borderWidth: StyleSheet.hairlineWidth,
  },
  create_profileTitleContainer: {
    flex: 0.6,
    borderBottomColor: "#424242",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  create_titleTextStyle: {
    color: "#c5c5c6",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 70,
  },
  create_profileTitleStyle: {
    fontSize: 31,
    lineHeight: 50,
    fontWeight: "600",
    color: appUIDefinition.theme.backgroundColors.white,
  },
  create_addProfile: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: "#424242",
    borderColor: "blue",
    margin: 20,
  },
  create_textInput: {
    backgroundColor: "#424242",
    height: 90,
    fontSize: 32,
    fontWeight: "300",
    marginBottom: 28,
    width: 837,
    borderRadius: 4,
    marginTop: 50,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center'
  },
  create_keyboardButton: {
    width: 46,
    height: 46,
    margin: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  create_keyboardButtonText: {
    width: 46,
    height: 46,
    color: "#6D6D6D",
    lineHeight: 37,
    fontSize: 31,
    textAlign: "center",
  },
  create_keyboardImage: {
    width: 70,
    height: 9,
  },
  create_keyboardSpace: {
    height: 9,
    width: 60,
    marginTop: 15,
    // marginRight: 15,
  },
  create_keyboardDelete: {
    height: 26,
    width: 48,
    // marginLeft: 50,
  },
  finalise_container: {
    width: width,
    height: height,
    backgroundColor: "#00030E",
    padding: 20,
  },

  finalise_mainContainer: {
    flex: 7,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
  },
  finalise_inputContainer: {
    width: "70%",
    height: "100%",
    paddingLeft: width * 0.1,
    paddingTop: height * 0.13,
    borderRightColor: "#424242",
    borderWidth: StyleSheet.hairlineWidth,
  },
  finalise_profileTitleContainer: {
    flex: 0.6,
    borderBottomColor: "#424242",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  finalise_titleTextStyle: {
    color: "#c5c5c6",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 70,
  },
  finalise_profileTitleStyle: {
    fontSize: 31,
    lineHeight: 50,
    fontWeight: "600",
    color: appUIDefinition.theme.backgroundColors.white,
  },
  finalise_addProfile: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: "#424242",
    borderColor: "blue",
    margin: 20,
  },
  finalise_textInput: {
    backgroundColor: "#424242",
    height: 90,
    fontSize: 32,
    fontWeight: "300",
    marginBottom: 28,
    width: 837,
    borderRadius: 4,
    marginTop: 50,
    justifyContent: "center",
  },
  finalise_keyboardButton: {
    width: 46,
    height: 46,
    margin: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  finalise_keyboardButtonText: {
    width: 46,
    height: 46,
    color: "#6D6D6D",
    lineHeight: 37,
    fontSize: 31,
    textAlign: "center",
  },
  finalise_keyboardImage: {
    width: 70,
    height: 9,
  },
  finalise_keyboardSpace: {
    height: 9,
    width: 70,
    marginTop: 15,
    marginRight: 15,
  },
  finalise_keyboardDelete: {
    height: 26,
    width: 48,
    marginLeft: 50,
  },
  finalise_profileStyles: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    marginLeft: 50,
  },
  finalise_activeProfileStyles: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    marginLeft: 20,
    borderWidth: 5,
    borderColor: "#053C69",
  },
  finalise_titleStyles: {
    fontSize: 31,
    lineHeight: 51,
    color: appUIDefinition.theme.colors.white,
  },
  finalise_subTitleStyles: {
    fontSize: 25,
    lineHeight: 38,
    color: appUIDefinition.theme.colors.white,
    flexWrap: "wrap",
    width: 883,
    marginTop: 20,
  },
  finalise_imageStyles: {
    height: 50,
    width: 50,
    marginTop: 10,
    marginRight: 50,
    alignSelf: "flex-start",
  },
  finalise_placeholderStyles: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    borderColor: appUIDefinition.theme.colors.white,
    borderWidth: 2,
    marginTop: 10,
    marginRight: 50,
    alignSelf: "flex-start",
  },
  finalise_activeBox: {
    marginTop: 80,
    marginLeft: 50,
    height: 130,
    width: 516,
    borderRadius: 6,
    backgroundColor: "#053C69",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  finalise_inActiveBox: {
    marginTop: 80,
    marginLeft: 50,
    height: 130,
    width: 516,
    borderRadius: 6,
  },
  finalise_editIconStyles: {
    height: 25,
    width: 25,
    resizeMode: "contain",
  },
  personalize_container: {
    width: width,
    height: height,
    backgroundColor: "#00030E",
    padding: 20,
  },

  personalize_mainContainer: {
    flex: 7,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
  },
  personalize_inputContainer: {
    width: "70%",
    height: "100%",
    paddingLeft: width * 0.15,
    paddingTop: height * 0.15,
    borderRightColor: "#424242",
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 50
  },
  personalize_profileTitleContainer: {
    flex: 0.6,
    borderBottomColor: "#424242",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  personalize_titleTextStyle: {
    color: "#c5c5c6",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 70,
  },
  personalize_profileTitleStyle: {
    fontSize: 31,
    lineHeight: 50,
    fontWeight: "600",
    color: appUIDefinition.theme.backgroundColors.white,
  },
  personalize_addProfile: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: "#424242",
    borderColor: "blue",
    margin: 20,
  },
  personalize_textInput: {
    backgroundColor: "#424242",
    height: 90,
    fontSize: 32,
    fontWeight: "300",
    marginBottom: 28,
    width: 837,
    borderRadius: 4,
    marginTop: 50,
    justifyContent: "center",
  },
  personalize_keyboardButton: {
    width: 46,
    height: 46,
    margin: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  personalize_keyboardButtonText: {
    width: 46,
    height: 46,
    color: "#6D6D6D",
    lineHeight: 37,
    fontSize: 31,
    textAlign: "center",
  },
  personalize_keyboardImage: {
    width: 70,
    height: 9,
  },
  personalize_keyboardSpace: {
    height: 9,
    width: 70,
    marginTop: 15,
    marginRight: 15,
  },
  personalize_keyboardDelete: {
    height: 26,
    width: 48,
    marginLeft: 50,
  },
  personalize_profileStyles: {
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    margin: 20,
  },
  personalize_activeProfileStyles: {
    transform: [
      {
        scale: 1.2,
      },
    ],
  },
  personalize_titleStyles: {
    fontSize: 31,
    lineHeight: 51,
    color: appUIDefinition.theme.colors.white,
  },
  personalize_subTitleStyles: {
    fontSize: 25,
    lineHeight: 38,
    color: appUIDefinition.theme.colors.white,
    flexWrap: "wrap",
    width: 883,
    marginTop: 20,
  },
  personalize_imageStyles: {
    height: 37,
    width: 37,
    // marginTop: 10,
    marginRight: 50,
    alignSelf: "flex-start",
  },
  personalize_placeholderStyles: {
    height: 37,
    width: 37,
    borderRadius: 37 / 2,
    borderColor: appUIDefinition.theme.colors.white,
    borderWidth: 2,
    // marginTop: 10,
    marginRight: 50,
    alignSelf: "flex-start",
  },
});
