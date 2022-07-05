import { StyleSheet } from "react-native";

const MFSettingsStyles = StyleSheet.create({
  root: {
    width: 714,
    height: "100%",
    backgroundColor: "#202124",
  },
  headerContainer: {
    width: "100%",
    height: 185,
    backgroundColor: "#00030E",
    padding: 50,
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    padding: 50,
    height: "90%",
  },
  content:{
    width: '100%',
    height:'100%'
  },
  titleText: {
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 55,
    color: "white",
  },
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
  },
  container: {
    width: "100%",
    height: 100,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: 30,
    display: "flex",
    flexDirection: "row",
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
    shadowColor: "#0000006b",
    shadowOffset: {
      width: 6,
      height: 8,
    },
    shadowOpacity: 0.42,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default MFSettingsStyles;
