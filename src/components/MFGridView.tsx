import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  FlatList,
  TextStyle,
} from "react-native";
import { ImageStyle } from "react-native-fast-image";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import MFCard, { AspectRatios, TitlePlacement } from "./MFCard";
import MFLibraryCard from "./MFLibraryCard";
import MFOverlay from "./MFOverlay";
/** Props for MFGrid */
interface MFGridProps {
  /** List of Subscriber feed to render as Grid */
  dataSource?: Array<SubscriberFeed>;
  /** Styles of root container that holds Grid view */
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
  cardStyle?: "16x9" | "3x4" | "2x3";
  /** Specification of title placement */
  titlePlacement?: TitlePlacement;
  /** Function to execute when grid element is focused */
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  /** Function to execute when grid element is pressed/selected */
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
  /** Function to execute when grid element is unfocused */
  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;
  /** Handler for when Flatlist end is reached */
  onEndReached?: null | (() => void) | undefined;
  /** Should auto focus on the first card in the grid */
  autoFocusOnFirstCard?: boolean;
  /** Id of the selected card */
  selectedId: any;
}
/**
 * A functional component to render a collection of SubscriberFeed as GridView
 * @param { MFGridProps} props - Props required for MFGridView
 * @returns {React.ForwardedRef} - Renders a Grid view representation of SubscriberFeed
 */
const MFGridView: React.FunctionComponent<MFGridProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    return (
      <FlatList
        data={props.dataSource}
        numColumns={4}
        keyExtractor={(x, i) => i.toString()}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={0.8}
        renderItem={({ item, index }) => (
          <MFLibraryCard
            //@ts-ignore
            ref={index === 0 ? ref : null}
            key={`Index${index}`}
            data={item}
            style={props.style}
            focusedStyle={props.focusedStyle}
            imageStyle={props.imageStyle}
            title={""}
            layoutType={"LandScape"}
            showTitleOnlyOnFocus={false}
            autoFocusOnFirstCard={index === 0}
            titlePlacement={props.titlePlacement}
            cardStyle={props.cardStyle}
            onFocus={(event) => {
              props.onFocus && props.onFocus(event);
            }}
            onPress={(event) => {
              props.onPress && props.onPress(event);
            }}
            onBlur={(event) => {}}
            overlayComponent={
              <MFOverlay
                renderGradiant={true}
                //@ts-ignore
                showProgress={item.Bookmark! || false}
                //@ts-ignore
                progress={item.progress ? item.progress * 100 : 20}
                bottomText={
                  //@ts-ignore
                  item.metadataLine3 || item.durationMinutesString || ""
                }
              />
            }
            shouldRenderText
          />
        )}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 50,
    backgroundColor: "black",
  },
});

export default MFGridView;
