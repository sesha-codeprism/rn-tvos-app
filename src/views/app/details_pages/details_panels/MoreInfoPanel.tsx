import React, { useEffect } from "react";
import {
  Animated,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AppStrings, getFontIcon } from "../../../../config/strings";
import { format, sortInorder } from "../../../../utils/assetUtils";
import {
  chooseRating,
  metadataSeparator,
} from "../../../../utils/Subscriber.utils";
import { globalStyles as globals } from "../../../../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../../../../utils/uidefinition";
import { fontIconsObject } from "../../../../utils/analytics/consts";
import HeaderComponent from "../../../../components/HeaderComponent";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";

export type State = {
  opacity: Animated.Value;
};

type Genre = { Id: string; Name: string };

type EpisodeData = {
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string;
  episodeDescription: string;
};

type MoreInfoPanelState = State;

// @ts-ignore
const liveIcon = getFontIcon("source_live");
// @ts-ignore
const dvrIcon = getFontIcon("source_dvr");
// @ts-ignore
const restartIcon = getFontIcon("badge_restart");
// @ts-ignore
const vodIcon = getFontIcon("source_vod");
// @ts-ignore
const upcomingIcon = getFontIcon("badge_upcoming");
// @ts-ignore
const ppvIcon = getFontIcon("source_ppv");

interface MoreInfoProps {
  navigation?: any;
  route?: any;
}

const MoreInfoPanel: React.FunctionComponent<MoreInfoProps> = (props) => {
  const {
    episodeData = {},
    episodeDetailsData = {},
    udpData = {},
    genres = [],
    networkInfo = [],
  } = props.route.params;

  const getMetadataString = () => {
    const {
      ReleaseYear = "",
      Rating = "",
      seasonsCount = "",
      durationMinutesString = "",
    } = udpData;
    const metadataString = [];
    if (durationMinutesString) {
      metadataString.push(durationMinutesString);
    }
    if (seasonsCount) {
      metadataString.push(seasonsCount);
    }
    if (ReleaseYear) {
      metadataString.push(ReleaseYear);
    }
    if (Rating) {
      metadataString.push(Rating);
    }

    return metadataString.join(metadataSeparator);
  };

  const getEpisodeTitleString = (episodeData: EpisodeData) => {
    const { str_seasonNumber, str_episodeNumber } = AppStrings || {};
    const { episodeName, episodeNumber, seasonNumber } = episodeData;
    const seasonTranslation =
      format(str_seasonNumber || "S{0}", seasonNumber.toString()) ||
      `S${seasonNumber}`;

    const episodeTranslation =
      format(str_episodeNumber || "E{0}", episodeNumber.toString()) ||
      `E${episodeNumber}`;

    return `${seasonTranslation} ${episodeTranslation}${metadataSeparator}${episodeName}`;
  };

  // Function to determine if episode data is available and complete (to determine if episode data should be shown)
  const hasCompleteEpisodeData = (episodeData: EpisodeData) => {
    const { episodeName, episodeNumber, seasonNumber } = episodeData;
    return episodeName && episodeNumber && seasonNumber;
  };

  const headingLine1 = hasCompleteEpisodeData(episodeData! || {})
    ? getEpisodeTitleString(episodeData!)
    : udpData.title || udpData.Name || udpData.Title;

  const headingLine2 = hasCompleteEpisodeData(episodeData! || {})
    ? udpData.title || udpData.Title
    : getMetadataString();

  const getGenreText = (genres?: Genre[]) =>
    genres &&
    genres.map(
      (genre, index) =>
        `${genre.Name}${index === genres.length - 1 ? "" : metadataSeparator}`
    );

  const {
    statusText,
    description,
    locale,
    Rating,
    Ratings,
    SourceIndicators = undefined,
    combinedQualityLevels = [],
    ppvInfo,
  } = udpData;

  const renderNetworkLogos = () => {
    let items = [];
    if (networkInfo && networkInfo.length) {
      const networkInfoLength = networkInfo.length;
      for (let i = 0; i < networkInfoLength; i++) {
        let networkData = networkInfo[i];

        if (!networkData) {
          break;
        }
        let networkSource =
          networkData.logoUri ||
          networkData.tenFootLargeURL ||
          networkData.twoFootLargeURL ||
          networkData.oneFootLargeURL ||
          networkData.tenFootSmallURL ||
          networkData.twoFootSmallURL ||
          networkData.oneFootSmallURL ||
          AppStrings.placeholder;
        items.push(
          <Image
            key={`Index${i}`}
            source={networkSource}
            style={styles.networkImage}
          />
        );
      }
    }
    return items;
  };

  let statusTextList = statusText;
  if (episodeDetailsData) {
    if (Object.keys(episodeDetailsData).length) {
      statusTextList = episodeDetailsData?.statusText;
    }
  }

  let ratings = episodeDetailsData?.Rating || Rating || chooseRating(Ratings);

  const languageIndicator = locale?.split("-")[0];

  let sourceIndicators = SourceIndicators;
  let audioTags: any = [];

  const getAudioTags = (audioTagsList: any) => {
    const { combinedAudioIndicator, combinedAudioTags } = audioTagsList;
    return (
      (combinedAudioIndicator?.length && combinedAudioIndicator) ||
      (combinedAudioTags?.length && combinedAudioTags) ||
      []
    );
  };

  const {
    SourceIndicators: sourceIndicatorsList = undefined,
    combinedAudioIndicator = undefined,
    combinedAudioTags = undefined,
  } = episodeDetailsData;
  let { combinedAudioIndicator: udpCombinedAudioIndicators = undefined } =
    udpData;

  if (Object.keys(episodeDetailsData).length) {
    sourceIndicators = sourceIndicatorsList;
    audioTags = getAudioTags(episodeDetailsData);
  } else {
    if (!udpCombinedAudioIndicators) {
      udpCombinedAudioIndicators = [];
    }

    if (combinedAudioIndicator) {
      udpCombinedAudioIndicators.push(...combinedAudioIndicator);
    } else if (combinedAudioTags) {
      udpCombinedAudioIndicators.push(...combinedAudioTags);
    }
    udpData["combinedAudioIndicator"] = sortInorder(
      udpCombinedAudioIndicators,
      null
    );
    audioTags = getAudioTags(udpData);
  }

  let { IsLive, IsDVR, IsRestart, IsVOD, IsUpcoming, IsPPV } =
    sourceIndicators || {};

  let showSourceIndicators =
    IsLive || IsDVR || IsRestart || IsVOD || IsUpcoming || IsPPV;

  if (ppvInfo && ppvInfo?.hasPPV) {
    IsVOD = false;
    IsUpcoming = false;
    IsPPV = true;
    showSourceIndicators = true;
    const {
      currentSelectedSchedule: { StartUtc = "" },
    } = ppvInfo;
    const dateNow = new Date(Date.now());
    const startDate = new Date(StartUtc);
    if (StartUtc && startDate > dateNow) {
      IsUpcoming = true;
    }
  }

  const assetDescription = hasCompleteEpisodeData(episodeData)
    ? episodeData?.episodeDescription || ""
    : description;

  const genresList = getGenreText(genres);
  console.log("MoreInfo", getMetadataString());

  return (
    <SideMenuLayout
      title={headingLine1}
      subTitle={headingLine2}
      contentContainerStyle={{
        padding: 0,
        width: "100%",
        paddintTop: 0,
        height: "100%",
      }}
      isTitleInverted={false}
    >
      <ScrollView style={styles.bodyRoot}>
        {!!(statusTextList && statusTextList.length) && (
          <TouchableWithoutFeedback>
            <View style={styles.row}>
              {statusTextList.map((text: string, index: number) => {
                const statusTextStyle =
                  index === 0
                    ? styles.statusTextStyle
                    : styles.statusTextStyles;
                return (
                  <Text style={statusTextStyle} key={`statustext_${index}`}>
                    {text || ""}
                  </Text>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        )}

        {genresList?.length ? (
          <Text style={[styles.genreTextStyle]}>{genresList}</Text>
        ) : null}
        {assetDescription ? (
          <TouchableWithoutFeedback>
            <View>
              <Text style={[styles.bodyTextStyle, styles.row]}>
                {assetDescription}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <Text style={[styles.bodyTextStyle, styles.audioText]}>
          {AppStrings?.str_audio}:{" "}
          {(AppStrings?.str_settings_languages as any)[languageIndicator]}
        </Text>
        <Text style={[styles.bodyTextStyle, styles.row]}>
          {AppStrings?.str_subtitle}:{" "}
          {(AppStrings?.str_settings_languages as any)[languageIndicator]}
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingIndicator} />
          <Text style={[styles.ratingTextStyle]}>
            {ratings
              ? `${AppStrings?.str_rated} ${ratings}`
              : `${AppStrings?.str_unrated}`}
          </Text>
        </View>
        <View>
          <View style={styles.separatorStyle} />
        </View>

        <View style={styles.entitlementRow}>
          {/* Quality Indicators */}
          {combinedQualityLevels?.map((quality: string) => {
            return (
              <View key={quality}>
                <Text style={styles.indicatorIconStyle}>
                  {getFontIcon((fontIconsObject as any)[quality])}
                </Text>
              </View>
            );
          })}

          {/* Language Indicators */}
          {!!languageIndicator && (
            <View>
              <Text style={styles.indicatorIconStyle}>
                {getFontIcon((fontIconsObject as any)[languageIndicator])}
              </Text>
            </View>
          )}

          {/* Audio Indicator */}
          {!!audioTags.length &&
            audioTags.map((audioTag: string) => {
              return (
                <View key={audioTag}>
                  <Text style={styles.indicatorIconStyle}>
                    {getFontIcon((fontIconsObject as any)[audioTag])}
                  </Text>
                </View>
              );
            })}
        </View>

        {!!showSourceIndicators && (
          <View style={styles.entitlementRow}>
            {!!IsLive && <Text style={styles.sourceIcon}>{liveIcon}</Text>}
            {!!IsDVR && <Text style={styles.sourceIcon}>{dvrIcon}</Text>}
            {!!IsRestart && (
              <Text style={styles.sourceIcon}>{restartIcon}</Text>
            )}
            {!!IsVOD && <Text style={styles.sourceIcon}>{vodIcon}</Text>}
            {!!IsUpcoming && (
              <Text style={styles.sourceIcon}>{upcomingIcon}</Text>
            )}
            {!!IsPPV && <Text style={styles.sourceIcon}>{ppvIcon}</Text>}
          </View>
        )}

        <View>
          <View style={styles.separatorStyle} />
        </View>

        <View>
          <View style={styles.flexRow}>{renderNetworkLogos()}</View>
        </View>

        <TouchableWithoutFeedback>
          <View>
            <View style={styles.entitlementRow}></View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SideMenuLayout>
  );
};

const styles: any = StyleSheet.create(
  getUIdef("Details.MoreInfoPanel")?.style ||
    scaleAttributes({
      bodyRoot: {
        paddingLeft: 54,
        paddingRight: 54,
        paddingTop: 34,
        paddingBottom: 34,
      },
      statusTextStyles: {
        fontSize: globals.fontSizes.body2,
        color: globals.fontColors.statusWarning,
        marginTop: 13,
      },
      statusTextStyle: {
        fontSize: globals.fontSizes.body2,
        color: globals.fontColors.statusWarning,
      },
      genreTextStyle: {
        fontSize: globals.fontSizes.body2,
        fontFamily: globals.fontFamily.bold,
        color: globals.fontColors.light,
        marginBottom: 13,
        lineHeight: globals.lineHeights.body2,
      },
      bodyTextStyle: {
        fontSize: globals.fontSizes.body2,
        color: globals.fontColors.lightGrey,
        lineHeight: globals.lineHeights.body2,
        fontFamily: globals.fontFamily.regular,
      },
      ratingTextStyle: {
        fontSize: globals.fontSizes.body2,
        fontFamily: globals.fontFamily.bold,
        color: globals.fontColors.lightGrey,
      },
      row: {
        paddingBottom: 30,
      },
      audioText: {
        paddingBottom: 5,
      },
      ratingContainer: {
        flexDirection: "row",
        marginBottom: 24,
        marginTop: 10,
      },
      ratingIndicator: {
        width: 5,
        height: "100%",
        backgroundColor: globals.backgroundColors.shade5,
        marginRight: 14,
      },
      separatorStyle: {
        width: "100%",
        height: 1,
        opacity: 0.3,
        backgroundColor: globals.backgroundColors.shade5,
        marginBottom: 20,
      },
      entitlementRow: {
        marginTop: 20,
        flexDirection: "row",
      },
      sourceIcon: {
        fontFamily: globals.fontFamily.icons,
        fontSize: 50,
        color: globals.fontColors.lightGrey,
        marginRight: 20,
        marginTop: -16,
        marginBottom: -4,
      },
      indicatorIconStyle: {
        fontFamily: globals.fontFamily.icons,
        fontSize: 20,
        color: globals.fontColors.lightGrey,
        marginRight: 15,
        marginTop: -12,
        marginBottom: -12,
      },
      networkImage: {
        height: 28,
        width: 67,
        resizeMode: "contain",
        marginRight: 20,
      },
      flexRow: {
        flexDirection: "row",
      },
    })
);
export default MoreInfoPanel;
