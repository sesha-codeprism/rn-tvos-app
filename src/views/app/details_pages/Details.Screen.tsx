import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { Feed } from "../../../@types/HubsResponse";
import { AppImages } from "../../../assets/images";
import MFText from "../../../components/MFText";
import {
  DateToAMPM,
  getMetadataLine2,
  isExpiringSoon,
  massageDiscoveryFeedAsset,
  massagePreviousDate,
  massageProgramDataForUDP,
} from "../../../utils/assetUtils";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../utils/dimensions";
import {
  getImageUri,
  metadataSeparator,
} from "../../../utils/Subscriber.utils";
import { getUIdef, scaleAttributes } from "../../../utils/uidefinition";
import { globalStyles as g } from "../../../config/styles/GlobalStyles";
import { PageContainer } from "../../../components/PageContainer";
import { getItemId } from "../../../utils/dataUtils";
import { AppStrings, getFontIcon } from "../../../config/strings";
import {
  assetTypeObject,
  BookmarkType,
  ContentType,
  fontIconsObject,
  languageKey,
  placeholder2x3Image,
  sourceTypeString,
} from "../../../utils/analytics/consts";
import { Genre } from "../../../utils/common";
import { useQuery } from "react-query";
import { defaultQueryOptions } from "../../../config/constants";
import { DefaultStore, getEpisodeInfo } from "../../../utils/DiscoveryUtils";
import { GLOBALS } from "../../../utils/globals";
import { getDataFromUDL } from "../../../../backend";
import ProgressBar from "../../../components/MFProgress";
import MFLoader from "../../../components/MFLoader";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";

interface AssetData {
  id: string;
  assetType: {
    contentType: string;
    itemType: string;
    sourceType: string;
  };
  $top: number;
  $skip: number;
  pivots: string;
  contentTypeEnum: number;
}

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

interface SideMenuState {
  visible: boolean;
  panelName: string;
}

const DetailsScreen: React.FunctionComponent<DetailsScreenProps> = (props) => {
  const feed: Feed = props.route.params.feed;
  const [similarData, setSimilarData] = useState<any>(undefined);
  const [discoveryProgramData, setdiscoveryProgramData] =
    useState<any>(undefined);
  const [discoverySchedulesData, setdiscoverySchedulesData] =
    useState<any>(undefined);
  const [playActionsData, setplayActionsData] = useState<any>(undefined);
  const [subscriberData, setsubscriberData] = useState<any>(undefined);
  const [udpDataAsset, setUDPDataAsset] = useState<any>();
  const [sidePanelState, setSidePanelState] = useState<SideMenuState>({
    panelName: "",
    visible: false,
  });
  let scrollViewRef: any = React.createRef<ScrollView>();

  const onGetScrollView = (scrolViewRef: ScrollView | null): void => {
    scrollViewRef = scrolViewRef;
  };
  const updateAssetData = () => {
    //@ts-ignore
    const assetType = feed?.assetType!;
    const id = getItemId(feed);
    const language = languageKey.language + "en";

    return {
      id,
      assetType,
      $top: 10,
      $skip: 0,
      pivots: language,
      contentTypeEnum:
        assetTypeObject[assetType.contentType] ||
        assetTypeObject[ContentType.PROGRAM],
    };
  };
  let assetData: AssetData = updateAssetData();

  const getSimilarItemsForFeed = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${assetData.pivots}&id=${id}&itemType=${assetData.contentTypeEnum}`;
    const udlParam = "udl://subscriber/similarprograms/" + params;
    const data = await getDataFromUDL(udlParam);
    setSimilarData(data.data);
    return data;
  };

  const renderFavoriteButton = () => {
    return (
      <View style={[styles.buttonContainerStyle, { backgroundColor: "red" }]}>
        <MFButton
          textLabel="Favorite button"
          variant={MFButtonVariant.Icon}
          iconSource={AppImages.placeholder}
          iconStyles={{ height: 70, width: 70 }}
          style={[styles.buttonIconContainer, styles.solidBackground]}
          focusedStyle={styles.focusedBackground}
          imageSource={0}
          avatarSource={undefined}
          iconButtonStyles={{
            shouldRenderImage: true,
          }}
        />
      </View>
    );
  };

  const getDiscoverySchedules = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?$top=${assetData.$top}&$skip=${assetData.$skip}&storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${assetData.pivots}&id=${id}&itemType=${assetData.contentTypeEnum}&lang="en-US"`;
    const udlParam = "udl://discovery/programSchedules/" + params;
    const data = await getDataFromUDL(udlParam);
    setdiscoverySchedulesData(data.data);
    return data;
  };

  const getDiscoveryProgramData = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?storeId=${DefaultStore.Id}&$groups=${GLOBALS.store.rightsGroupIds}&pivots=${assetData.pivots}&id=${id}`;
    const udlParam = "udl://discovery/programs/" + params;
    const data = await getDataFromUDL(udlParam);
    const massagedData = massageDiscoveryFeedAsset(
      data.data,
      assetTypeObject[assetData.contentTypeEnum]
    );
    setdiscoveryProgramData(massagedData);
    return massagedData;
  };

  const getPlayActions = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?catchup=false&storeId=${DefaultStore.Id}&groups=${GLOBALS.store.rightsGroupIds}&id=${id}`;
    const udlParam = "udl://subscriber/programplayactions/" + params;
    const data = await getDataFromUDL(udlParam);
    setplayActionsData(data.data);
    return data;
  };

  const getProgramSubscriberData = async (assetData: AssetData) => {
    if (!assetData) {
      console.log("No asset data to make api call..");
      return undefined;
    }
    const id = getItemId(feed);
    const params = `?storeId=${DefaultStore.Id}&id=${id}`;
    const udlParam = "udl://subscriber/getProgramSubscriberData/" + params;
    const data = await getDataFromUDL(udlParam);
    setsubscriberData(data.data);
    return data;
  };

  const getUDPData = async () => {
    if (
      !similarDataQuery.data &&
      !discoveryProgramDataQuery.data &&
      !discoverySchedulesQuery.data &&
      !playActionsQuery.data &&
      !subscriberDataQuery.data
    ) {
      console.warn("Data has not been initialised");
      return undefined;
    }
    const assetType =
      //@ts-ignore
      assetTypeObject[feed?.assetType?.contentType] ||
      assetTypeObject[ContentType.PROGRAM];

    const udpData = massageProgramDataForUDP(
      playActionsData,
      subscriberData,
      discoveryProgramData,
      undefined,
      discoverySchedulesData,
      undefined,
      undefined,
      undefined,
      subscriberData,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    console.log("UDP data", udpData);
    setUDPDataAsset(udpData);
    return udpData;
  };

  const getGenreText = (genres?: Genre[]) =>
    genres &&
    genres.map(
      (genre, index) =>
        `${genre.Name}${index === genres.length - 1 ? "" : metadataSeparator}`
    );

  const similarDataQuery = useQuery(
    ["get-similarItems", assetData?.id],
    () => getSimilarItemsForFeed(assetData),
    defaultQueryOptions
  );

  const discoveryProgramDataQuery = useQuery(
    ["get-program-data", assetData?.id],
    () => getDiscoveryProgramData(assetData),
    defaultQueryOptions
  );

  const discoverySchedulesQuery = useQuery(
    ["get-discoveryschedules", assetData?.id],
    () => getDiscoverySchedules(assetData),
    defaultQueryOptions
  );

  const playActionsQuery = useQuery(
    ["get-playActiosn", assetData?.id],
    () => getPlayActions(assetData),
    defaultQueryOptions
  );

  const subscriberDataQuery = useQuery(
    ["get-subscriber-data", assetData?.id],
    () => getProgramSubscriberData(assetData),
    defaultQueryOptions
  );

  const udpDataQuery = useQuery(
    ["get-UDP-data", assetData?.id],
    () => getUDPData(),
    {
      enabled:
        !!similarData &&
        !!discoveryProgramData &&
        !!discoverySchedulesData &&
        !!discoverySchedulesQuery.data &&
        !!playActionsData &&
        !!subscriberData,
    }
  );

  const renderCTAButtonGroup = () => {
    const { visible, panelName } = sidePanelState;
    const focusable = !(visible && panelName);
    console.log("rendering CTA");
    return (
      <View style={[styles.buttonContainer]}>
        <ScrollView horizontal>
          {udpDataAsset.ctaButtons?.length &&
            udpDataAsset.ctaButtons?.map((cta: any, index: number) => {
              let fontIconStyle: { [key: string]: any };

              if (
                cta?.buttonAction ===
                  AppStrings.str_details_program_record_button ||
                cta?.buttonAction ===
                  AppStrings?.str_details_series_record_button
              ) {
                fontIconStyle = styles.ctaFontIconStyle;
              }

              return (
                <MFButton
                  key={`ctaBtn_${cta.buttonText}_${index}`}
                  iconSource={0}
                  imageSource={0}
                  avatarSource={undefined}
                  variant={MFButtonVariant.Icon}
                  textLabel={cta.buttonText}
                  iconStyles={fontIconStyle!}
                  style={styles.ctaButtonStyle}
                  iconButtonStyles={{
                    shouldRenderImage: true,
                    placeholderStyles: fontIconStyle!,
                  }}
                />
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const renderShowcard = () => {
    const { image2x3PosterURL = undefined, image2x3KeyArtURL = undefined } =
      udpDataAsset || {};
    const imageSource =
      image2x3KeyArtURL || image2x3PosterURL || AppImages.placeholder;
    return (
      <View style={styles.firstColumn}>
        <View style={styles.imageContainer}>
          <ImageBackground source={imageSource} style={styles.showcardImage} />
        </View>
        <View style={styles.favoriteBlock}>{renderFavoriteButton()}</View>
      </View>
    );
  };
  const renderMetadata = () => {
    const {
      durationMinutesString = undefined,
      seasonsCount = undefined,
      genre = undefined,
      ReleaseYear = undefined,
      Rating = undefined,
    } = udpDataAsset || {};
    const genereText = getGenreText(genre)?.join("");
    const metadataArray = [
      durationMinutesString,
      seasonsCount,
      genereText,
      ReleaseYear,
      Rating,
    ];
    const metadataLine = metadataArray.filter(Boolean).join(metadataSeparator);

    return (
      <View style={styles.metadataContainer}>
        <Text style={styles.metadataLine1}>{metadataLine}</Text>
      </View>
    );
  };

  const renderEpisodeDetails = () => {
    const {
      ChannelInfo: { Schedule = undefined } = {},
      playDvr = undefined,
      Bookmark = undefined,
      assetType: { sourceType = undefined } = {},
      subscriptionItemForProgram: { ProgramDetails = undefined } = {},
      currentCatchupSchedule = undefined,
      ppvInfo = undefined,
      SourceIndicators = undefined,
    } = udpDataAsset || {};

    const isLiveAsset = SourceIndicators
      ? Object.keys(SourceIndicators).includes("IsLive")
      : false;

    const {
      hasPPV = false,
      isPPVWatchable = false,
      currentSelectedSchedule = undefined,
    } = ppvInfo || {};

    if (
      !hasPPV &&
      ((!currentCatchupSchedule &&
        !Schedule &&
        !playDvr &&
        !props.seriesSubscriberData?.PriorityEpisodeTitle) ||
        (Bookmark && Schedule?.playSource !== sourceTypeString.UPCOMING))
    ) {
      return;
    }

    let episodeNumber;
    let seasonNumber;
    let episodeName;
    let name;
    let startUtc;
    let endUtc;
    let CatchupStartUtc;
    let CatchupEndUtc;
    let parsedStartTime;
    let parsedEndTime;
    let startEpoc;
    let endEpoc;
    let progressDataSource = {
      RuntimeSeconds: 0,
      TimeSeconds: 0,
      BookmarkType: "",
      Id: "",
      ProgramId: "",
    };
    let isLive = false;
    let showLiveBadge = true;
    let programId;

    const {
      Schedule: dataSchedule = undefined,
      assetType = undefined,
      Bookmark: dataBookmark = props.subscriberPlayOptionsData?.Bookmark ||
        undefined,
      CatalogInfo = undefined,
      isFromEPG = false,
      ItemType = "",
    } = props.navigation.params.data || {};

    if (Schedule || dataSchedule || currentCatchupSchedule) {
      if (isFromEPG && assetType?.sourceType === sourceTypeString.CATCHUP) {
        ({
          EpisodeNumber: episodeNumber,
          SeasonNumber: seasonNumber,
          EpisodeName: episodeName,
          Name: name,
          StartUtc: startUtc,
          EndUtc: endUtc,
          ProgramId: programId,
          CatchupStartUtc: CatchupStartUtc,
          CatchupEndUtc: CatchupEndUtc,
        } = currentCatchupSchedule?.Schedule || currentCatchupSchedule || {});
      } else if (assetType?.sourceType === sourceTypeString.UPCOMING) {
        ({
          episode: episodeNumber,
          season: seasonNumber,
          episodeTitle: episodeName,
          title: name,
          StartUtc: startUtc,
          EndUtc: endUtc,
          ProgramId: programId,
          CatchupStartUtc: CatchupStartUtc,
          CatchupEndUtc: CatchupEndUtc,
        } = Schedule || dataSchedule || currentCatchupSchedule || {});
      } else {
        ({
          EpisodeNumber: episodeNumber,
          SeasonNumber: seasonNumber,
          EpisodeName: episodeName,
          Name: name,
          StartUtc: startUtc,
          EndUtc: endUtc,
          ProgramId: programId,
          CatchupStartUtc: CatchupStartUtc,
          CatchupEndUtc: CatchupEndUtc,
        } = Schedule || dataSchedule || currentCatchupSchedule || {});
      }

      let convertedStartDate =
        (startUtc && new Date(startUtc)) ||
        (CatchupStartUtc && new Date(CatchupStartUtc));
      let convertedEndDate =
        (endUtc && new Date(endUtc)) ||
        (CatchupEndUtc && new Date(CatchupEndUtc));
      startEpoc = Date.parse(startUtc || CatchupStartUtc);
      endEpoc = Date.parse(endUtc || CatchupEndUtc);

      parsedStartTime = convertedStartDate && DateToAMPM(convertedStartDate);
      parsedEndTime = convertedEndDate && DateToAMPM(convertedEndDate);

      progressDataSource.BookmarkType = sourceTypeString.LIVE as BookmarkType;
      if (startEpoc && endEpoc) {
        progressDataSource.RuntimeSeconds = endEpoc - startEpoc;

        if (sourceType !== sourceTypeString.CATCHUP) {
          progressDataSource.TimeSeconds = new Date().getTime() - startEpoc;
        }
      }
      isLive = true;
      const now = new Date();
      if (sourceType === sourceTypeString.DVR) {
        if (convertedEndDate < now || convertedStartDate > now) {
          showLiveBadge = false;
        }
      } else if (
        sourceType === sourceTypeString.CATCHUP &&
        props.subscriberPlayOptionsData?.Bookmark
      ) {
        if (convertedEndDate < now || convertedStartDate > now) {
          showLiveBadge = false;
        }
        progressDataSource = props.subscriberPlayOptionsData?.Bookmark;
      } else {
        showLiveBadge = sourceType === sourceTypeString.LIVE || isLiveAsset;
      }
    } else if (props.seriesSubscriberData) {
      if (assetType?.contentType === ContentType.EPISODE) {
        if (CatalogInfo) {
          ({
            EpisodeNumber: episodeNumber,
            SeasonNumber: seasonNumber,
            EpisodeName: episodeName,
            Name: name,
            StartUtc: startUtc,
            EndUtc: endUtc,
            ProgramId: programId,
          } = CatalogInfo);
        }

        progressDataSource.BookmarkType = sourceTypeString.VOD as BookmarkType;
        if (dataBookmark) {
          const { RuntimeSeconds, TimeSeconds } = dataBookmark;
          progressDataSource.RuntimeSeconds = RuntimeSeconds || 0;
          progressDataSource.TimeSeconds = TimeSeconds || 0;
        }
      } else {
        const { PriorityEpisodeTitle } = props.seriesSubscriberData;

        if (PriorityEpisodeTitle) {
          const { CatalogInfo = {} } = PriorityEpisodeTitle || {};
          ({
            EpisodeNumber: episodeNumber = undefined,
            SeasonNumber: seasonNumber = undefined,
            EpisodeName: episodeName = undefined,
            Name: name = undefined,
            StartUtc: startUtc = undefined,
            EndUtc: endUtc = undefined,
            ProgramId: programId = undefined,
          } = CatalogInfo || {});

          if (PriorityEpisodeTitle?.Bookmark) {
            progressDataSource = PriorityEpisodeTitle?.Bookmark;
          } else {
            progressDataSource.BookmarkType =
              sourceTypeString.VOD as BookmarkType;
            progressDataSource.RuntimeSeconds = CatalogInfo.RuntimeSeconds || 0;
            progressDataSource.TimeSeconds =
              props.episodeBookmarkData?.TimeSeconds || 0;
          }
        }
      }
    }

    contextualSchedule = programId;

    // DVR Details
    if (playDvr && ProgramDetails) {
      seasonNumber = ProgramDetails?.SeasonNumber;
      episodeNumber = ProgramDetails?.EpisodeNumber;
      episodeName = ProgramDetails?.EpisodeTitle;
    }

    const metadata = [];
    if (seasonNumber || episodeNumber) {
      metadata.push(
        getEpisodeInfo({
          SeasonNumber: seasonNumber,
          EpisodeNumber: episodeNumber,
        })
      );
    }
    if (episodeName || name) {
      metadata.push(episodeName || name);
    }

    // PPV

    if (hasPPV) {
      //TODO: Fix this mess.. Understand what's going on..
      // const isFromLibrary =
      //   props.navigation?.params?.data?.libraryId === "Library";
      const isFromLibrary = false;
      const { StartUtc, EndUtc, ChannelNumber } = currentSelectedSchedule;
      isLive = isPPVWatchable;
      metadata.push(`Airs on ${ChannelNumber}`);
      if (!isFromLibrary) {
        startUtc = StartUtc;
        endUtc = EndUtc;
        let convertedStartDate = startUtc && new Date(startUtc);
        let convertedEndDate = endUtc && new Date(endUtc);
        parsedStartTime = convertedStartDate && DateToAMPM(convertedStartDate);
        parsedEndTime = convertedEndDate && DateToAMPM(convertedEndDate);
      }
      showLiveBadge = isLive;
    }
    // PPV

    return (
      <View style={styles.episodeBlockContainer}>
        <View style={styles.flexRow}>
          <Text style={styles.episodeBlockTitle}>
            {metadata.join(metadataSeparator)}
          </Text>
        </View>
        {(!!isLive || !!hasPPV) && !!parsedStartTime && (
          <View style={styles.flexRow}>
            <Text style={styles.episodeMetadata}>
              {startUtc && massagePreviousDate(startUtc, hasPPV)}
              {metadataSeparator}
              {parsedStartTime} - {parsedEndTime}
            </Text>

            {!!showLiveBadge && (
              <View>
                <Text style={styles.badgeStyle}>{liveIcon}</Text>
              </View>
            )}
          </View>
        )}
        {!!progressDataSource && (
          <ProgressBar
            styles={{
              progressBarContainer: [
                styles.progressBarContainer,
                { marginTop: 0 },
              ],
            }}
            dataSource={progressDataSource}
            progressInfo={""}
          />
        )}
      </View>
    );
  };

  const renderIndicators = () => {
    let {
      locale,
      statusText,
      combinedQualityLevels,
      combinedAudioIndicator,
      combinedAudioTags,
    } = udpDataAsset;
    const langaugeIndicator = locale?.split("-")[0];
    const qualityLevel = combinedQualityLevels && combinedQualityLevels[0];
    const audioTags =
      (combinedAudioIndicator?.length && combinedAudioIndicator) ||
      (combinedAudioTags?.length && combinedAudioTags) ||
      [];
    const statusTextItem = (statusText?.length && statusText[0]) || "";

    // Schedules
    return (
      <View>
        <View style={styles.flexRow}>
          {/* Quality Indicators */}
          {!!qualityLevel && (
            <Text style={styles.fontIconStyle}>
              {getFontIcon((fontIconsObject as any)[qualityLevel])}
            </Text>
          )}

          {/* Language Indicators */}
          {!!langaugeIndicator && (
            <Text style={styles.fontIconStyle}>
              {getFontIcon((fontIconsObject as any)[langaugeIndicator])}
            </Text>
          )}

          {/* Audio Indicator */}

          {audioTags?.map((audioIndicator: any) => {
            return (
              <Text style={styles.fontIconStyle} key={audioIndicator}>
                {getFontIcon((fontIconsObject as any)[audioIndicator])}
              </Text>
            );
          })}
        </View>
        <Text style={styles.statusTextStyle}>{statusTextItem}</Text>
      </View>
    );
  };

  const renderAssetInfo = () => {
    const { title, description, ratingValues, subscriptionItemForProgram } =
      udpDataAsset;
    const shouldShowExpiringIcon: boolean = isExpiringSoon(
      subscriptionItemForProgram
    );
    return (
      <View style={styles.secondColumn}>
        <View style={{ flexDirection: "row" }}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          {shouldShowExpiringIcon ? (
            <FastImage
              source={AppImages.placeholder}
              style={styles.hourGlass}
            ></FastImage>
          ) : null}
        </View>

        {/* Metadata */}
        {renderMetadata()}

        {/* Quality, Language, Audio, Dolby Indicator */}
        {renderIndicators()}
        {description ? (
          <MFText
            shouldRenderText
            displayText={description}
            textStyle={styles.descriptionText}
            adjustsFontSizeToFit={false}
            numberOfLines={5}
          />
        ) : null}
        {/* Content Ratings */}
        {ratingValues && ratingValues?.length > 0 && renderRatingValues()}
        {/* Progress bar */}
        {renderEpisodeDetails()}
      </View>
    );
  };

  const renderRatingValues = () => {
    //@ts-ignore
    const [first, second] = feed!.ratingValues || [];
    return (
      <View style={styles.contentRatingsContainer}>
        {first && (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingsIcon}
              source={{
                uri: first.Image,
              }}
            />
            <Text
              style={[styles.metadataLine1, styles.contentRatingText]}
            >{`${first.Score}%`}</Text>
          </View>
        )}
        {second && (
          <View style={styles.ratingBlock}>
            <FastImage
              style={styles.contentRatingsIcon}
              source={{
                uri: second.Image,
              }}
            />

            <Text
              style={[styles.metadataLine1, styles.contentRatingText]}
            >{`${second.Score}%`}</Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <PageContainer type="FullPage">
      <ImageBackground
        source={AppImages.landing_background}
        style={styles.flexOne}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <View style={styles.containerOpacity}>
          <ScrollView key={`detailspagekey`} ref={onGetScrollView}>
            {udpDataQuery.data ? (
              <View style={styles.detailsBlock}>
                {renderShowcard()}

                <View style={styles.secondBlock}>
                  <View style={styles.flexRow}>
                    {/* Metadata and CTA */}
                    {renderAssetInfo()}

                    {/* Network Logo */}
                  </View>

                  <View style={styles.ctaButtonGroupBlock}>
                    {/* CTA */}
                    {renderCTAButtonGroup()}
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MFLoader />
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </PageContainer>
  );
};

const styles = StyleSheet.create(
  getUIdef("Details.Showcard")?.style ||
    scaleAttributes({
      detailsBlock: {
        height: 852,
        flexDirection: "row",
      },
      secondBlock: {
        marginTop: 86,
        flexDirection: "column",
        flex: 1,
        height: 627,
      },
      flexRow: {
        flexDirection: "row",
      },
      ctaBlock: {
        flexDirection: "row",
      },
      favoriteBlock: {
        width: 583,
        marginTop: 69,
      },
      ctaButtonGroupBlock: {
        marginTop: 69,
      },
      containerOpacity: {
        backgroundColor: g.backgroundColors.shade1,
        opacity: 0.9,
      },
      firstColumn: {
        width: 583,
        alignItems: "center",
      },
      imageContainer: {
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 86,
        height: 627,
      },
      secondColumn: {
        width: 905,
        height: 627,
        justifyContent: "center",
      },
      thirdColumn: {
        flex: 1,
        paddingRight: 90,
        alignItems: "flex-end",
      },
      networkImageView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: g.backgroundColors.shade3,
        borderRadius: 3,
        height: 111,
        width: 111,
        padding: 25,
        marginBottom: 15,
      },
      networkImage: {
        height: 63,
        width: 85,
        resizeMode: "contain",
      },
      marginRight20: {
        marginRight: 20,
      },
      networkTitle: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body1,
        color: g.fontColors.darkGrey,
      },
      metadataContainer: {
        flexDirection: "row",
        paddingBottom: 23,
      },
      title: {
        fontFamily: g.fontFamily.bold,
        fontSize: g.fontSizes.heading2,
        color: g.fontColors.light,
        paddingBottom: 10,
      },
      hourGlass: {
        width: 16,
        height: 22,
        marginTop: 26,
        marginLeft: 15,
      },
      metadataLine1: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        marginBottom: 25,
      },
      description: {
        fontFamily: g.fontFamily.regular,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        lineHeight: g.lineHeights.body2,
      },
      showcardImage: {
        height: 628,
        width: 419,
      },
      buttonContainerStyle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonIconContainer: {
        borderRadius: 35,
        width: 70,
        height: 70,
        overflow: "hidden",
        backgroundColor: g.backgroundColors.shade4,
      },
      solidBackground: {
        backgroundColor: g.backgroundColors.shade4,
      },
      moreDetailsContainer: {
        marginTop: 104,
      },
      contentRatingsContainer: {
        flexDirection: "row",
        marginBottom: 25,
      },
      contentRatingsIcon: {
        width: 30,
        height: 30,
      },
      contentRatingText: {
        marginLeft: 10,
      },
      ratingBlock: {
        marginRight: 30,
        flexDirection: "row",
      },
      textStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.light,
      },
      progressBarContainer: {
        height: 3,
      },
      progressInfoText: {
        fontFamily: g.fontFamily.semiBold,
        fontSize: g.fontSizes.body2,
        color: g.fontColors.lightGrey,
        paddingBottom: 30,
        lineHeight: g.lineHeights.body2,
        marginBottom: 20,
      },
      statusTextStyle: {
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.regular,
        color: g.fontColors.statusWarning,
        marginBottom: 25,
      },
      fontIconStyle: {
        fontFamily: g.fontFamily.icons,
        fontSize: 70,
        color: g.fontColors.lightGrey,
        marginRight: 15,
        marginTop: -40,
        marginBottom: 10,
      },
      flexOne: {
        flex: 1,
      },
      ctaButtonStyle: {
        height: 66,
        fontFamily: g.fontFamily.semiBold,
      },
      ctaFontIconStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.statusError,
      },
      buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 40,
      },
      modalContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
      },
      episodeBlockContainer: {
        marginTop: 35.5,
      },
      episodeBlockTitle: {
        marginBottom: 20,
        fontSize: g.fontSizes.body1,
        fontFamily: g.fontFamily.bold,
        color: g.fontColors.light,
      },
      episodeMetadata: {
        marginBottom: 20,
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.semiBold,
        color: g.fontColors.lightGrey,
      },
      badgeStyle: {
        fontFamily: g.fontFamily.icons,
        color: g.fontColors.badge,
        fontSize: 50,
        marginLeft: 20,
        marginTop: -10,
      },
      marginTop: {
        marginTop: 8,
      },
      descriptionText: {
        fontSize: g.fontSizes.body2,
        fontFamily: g.fontFamily.regular,
        color: g.fontColors.lightGrey,
        lineHeight: g.lineHeights.body2,
        marginBottom: 25,
      },
    })
);

export default DetailsScreen;
