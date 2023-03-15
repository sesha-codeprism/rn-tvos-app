import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { AppStrings } from "../../../../config/strings";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";

interface WaysToWatchProps {
  navigation?: any;
  route?: any;
}

export enum WaysToWatchPanelRoutes {
  PlayDVR,
  WatchLive,
  Restart,
  Upcoming,
  PlayVOD,
  RentBuy,
  Subscribe,
}

const WaysToWatchPanel: React.FunctionComponent<WaysToWatchProps> = (props) => {
  const invertedHeading = true;

  const headingLine1 = AppStrings?.str_details_cta_waystowatch;

  const headingLine2 = props.route.params?.title;

  const getIconName = (panelRoute: WaysToWatchPanelRoutes): any => {
    switch (panelRoute) {
      case WaysToWatchPanelRoutes.PlayDVR:
      case WaysToWatchPanelRoutes.PlayVOD:
      case WaysToWatchPanelRoutes.WatchLive:
        return "play";
      case WaysToWatchPanelRoutes.Restart:
        return "restart";
      case WaysToWatchPanelRoutes.Upcoming:
        return "upcoming";
    }
  };

  return (
    <SideMenuLayout
      title={headingLine1}
      subTitle={headingLine2}
      isTitleInverted={true}
    ></SideMenuLayout>
  );
};

const styles = StyleSheet.create(
  getUIdef("WaysToWatchPanel")?.style ||
    scaleAttributes({
      selectButtonContainer: {
        width: "100%",
        paddingHorizontal: 30,
        height: 100,
      },
      root: {
        paddingTop: 37,
      },
    })
);

export default WaysToWatchPanel;
