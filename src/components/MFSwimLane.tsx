import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, View } from "react-native";
import { Feed } from "../@types/HubsResponse";
import { SubscriberFeed } from "../@types/SubscriberFeed";
import { layout2x3 } from "../config/constants";
import { Routes } from "../config/navigation/RouterOutlet";
import { Layout, NavigationTarget } from "../utils/analytics/consts";
import { ItemShowType } from "../utils/common";
import { GLOBALS } from "../utils/globals";
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
}

const MFSwimLane: React.FunctionComponent<MFSwimLaneProps> = React.forwardRef(
  ({ ...props }, ref: any) => {
    const [page, setPage] = React.useState(0);
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
        props.data?.length >= props.limitSwimlaneItemsTo!);

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
          navigationTargetUri === "browsepayperview"
        ) {
          updateRoute("BrowseGallery", payload);
          return;
          // props.navigation.navigate(Routes.BrowseGallery, payload);
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
          updateRoute("Favorites", payload);
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
      <View style={{ flexDirection: "column" }}>
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
          railContainerStyles={{}}
          libraryItems={props.data}
          customViewAllTitle={props.customViewAllTitle}
          feed={props.feed}
          cardStyle={props.cardStyle}
          onPress={props.onPress}
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
              ref={ref}
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
