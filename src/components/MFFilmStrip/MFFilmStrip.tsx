import React, { useRef, useState } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
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
import MFOverlay from "../MFOverlay";
import MFMetaData from "../MFMetadata/MFMetaData";
// export interface FeedsObject {
//   imageSource?: string;
//   imageStyles?: StyleProp<ImageStyle>;
// }
/**
 * Class representation of Feed Objects rendered in MFFilmStrip component
 */
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
  limitSwimlaneItemsTo?: number;
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
  libraryItems?: Array<SubscriberFeed> | any;
  cardStyle?: "16x9" | "3x4" | "2x3";
  updateSwimLaneKey?: null | ((event: string) => void) | undefined;
  swimLaneKey?: string;
  onListFooterElementFocus?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  onListFooterElementOnPress?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  flatListStyle?: any;
  autoFocusOnFirstCard?: boolean;
}
/**
 * Component that renders horizontal-scrolling collection of items
 * @param props - MFFilmStrip props
 * @returns MFFilmStrip component
 */
const MFFilmStrip: React.FunctionComponent<MFFilmStripProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    const flatListRef = useRef<FlatList>(null);
    const [dataSource, setDataSource] = useState([...(props.dataSource || [])]);
    const [currentFeed, setCurrentFeed] = useState<SubscriberFeed>();
    const _onFocus = (index: number) => {
      flatListRef.current?.scrollToIndex({ animated: true, index: index });
      if (props.isCircular) {
        if (index > dataSource.length - 3) {
          setDataSource([...dataSource, ...(props.dataSource || [])]);
        }
      }
      if (
        Array.isArray(props.libraryItems) &&
        props.libraryItems &&
        props.libraryItems[index]
      ) {
        setCurrentFeed(props.libraryItems![index]);
      } else if (Object.keys(props.libraryItems)[0]) {
        setCurrentFeed(
          props.libraryItems[Object.keys(props.libraryItems)[0]][index]
        );
      }
      props.updateSwimLaneKey && props.title
        ? props.updateSwimLaneKey(props.title)
        : props.updateSwimLaneKey &&
          props.libraryItems[Object.keys(props.libraryItems)[0]][index]
        ? props.updateSwimLaneKey(
            props.libraryItems[Object.keys(props.libraryItems)[0]][index].title
          )
        : null;
    };
    const dataArray: Array<SubscriberFeed> | undefined = Array.isArray(
      props.libraryItems
    )
      ? props.libraryItems?.slice(0, props.limitSwimlaneItemsTo)
      : props.libraryItems !== undefined
      ? props.libraryItems[Object.keys(props.libraryItems)[0]]?.slice(
          0,
          props.limitSwimlaneItemsTo!
        )
      : [];
    const cardWidth = parseInt(props.style?.width?.toString() || "300");

    return (
      <View style={[Styles.railContainer, props.railContainerStyles]}>
        {
          <MFText
            textStyle={[Styles.railTitle, props.railTitleStyles]}
            displayText={
              Array.isArray(props.libraryItems)
                ? props.title
                : props.libraryItems !== undefined
                ? Object.keys(props.libraryItems)[0]
                : props.title
            }
            enableRTL={props.enableRTL}
            shouldRenderText
          />
        }
        {
          /** Checking if UDL data is not undefined an list length > 0 */
          props.libraryItems !== undefined ? (
            <FlatList
              ref={flatListRef}
              style={StyleSheet.flatten([props.flatListStyle])}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal
              windowSize={4}
              disableIntervalMomentum
              contentContainerStyle={{
                paddingRight: SCREEN_WIDTH,
              }}
              inverted={props.enableRTL}
              data={dataArray}
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
                  // @ts-ignore
                  ref={index === 0 ? ref : null}
                  autoFocusOnFirstCard={
                    props.autoFocusOnFirstCard
                      ? index === 0
                        ? true
                        : false
                      : false
                  }
                  key={`Index${index}`}
                  data={item}
                  cardStyle={props.cardStyle}
                  style={props.style}
                  focusedStyle={props.focusedStyle}
                  imageStyle={props.imageStyle}
                  title={""}
                  layoutType={
                    props.enableCircularLayout ? "Circular" : "LandScape"
                  }
                  showTitleOnlyOnFocus={false}
                  titlePlacement={props.titlePlacement}
                  overlayComponent={
                    <MFOverlay
                      //@ts-ignore
                      renderGradiant={true}
                      showProgress={item.Bookmark! || false}
                      progress={20}
                      // displayTitle={item.title}
                      bottomText={item.runtime}
                      // showRec={true}
                      // recType={"series"}
                    />
                  }
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
              }}
            >
              <MFViewAllButton
                // @ts-ignore
                ref={ref}
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
        }
        <View
          style={{
            width: 500,
            height: 141,
          }}
        >
          {currentFeed &&
            props.swimLaneKey?.trim().length! > 0 &&
            (props.swimLaneKey === props.title ||
              props.swimLaneKey === currentFeed?.title) && (
              <MFMetaData currentFeed={currentFeed} />
            )}
        </View>
      </View>
    );
  }
);
export const OverlayComponent = ({
  displayString,
}: {
  displayString: string;
}) => (
  <View
    style={{
      backgroundColor: "transparent",
      alignSelf: "flex-end",
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
