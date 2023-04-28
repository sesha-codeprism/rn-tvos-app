import { ContentType, playBackMode, sourceTypeString } from "../../utils/analytics/consts";
import { findChannelByStationId, getRestrictionsForVod } from "../../utils/assetUtils";
import { GLOBALS } from "../../utils/globals";
import { config } from "../../config/config";
import { AppStrings } from "../../config/strings";
import { Routes } from "../../config/navigation/RouterOutlet";

export const getRenderImageURI = (renderType: any, data: any) => {
    switch (renderType) {
      case "16x9":
        //* : Return the !undefined 16x9 image or undefined otherwise */
        if (data.image16x9KeyArtURL) {
          return data.image16x9KeyArtURL.uri;
        } else if (data.image16x9PosterURL) {
          return data.image16x9PosterURL.uri;
        } else {
          return undefined;
        }
      case "2x3":
        //* : Return the !undefined 2x3 image or undefined otherwise */
        if (data.image2x3KeyArtURL) {
          return data.image2x3KeyArtURL.uri;
        } else if (data.image2x3PosterURL) {
          return data.image2x3PosterURL.uri;
        } else {
          return undefined;
        }
      case "3x4":
        //* : Return the !undefined 3x4 image or undefined otherwise */
        //@ts-ignore
        if (data.image3x4PosterURL) {
          //@ts-ignore
          return data.image3x4PosterURL.uri;
          //@ts-ignore
        } else if (data.image3x4KeyArtURL) {
          //@ts-ignore
          return data.image3x4KeyArtURL.uri;
        } else {
          return undefined;
        }
      default:
        return undefined;
    }
  };

export const navigateToPlayer = (params: any, navigation: any) => {
    const { udpDataAsset, bookmark, subscriberPlayOptionsData } = params || {};
    const {
        ChannelInfo: { Schedule = undefined } = {},
        playDvr = undefined,
        assetType: { sourceType = undefined } = {},
        subscriptionItemForProgram: { ProgramDetails = undefined } = {},
        currentCatchupSchedule = undefined,
        ppvInfo = undefined,
        SourceIndicators = undefined,
        IsVOD,
        playSource
    } = udpDataAsset || {};

    let { Bookmark = undefined } = udpDataAsset || {};
    console.log('*********************** navigateToPlayer **************************');
    ({ Bookmark } = subscriberPlayOptionsData || {});

    if (
        sourceType === sourceTypeString.VOD ||
        sourceType === "PACKAGE" ||
        (IsVOD && !playSource)
    ) {
        if (
            !Bookmark
        ) {
            const { Id } = udpDataAsset || {};
            Bookmark = {
                Id,
                TimeSeconds: 0,
            };
            udpDataAsset.Bookmark = Bookmark;
            udpDataAsset.Bookmark.BookmarkType = "Video";
        } else if (
            !udpDataAsset.Bookmark &&
            udpDataAsset?.assetType?.contentType === ContentType.SERIES &&
            udpDataAsset.Id
        ) {
            Bookmark = {
                Id: udpDataAsset.Id,
                TimeSeconds: 0,
            };
            udpDataAsset.Bookmark = Bookmark;
            udpDataAsset.Bookmark.BookmarkType = "Video";
        }

        openPlayer(udpDataAsset, bookmark, navigation);
    } else {
        const {
            isFromEPG = false,
            playSource = "",
            Schedule = undefined,
            channel = undefined,
        } = udpDataAsset || {};

        if (isFromEPG && playSource === "LIVE") {
            // fetch channnel and service
            const channelFromEPG = findChannelByStationId(
                Schedule?.channelId,
                undefined,
                undefined,
                GLOBALS.channelMap
            );

            const service = GLOBALS.channelMap.getService(
                channelFromEPG.channel
            );
            const playObj = {
                ...udpDataAsset,
                ChannelInfo: {
                    ...udpDataAsset.ChannelInfo,
                    Schedule: Schedule,
                    Channel: channel,
                    Service: service,
                },
            };
            openPlayer(playObj, bookmark, navigation);
        } else {
            if (udpDataAsset && !udpDataAsset.Bookmark) {
                udpDataAsset.Bookmark = Bookmark || bookmark || {TimeSeconds:0};
            }
            openPlayer(udpDataAsset, bookmark, navigation);
        }
    }
}

const  getEntitlements = (data: any) => {
    const {
        ChannelInfo = {},
        playAction = undefined,
        playSource,
        currentCatchupSchedule = {},
        combinedEntitlements = [],
        isTrailer,
        ppvInfo,
        vodEntitlements = [],
    } = data;

    if (playSource === sourceTypeString.LIVE)
        return ChannelInfo.Schedule?.Entitlements;
    else if (playSource === sourceTypeString.CATCHUP)
        return (
            currentCatchupSchedule.Schedule?.Entitlements ||
            combinedEntitlements
        );
    else if (playSource === sourceTypeString.VOD)
        if (isTrailer) {
            if (ppvInfo.hasPPV) {
                return ppvInfo.Entitlement;
            } else {
                return playAction.Restrictions;
            }
        } else {
            return vodEntitlements || []; //Assuming VOD and DVR playback doesn't allow any Entitlements and user can do any Trickplay.
            //TODO: To separate all Entitlements into its own object instead of combinedEntitlements.
        }
    else return combinedEntitlements;
};

const openPlayer =  (udpDataAsset: any, bookmark: any, navigation: any) => {
    const {
            title = undefined,
            ChannelInfo = {},
            currentCatchupSchedule = {},
            Bookmark = {},
            subscriptionItemForProgram: { PlayInfo = undefined } = {},
            ProgramDetails = {},
            playAction = undefined,
            usablePlayActions = undefined,
            playSource,
            restart = undefined,
            catchupPlayinfo = {},
            isTrailer = false,
            ppvInfo = {}
    } = udpDataAsset;

    let Service: any;

    const combinedEntitlementsObj: any =  {};
    const combinedEntitlements = getEntitlements(udpDataAsset);
    if (combinedEntitlements) {
        for (let entitle of combinedEntitlements) {
            combinedEntitlementsObj[entitle] = true;
        }
    }

    let dataSource =
        ChannelInfo?.Service?.DataSource ||
        currentCatchupSchedule?.Service?.DataSource;

    ppvInfo.hasPPV
        ? ppvInfo.currentSelectedSchedule?.Service?.DataSource
        : undefined;

    if (ppvInfo.hasPPV && ppvInfo.currentSelectedSchedule) {
        ({ Service = {} } = ppvInfo.currentSelectedSchedule);
        if (Service && Service.DataSource) {
            dataSource = Service.DataSource;
        }
    }

    let bookmarkPosition = Bookmark?.TimeSeconds;
    const serverURL = GLOBALS.bootstrapSelectors?.ServiceMap.Services.defaultAccHostName;
    const userToken = GLOBALS.bootstrapSelectors?.UserId;
    const primaryAccount = GLOBALS.bootstrapSelectors?.AccountId;
    const stsToken = GLOBALS.store?.accessToken;

    let ownerUID = dataSource?.ownerId;
    let mediaUID = dataSource?.mediaId;
    let appToken =
        dataSource?.appToken ||
        ChannelInfo?.Channel?.ServiceCollectionId;

    let mode =  playBackMode[sourceTypeString.VOD];
    let startTime;
    let videoURI = "";
    const dvrPlayInfo = PlayInfo || udpDataAsset?.PlayInfo;

    if (restart) {
        bookmarkPosition = 0;
    }

    if (
        (playSource === sourceTypeString.LIVE || ppvInfo.hasPPV) &&
        dataSource
    ) {
        mode = playBackMode[sourceTypeString.LIVE];

        navigation.navigate(Routes.Video, {

              server_url: serverURL,
              live: true,
              stsToken: stsToken,
              tenantId: GLOBALS.bootstrapSelectors?.TenantId,
              locale: GLOBALS.store?.settings.display?.onScreenLanguage?.languageCode,
              ownerUID: ownerUID || config?.playerConfig?.owner_uid,
              bookmarkPosition: bookmarkPosition,
              userToken: userToken,
              mediaUID: mediaUID,
              appToken: appToken,
              primaryAccount: primaryAccount,
              subtitleTrack: GLOBALS.store!.settings.display.subtitleConfig.primary || GLOBALS.store!.settings.display.subtitleConfig.secondary,
              ccEnabled: GLOBALS.store!.settings.display.closedCaption,
              audioTrack: GLOBALS.store!.settings.audio.audioLanguages.primary || GLOBALS.store!.settings.audio.audioLanguages.secondary,
              maxBitrate:  GLOBALS.store!.settings.display.bitrates10ft,
              catalogInfo: udpDataAsset,
              schedule: ChannelInfo?.Schedule?.ChannelInfo?.Schedule || ChannelInfo?.Schedule
            
          });
    } else if (
        playSource === sourceTypeString.CATCHUP &&
        currentCatchupSchedule
    ) {
        startTime =
            currentCatchupSchedule?.Schedule?.StartUtc ||
            currentCatchupSchedule?.StartUtc;

        if (bookmark && bookmark.CATCHUP_Bookmark) {
            bookmarkPosition = bookmark.CATCHUP_Bookmark?.TimeSeconds;
        } else {
            bookmarkPosition = 0;
        }

        if (GLOBALS.bootstrapSelectors?.CatchupMode === "Dvr") {
            if (catchupPlayinfo && Object.keys(catchupPlayinfo).length) {
                ownerUID = catchupPlayinfo.OwnerId;
                mediaUID = catchupPlayinfo.MediaId;
                appToken = catchupPlayinfo.RecordingToken;
                navigation.navigate(Routes.Video, {
                     
                      server_url: serverURL,
                      live: false,
                      stsToken: stsToken,
                      tenantId: GLOBALS.bootstrapSelectors?.TenantId,
                      locale: GLOBALS.store?.settings.display?.onScreenLanguage?.languageCode,
                      ownerUID: ownerUID || config?.playerConfig?.owner_uid,
                      bookmarkPosition: bookmarkPosition,
                      userToken: userToken,
                      mediaUID: mediaUID,
                      appToken: appToken,
                      primaryAccount: primaryAccount,
                      subtitleTrack: GLOBALS.store!.settings.display.subtitleConfig.primary || GLOBALS.store!.settings.display.subtitleConfig.secondary,
                      ccEnabled: GLOBALS.store!.settings.display.closedCaption,
                      audioTrack: GLOBALS.store!.settings.audio.audioLanguages.primary || GLOBALS.store!.settings.audio.audioLanguages.secondary,
                      maxBitrate:  GLOBALS.store!.settings.display.bitrates10ft,
                      catalogInfo: udpDataAsset,
                      schedule: ChannelInfo?.Schedule?.ChannelInfo?.Schedule || ChannelInfo?.Schedule
                    
                  });
            } else {
                throw Error(AppStrings
                    ?.str_playback_error_unavailable_restart_tv_info);
            }
        } else {
            navigation.navigate(Routes.Video, {
 
                  server_url: serverURL,
                  live: false,
                  stsToken: stsToken,
                  tenantId: GLOBALS.bootstrapSelectors?.TenantId,
                  locale: GLOBALS.store?.settings.display?.onScreenLanguage?.languageCode,
                  ownerUID: ownerUID || config?.playerConfig?.owner_uid,
                  bookmarkPosition: bookmarkPosition,
                  userToken: userToken,
                  mediaUID: mediaUID,
                  appToken: appToken,
                  primaryAccount: primaryAccount,
                  subtitleTrack: GLOBALS.store!.settings.display.subtitleConfig.primary || GLOBALS.store!.settings.display.subtitleConfig.secondary,
                  ccEnabled: GLOBALS.store!.settings.display.closedCaption,
                  audioTrack: GLOBALS.store!.settings.audio.audioLanguages.primary || GLOBALS.store!.settings.audio.audioLanguages.secondary,
                  maxBitrate:  GLOBALS.store!.settings.display.bitrates10ft,
                  catalogInfo: udpDataAsset,
                  schedule: ChannelInfo?.Schedule?.ChannelInfo?.Schedule || ChannelInfo?.Schedule
              });
        }
    } else if (playSource === sourceTypeString.DVR && dvrPlayInfo) {
        // DVR Play back
        const playInfoObject =
            (dvrPlayInfo.length > 0 && dvrPlayInfo[0]) || {};
        mediaUID = playInfoObject.MediaId;
        mode = playBackMode[sourceTypeString.VOD];
        appToken = playInfoObject.RecordingToken;
        ownerUID = config.playerConfig.owner_uid;
        if (bookmark && bookmark.DVR_Bookmark) {
            if (
                bookmark.DVR_Bookmark?.RuntimeSeconds ===
                bookmark.DVR_Bookmark?.TimeSeconds
            ) {
                bookmarkPosition = 0;
            } else {
                bookmarkPosition = bookmark.DVR_Bookmark?.TimeSeconds;
            }
        } else {
            bookmarkPosition = 0;
        }

        navigation.navigate(Routes.Video, {
 
              server_url: serverURL,
              live: false,
              stsToken: stsToken,
              tenantId: GLOBALS.bootstrapSelectors?.TenantId,
              locale: GLOBALS.store?.settings.display?.onScreenLanguage?.languageCode,
              ownerUID: ownerUID || config?.playerConfig?.owner_uid,
              bookmarkPosition: bookmarkPosition,
              userToken: userToken,
              mediaUID: mediaUID,
              appToken: appToken,
              primaryAccount: primaryAccount,
              subtitleTrack: GLOBALS.store!.settings.display.subtitleConfig.primary || GLOBALS.store!.settings.display.subtitleConfig.secondary,
              ccEnabled: GLOBALS.store!.settings.display.closedCaption,
              audioTrack: GLOBALS.store!.settings.audio.audioLanguages.primary || GLOBALS.store!.settings.audio.audioLanguages.secondary,
              maxBitrate:  GLOBALS.store!.settings.display.bitrates10ft,
              catalogInfo: udpDataAsset,
              schedule: ChannelInfo?.Schedule?.ChannelInfo?.Schedule || ChannelInfo?.Schedule
          });
    } else if (playSource === sourceTypeString.DVR && dataSource) {
        if (bookmark.DVR_Bookmark) {
            if (
                bookmark.DVR_Bookmark?.RuntimeSeconds ===
                bookmark.DVR_Bookmark?.TimeSeconds
            ) {
                bookmarkPosition = 0;
            } else {
                bookmarkPosition = bookmark.DVR_Bookmark?.TimeSeconds;
            }
        } else {
            bookmarkPosition = 0;
        }
        navigation.navigate(Routes.Video, {

              server_url: serverURL,
              live: true,
              stsToken: stsToken,
              tenantId: GLOBALS.bootstrapSelectors?.TenantId,
              locale: GLOBALS.store?.settings.display?.onScreenLanguage?.languageCode,
              ownerUID: ownerUID || config?.playerConfig?.owner_uid,
              bookmarkPosition: bookmarkPosition,
              userToken: userToken,
              mediaUID: mediaUID,
              appToken: appToken,
              primaryAccount: primaryAccount,
              subtitleTrack: GLOBALS.store!.settings.display.subtitleConfig.primary || GLOBALS.store!.settings.display.subtitleConfig.secondary,
              ccEnabled: GLOBALS.store!.settings.display.closedCaption,
              audioTrack: GLOBALS.store!.settings.audio.audioLanguages.primary || GLOBALS.store!.settings.audio.audioLanguages.secondary,
              maxBitrate:  GLOBALS.store!.settings.display.bitrates10ft,
              catalogInfo: udpDataAsset,
              schedule: ChannelInfo?.Schedule?.ChannelInfo?.Schedule || ChannelInfo?.Schedule
          });
    } else {
        const supportedPlayActions = getRestrictionsForVod(
            usablePlayActions,
            isTrailer
        );

        if (bookmark && bookmark.VOD_Bookmark) {
            if (
                supportedPlayActions?.CatalogInfo?.RuntimeSeconds ===
                bookmark.VOD_Bookmark?.TimeSeconds
            ) {
                bookmarkPosition = 0;
            } else {
                bookmarkPosition = bookmark.VOD_Bookmark?.TimeSeconds;
            }
        } else {
            bookmarkPosition = 0;
        }
        mediaUID =
            (playAction && playAction?.VideoProfile?.Id) ||
            (usablePlayActions && usablePlayActions[0]?.VideoProfile?.Id);
        const PlaybackUri = (playAction && playAction?.VideoProfile?.PlaybackUri) ||
                            (usablePlayActions && usablePlayActions[0]?.VideoProfile?.PlaybackUri);
        mode = +playBackMode[playSource];
        ownerUID = config.playerConfig.owner_uid;
        appToken = undefined;

        navigation.navigate(Routes.Video, {
            
              server_url: serverURL,
              live: false,
              stsToken: stsToken,
              tenantId: GLOBALS.bootstrapSelectors?.TenantId,
              playbackUri: PlaybackUri,
              locale: GLOBALS.store?.settings.display?.onScreenLanguage?.languageCode,
              ownerUID: ownerUID || config?.playerConfig?.owner_uid,
              bookmarkPosition: bookmarkPosition,
              userToken: userToken,
              mediaUID: mediaUID,
              appToken: appToken,
              primaryAccount: primaryAccount,
              subtitleTrack: GLOBALS.store!.settings.display.subtitleConfig.primary || GLOBALS.store!.settings.display.subtitleConfig.secondary,
              ccEnabled: GLOBALS.store!.settings.display.closedCaption,
              audioTrack: GLOBALS.store!.settings.audio.audioLanguages.primary || GLOBALS.store!.settings.audio.audioLanguages.secondary,
              maxBitrate:  GLOBALS.store!.settings.display.bitrates10ft,
              catalogInfo: udpDataAsset,
              schedule: ChannelInfo?.Schedule?.ChannelInfo?.Schedule || ChannelInfo?.Schedule
          });
    }
}

export const updateBookmark = (udpDataAsset:  any, duration:  number, currentTime: number) => {
    const {
        Bookmark: {
            Id :  BookmarkId  = undefined,
            BookmarkType: TypeOfCurrentBookmark = undefined,
            RecordingId = undefined,
        } = {},
        Bookmark,
        playSource = undefined,
        subscriptionItemForProgram: { ProgramDetails: SIProgramDetails = undefined, Id: SubscriptionId = null } = {},
        isTrailer = false,
        currentCatchupSchedule: { Schedule = undefined } = {},
        currentCatchupSchedule,
        ProgramDetails,
        ProgramId,
        ScheduledRuntimeSeconds,
        playAction,
        id: AssetId,
    } = udpDataAsset;

    if (isTrailer) {
        return new Promise<any>((resolve) => resolve(false));
    }

    if (playSource === sourceTypeString.DVR) {
        let id: string | undefined = Id;
        let bookmark: any = {};
        if (
            (!id || Bookmark?.BookmarkType !== "Recording") &&
            (AssetId || RecordingId || SubscriptionId)
        ) {
            id = SubscriptionId || AssetId || RecordingId;

            bookmark["RuntimeSeconds"] = ScheduledRuntimeSeconds;
            bookmark["ProgramId"] =
                ProgramId || ProgramDetails.UniversalProgramId;
            bookmark["SeriesId"] =
                ProgramDetails.UniversalSeriesId ||
                ProgramDetails?.SeriesId;
            bookmark["SeasonId"] = ProgramDetails?.SeasonId;
        } else if (Bookmark?.BookmarkType === "Recording") {
            bookmark = { ...Bookmark };
        }
        let timeleft = duration - currentTime;
        if (currentTime && bookmark && id) {
            return publishBookmark(
                id,
                {
                    ...bookmark,
                    TimeSeconds:
                        timeleft < 20
                            ? bookmark.RuntimeSeconds
                            : Math.round(currentTime),
                },
                BookmarkType.RECORDING
            );
        }
    } else if (playSource === sourceTypeString.CATCHUP) {
        let id: string | undefined = BookmarkId;
        let duration: any = {};
        const startUtc =
            Schedule?.StartUtc || currentCatchupSchedule?.StartUtc;
        const endUtc = Schedule?.EndUtc || currentCatchupSchedule?.EndUtc;
        const stationId =
            Schedule?.StationId || currentCatchupSchedule?.StationId;

        if (stationId && startUtc && endUtc) {
            id = `${stationId}_${startUtc}_${endUtc}`;
            const startDate = new Date(startUtc);
            const endDate = new Date(endUtc);
            duration = (endDate.getTime() - startDate.getTime()) / 1000;
        }

        if (currentTime && id && duration) {
            return publishBookmark(
                id,
                {
                    RuntimeSeconds: Math.round(duration),
                    TimeSeconds: Math.round(currentTime),
                },
                BookmarkType.CATCHUP
            );
        }
    } else if (playSource === sourceTypeString.VOD) {
        const videoProfileId =
            playAction?.Id ||
            playAction?.VideoProfile.Id.split(
                `_${playAction.VideoProfile.Encoding}`
            )[0];
        let type = BookmarkType.VOD;
        let id = videoProfileId || BookmarkId;
        let timeleft = duration - currentTime;
        if (currentTime) {
            return publishBookmark(
                id,
                {
                    TimeSeconds:
                        timeleft < 20
                            ? playAction?.CatalogInfo?.RuntimeSeconds ||
                              playAction?.Bookmark?.RuntimeSeconds ||
                              udpDataAsset?.CatalogInfo?.RuntimeSeconds||
                              0
                            : Math.round(currentTime),
                },
                type
            );
        }
    }
    return new Promise<any>((resolve) => resolve(false));
};