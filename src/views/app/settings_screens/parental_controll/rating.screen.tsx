import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu";
import { AppImages } from "../../../../assets/images";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStrings } from "../../../../config/strings";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { GLOBALS } from "../../../../utils/globals";
import { updateStore } from "../../../../utils/helpers";
interface Props {
  navigation: NativeStackNavigationProp<any>;
  providers: string;
}

const RatingScreen: React.FunctionComponent<Props> = (props: any) => {
  const [focussed, setFocussed] = useState<any>("");
  const [ratingList, setRatingList] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
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
    console.log("rating list", list);
    setRatingList(list);
  };
  const getSelectedItems = () => {
    try {
      console.log(" GLOBALS.store.settings in get", GLOBALS.store);
      const selectedlist =
        GLOBALS.store.settings.parentalControll.contentLock &&
        GLOBALS.store.settings.parentalControll.contentLock[
          props.route.params.action
        ]
          ? GLOBALS.store.settings.parentalControll.contentLock[
              props.route.params.action
            ]
          : [];
      console.log("selected items", selectedlist);
      setSelectedItems([...selectedlist]);
    } catch (error) {
      console.log("error getting selected items", error);
    }
  };

  useEffect(() => {
    console.log("props coming to rating screen", props);
    formatList();
    getSelectedItems();
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
      console.log("GLOBALS.store.settings", GLOBALS.store);
      GLOBALS.store.settings.parentalControll.contentLock &&
      GLOBALS.store.settings.parentalControll.contentLock[
        props.route.params.action
      ]
        ? (GLOBALS.store.settings.parentalControll.contentLock[
            props.route.params.action
          ] = [...unselected])
        : (GLOBALS.store.settings.parentalControll.contentLock = {
            ...GLOBALS.store.settings.parentalControll.contentLock,
            [props.route.params.action]: [...unselected],
          });
      updateStore(JSON.stringify(GLOBALS.store));
    } else {
      setSelectedItems([...selectedList]);
      GLOBALS.store.settings.parentalControll.contentLock &&
      GLOBALS.store.settings.parentalControll.contentLock[
        props.route.params.action
      ]
        ? (GLOBALS.store.settings.parentalControll.contentLock[
            props.route.params.action
          ] = [...selectedList])
        : (GLOBALS.store.settings.parentalControll.contentLock = {
            ...GLOBALS.store.settings.parentalControll.contentLock,
            [props.route.params.action]: [...selectedList],
          });
      updateStore(JSON.stringify(GLOBALS.store));
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
              {selectedItems.some((value) => value.age === item.age) ? (
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
