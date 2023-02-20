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

interface MFGridProps {
  dataSource?: Array<SubscriberFeed>;
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
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;

  onPress?: null | ((event: SubscriberFeed) => void) | undefined;

  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;
  /** Handler for when Flatlist end is reached */
  onEndReached?: null | (() => void) | undefined;
  autoFocusOnFirstCard?: boolean;
  selectedId: any;
}

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
