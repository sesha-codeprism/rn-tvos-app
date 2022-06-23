import React from "react";
import { View } from "react-native";
import { Feed } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { enableRTL, layout2x3 } from "../config/constants";
import { format } from "../utils/DiscoveryUtils";
import { HomeScreenStyles } from "../views/app/Homescreen.styles";
import Styles from "./MFButtonsVariants/MFButtonStyles";
import { TitlePlacement } from "./MFCard";
import MFFilmStrip, { OverlayComponent } from "./MFFilmStrip/MFFilmStrip";
import MFViewAllButton from "./MFFilmStrip/ViewAllComponent";

interface MFSwimLaneProps {
  feed: Feed;
  data: any;
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;
}

const MFSwimLane: React.FunctionComponent<MFSwimLaneProps> = (props) => {
  const [page, setPage] = React.useState(0);
  return (
    <MFFilmStrip
      limitItemsTo={16}
      enableCircularLayout
      title={props.feed.Name}
      style={
        props.feed.ShowcardAspectRatio === layout2x3
          ? HomeScreenStyles.portraitCardStyles
          : HomeScreenStyles.landScapeCardStyles
      }
      imageStyle={
        props.feed.ShowcardAspectRatio === layout2x3
          ? HomeScreenStyles.portraitCardImageStyles
          : HomeScreenStyles.landScapeCardImageStyles
      }
      focusedStyle={HomeScreenStyles.focusedStyle}
      titlePlacement={TitlePlacement.beneath}
      enableRTL={enableRTL}
      appendViewAll
      railContainerStyles={{}}
      railTitleStyles={{ paddingLeft: 50 }}
      renderLibraryItemList
      libraryItems={props.data}
      onFocus={(event) => {
        props.onFocus && props.onFocus(event);
      }}
      listEmptyComponent={
        /** List length <=0. UDL Call successful but no data items returned */
        <MFViewAllButton
          displayStyles={Styles.railTitle}
          displayText={"No items returned"}
          style={
            props.feed.ShowcardAspectRatio === layout2x3
              ? HomeScreenStyles.portraitCardStyles
              : HomeScreenStyles.landScapeCardStyles
          }
          imageStyle={
            props.feed.ShowcardAspectRatio === layout2x3
              ? HomeScreenStyles.portraitCardImageStyles
              : HomeScreenStyles.landScapeCardImageStyles
          }
          focusedStyle={HomeScreenStyles.focusedStyle}
          onPress={() => {}}
        />
      }
      shouldRenderFooter={
        props.feed.NavigationTargetUri &&
        props.feed.NavigationTargetText &&
        props.feed.NavigationTargetVisibility &&
        props.data &&
        props.data.length > 0
      }
      overlayComponent={<OverlayComponent displayString={"New Episode"} />}
      viewAll={
        <MFViewAllButton
          displayStyles={Styles.railTitle}
          displayText={
            props.feed.NavigationTargetText &&
            props.feed.NavigationTargetText.includes("{")
              ? format(props.feed.NavigationTargetText, props.feed.Name)
              : props.feed.NavigationTargetText!
          }
          style={
            props.feed.ShowcardAspectRatio === layout2x3
              ? HomeScreenStyles.portraitCardStyles
              : HomeScreenStyles.landScapeCardStyles
          }
          imageStyle={
            props.feed.ShowcardAspectRatio === layout2x3
              ? HomeScreenStyles.portraitCardImageStyles
              : HomeScreenStyles.landScapeCardImageStyles
          }
          focusedStyle={HomeScreenStyles.focusedStyle}
          onPress={() => {}}
        />
      }
    />
  );
};

export default MFSwimLane;