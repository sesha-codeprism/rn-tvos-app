import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PageContainer } from "../../../components/PageContainer";
import { SCREEN_HEIGHT } from "../../../utils/dimensions";
import { globalStyles } from "../../../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../../../utils/uidefinition";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStrings } from "../../../config/strings";

interface DvrManagerProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}
enum DvrMenuItems {
  Recorded,
  Scheduled,
}
const DVRManagerScreen = (props: DvrManagerProps) => {
  const [currentDvrMenu, setDurrentDvrMenu] = useState(DvrMenuItems.Recorded);
  const [selectedAsset, setSelectedAsset] = useState();
  const [completedWidth, setCompletedWidth] = useState(0);
  const [pivots, setPivots] = useState();
  const [isMenuFocused, setIsMenuFocused] = useState(true);
  const [focussedComponent, setFocussedComponent] = useState();

  const defaultBackgroundImageConfig: any = getUIdef("BackgroundImage")?.config;
  const backgroundImageUri = defaultBackgroundImageConfig?.backgroundImageUri;
  const dvrMenuItems = [
    { Id: DvrMenuItems.Recorded, Name: AppStrings.str_dvr_recorded },
    {
      Id: DvrMenuItems.Scheduled,
      Name: AppStrings.str_dvr_scheduled,
    },
  ];
  useEffect(() => {
    console.log('props inside DVR manager', props)
  });

  const renderTitleBlock = (title: string, metadata: string) => {
    return (
      <View style={DVRManagerStyles.titleBlock}>
        <Text style={DVRManagerStyles.seasonTitle}>{title}</Text>
        <Text style={DVRManagerStyles.seasonMetadata}>{metadata}</Text>
      </View>
    );
  };
  return (
    <PageContainer type="FullPage">
      {/* <ImageBackground
        source={
        //   props.route.params.discoveryData?.image16x9KeyArtURL ||
        //   props.route.params.discoveryData?.image2x3PosterURL ||
        //   props.route?.image16x9KeyArtURL ||
        //   props.route?.image16x9PosterURL ||
          backgroundImageUri
        }
        style={DVRManagerStyles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      > */}
      <View style={DVRManagerStyles.containerStyle}>
        <View style={DVRManagerStyles.firstBlock}>
          {renderTitleBlock("DVR Manager", "")}
          <View style={DVRManagerStyles.flexOne}>
            <ScrollView
              style={DVRManagerStyles.seasonScrollView}
              // ref={seasonScrollView}
            >
              <View>
                <Text>Recorded</Text>
              </View>
              <View>
                <Text>Scheduled</Text>
              </View>
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 10,
            height: SCREEN_HEIGHT,
            backgroundColor: "transparent",
          }}
          onFocus={() => {
            //   if (ctaList.length <= 0) {
            //     /** Basically we haven't focused on episodes yet.. so need to focus on episodes */
            //     firstEpisodeRef?.current?.setNativeProps({
            //       hasTVPreferredFocus: true,
            //     });
            //   } else {
            //     /** Coming from Episode list.. need to pick the correct season */
            //     seasonButtonRef?.current?.setNativeProps({
            //       hasTVPreferredFocus: true,
            //     });
            //   }
          }}
        />
      </View>
      {/* </ImageBackground> */}
    </PageContainer>
  );
};
const DVRManagerStyles: any = StyleSheet.create(
  getUIdef("DvrManager")?.style ||
    scaleAttributes({
      containerStyle: {
        flex: 1,
        flexDirection: "row",
        paddingTop: 72,
        paddingLeft: 90,
        paddingRight: 58,
        backgroundColor: globalStyles.backgroundColors.shade1,
        opacity: 0.9,
      },
      firstBlock: {
        width: 543,
      },
      titleBlock: {
        marginBottom: 116,
      },
      seasonTitle: {
        fontFamily: globalStyles.fontFamily.bold,
        fontSize: globalStyles.fontSizes.subTitle1,
        color: globalStyles.fontColors.light,
        marginBottom: 15,
      },
      seasonMetadata: {
        fontFamily: globalStyles.fontFamily.semiBold,
        fontSize: globalStyles.fontSizes.body2,
        color: globalStyles.fontColors.lightGrey,
      },
      flexOne: {
        flex: 1,
      },
      seasonScrollView: {
        marginBottom: 30,
      },
    })
);

const styles = StyleSheet.create(
  getUIdef("DvrManager")?.style ||
    scaleAttributes({
      container: {
        paddingTop: 40,
      },
      dvrMain: {
        display: "flex",
        flexDirection: "row",
      },
      dvrView: {
        width: 420,
        height: "100%",
      },
      dvrScrollView: {
        paddingLeft: 90,
      },
      dvrresultsView: {
        width: 1920,
        height: 950,
        marginLeft: 40,
        marginTop: 20,
      },
      dvrScheduleViewStyle: {
        alignItems: "flex-start",
        width: 1920,
        height: 950,
      },
      noResultsView: {
        width: 1460,
        height: 950,
        marginTop: 20,
        marginLeft: 10,
        paddingBottom: 30,
      },
      manageButton: {
        height: 70,
        width: 300,
        backgroundColor: globalStyles.backgroundColors.shade3,
        marginTop: 55,
        textAlign: "center",
      },
      headerUnderLine: {
        width: 1920,
        opacity: 0.4,
        height: 1,
        borderWidth: 0.4,
        borderColor: globalStyles.backgroundColors.shade5,
        backgroundColor: globalStyles.backgroundColors.shade5,
        alignSelf: "center",
        marginTop: 30,
      },
      titlePadding: {
        paddingLeft: 88,
        paddingBottom: 20,
      },
      flexOne: {
        flex: 1,
      },
      title: {
        color: globalStyles.fontColors.light,
        fontSize: globalStyles.fontSizes.subTitle1,
        fontFamily: globalStyles.fontFamily.semiBold,
      },
      filterViewStyle: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        top: 0,
        right: 0,
        alignContent: "flex-end",
        zIndex: 1000,
      },
      dvrText: {
        fontFamily: globalStyles.fontFamily.regular,
        color: globalStyles.fontColors.darkGrey,
      },
      dvrTextSelected: {
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.light,
      },
      backgroundPosterStyle: {
        backgroundColor: globalStyles.backgroundColors.shade1,
        opacity: 0.9,
      },
      dvrBlock: {
        height: 62,
        width: 300,
        marginTop: 40,
      },
      dvrResultDetails: {
        marginTop: 30,
      },
      dvrCloudSpace: {
        fontFamily: globalStyles.fontFamily.regular,
        color: globalStyles.fontColors.darkGrey,
        fontSize: globalStyles.fontSizes.caption1,
        marginTop: 410,
      },
      recorded: {
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.lightGrey,
        fontSize: globalStyles.fontSizes.body2,
      },
      dvrSpace: {
        marginTop: 20,
        flexDirection: "row",
      },
      metadataSeparator: {
        marginLeft: 30,
      },
      progressBarContainer: {
        height: 6,
        width: 300,
        borderRadius: 9,
        marginTop: 20,
      },
      buttonContainerStyle: {
        height: 66,
        width: 180,
        marginTop: 30,
      },
      focusedUnderLine: {
        backgroundColor: globalStyles.backgroundColors.primary1,
      },
    })
);
export default DVRManagerScreen;
