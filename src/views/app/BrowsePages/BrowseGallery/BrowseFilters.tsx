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
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { appUIDefinition } from "../../../../config/constants";
import { GLOBALS } from "../../../../utils/globals";

type BrowseFilterProps = {
  open: boolean;
  filterData: any;
  filterState: any;
  setOpenSubMenu: (open: boolean) => void;
  subMenuOpen: boolean;
  setOpenMenu: any;
  handleOnPress?: (value: any) => void;
};
const filterData = [
  {
    Id: "Genre",
    Name: "Genre",
    Pivots: [
      {
        Id: "Genre|2006",
        Name: "Action",
      },
      {
        Id: "Genre|2681",
        Name: "Comedy",
      },
      {
        Id: "Genre|2107",
        Name: "Crime",
      },
      {
        Id: "Genre|2700",
        Name: "Documentary",
      },
      {
        Id: "Genre|2715",
        Name: "Drama",
      },
      {
        Id: "Genre|2003",
        Name: "Family",
      },
      {
        Id: "Genre|2729",
        Name: "Fantasy",
      },
      {
        Id: "Genre|2500",
        Name: "Holidays",
      },
      {
        Id: "Genre|2771",
        Name: "Horror",
      },
      {
        Id: "Genre|2822",
        Name: "Mystery",
      },
      {
        Id: "Genre|2888",
        Name: "Sci-Fi",
      },
      {
        Id: "Genre|2005",
        Name: "Sports",
      },
      {
        Id: "Genre|2921",
        Name: "Thriller",
      },
      {
        Id: "Genre|2013",
        Name: "Western",
      },
    ],
  },
  {
    Id: "ShowType",
    Name: "ShowType",
    Pivots: [
      {
        Id: "ShowType|Movie",
        Name: "Movie",
      },
      {
        Id: "ShowType|TVShow",
        Name: "TVShow",
      },
      {
        Id: "ShowType|Live",
        Name: "Live",
      },
      {
        Id: "ShowType|Station",
        Name: "Station",
      },
    ],
  },
  {
    Id: "Price",
    Name: "Price",
    Pivots: [
      {
        Id: "Price|Free",
        Name: "Free",
      },
    ],
  },
  {
    Id: "Language",
    Name: "Language",
    Pivots: [
      {
        Id: "Language|en",
        Name: "English",
      },
      {
        Id: "Language|fr",
        Name: "French",
      },
    ],
  },
  {
    Id: "SortBy",
    Name: "Sort by",
    Pivots: [
      {
        Id: "orderBy|Popularity",
        Name: "Popular",
      },
      {
        Id: "orderBy|Name",
        Name: "A-Z",
      },
      {
        Id: "orderBy|ReleaseYear",
        Name: "Release year",
      },
      {
        Id: "orderBy|LicenseWindowStartUtc",
        Name: "Date added",
      },
      {
        Id: "orderBy|Rating_fr",
        Name: "Cinoche.com",
        Language: "fr",
      },
      {
        Id: "orderBy|Rating_en",
        Name: "Rotten Tomatoes",
        Language: "en",
      },
    ],
  },
  {
    Id: "Restrictions",
    Name: "Restrictions",
    Pivots: [
      {
        Id: "Restrictions|Downloadable",
        Name: "Downloadable",
      },
    ],
  },
  {
    Id: "QualityLevel",
    Name: "QualityLevel",
    Pivots: [
      {
        Id: "QualityLevel|HD",
        Name: "HD",
      },
      {
        Id: "QualityLevel|UHD",
        Name: "UHD",
      },
    ],
  },
  {
    Id: "LicenseWindow",
    Name: "LicenseWindow",
    Pivots: [
      {
        Id: "LicenseWindow|New",
        Name: "New",
      },
      {
        Id: "LicenseWindow|LastChance",
        Name: "Last Chance",
      },
    ],
  },
  {
    Id: "OfferType",
    Name: "OfferType",
    Pivots: [
      {
        Id: "OfferType|Free",
        Name: "Free",
      },
      {
        Id: "OfferType|Rent",
        Name: "Rent",
      },
      {
        Id: "OfferType|Purchase",
        Name: "Purchase",
      },
    ],
  },
];
const SCREEN_WIDTH = Dimensions.get("window").width;
const { width, height } = Dimensions.get("screen");
const BrowseFilter = (props: BrowseFilterProps) => {
  const halfOpenOffset = Dimensions.get("screen").width * 0.25;
  const fullCloseOffset = Dimensions.get("screen").width * 0.5;
  const fullOpenOffset = 0;
  const [menuList, setMenuList] = useState<Array<any>>([]);
  const [expanded, setExpanded] = useState(props.open);
  const [subMenuList, setSubMenuList] = useState<Array<any>>([]);
  const [focusedMenu, setFocusedMenu] = useState(0);
  const [focusedSubMenu, setFocusedSubMenu] = useState<any>(-1);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [selectedSubMenu, setSelectedSubMenu] = useState("");
  const [clearFocused, setClearFocused] = useState(false);
  const menuRef = Array(20)
    .fill(0)
    .map(() => useRef<PressableProps>(null));
  const subMenuFirstRef = useRef<PressableProps>(null);
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
    console.log(props.filterState);
    const menu = filterData.map((item, index) => {
      return { Id: item.Id, Name: item.Name };
    });
    //@ts-ignore
    setMenuList(menu);
    console.log("props.open in useEffect", props.open);
    props.open ? open() : close();
  }, [props.open]);

  const open = () => {
    console.log("browse filter is open");
    offset.value = props.open ? fullOpenOffset : fullCloseOffset;
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
      const subMenu = filterData.find((item) => {
        return item.Name === name.Name;
      })?.Pivots;
      setSubMenuList(subMenu ? subMenu : []);
    }
  };
  const onFocusBar = () => {
    try {
      console.log("Browse filter bar is focussed: menuHasFocus-", menuHasFocus);
    if (!menuHasFocus) {
      console.log(
        "Browse filter bar ==> menu is focussed: menuRef[focusedMenu]",
        menuRef[focusedMenu]
      );
      menuRef[focusedMenu]?.current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
      setFocusedSubMenu(null);
      setMenuHasFocus(true);
    } else {
      console.log(
        "Browse filter menu ==> bar is focussed: subMenuFirstRef",
        subMenuFirstRef
      );
      setMenuHasFocus(false);
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
      console.log("Error",error)
    }
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
                  hasTVPreferredFocus={index === 0}
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
                    // setFocusedSubMenu(null)
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
            ListFooterComponent={() => {
              return (
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
                    console.log("on Clear focus");
                    onFocusMenu("clear", menuList.length);
                    // menuRef[0]?.current?.setNativeProps({
                    //   hasTVPreferredFocus: true,
                    // });
                    // setClearFocused(true);
                    // setSubMenuList([]);
                    // setFocusedMenu(menuList.length);

                    // setFocusedSubMenu(null)
                  }}
                  // onBlur={() => {
                  //   console.log("Not on Clear focus");
                  //   setClearFocused(false);
                  // }}
                  onPress={() => {
                    //TODO: Write logic for clear function
                    console.log("TODO: Write logic for clear function");
                  }}
                >
                  <Text
                    style={{
                      ...styles.MenuItemText,
                      color: "white",
                      textAlign: "center",
                      fontSize: 25,
                      fontWeight: "600",
                      alignSelf: "center",
                    }}
                  >
                    Clear Focused
                  </Text>
                </Pressable>
              );
            }}
          />
          <TouchableOpacity style={styles.touchableBar} onFocus={onFocusBar} />
        </View>
        <View style={styles.subMenuContainer}>
          <FlatList
            data={focusedMenu === menuList.length ? [] : subMenuList}
            keyExtractor={(item) => item.Id}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  // @ts-ignore
                  ref={index === 0 ? subMenuFirstRef : null}
                  // hasTVPreferredFocus={i === 0}
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
                  {props.filterState[selectedMenu.Id]?.selectedIds?.includes(
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
