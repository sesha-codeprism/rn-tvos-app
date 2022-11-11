import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppImages } from "../../../../assets/images";
import { ScrollView } from "react-native-gesture-handler";

type BrowseFilterProps = {
  open: boolean;
  setOpenSubMenu: (open: boolean) => void;
  subMenuOpen: boolean;
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
const { width, height } = Dimensions.get("screen");
const BrowseFilter = (props: BrowseFilterProps) => {
  const halfOpenOffset = Dimensions.get("screen").width * 0.25;
  const fullCloseOffset = Dimensions.get("screen").width * 0.5;
  const fullOpenOffset = 0;
  const [menuList, setMenuList] = useState<Array<string>>([]);
  const [subMenuList, setSubMenuList] = useState<Array<any>>([]);
  const [focusedMenu, setFocusedMenu] = useState(0);
  const [focusedSubMenu, setFocusedSubMenu] = useState<any>(0);
  const [selectedSubMenu, setSelectedSubMenu] = useState("");

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
    const menu = filterData.map((item, index) => {
      return item.Name;
    });
    setMenuList(menu);
    console.log("props.open in useEffect", props.open);
    offset.value = props.open
      ? props.subMenuOpen
        ? fullOpenOffset
        : halfOpenOffset
      : fullCloseOffset;
    if (!props.open) {
      props.setOpenSubMenu(false);
    }
  }, [props.open, props.subMenuOpen]);
  const onFocusMenu = (name: string, index: number) => {
    setFocusedMenu(index);
    const subMenu = filterData.find((item) => {
      return item.Name === name;
    })?.Pivots;
    setSubMenuList(subMenu ? subMenu : []);
  };
  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <View style={styles.innerContainer}>
        {menuList.map((item, index) => {
          return (
            <Pressable
              hasTVPreferredFocus={index === 0}
              key={index}
              style={
                focusedMenu === index
                  ? [
                      styles.menuItem,
                      { borderRadius: 6, backgroundColor: "#252629" },
                    ]
                  : styles.menuItem
              }
              onFocus={() => {
                onFocusMenu(item, index);
                setFocusedSubMenu(null)
              }}
              onPress={() => {
                props.setOpenSubMenu(!props.subMenuOpen);
              }}
            >
              <Text
                style={
                  focusedMenu === index
                    ? { ...styles.MenuItemText, color: "white" }
                    : styles.MenuItemText
                }
              >
                {item}
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
      </View>
      <View style={styles.subMenuContainer}>
        <ScrollView>
        {subMenuList.map((item, i) => {
          return (
            <Pressable
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
                setSelectedSubMenu(item.Name);
                // props.setOpenSubMenu(!props.subMenuOpen);
              }}
            >
              {selectedSubMenu === item.Name ? (
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
              <Text style={styles.MenuItemText}> {item.Name}</Text>
            </Pressable>
          );
        })}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default BrowseFilter;

const styles = StyleSheet.create({
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
  icCircle: { width: 35, height: 35, marginRight: 25 },
});