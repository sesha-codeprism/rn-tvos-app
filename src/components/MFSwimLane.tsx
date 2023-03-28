//@ts-nocheck
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Feed } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { layout2x3 } from "../config/constants";
import { Routes } from "../config/navigation/RouterOutlet";
import { Layout, NavigationTarget } from "../utils/analytics/consts";
import { ContentRating, ItemShowType, Rating } from "../utils/common";
import { GLOBALS } from "../utils/globals";
import { IImage } from "../utils/live/live";
import { HomeScreenStyles } from "../views/app/Homescreen.styles";
import Styles from "./MFButtonsVariants/MFButtonStyles";
import { TitlePlacement } from "./MFCard";
import MFFilmStrip from "./MFFilmStrip/MFFilmStrip";
import MFViewAllButton from "./MFFilmStrip/ViewAllComponent";

interface MFSwimLaneProps {
  feed: Feed;
  data: any;
  onFocus?: null | ((event: SubscriberFeed) => void) | undefined;
  onPress?: null | ((event: SubscriberFeed) => void) | undefined;
  onBlur?: null | ((event: SubscriberFeed) => void) | undefined;
  updateSwimLaneKey?: null | ((event: string) => void) | undefined;
  swimLaneKey?: string;
  cardStyle?: "16x9" | "3x4" | "2x3";
  limitSwimlaneItemsTo?: number;
  swimId?: string;
  renderViewAll?: boolean;
  customViewAllTitle?: string;
  onListEmptyElementFocus?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
  onListEmptyElementPress?:
    | null
    | ((event: SubscriberFeed) => void)
    | undefined;
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
  navigation: NativeStackNavigationProp<any>;
  onLongPress?: any;
}

export interface Names {
  Culture: string;
  Value: string;
}

export interface FeedElement {
  Id: string;
  Name: string;
  ItemType: string;
  Images?: IImage[];
  Ratings: Rating[];
  CallLetters: string;
  IsAdult: boolean;
  ShowType: string;
  ReleaseYear?: number;
  SupportedImages: string[];
  ImageBucketId: string;
  ContentRatings: ContentRating[];
  IsLive?: boolean;
}

export interface PivotItems {
  Id: string;
  Name: string;
  HasMore: boolean;
  Items: FeedElement[];
  HasSubcategories?: boolean;
  HasSubcriptionPackages?: boolean;
  IsAdult?: boolean;
  Names?: Names;
  ReadOnly?: boolean;
}

export class FeedContents {
  feed: Feed | any;
  items: any;
  constructor(feed: any, items: any) {
    this.feed = feed;
    this.items = items;
  }
}

const MFSwimLane: React.FunctionComponent<MFSwimLaneProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    const [page, setPage] = React.useState(0);
    let innerNoItemsReturenedRef = useRef<TouchableOpacity>(null);

    const _onBlur = () => {};
    const _onFocus = (event?: SubscriberFeed, index?: number) => {
      props.onFocus && event && props.onFocus(event);
    };
    const showViewAll =
      props.renderViewAll ||
      props.feed?.NavigationTargetVisibility ===
        NavigationTarget.SHOW_FEED_ALWAYS ||
      (props.feed?.NavigationTargetVisibility ===
        NavigationTarget.CLIENT_DEFINED &&
        props.data?.length >= props.limitSwimlaneItemsTo!) ||
      props.feed.NavigationTargetUri === "dvr";

    const updateRoute = (route: string, params: any) => {
      console.log("UpdateRoute", route, params);
      if (!route && !params) {
        console.log("No route info or params provided");
        return;
      }
      //@ts-ignore
      if (Routes[`${route}`] !== undefined) {
        /** Route info exists in our router.. so navigate to that route with passed params */
        //@ts-ignore
        props.navigation.navigate(Routes[`${route}`], params);
      } else {
        /** Current route not implemented yet.. So re-direct towards fallback page */
        props.navigation.navigate(Routes.FallBack, params);
      }
    };
    const onTapViewAll = (feed: any) => {
      console.log('View all pressed', feed);
      if (!props.navigation) {
        console.warn("Missing navigation prop");
        return;
      }
      const payload: any = {
        feed,
        title: feed.Name,
        navigationTargetUri: feed.NavigationTargetUri,
      };
      const navigationTargetUri =
        feed.NavigationTargetUri && feed.NavigationTargetUri.split("?")[0];
      const browseObject = () => {
        if (
          navigationTargetUri === "browsepromotions" ||
          navigationTargetUri === "browsepayperview" ||
          navigationTargetUri === "libraries"
        ) {
          updateRoute("BrowseGallery", payload);
          return;
          // props.navigation.navigate(Routes.BrowseGallery, payload);
        }
        if (navigationTargetUri === "favorites") {
          updateRoute(Routes.FavouriteManager, payload);
        }
        if (navigationTargetUri === "dvr") {
          updateRoute("DvrManager", payload);
        }
        if (feed.Layout === Layout.Category || feed.HasSubcategories === true) {
          updateRoute("BrowseCategory", payload);
        } else if (
          !!feed?.ItemType &&
          feed?.ItemType === ItemShowType.SvodPackage
        ) {
          props.navigation.navigate("BrowseSubGallery", payload);
        } else {
          updateRoute("BrowseGallery", payload);
        }
      };

      const navigationTargetObject: any = {
        favorites: () => {
          updateRoute("FavouriteManager", payload);
        },
        dvr: () => {
          updateRoute("DvrManager", payload);
        },
        liveTvGuide: () => {
          props.navigation.navigate("guide");
        },
        restartTv: () => {
          if (
            feed?.ContextualNavigationTargetUri &&
            feed.ContextualNavigationTargetUri === "restartTvGallery"
          ) {
            updateRoute("BrowseGallery", payload);
          } else {
            updateRoute("BrowseCategory", payload);
          }
        },
        browsepackages: () => {
          updateRoute("BrowseGallery", payload);
        },
        browserecommendations: () => {
          updateRoute("BrowseCategory", payload);
        },
        browsemovies: browseObject,
        browsetv: browseObject,
        browsemoviesandtv: browseObject,
        browsepromotions: browseObject,
        browsemixedrecommendations: browseObject,
        libraries: browseObject,
        continue: browseObject,
        browsepayperview: browseObject,
        browsetrending: browseObject,
        browsedvrtvshows: () => {
          updateRoute("BrowseGallery", payload);
        },
        browsedvrmovies: () => {
          updateRoute("BrowseGallery", payload);
        },
        browsesearch: browseObject,
      };
      navigationTargetObject[navigationTargetUri] &&
        navigationTargetObject[navigationTargetUri]();
    };

    return (
      <View style={[{ flexDirection: "column" }]}>
        <MFFilmStrip
          // @ts-ignore
          ref={ref}
          key={`${props.swimId}-filmStrip`}
          filmStripId={`${props.swimId}-filmStrip`}
          limitSwimlaneItemsTo={props.limitSwimlaneItemsTo}
          enableCircularLayout
          // @ts-ignore
          title={props.feed?.Name || props.feed.name}
          style={
            props.cardStyle === "2x3"
              ? HomeScreenStyles.portraitCardStyles
              : props.cardStyle === "16x9"
              ? HomeScreenStyles.landScapeCardStyles
              : props.cardStyle === "3x4"
              ? HomeScreenStyles.card3x4Styles
              : HomeScreenStyles.landScapeCardStyles
          }
          imageStyle={
            props.cardStyle === "2x3"
              ? HomeScreenStyles.portraitCardImageStyles
              : props.cardStyle === "16x9"
              ? HomeScreenStyles.landScapeCardImageStyles
              : props.cardStyle === "3x4"
              ? HomeScreenStyles.card3x4ImageStyles
              : HomeScreenStyles.landScapeCardImageStyles
          }
          focusedStyle={HomeScreenStyles.focusedStyle}
          titlePlacement={TitlePlacement.beneath}
          enableRTL={GLOBALS.enableRTL}
          appendViewAll
          swimLaneKey={props.swimLaneKey}
          updateSwimLaneKey={props.updateSwimLaneKey}
          railContainerStyles={
            props.cardStyle === "3x4" || props.cardStyle === "2x3"
              ? { height: 550 }
              : { height: 450 }
          }
          libraryItems={props.data}
          customViewAllTitle={props.customViewAllTitle}
          feed={props.feed}
          cardStyle={props.cardStyle}
          onPress={props.onPress}
          onLongPress={props.onLongPress}
          onBlur={(event) => {
            _onBlur();
          }}
          onFocus={(event) => {
            _onFocus(event);
            props.onFocus && props.onFocus(event);
          }}
          listEmptyComponent={
            /** List length <=0. UDL Call successful but no data items returned */
            <MFViewAllButton
              // @ts-ignore
              ref={innerNoItemsReturenedRef}
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
              onPress={props.onListEmptyElementPress}
              onFocus={props.onListEmptyElementFocus}
            />
          }
          shouldRenderFooter={showViewAll}
          onListFooterElementOnPress={props.onListFooterElementOnPress}
          onListFooterElementFocus={props.onListFooterElementFocus}
          onViewAllPressed={onTapViewAll}
          flatListStyle={{ display: "flex", flex: 1, flexDirection: "row" }}
          getNoItemReturenedRef={() => innerNoItemsReturenedRef}
        />
      </View>
    );
  }
);
MFSwimLane.defaultProps = {
  cardStyle: "16x9",
  renderViewAll: undefined,
  customViewAllTitle: "View All",
};

export default MFSwimLane;
