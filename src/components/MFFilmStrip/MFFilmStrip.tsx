import React, { useRef, useState } from "react";
import { FlatList, StyleProp, TextStyle, View, ViewStyle } from "react-native";
// import { FeedObject } from '../../@types/FeedObject';
import Styles from "../MFButtonsVariants/MFButtonStyles";
import MFCard from "../MFCard";
import { MFTabBarStyles } from "../MFTabBar/MFTabBarStyles";
import MFText from "../MFText";
import { TitlePlacement } from "../MFCard";
import { ImageStyle } from "react-native-fast-image";
import { Feed } from "../../@types/HubsResponse";
import MFLibraryCard from "../MFLibraryCard";
import { SubscriberFeed } from "../../@types/SubscriberFeed";
import { HomeScreenStyles } from "../../views/app/Homescreen.styles";
import MFViewAllButton from "./ViewAllComponent";
import { SCREEN_WIDTH } from "../../utils/dimensions";

// export interface FeedsObject {
//   imageSource?: string;
//   imageStyles?: StyleProp<ImageStyle>;
// }

/**
 * Class representation of Feed Objects rendered in MFFilmStrip component
 */
export interface FeedObject {
  /** ID of the object*/
  id: string;
  /** Author of the content/object*/
  author: string;
  /** Width of the image*/
  width: number;
  /** Height of the image*/
  height: number;
  /** Web URL of the image */
  url: string;
  /** Render URL of the image*/
  download_url: string;
}

/**
 * Props for the MFFilmStrip component
 */
export interface MFFilmStripProps {
  /** Title of the Film Strip*/
  title?: string;
  /** Film Strip title render styles*/
  titleStyles?: StyleProp<TextStyle>;
  /** Array of FeedObjects to be rendered in FilmStrip */
  dataSource?: Array<Feed>;
  /** Component to be rendered at the end of the list. To enable View All feature*/
  viewAll?: React.ReactElement;
  /**Component to be rendered when list is empty */
  listEmptyComponent?: React.ReactElement;
  /** Specify if the View All component should be rendered with the list*/
  appendViewAll?: boolean;
  /** Specify number of elements in the list*/
  limitItemsTo?: number;
  /** Specify where the View All component should be rendered, at the start/end of the list*/
  viewAllPlacement?: "Prepend" | "Append";
  /** Specify if the list is circular-looping*/
  isCircular?: boolean;
  /** Specify if the RTL support is to be enabled*/
  enableRTL?: boolean;
  /**Specify if the layout for all the cards should be circular */
  enableCircularLayout?: boolean;
  /** MFCard to be rendered as a part of the Filmstrip */
  mfCardComponent?: typeof MFCard;
  /**MFFilmStrip RailContainerStyles */
  railContainerStyles?: StyleProp<ViewStyle>;
  /** MFilmStrip Rail title Styles */
  railTitleStyles?: StyleProp<TextStyle>;
  /** Element to be rendered as an overlay */
  overlayComponent?: React.ReactElement;
  /** Element to be rendered as progress bar */
  progressElement?: React.ReactElement;
  /** Rendered MFCard default styles */
  style?: ViewStyle;
  /** Rendered MFCard image styles. Ideally same as Card's default style */
  imageStyle?: StyleProp<ImageStyle>;
  /** Rendered MFCard style when focused */
  focusedStyle?: StyleProp<ViewStyle>;
  /** Placement of the title on the card - Top, Center, Bottom or Beneath */
  titlePlacement?: TitlePlacement;
  /** Should MFCard render ProgressComponent */
  shouldRenderProgress?: boolean;
  /** Should render ListFooterComponent */
  shouldRenderFooter?: boolean;
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;

  onPress?: null | ((event: SubscriberFeed) => void) | undefined;

  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;

  libraryItems?: Array<SubscriberFeed>;
  renderLibraryItemList?: boolean;
  onListFooterElementFocus?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  onListFooterElementOnPress?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
}

/**
 * Component that renders horizontal-scrolling collection of items
 * @param props - MFFilmStrip props
 * @returns MFFilmStrip component
 */
const MFFilmStrip: React.FunctionComponent<MFFilmStripProps> = (props) => {
  const flatListRef = useRef<FlatList>(null);
  const [dataSource, setDataSource] = useState([...(props.dataSource || [])]);
  const _onFocus = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index });
    if (props.isCircular) {
      if (index > dataSource.length - 3) {
        setDataSource([...dataSource, ...(props.dataSource || [])]);
      }
    }
  };

  const cardWidth = parseInt(props.style?.width?.toString() || "300");

  return (
    <View style={[Styles.railContainer, props.railContainerStyles]}>
      <MFText
        textStyle={[Styles.railTitle, props.railTitleStyles]}
        displayText={props.title}
        enableRTL={props.enableRTL}
        shouldRenderText
      />
      {props.renderLibraryItemList ? (
        /** Checking if UDL data is not undefined an list length > 0 */
        props.libraryItems !== undefined ? (
          <FlatList
            ref={flatListRef}
            scrollEnabled={false}
            horizontal
            disableIntervalMomentum
            contentContainerStyle={{
              paddingRight: SCREEN_WIDTH,
              paddingLeft: 50,
            }}
            inverted={props.enableRTL}
            data={props.libraryItems}
            initialNumToRender={20}
            keyExtractor={(x, i) => i.toString()}
            ListHeaderComponent={
              props.appendViewAll && props.viewAllPlacement === "Prepend"
                ? props.shouldRenderFooter
                  ? props.viewAll
                  : null
                : null
            }
            ListEmptyComponent={props.listEmptyComponent}
            ListFooterComponent={
              props.appendViewAll &&
              (props.viewAllPlacement === "Append" || !props.viewAllPlacement)
                ? props.shouldRenderFooter
                  ? props.viewAll
                  : null
                : null
            }
            getItemLayout={(data, index) => ({
              length: cardWidth,
              offset: cardWidth * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <MFLibraryCard
                key={`Index${index}`}
                data={item}
                style={props.style}
                focusedStyle={props.focusedStyle}
                imageStyle={props.imageStyle}
                title={""}
                layoutType={
                  props.enableCircularLayout ? "Circular" : "LandScape"
                }
                showTitleOnlyOnFocus={true}
                titlePlacement={props.titlePlacement}
                overlayComponent={props.overlayComponent}
                progressComponent={props.progressElement}
                showProgress={props.shouldRenderProgress}
                shouldRenderText
                onFocus={(event) => {
                  _onFocus(index);
                  props.onFocus && props.onFocus(event);
                }}
                onPress={(event) => {
                  props.onPress && props.onPress(event);
                }}
                onBlur={(event) => {}}
              />
            )}
          />
        ) : (
          /** UDL data undefined.. So basically UDL call isn't implemented or call failed with some error code. */
          <View
            style={{
              paddingRight: SCREEN_WIDTH,
              paddingLeft: 50,
            }}
          >
            <MFViewAllButton
              displayStyles={Styles.railTitle}
              displayText={"Feed Not Implemented"}
              style={[HomeScreenStyles.landScapeCardStyles]}
              imageStyle={HomeScreenStyles.landScapeCardImageStyles}
              focusedStyle={HomeScreenStyles.focusedStyle}
              onPress={props.onListFooterElementOnPress}
              onFocus={props.onListFooterElementFocus}
            />
          </View>
        )
      ) : (
        <FlatList
          horizontal
          inverted={props.enableRTL}
          data={props.dataSource}
          initialNumToRender={20}
          keyExtractor={(x, i) => i.toString()}
          ListHeaderComponent={
            props.appendViewAll && props.viewAllPlacement === "Prepend"
              ? props.viewAll
              : null
          }
          ListFooterComponent={
            props.appendViewAll &&
            (props.viewAllPlacement === "Append" || !props.viewAllPlacement)
              ? props.viewAll
              : null
          }
          renderItem={({ item, index }) => (
            <MFCard
              key={`Index${index}`}
              data={item}
              style={props.style}
              focusedStyle={props.focusedStyle}
              imageStyle={props.imageStyle}
              title={item.Name || item.Id}
              layoutType={props.enableCircularLayout ? "Circular" : "LandScape"}
              showTitleOnlyOnFocus={true}
              titlePlacement={props.titlePlacement}
              overlayComponent={props.overlayComponent}
              progressComponent={props.progressElement}
              showProgress={props.shouldRenderProgress}
              shouldRenderText
              onFocus={(event) => {
                // props.onFocus && props.onFocus(event);
              }}
              onPress={(event) => {
                // props.onPress && props.onPress(event);
              }}
              onBlur={(event) => {}}
            />
          )}
        />
      )}
    </View>
  );
};

export const OverlayComponent = ({
  displayString,
}: {
  displayString: string;
}) => (
  <View
    style={{
      backgroundColor: "transparent",
      // backgroundColor: "#222222",
      alignSelf: "flex-end",
      // marginRight: 30,
      // marginTop: 10,
      // borderRadius: 5,
      padding: 10,
    }}
  >
    <MFText
      displayText={displayString}
      shouldRenderText
      textStyle={[
        MFTabBarStyles.tabBarItemText,
        { alignSelf: "center", color: "white", marginTop: 5 },
      ]}
    />
  </View>
);

export default MFFilmStrip;
