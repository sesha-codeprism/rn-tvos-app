import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import SideMenuLayout from "../../../components/MFSideMenu/MFSideMenu";
import { AppStrings } from "../../../config/strings";
import { AppImages } from "../../../assets/images";
interface Props {
  data: any;
}
const menuItems = [
  {
    title: AppStrings.str_details_cta_playdvr,
    action: "",
    icon: AppImages.Play_ic,
  },
  {
    title: "Save",
    action: "",
    icon: AppImages.Save_ic,
  },
  {
    title: "Delete",
    action: "",
    icon: AppImages.Delete_ic,
  },
  {
    title: "More Info",
    action: "",
    icon: AppImages.More_info_ic,
  },
];
export default function LongPressMenu(props: Props) {
  const [focused, setFocused] = useState<any>(0);
  const [listItems, setListItems] = useState(menuItems);

  console.log("props in long press", props.data);
  const getFormatedDate = (date: string) => {
    const d = new Date(date);
    const month = d.toLocaleString("default", { month: "long" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };
  return (
    <SideMenuLayout title={props.data.title} subTitle={props.data.episodeInfo}>
      <Text style={styles.recordedText}>{`${
        AppStrings.str_recorded_on
      } ${getFormatedDate(props.data.Settings.StartUtc)}`}</Text>
      <FlatList
        data={listItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          console.log(item.title);
          return (
            <Pressable
              hasTVPreferredFocus={index === 0 ? true : false}
              onFocus={() => {
                setFocused(index);
              }}
              onPress={() => {}}
              style={
                index === focused
                  ? {
                      ...styles.containerActive,
                      ...styles.btnContainer,
                    }
                  : styles.btnContainer
              }
              key={index}
              isTVSelectable={true}
            >
              <Image
                source={item.icon}
                style={{ width: 35, height: 35, marginRight: 26 }}
              />
              <Text
                style={[
                  styles.listText,
                  { color: index === focused ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {item.title}
              </Text>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#202124",
  },
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
  content: {
    width: "100%",
    height: "100%",
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
  btnContainer: {
    width: "100%",
    height: 100,
    justifyContent: "flex-start",
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
  recordedText: {
    color: "#A7A7A7",
    fontSize: 25,
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 31,
    marginBottom: 31,
    marginLeft: 10
  },
});
