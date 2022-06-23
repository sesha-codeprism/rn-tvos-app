import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu";
import { AppImages } from "../../../../assets/images";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStrings } from "../../../../config/strings";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
interface Props {
  navigation: NativeStackNavigationProp<any>;
  providers: string;
}

const RatingScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [ratingList, setRatingList] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const formatList = () => {
    const strings: any = AppStrings;
    const listItem: any = strings.str_ratings[props.route.params.action];
    let list = [];
    for (let key in listItem) {
      list.push({
        title: key,
        subTitle: listItem[key].name,
        age: listItem[key].age,
        action: "",
      });
    }
    list.sort((a, b) => {
      return b.age - a.age;
    });
    setRatingList(list);
  };
  useEffect(() => {
    console.log("props coming to rating screen", props);
    formatList();
  }, []);
  const onPress = (data: any) => {
    const list = ratingList;
    const selectedList = list.filter(
      (item: any, index: any) => item.age >= data.age
    );
    const selected = selectedItems;
    if (selected.includes(data)) {
       const unselected = selected.filter(
          (item: any, index: any) => item.age > data.age
        );
        setSelectedItems([...unselected]);
    } else {
      setSelectedItems([...selectedList]);
    }
  };
  return (
    <SideMenuLayout
      title="Parental Controls"
      subTitle={props.route.params.title}
    >
      <View style={styles.contentTitleContainer}>
        <Text style={styles.contentTitle}>
          Please select the Movie Ratings which you like to lock. All ratings
          above your selected rating will also be locked.
        </Text>
      </View>
      {ratingList.map((item: any, index: any) => {
        return (
          <Pressable
            onFocus={() => {
              setFocussed(index);
            }}
            onPress={() => {
              onPress(item);
            }}
            style={
              index === focussed
                ? { ...MFSettingsStyles.containerActive, ...styles.container }
                : styles.container
            }
            key={index}
          >
            <View style={styles.icContainer}>
              {selectedItems.includes(item) ? (
                <Image
                  source={AppImages.checked_circle}
                  style={styles.icCircle}
                />
              ) : (
                <Image
                  source={AppImages.unchecked_circle}
                  style={styles.icCircle}
                />
              )}
            </View>
            <View style={styles.listContent}>
              <Text
                style={[
                  styles.listText,
                  { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.listSubtitleText,
                  {
                    color: index === focussed ? "#EEEEEE" : "#A7A7A7",
                  },
                ]}
              >
                {item.subTitle}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </SideMenuLayout>
  );
};

export default RatingScreen;

const styles = StyleSheet.create({
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
  },
  listSubtitleText: {
    fontSize: 23,
    letterSpacing: 0,
    // lineHeight: 38,
  },
  contentTitleContainer: {
    width: 622,
    height: 119,
  },
  contentTitle: {
    color: "#A7A7A7",
    lineHeight: 38,
    fontSize: 28,
    letterSpacing: 0,
  },
  icCircle: { width: 35, height: 35 },
  container: {
    width: "100%",
    height: 120,
    // justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
  },
  icContainer: {
    width: "15%",
    height: 83,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    width: "85%",
    height: 83,
    // alignContent: "center",
    // alignItems: "center",
    justifyContent: "center",
  },
});