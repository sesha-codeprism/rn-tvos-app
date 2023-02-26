import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppImages } from "../../../../assets/images";
import MFText from "../../../../components/MFText";
import { appUIDefinition } from "../../../../config/constants";
import { AppStrings } from "../../../../config/strings";
import { GLOBALS } from "../../../../utils/globals";

type BrowseFilterProps = {
  open: boolean;
  filterData: any;
  filterState: any;
  defaultFilterState: any;
  setOpenSubMenu: (open: boolean) => void;
  subMenuOpen: boolean;
  setOpenMenu: any;
  handleOnPress?: (value: any) => void;
  handleFilterClear?: () => void;
  route?: any;
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const { width, height } = Dimensions.get("screen");
const BrowseFilter = (props: BrowseFilterProps) => {
  const halfOpenOffset = Dimensions.get("screen").width * 0.25;
  const fullCloseOffset = Dimensions.get("screen").width * 0.5;
  const fullOpenOffset = 0;
  const [menuList, setMenuList] = useState<Array<any>>([]);
  const [expanded, setExpanded] = useState(true);
  const [subMenuList, setSubMenuList] = useState<Array<any>>([]);
  const [focusedMenu, setFocusedMenu] = useState(0);
  const [focusedSubMenu, setFocusedSubMenu] = useState<any>(-1);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [selectedSubMenu, setSelectedSubMenu] = useState("");
  const [clearFocused, setClearFocused] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(true);
  const menuRef = Array(20)
    .fill(0)
    .map(() => useRef<PressableProps>(null));
  const subMenuFirstRef = useRef<TouchableOpacity>(null);
  const [menuHasFocus, setMenuHasFocus] = useState(true);
  const offset = useSharedValue(fullCloseOffset);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(offset.value, {
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            duration: 300,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    console.log("props in useEffect", props);
    const menu = props.filterData?.map(
      (item: { Id: any; Name: any }, index: any) => {
        return { Id: item.Id, Name: item.Name };
      }
    );
    setMenuList(menu);
    console.log("props.open in useEffect", props.open);
    props.open ? open() : close();
  }, [props.open]);

  const open = () => {
    console.log("browse filter is open");
    offset.value = openDrawer ? fullOpenOffset : fullCloseOffset;
    // if (!props.open) {
    //   props.setOpenSubMenu(false);
    // }
    setExpanded(true);
  };
  const close = () => {
    console.log("browse filter is closed");
    offset.value = fullCloseOffset;
    setExpanded(false);
    props.setOpenMenu(false);
  };
  const onFocusMenu = (name: any, index: number) => {
    console.log("onFocusMenu:index", index);
    setFocusedMenu(index);
    if (name !== "clear") {
      const subMenu = props.filterData.find((item: any) => {
        return item.Name === name.Name;
      })?.Pivots;
      setSubMenuList(subMenu ? subMenu : []);
    }
  };
  const onFocusBar = () => {
    try {
      console.log(
        "Browse filter bar is focussed: menuHasFocus-",
        menuHasFocus,
        focusedMenu
      );
      if (!menuHasFocus) {
        console.log(
          "Browse filter bar ==> menu is focussed: menuRef[focusedMenu]",
          focusedMenu,
          menuHasFocus
        );
        // @ts-ignore
        menuRef[focusedMenu]?.current?.setNativeProps({
          hasTVPreferredFocus: true,
        });
        setFocusedSubMenu(null);
        setMenuHasFocus(true);
        // setFocusedMenu(focusedMenu);
      } else {
        console.log(
          "Browse filter menu ==> bar is focussed: subMenuFirstRef",
          subMenuFirstRef
        );
        setMenuHasFocus(false);
        // setFocusedSubMenu(0)
        // subMenuFirstRef.current?.current.viewConfig.validAttributes.hasTVPreferredFocus = true;
       // @ts-ignore
        subMenuList.length === 0
          ? menuRef[focusedMenu]?.current?.setNativeProps({
              hasTVPreferredFocus: true,
            })
          : subMenuFirstRef?.current?.setNativeProps({
              hasTVPreferredFocus: true,
            });
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const checkDefaultState = () => {
    props.filterState !== props.defaultFilterState;
    let filters = [];
    let defaultFilters = [];
    for (let key in props.filterState) {
      if (!_.isEmpty(props.filterState[key].selectedIds)) {
        filters.push(props.filterState[key].selectedIds[0]);
      }
    }
    for (let key in props.defaultFilterState) {
      if (!_.isEmpty(props.defaultFilterState[key].selectedIds)) {
        defaultFilters.push(props.defaultFilterState[key].selectedIds[0]);
      }
    }
    // console.log("filters", JSON.stringify(filters), "defaultFilters", JSON.stringify(defaultFilters), JSON.stringify(filters) === JSON.stringify(defaultFilters));
    return JSON.stringify(filters) === JSON.stringify(defaultFilters)
  };
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={expanded}
      onRequestClose={() => {
        // setExpanded(false);
        close();
        console.log("Modal has been closed.", props.open);
      }}
      style={[styles.main, GLOBALS.enableRTL ? { left: 0 } : { right: 0 }]}
      onDismiss={() => {
        console.log("Modal dismissed", props.open);
      }}
      accessible={true}
      presentationStyle={"overFullScreen"}

    >
      <Animated.View style={[styles.container, animatedStyles]}>
        <View style={styles.innerContainer}>
          <FlatList
            data={menuList}
            keyExtractor={(item) => item.Id}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  // @ts-ignore
                  ref={menuRef[index]}
                  // hasTVPreferredFocus={index === focusedMenu && !menuHasFocus}
                  key={index}
                  style={
                    focusedMenu === index
                      ? [
                          styles.menuItem,
                          { borderRadius: 6, backgroundColor: "#063961" },
                        ]
                      : styles.menuItem
                  }
                  onFocus={() => {
                    clearFocused ? setClearFocused(false) : null;
                    setSelectedMenu(item);
                    onFocusMenu(item, index);
                    setFocusedSubMenu(-1)
                  }}
                  onPress={() => {
                    setSelectedMenu(item);
                    props.setOpenSubMenu(true);
                  }}
                >
                  <Text
                    style={
                      focusedMenu === index
                        ? { ...styles.MenuItemText, color: "white" }
                        : styles.MenuItemText
                    }
                  >
                    {item.Name}
                  </Text>
                  {focusedMenu === index && (
                    <Image
                      source={AppImages.rightArrowWhite}
                      style={{ width: 14, height: 24 }}
                    />
                  )}
                </Pressable>
              );
            }}
            ListFooterComponentStyle={{
              width: "100%",
              height: 120,
              justifyContent: "flex-end",
            }}
            ListFooterComponent={
              props.filterState &&
              !checkDefaultState() && (
                <Pressable
                // @ts-ignore
                  ref={menuRef[menuList.length]}
                  style={
                    focusedMenu === menuList.length
                      ? [
                          styles.menuItem,
                          {
                            // marginTop: 10,
                            borderRadius: 6,
                            height: 62,
                            backgroundColor: "#063961",
                            alignContent: "center",
                            justifyContent: "center",
                          },
                        ]
                      : [
                          styles.menuItem,
                          {
                            // marginTop: 10,
                            backgroundColor: "#3A3A3B",
                            height: 62,
                            alignContent: "center",
                            justifyContent: "center",
                          },
                        ]
                  }
                  onFocus={() => {
                    onFocusMenu("clear", menuList.length);
                    // setClearFocused(true);
                    // setSubMenuList([]);
                    // setFocusedMenu(menuList.length);

                    // setFocusedSubMenu(null)
                  }}
                  onPress={() => {
                    props.handleFilterClear && props.handleFilterClear();
                  }}
                >
                  <MFText
                    textStyle={{
                      ...styles.MenuItemText,
                      color: "white",
                      textAlign: "center",
                      fontSize: 25,
                      fontWeight: "600",
                      alignSelf: "center",
                    }}
                    shouldRenderText
                    displayText={AppStrings.str_clear}
                  />
                </Pressable>
              )
            }
          />
          <TouchableOpacity style={styles.touchableBar} onFocus={onFocusBar} />
        </View>
        <View style={styles.subMenuContainer}>
          <FlatList
            data={focusedMenu === menuList?.length ? [] : subMenuList}
            keyExtractor={(item) => item.Id}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  // @ts-ignore
                  ref={index === 0 ? subMenuFirstRef : null}
                  // hasTVPreferredFocus={index === 0 && menuHasFocus}
                  key={index}
                  style={
                    focusedSubMenu === index
                      ? [
                          styles.subMenuItem,
                          {
                            backgroundColor: "#053C69",
                            borderRadius: 6,
                          },
                        ]
                      : styles.subMenuItem
                  }
                  onFocus={() => {
                    console.log("submenu: index-", index);
                    setFocusedSubMenu(index);
                  }}
                  onPress={() => {
                    // props.setOpenSubMenu(!props.subMenuOpen);
                    const values = { key: selectedMenu.Id, value: item };
                    props.handleOnPress && props.handleOnPress(values);
                    setSelectedSubMenu(item.Name);
                  }}
                >
                  {props.filterState &&
                  props.filterState[selectedMenu.Id]?.selectedIds?.includes(
                    item.Id
                  ) ? (
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
                  <Text style={styles.MenuItemText}>{item.Name}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Animated.View>
      </Modal>
  );
};

export default BrowseFilter;

const styles = StyleSheet.create({
  main: {
    position: "absolute",
    // right: 0,
    top: 0,
    width: SCREEN_WIDTH,
    backgroundColor: "green",
  },
  container: {
    backgroundColor: "#191b1f",
    width: "46%",
    height: height,
    alignSelf: "flex-end",
    flexDirection: "row",
    position: "absolute",
  },
  innerContainer: {
    height: "100%",
    padding: 20,
    width: "46%",
    flexDirection: "column",
  },
  menuItem: {
    height: 100,
    width: 360,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 35,
    // marginBottom: 10,
  },
  subMenuItem: {
    height: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: 460,
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 35,
    // marginBottom: 10,
  },
  MenuItemText: {
    color: "#A7A7A7", // "#EEEEEE",
    fontSize: 29,
    //fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 50,
  },
  subMenuContainer: {
    backgroundColor: "#202124",
    height: "100%",
    padding: 20,
    width: "54%",
  },
  icCircle: {
    width: 35,
    height: 35,
    marginRight: 25,
  },
  touchableBar: {
    height: "85%",
    width: 30,
    position: "absolute",
    backgroundColor: __DEV__ ? "red" : "transparent",
    right: 0,
    top: 50,
  },
});
