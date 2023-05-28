//@ts-nocheck
import React from "react";
import { StyleSheet, View } from "react-native";
import { getUIdef, scaleAttributes } from "../utils/uidefinition";
import { globalStyles as g } from "../config/styles/GlobalStyles";
import AutoScrollingText from "./AutoSizingText";

/** Props for Header component */
export interface HeaderComponentProps {
  /** Title string to be rendered */
  heading: string;
  /** Subtitle string to be rendered */
  subHeading: string;
  /** Should the title and subtitle be swapped */
  inverted?: boolean;
}
/**
 * A Functional component that renders a Header component for Side Menu panels
 * @param {HeaderComponentProps} props - Propsfor Header component
 * @returns {JSX.Element} rendered  Header component
 */
const HeaderComponent: React.FunctionComponent<HeaderComponentProps> = (
  props
) => {
  return (
    <View style={styles.headerContainer}>
      <AutoScrollingText
        isHorizontal={true}
        style={{
          textStyle: props.inverted ? styles.header2 : styles.header1,
          containerStyle: styles.headerContainerStyle,
        }}
        value={props.heading}
      />
      <AutoScrollingText
        isHorizontal={true}
        style={{
          textStyle: props.inverted ? styles.header1 : styles.header2,
          containerStyle: styles.header1Spacing,
        }}
        value={props.subHeading}
      />
    </View>
  );
};

const styles = StyleSheet.create(
  getUIdef("SlideMenu.SideMenu")?.style ||
    scaleAttributes({
      sideMenuContainer: {
        width: 714,
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: g.backgroundColors.shade2,
        zIndex: 150,
        paddingTop: 0,
      },
      headerContainer: {
        height: 175,
        width: 714,
        paddingLeft: 54,
        paddingTop: 49,
        backgroundColor: g.auxiliaryColors.overlay3,
      },
      header1: {
        color: g.fontColors.lightGrey,
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.semiBold,
      },
      header2: {
        fontFamily: g.fontFamily.bold,
        color: g.fontColors.light,
        fontSize: g.fontSizes.subTitle1,
      },
      header1Spacing: {
        marginTop: 18,
        paddingBottom: 13,
        paddingRight: 54,
      },
      headerContainerStyle: {
        paddingRight: 54,
      },
    })
);

export default HeaderComponent;
