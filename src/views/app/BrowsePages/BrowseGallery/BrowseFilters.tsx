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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
  const [menuList, setMenuList] = useState<Array<any>>();
  const [expanded, setExpanded] = useState(props.open);
  const [subMenuList, setSubMenuList] = useState<Array<any>>([]);
  const [focusedMenu, setFocusedMenu] = useState(0);
  const [focusedSubMenu, setFocusedSubMenu] = useState<any>(0);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [selectedSubMenu, setSelectedSubMenu] = useState("");
  const [clearFocused, setClearFocused] = useState(false);
  const menuRef = filterData.map(() => useRef<PressableProps>(null));
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
    props.setOpenMenu(false)
  };
  const onFocusMenu = (name: any, index: number) => {
    // @ts-ignore
    setFocusedMenu(index);
    const subMenu = filterData.find((item) => {
      return item.Name === name.Name;
    })?.Pivots;
    setSubMenuList(subMenu ? subMenu : []);
  };
  const onFocusBar = () => {
    if (!menuHasFocus) {
      // @ts-ignore
      menuRef[focusedMenu].current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
      setFocusedSubMenu(null);
      setMenuHasFocus(true);
    } else {
      setMenuHasFocus(false);
      // @ts-ignore
      subMenuFirstRef.current?.setNativeProps({
        hasTVPreferredFocus: true,
      });
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
          <>
            {menuList?.map((item, index) => {
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
            })}
            <TouchableOpacity
              style={styles.touchableBar}
              onFocus={onFocusBar}
            ></TouchableOpacity>
          </>
          <Pressable
            // @ts-ignore
            hasTVPreferredFocus={false}
            style={
              clearFocused
                ? [
                    styles.menuItem,
                    {
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
                      backgroundColor: "#3A3A3B",
                      height: 62,
                      alignContent: "center",
                      justifyContent: "center",
                    },
                  ]
            }
            onFocus={() => {
              setClearFocused(true);
              setFocusedMenu(-1);
              // setFocusedSubMenu(null)
            }}
            onBlur={() => {
              setClearFocused(false);
            }}
            onPress={() => {
              //TODO: Write logic for clear function
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
        </View>
        <View style={styles.subMenuContainer}>
          <ScrollView>
            {subMenuList.map((item, i) => {
              return (
                <Pressable
                  // @ts-ignore
                  ref={i === 0 ? subMenuFirstRef : null}
                  // hasTVPreferredFocus={i === 0}
                  key={i}
                  style={
                    focusedSubMenu === i
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
                    setFocusedSubMenu(i);
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
            })}
          </ScrollView>
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
    height: "100%",
    width: 30,
    position: "absolute",
    right: 0,
  },
});
