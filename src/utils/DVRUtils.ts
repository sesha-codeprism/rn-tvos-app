import _ from "lodash";
import { isEmpty, find, filter } from "lodash";
import { Alert } from "react-native";
import { config } from "../config/config";
import { AppStrings } from "../config/strings";
import { Genre, RecorderModel } from "./analytics/consts";
import { DvrItemState, FilterValue, ItemShowType } from "./common";
import { format } from "./dataUtils";
import { LiveChannelMap } from "./live/LiveUtils";
import { getUIdef } from "./uidefinition";
const dvrConfig = getUIdef("DvrManager")?.config;
//@ts-ignore
const dvrFilterSortEnabled = dvrConfig?.isSortByDateEnabled || true;
//@ts-ignore
const dvrFilterSoonToBeExpiredDays = dvrConfig?.soonToBeExpiredDays || 4;
const MILLISECONDS_IN_24HRS = 86400000;



export interface SubscriptionGroupsResponse {
    SubscriptionGroups: SubscriptionGroup[];
    Expired: boolean;
    DiskFullPercentage: number;
    QuotaResponse: QuotaResponse;
    ContinuationToken: string;
}

interface QuotaResponse {
    TotalQuotaBytes: number;
    ConsumedQuotaBytes: number;
}

interface SubscriptionGroup {
    Id: string;
    Definition: string;
    SeriesDetails?: SeriesDetails;
    Settings: Settings;
    State: string;
    SubscriptionItems: (SubscriptionItem | SubscriptionItems2 | SubscriptionItems3 | SubscriptionItems4)[];
    ScheduleVersion: number;
    SeriesId?: string;
}

interface SubscriptionItems4 {
    Id: string;
    SubscriptionId: string;
    StationId: string;
    ProgramId: string;
    PlayInfo: PlayInfo[];
    ItemState: string;
    ProgramDetails: ProgramDetails4;
    Settings: Settings2;
    ScheduledAvailabilityStartUtc: string;
    ScheduledRuntimeSeconds: number;
    ActualAvailabilityStartUtc: string;
    ActualAvailabilityEndUtc: string;
    ExceedsQuota: boolean;
    ScheduleVersion: number;
    IsGeneric: boolean;
    IsAdult: boolean;
    IsDownloadable: boolean;
    DownloadCount: number;
    ContentExpiryUtc: string;
    RecordingSearchIndexState: string;
    Tags: string[];
    AudioTags: AudioTags;
    MfRecordingId: string;
}

interface ProgramDetails4 {
    UniversalProgramId: string;
    Title: string;
    EpisodeTitle: string;
    ImageBucketId: string;
    Description: string;
    ShowType: string;
    ReleaseDate: string;
    UniversalSeriesId: string;
    SeasonId: string;
    SeasonNumber: number;
    EpisodeNumber: string;
    EpisodeSequence: number;
    Images: Image[];
    SupportedImages: string[];
    Genres: Genre[];
    Ratings: Rating[];
    IsAdult: boolean;
}

interface SubscriptionItems3 {
    Id: string;
    SubscriptionId: string;
    StationId: string;
    ProgramId: string;
    PlayInfo: PlayInfo[];
    ItemState: string;
    ProgramDetails: ProgramDetails3;
    Settings: Settings2;
    ScheduledAvailabilityStartUtc: string;
    ScheduledRuntimeSeconds: number;
    ActualAvailabilityStartUtc: string;
    ActualAvailabilityEndUtc: string;
    ExceedsQuota: boolean;
    ScheduleVersion: number;
    IsGeneric: boolean;
    IsAdult: boolean;
    IsDownloadable: boolean;
    DownloadCount: number;
    ContentExpiryUtc: string;
    RecordingSearchIndexState: string;
    Tags: string[];
    AudioTags: AudioTags2;
    MfRecordingId: string;
    StorageExpirationSeconds: number;
    PlaybackExpirationSeconds: number;
}

interface AudioTags2 {
    ClosedCaptioned?: any;
    Stereo?: any;
}

interface ProgramDetails3 {
    UniversalProgramId: string;
    Title: string;
    ImageBucketId: string;
    Description: string;
    ShowType: string;
    ReleaseDate: string;
    UniversalSeriesId: string;
    SeasonId: string;
    SeasonNumber: number;
    EpisodeNumber: string;
    EpisodeSequence: number;
    Images: Image[];
    SupportedImages: string[];
    Genres: Genre[];
    Ratings: any[];
    IsAdult: boolean;
}

interface SubscriptionItems2 {
    Id: string;
    SubscriptionId: string;
    StationId: string;
    ProgramId: string;
    PlayInfo: PlayInfo[];
    ItemState: string;
    ProgramDetails: ProgramDetails2;
    Settings: Settings2;
    ScheduledAvailabilityStartUtc: string;
    ScheduledRuntimeSeconds: number;
    ActualAvailabilityStartUtc: string;
    ActualAvailabilityEndUtc: string;
    ExceedsQuota: boolean;
    ScheduleVersion: number;
    IsGeneric: boolean;
    IsAdult: boolean;
    IsDownloadable: boolean;
    DownloadCount: number;
    ContentExpiryUtc: string;
    RecordingSearchIndexState: string;
    Tags: string[];
    AudioTags: AudioTags;
    MfRecordingId: string;
}

interface ProgramDetails2 {
    UniversalProgramId: string;
    Title: string;
    ImageBucketId: string;
    Description: string;
    ShowType: string;
    ReleaseDate: string;
    UniversalSeriesId: string;
    SeasonId: string;
    EpisodeNumber: string;
    Images: Image[];
    SupportedImages: string[];
    Genres: Genre[];
    Ratings: Rating[];
    IsAdult: boolean;
}

interface SubscriptionItem {
    Id: string;
    SubscriptionId: string;
    StationId: string;
    ProgramId: string;
    PlayInfo: PlayInfo[];
    ItemState: string;
    ProgramDetails: ProgramDetails;
    Settings: Settings2;
    ScheduledAvailabilityStartUtc: string;
    ScheduledRuntimeSeconds: number;
    ActualAvailabilityStartUtc: string;
    ActualAvailabilityEndUtc: string;
    ExceedsQuota: boolean;
    ScheduleVersion: number;
    IsGeneric: boolean;
    IsAdult: boolean;
    IsDownloadable: boolean;
    DownloadCount: number;
    ContentExpiryUtc: string;
    RecordingSearchIndexState: string;
    Tags: string[];
    AudioTags: AudioTags;
    MfRecordingId: string;
}

interface AudioTags {
    ClosedCaptioned?: any;
}

interface Settings2 {
    RecyclingDisabled: boolean;
    EndLateSeconds: number;
    StartEarlySeconds: number;
    ChannelNumber: number;
    IsMultiChannel: boolean;
    SoftPrePaddingSeconds: number;
    SoftPostPaddingSeconds: number;
}

interface ProgramDetails {
    UniversalProgramId: string;
    Title: string;
    ImageBucketId: string;
    Description: string;
    ShowType: string;
    Images: Image[];
    SupportedImages: any[];
    Genres: Genre[];
    Ratings: Rating[];
    IsAdult: boolean;
}

interface PlayInfo {
    MediaId: string;
    OwnerId: string;
    RecordingToken: string;
    Entitlements: string[];
}

interface Settings {
    StartUtc: string;
    StationId: string;
    ChannelNumber: number;
    IsMultiChannel: boolean;
    EndLateSeconds: number;
    RecyclingDisabled: boolean;
    ShowType?: string;
    AirtimeDomain?: string;
    ManualRDDurationSeconds: number;
    ServiceCollectionId: string;
}

export interface SeriesDetails {
    Title: string;
    Images: Image[];
    ImageBucketId?: string;
    SupportedImages: string[];
    Genres: Genre[];
    Ratings: Rating[];
    IsAdult: boolean;
    Description?: string;
    SeriesId?: string;
    StartYear?: number;
}

interface Rating {
    System: string;
    Value: string;
}

interface Genre {
    Id: string;
    Name: string;
}

interface Image {
    Size: string;
    ImageType: string;
    Uri: string;
}

export interface ISubscriptionSetting {
    StationId?: string;
    ChannelNumber: number;
    StartUtc: string;
    MaximumViewableShows?: number;
    EndLateSeconds: number;
    RecyclingDisabled: boolean;
    ShowType?: string;
    AirtimeDomain?: string;
    ChannelMapId: string;
    ManualRDDurationSeconds?: number;
    ProviderName?: string;
    OriginalStationId?: string;
    IsMultiChannel?: boolean;
}


export enum DvrItemErrorCode {
    UNKNOWN = "Unknown",
    GENERIC = "Generic",
    NO_EPG_DATA = "NoEpgData",
    EPG_DATA_MISMATCH = "EpgDataMismatch",
    PROGRAM_ALREADY_TARGETED = "ProgramAlreadyTargeted",
    RECORDING_NOT_FOUND = "RecordingNotFound",
    RECORDING_INVALID_STATE = "RecordingIsInInvalidState",
    RECORDING_NOT_COMPLETED = "RecordingIsNotCompleted",
    UNIVERSALID_NOT_FOUND = "UniversalIdNotFound",
    NATIVEID_NOT_FOUND = "NativeIdNotFound",
    EXT_ACCOUNT_NOT_FOUND = "ExternalAccountNotFound",
    MEDIAROOM_EXCEPTION = "MediaroomSoapException",
    ERROR_CONTACTING_SERVER = "ErrorContactingServer",
    BRANCHID_NOT_FOUND = "BranchIdNotFound",
    NO_RECORDERS_AVAILABLE = "NoRecordersAvailable",
    NO_RECORD_RIGHTS = "NoRecordingRights",
    NO_RECORD_RIGHTS_FOR_PPV = "NoRecordingRightsForPayPerView",
    MEDIAROOM_QUEUE_FULL = "OssQueueFull",
    TIMEOUT = "Timeout",
    MISSING_CACHE_ID = "MissingCacheId",
    BLACKED_OUT = "BlackedOut",
    RECORDING_QUOTA_EXCEDDED = "RECORDING_QUOTA_EXCEDDED",
}

export enum DvrGroupShowType {
    Any = "Any",
    FirstRunOnly = "FirstRunOnly",
    SortBy = "SortBy",
    FilterBy = "FilterBy",
}

export enum DvrGroupState {
    INVALID = "Invalid",
    UNKNOWN_SCHEDULE = "UnknownSchedule",
    KNOWN_SCHEDULE = "KnownSchedule",
    TENTATIVE_SCHEDULE = "TentativeSchedule",
    FALTERING_SCHEDULE = "FalteringSchedule",
    DORMANT = "Dormant",
    CANCELED = "Canceled",
    COMPLETED = "Completed",
    DELETED = "Deleted",
}

export enum Definition {
    SINGLE_TIME = "SingleTime",
    SINGLE_PROGRAM = "SingleProgram",
    SERIES = "Series",
    GENERIC_PROGRAM = "GenericProgram",
}

export enum DvrButtonAction {
    None,
    Record,
    Edit,
    Promote,
    ResolveConflicts,
    Wait,
}

export enum RequestType {
    GET,
    SCHEDULE,
    UPDATE,
    CANCEL,
    STOP,
    DELETE,
    RESOLVE_CONFLICT,
}

export enum DvrResponseState {
    COMPLETED = "Completed",
    FAILED = "Failed",
}

export enum FilterByOption {
    ALL = "All",
    SAVED = "Saved",
    EXPIRING = "ExpireSoon",
}

export enum QualityLevels {
    UHD = "UHD",
    SD = "SD",
    HD = "HD",
    ReachUHD = "ReachUHD",
    ReachHD = "ReachHD",
    ReachSD = "ReachSD",
    MOBILE = "Mobile",
}

export type DvrButtonActionType = {
    buttonAction: DvrButtonAction;
    subscription?: any;
};

export enum DVRSubscriptionGroupDataFilterType {
    Viewable = "viewable",
    Scheduled = "scheduled",
}

export const calculateSeriesButtonAction = (
    seriesId: string,
    startTimeUtc: string,
    stationId: string,
    channelNumber: number,
    entitlements: string[],
    recordedSubscriptionGroups: any,
    scheduledSubscriptionGroups: any,
    liveSchedules: any,
    allSubscriptionGroup: any,
    actionRequests: any,
    recorderModel: any,
    isCloudDVRCapable: boolean,
    channelMap: any
): DvrButtonActionType | undefined => {
    let canCreateLiveModel = validateArgumentsForLive(
        seriesId,
        startTimeUtc,
        stationId,
        channelNumber
    );
    let canCreateVodModel = validateArgumentsForVod(seriesId);

    if (canCreateLiveModel) {
        return calculateSeriesButtonActionLiveModel(
            seriesId,
            startTimeUtc,
            stationId,
            channelNumber,
            liveSchedules,
            allSubscriptionGroup,
            actionRequests,
            recorderModel,
            isCloudDVRCapable,
            channelMap
        );
    } else if (canCreateVodModel) {
        return calculateSeriesButtonActionVodModel(
            seriesId,
            recordedSubscriptionGroups,
            scheduledSubscriptionGroups,
            liveSchedules,
            allSubscriptionGroup,
            actionRequests,
            recorderModel,
            isCloudDVRCapable,
            channelMap
        );
    }

    return undefined;
};

const validateArgumentsForLive = (
    seriesId: string,
    startTimeUtc: string,
    stationId: string,
    channelNumber: number
): boolean => {
    return !(
        !seriesId ||
        seriesId === "" ||
        !startTimeUtc ||
        startTimeUtc === "" ||
        !stationId ||
        stationId === "" ||
        !channelNumber
    );
};

const validateArgumentsForVod = (seriesId: string): boolean => {
    return !(!seriesId || seriesId === "");
};

const calculateSeriesButtonActionLiveModel = (
    seriesId: string,
    startTimeUtc: string,
    stationId: string,
    channelNumber: number,
    liveSchedules: any,
    allSubscriptionGroup: any,
    actionRequests: any,
    recorderModel: any,
    isCloudDVRCapable: boolean,
    channelMap: any
): DvrButtonActionType => {
    let availableAction = DvrButtonAction.None;
    const channelsByStationId = _.groupBy(
        channelMap?.getChannels(),
        (channel) => channel?.StationId
    );
    const serviceMap = channelMap?.ServiceMap;
    liveSchedules = filterLiveSchedules(
        liveSchedules,
        recorderModel,
        channelsByStationId,
        serviceMap,
        isCloudDVRCapable
    );

    if (isPendingLive(startTimeUtc, channelNumber, actionRequests)) {
        availableAction = DvrButtonAction.Wait;
        return {
            buttonAction: availableAction,
            subscription: undefined,
        };
    }

    const searchResult = searchSubscriptionItemsLaterThen(
        startTimeUtc,
        stationId,
        channelNumber,
        allSubscriptionGroup?.SubscriptionGroups
    );

    const selectedLiveSchedule = searchScheduleByStartTime(
        startTimeUtc,
        seriesId,
        stationId,
        liveSchedules
    );

    availableAction = getSeriesButtonStateLiveModel(
        selectedLiveSchedule,
        searchResult
    );

    return {
        buttonAction: availableAction,
        subscription: searchResult,
    };
};

const calculateSeriesButtonActionVodModel = (
    seriesId: string,
    recordedSubscriptionGroups: any,
    scheduledSubscriptionGroups: any,
    liveSchedules: any,
    allSubscriptionGroup: any,
    actionRequests: any,
    recorderModel: any,
    isCloudDVRCapable: boolean,
    channelMap: any
): DvrButtonActionType => {
    const channelsByStationId = _.groupBy(
        channelMap?.getChannels(),
        (channel) => channel?.StationId
    );
    const serviceMap = channelMap?.ServiceMap;
    liveSchedules = filterLiveSchedules(
        liveSchedules,
        recorderModel,
        channelsByStationId,
        serviceMap,
        isCloudDVRCapable
    );
    let {
        selectedLiveSchedule,
        selectedSubscriptionSearchResult,
        foundAsset,
    } = selectAsset(
        seriesId,
        recordedSubscriptionGroups,
        scheduledSubscriptionGroups,
        liveSchedules
    );
    let availableAction = DvrButtonAction.None;
    if (foundAsset) {
        if (isPendingVod(actionRequests)) {
            availableAction = DvrButtonAction.Wait;
        } else {
            availableAction = getSeriesButtonStateVodModel(
                selectedLiveSchedule,
                selectedSubscriptionSearchResult,
                allSubscriptionGroup
            );
        }
    } else {
        availableAction = DvrButtonAction.None;
    }
    return {
        buttonAction: availableAction,
        subscription: selectedSubscriptionSearchResult,
    };
};

function getSeriesButtonStateVodModel(
    liveSchedule: any,
    searchResult: any,
    scheduledSubscriptionGroups: any
): DvrButtonAction {
    let buttonState = DvrButtonAction.None;

    if (isValidFirstRunOnlyResult(searchResult)) {
        if (!searchResult.SubscriptionItem) {
            // if searched subscription doesn't contain any items
            buttonState = DvrButtonAction.Edit;
        } else if (
            searchResult.SubscriptionItem.ItemState === DvrItemState.CONFLICTS
        ) {
            buttonState = DvrButtonAction.ResolveConflicts;
        } else if (
            searchResult.SubscriptionGroup.State !== DvrGroupState.CANCELED
        ) {
            if (
                searchResult.SubscriptionGroup.Definition === Definition.SERIES
            ) {
                if (
                    isMultipleSubscriptionsInConflict(
                        searchResult.SubscriptionGroup.SeriesDetails.SeriesId,
                        scheduledSubscriptionGroups
                    )
                ) {
                    buttonState = DvrButtonAction.ResolveConflicts;
                } else {
                    buttonState = DvrButtonAction.Edit;
                }
            } else {
                buttonState = DvrButtonAction.Promote;
            }
        } else {
            buttonState = DvrButtonAction.Record;
        }
    } else if (liveSchedule) {
        if (
            isMultipleSubscriptionsInConflict(
                liveSchedule.SeriesId,
                scheduledSubscriptionGroups
            )
        ) {
            buttonState = DvrButtonAction.ResolveConflicts;
        } else {
            buttonState = DvrButtonAction.Record;
        }
    }

    return buttonState;
}

function getSeriesButtonStateLiveModel(
    schedule: any,
    searchResult: any
): DvrButtonAction {
    let buttonState = DvrButtonAction.None;

    if (isValidResult(searchResult)) {
        if (
            searchResult.SubscriptionItem.ItemState === DvrItemState.CONFLICTS
        ) {
            buttonState = DvrButtonAction.ResolveConflicts;
        } else if (
            searchResult.SubscriptionGroup.State !== DvrGroupState.CANCELED
        ) {
            if (
                searchResult.SubscriptionGroup.Definition === Definition.SERIES
            ) {
                buttonState = DvrButtonAction.Edit;
            } else {
                buttonState = DvrButtonAction.Promote;
            }
        } else {
            buttonState = DvrButtonAction.Record;
        }
    } else if (schedule) {
        buttonState = DvrButtonAction.Record;
    }

    return buttonState;
}

export function getSeriesOrProgramId(subscriptionGroup: any): string {
    return (
        subscriptionGroup &&
        ((<any>subscriptionGroup).SeriesId ||
            (subscriptionGroup?.SubscriptionItems &&
                subscriptionGroup?.SubscriptionItems[0] &&
                subscriptionGroup?.SubscriptionItems[0].ProgramId))
    );
}

export function getOnlyProgramId(
    subscriptionGroup: any,
    seriesOrProgramId: string
): string {
    return (
        subscriptionGroup &&
        subscriptionGroup?.SubscriptionItems &&
        subscriptionGroup.SubscriptionItems.find(
            (item: { ProgramId: string }) =>
                item?.ProgramId === seriesOrProgramId
        )?.ProgramId
    );
}

export function isValidSubscriptionGroup(subscriptionGroup: any): boolean {
    return (
        subscriptionGroup?.SubscriptionItems &&
        subscriptionGroup?.SubscriptionItems.length > 0 &&
        [
            Definition.SINGLE_PROGRAM,
            Definition.SERIES,
            Definition.GENERIC_PROGRAM,
        ].includes(subscriptionGroup.Definition)
    );
}

function isMultipleSubscriptionsInConflict(
    seriesOrProgramId: string,
    subscriptionGroups: any
) {
    return subscriptionGroups?.SubscriptionGroups.filter(
        (subscriptionGroup: any) => isValidSubscriptionGroup(subscriptionGroup)
    )
        .filter(
            (subscriptionGroup: any) =>
                getSeriesOrProgramId(subscriptionGroup) === seriesOrProgramId
        )
        .reduce((isSubscriptionsInConflict: any, subscriptionGroup: any) => {
            const isInConflict = recurringSubscriptionIsInConflict(
                subscriptionGroup
            );
            return isInConflict || isSubscriptionsInConflict;
        }, false);
}

function recurringSubscriptionIsInConflict(subscriptionGroup: any) {
    // Group is in conflict if any item is in conflict
    for (let subscriptionItem of subscriptionGroup?.SubscriptionItems) {
        if (subscriptionItem.ItemState === DvrItemState.CONFLICTS) {
            return true;
        }
    }
    return false;
}

function selectAssetForProgram(
    programId: string,
    channelNumber: number,
    recordedSubscriptionGroups: any,
    scheduledSubscriptionGroups: any,
    liveSchedules: any
): any {
    let foundAsset = false;
    let selectedLiveSchedule = null;
    let selectedSubscriptionSearchResult = null;

    let searchResult = trySelectSubscriptionItemForProgram(
        programId,
        recordedSubscriptionGroups
    );
    if (!isValidResult(searchResult)) {
        searchResult = trySelectSubscriptionItemForProgram(
            programId,
            scheduledSubscriptionGroups
        );
    }

    if (isValidResult(searchResult)) {
        selectedSubscriptionSearchResult = searchResult;
        foundAsset = true;
    }

    let liveSchedule = getFirstScheduleByTime(channelNumber, liveSchedules);

    if (liveSchedule) {
        selectedLiveSchedule = liveSchedule;
        foundAsset = true;
    }

    return {
        selectedLiveSchedule,
        selectedSubscriptionSearchResult,
        foundAsset,
    };
}

function selectAsset(
    seriesId: string,
    recordedSubscriptionGroups: any,
    scheduledSubscriptionGroups: any,
    liveSchedules: any
): any {
    let foundAsset = false;
    let selectedLiveSchedule = null;
    let selectedSubscriptionSearchResult = null;

    let searchResult = trySelectSubscriptionItem(
        seriesId,
        recordedSubscriptionGroups
    );
    if (!isValidFirstRunOnlyResult(searchResult)) {
        searchResult = trySelectSubscriptionItem(
            seriesId,
            scheduledSubscriptionGroups
        );
    }

    if (isValidFirstRunOnlyResult(searchResult)) {
        selectedSubscriptionSearchResult = searchResult;
        foundAsset = true;
    }

    let liveSchedule = trySelectFirstSchedule(seriesId, liveSchedules);

    if (liveSchedule) {
        selectedLiveSchedule = liveSchedule;
        foundAsset = true;
    }

    return {
        selectedLiveSchedule,
        selectedSubscriptionSearchResult,
        foundAsset,
    };
}

function isValidFirstRunOnlyResult(searchResult: any): boolean {
    return !!searchResult && !!searchResult.SubscriptionGroup;
}

function trySelectFirstSchedule(seriesId: string, schedules: any): any {
    if (schedules) {
        // Find the first schedule that has not passed
        for (let schedule of schedules) {
            if (
                Date.parse(schedule.EndUtc) > Date.now() &&
                schedule.SeriesId === seriesId
            ) {
                return schedule;
            }
        }
    }
    return null;
}

function getFirstScheduleByTime(channelNumber: number, schedules: any): any {
    if (schedules) {
        let scheduleCandidates = [];
        // Find the first schedule that has not passed
        for (const schedule of schedules) {
            if (Date.parse(schedule.EndUtc) > Date.now()) {
                if (
                    channelNumber &&
                    channelNumber === schedule?.ChannelNumber
                ) {
                    return schedule;
                }
                scheduleCandidates.push(schedule);
            }
        }
        return scheduleCandidates[0];
    }
    return null;
}

function trySelectSubscriptionItemForProgram(
    programId: string,
    subscriptionGroups: any
): any {
    // Pick first scheduled recording with matching programId
    let searchResults = findMultipleSubscriptionsByProgramId(
        programId,
        subscriptionGroups?.SubscriptionGroups
    );

    let result = null;
    const searchLength = searchResults.length;

    for (let i = 0; i < searchLength; i++) {
        const element = searchResults[i];
        const state = element.SubscriptionItem.ItemState;

        if (
            state === DvrItemState.SCHEDULED ||
            state === DvrItemState.RECORDING ||
            state === DvrItemState.RECORDED
        ) {
            result = element;
            break;
        }

        if (state === DvrItemState.CONFLICTS && result == null) {
            result = element;
        }
    }

    return result;
}

function findMultipleSubscriptionsByProgramId(
    programId: string,
    subscriptionGroups: any
): any {
    let searchResults = [];

    if (programId) {
        for (const g in subscriptionGroups) {
            const sg = subscriptionGroups[g];
            for (const i in sg.SubscriptionItems) {
                const si = sg.SubscriptionItems[i];
                if (si.ProgramId === programId) {
                    searchResults.push({
                        SubscriptionGroup: sg,
                        SubscriptionItem: si,
                    });
                }
            }
        }
    }

    return searchResults;
}

function trySelectSubscriptionItem(
    seriesId: string,
    subscriptionGroups: any
): any {
    // Pick first scheduled recording with matching seriesId
    let searchResults = findMultipleSubscriptionsBySeriesId(
        seriesId,
        subscriptionGroups?.SubscriptionGroups
    );

    if (!!searchResults && searchResults.length > 0) {
        let filteredResults = _.filter(searchResults, (sr: any) => {
            return (
                sr.SubscriptionGroup.State !== DvrGroupState.DELETED &&
                sr.SubscriptionGroup.State !== DvrGroupState.CANCELED &&
                sr.SubscriptionGroup.State !== DvrGroupState.COMPLETED
            );
        });

        let sortedResults = _.sortBy(filteredResults, (sr: any) => {
            if (sr.SubscriptionItem) {
                switch (sr.SubscriptionItem.ItemState) {
                    case DvrItemState.RECORDED:
                        return 0;
                    case DvrItemState.RECORDING:
                        return 1;
                    case DvrItemState.SCHEDULED:
                        return 2;
                    case DvrItemState.CONFLICTS:
                        return 3;
                    default:
                        return 10;
                }
            } else {
                //to put search result without item to the end
                return 11;
            }
        });

        return sortedResults[0];
    }
    return null;
}

function findMultipleSubscriptionsBySeriesId(
    seriesId: string,
    subscriptionGroups: any
): any {
    let searchResults = [];

    if (seriesId) {
        for (let g in subscriptionGroups) {
            let sg = subscriptionGroups[g];
            if (
                sg.SubscriptionItems &&
                sg.SubscriptionItems.length > 0 &&
                sg.Definition === Definition.SERIES &&
                sg.SeriesDetails &&
                sg.SeriesDetails.SeriesId === seriesId
            ) {
                let si = sg?.SubscriptionItems[0];
                searchResults.push({
                    SubscriptionGroup: sg,
                    SubscriptionItem: si,
                });
                // }
            }
        }
    }

    return searchResults;
}

export const calculateProgramButtonAction = (
    programId: string,
    startTimeUtc: string,
    stationId: string,
    channelNumber: number,
    entitlements: string[],
    actionRequests: any,
    liveSchedules: any,
    allSubscriptionGroup: any,
    recordedSubscriptionGroups: any,
    scheduledSubscriptionGroups: any,
    recorderModel: any,
    isCloudDVRCapable: boolean,
    channelMap: any,
    endUtc?: any
): DvrButtonActionType | undefined => {
    let canCreateLiveModel = validateArgumentsForLive(
        programId,
        startTimeUtc,
        stationId,
        channelNumber
    );
    let canCreateVodModel = validateArgumentsForVod(programId);
    if (endUtc) {
        const catchupEndDate = new Date(endUtc);
        const now = new Date();
        if (catchupEndDate < now) {
            canCreateLiveModel = false;
        }
    }

    if (endUtc) {
        const catchupEndDate = new Date(endUtc);
        const now = new Date();
        if (catchupEndDate < now) {
            canCreateLiveModel = false;
        }
    }

    if (canCreateLiveModel) {
        return calculateProgramButtonActionLiveModel(
            startTimeUtc,
            channelNumber,
            programId,
            stationId,
            actionRequests,
            liveSchedules,
            allSubscriptionGroup,
            isCloudDVRCapable,
            recorderModel,
            channelMap
        );
    } else if (canCreateVodModel) {
        return calculateProgramButtonActionVodModel(
            programId,
            channelNumber,
            actionRequests,
            liveSchedules,
            recordedSubscriptionGroups,
            scheduledSubscriptionGroups,
            isCloudDVRCapable,
            recorderModel,
            channelMap
        );
    }

    return undefined;
};

const calculateProgramButtonActionVodModel = (
    programId: any,
    channelNumber: number,
    actionRequests: any,
    liveSchedules: any,
    recordedSubscriptionGroups: any,
    scheduledSubscriptionGroups: any,
    isCloudDVRCapable: boolean,
    recorderModel: any,
    channelMap: any
): DvrButtonActionType => {
    let availableAction: DvrButtonAction = DvrButtonAction.None;
    const channelsByStationId = _.groupBy(
        channelMap?.getChannels(),
        (channel) => channel?.StationId
    );
    const serviceMap = channelMap?.ServiceMap;
    liveSchedules = filterLiveSchedules(
        liveSchedules,
        recorderModel,
        channelsByStationId,
        serviceMap,
        isCloudDVRCapable
    );
    let {
        selectedLiveSchedule,
        selectedSubscriptionSearchResult,
        foundAsset,
    } = selectAssetForProgram(
        programId,
        channelNumber,
        recordedSubscriptionGroups,
        scheduledSubscriptionGroups,
        liveSchedules
    );
    if (foundAsset) {
        if (isPendingVod(actionRequests)) {
            availableAction = DvrButtonAction.Wait;
        } else {
            availableAction = getProgramButtonStateForVodModel(
                selectedLiveSchedule,
                selectedSubscriptionSearchResult
            );
        }
    } else {
        availableAction = DvrButtonAction.None;
    }

    return {
        buttonAction: availableAction,
        subscription: selectedSubscriptionSearchResult,
    };
};

const calculateProgramButtonActionLiveModel = (
    startTimeUtc: string,
    channelNumber: number,
    programId: string,
    stationId: string,
    actionRequests: any,
    liveSchedules: any,
    allSubscriptionGroup: any,
    isCloudDVRCapable: boolean,
    recorderModel: any,
    channelMap: any
): DvrButtonActionType => {
    let availableAction: DvrButtonAction = DvrButtonAction.None;
    const channelsByStationId = _.groupBy(
        channelMap?.getChannels(),
        (channel) => channel?.StationId
    );
    const serviceMap = channelMap?.ServiceMap;
    liveSchedules = filterLiveSchedules(
        liveSchedules,
        recorderModel,
        channelsByStationId,
        serviceMap,
        isCloudDVRCapable
    );
    if (isPendingLive(startTimeUtc, channelNumber, actionRequests)) {
        availableAction = DvrButtonAction.Wait;
        return { buttonAction: availableAction };
    }

    let searchResult = findProgramSubscription(
        allSubscriptionGroup,
        programId,
        startTimeUtc,
        stationId,
        channelNumber
    );

    let selectedLiveSchedule = searchScheduleByStartTime(
        startTimeUtc,
        programId,
        stationId,
        liveSchedules
    );

    availableAction = getProgramButtonState(selectedLiveSchedule, searchResult);
    return { buttonAction: availableAction, subscription: searchResult };
};

export const findProgramSubscription = (
    allSubscriptionGroup: any,
    programId: string,
    startTimeUtc: string,
    stationId: string,
    channelNumber: number
): any => {
    let searchResult: any;
    if (config?.dvr?.enableAllChannels) {
        searchResult = findSubscriptionByProgramId(
            programId,
            allSubscriptionGroup?.SubscriptionGroups
        );
    }

    const isMultiChannel =
        searchResult &&
        searchResult.SubscriptionItem &&
        searchResult.SubscriptionItem.Settings.IsMultiChannel;

    if (!(searchResult && searchResult.SubscriptionItem) || !isMultiChannel) {
        searchResult = findSubscriptionByStartTime(
            startTimeUtc,
            stationId,
            channelNumber,
            allSubscriptionGroup?.SubscriptionGroups
        );
    }
    return searchResult;
};

export const findSubscriptionByProgramId = (
    programId: string,
    subscriptionGroups: any
): any => {
    if (programId) {
        for (let g in subscriptionGroups) {
            let sg = subscriptionGroups[g];
            for (let i in sg?.SubscriptionItems) {
                let si = sg?.SubscriptionItems[i];
                if (si.ProgramId === programId) {
                    return {
                        SubscriptionGroup: sg,
                        SubscriptionItem: si,
                    };
                }
            }
        }
    }

    return {
        SubscriptionGroup: null,
        SubscriptionItem: null,
    };
};

export const findSubscriptionByStartTime = (
    startTimeUtc: string,
    stationId: string,
    channelNumber: number,
    subscriptionGroups: any,
    definition?: string
): any => {
    let searchedUtcTime = new Date(startTimeUtc).getTime();

    for (let g in subscriptionGroups) {
        let sg = subscriptionGroups[g];
        if (
            sg?.Settings?.ChannelNumber !== channelNumber &&
            !sg?.Settings?.IsMultiChannel
        ) {
            continue;
        }
        for (let i in sg?.SubscriptionItems) {
            let si = sg?.SubscriptionItems[i];
            if (
                si?.StationId === stationId &&
                new Date(getStartTime(si)).getTime() === searchedUtcTime &&
                (definition ? definition === sg?.Definition : true)
            ) {
                return {
                    SubscriptionGroup: sg,
                    SubscriptionItem: si,
                };
            }
        }
    }

    return {
        SubscriptionGroup: null,
        SubscriptionItem: null,
    };
};

export const findSubscriptionBySeriesId = (
    seriesId: string,
    subscriptionGroups: any
): any => {
    if (seriesId && subscriptionGroups && subscriptionGroups.length) {
        for (let g in subscriptionGroups) {
            let sg = subscriptionGroups[g];
            if (
                sg.SubscriptionItems &&
                sg.SubscriptionItems.length > 0 &&
                sg.Definition === Definition.SERIES &&
                sg.SeriesDetails &&
                sg.SeriesDetails.SeriesId === seriesId
            ) {
                let si = sg.SubscriptionItems[0];
                return {
                    SubscriptionGroup: sg,
                    SubscriptionItem: si,
                };
            }
        }
    }

    return {
        SubscriptionGroup: null,
        SubscriptionItem: null,
    };
};
export function getStartTime(si: any): string {
    let startUtc =
        si.ItemState === DvrItemState.RECORDED &&
            si.ActualAvailabilityStartUtc &&
            !isMinDateTime(si.ActualAvailabilityStartUtc)
            ? si.ActualAvailabilityStartUtc
            : si.ScheduledAvailabilityStartUtc;

    return startUtc;
}

export function isMinDateTime(date: string): boolean {
    let jsDate = new Date(date);

    return jsDate.getFullYear() === 1;
}

export function isValidResult(searchResult: any): boolean {
    return (
        !!searchResult &&
        !!searchResult.SubscriptionGroup &&
        !!searchResult.SubscriptionItem
    );
}

function isInThePast(subscriptionItem: any): boolean {
    return new Date(getEndTime(subscriptionItem)) < new Date();
}

export function getEndTime(si: any): string {
    if (
        (si.ItemState === DvrItemState.RECORDED ||
            si.ItemState === DvrItemState.RECORDING) &&
        si.ActualAvailabilityEndUtc &&
        !isMinDateTime(si.ActualAvailabilityEndUtc)
    ) {
        return si.ActualAvailabilityEndUtc;
    }

    return getScheduledEndTimeISOString(si);
}

function getScheduledEndTimeISOString(si: any): string {
    return getScheduledEndTime(si).toISOString();
}

function getScheduledEndTime(si: any): Date {
    return new Date(
        new Date(si?.ScheduledAvailabilityStartUtc).getTime() +
        si?.ScheduledRuntimeSeconds * 1000
    );
}

export const getProgramButtonState = (
    schedule: any,
    searchResult: any
): DvrButtonAction => {
    let buttonState = DvrButtonAction.None;

    if (isValidResult(searchResult)) {
        if (searchResult.SubscriptionItem.ItemState === DvrItemState.CANCELED) {
            if (
                searchResult.SubscriptionGroup.State !== DvrGroupState.CANCELED
            ) {
                if (schedule && schedule.IsGeneric) {
                    buttonState = DvrButtonAction.Edit;
                } else {
                    buttonState = DvrButtonAction.Promote;
                }
            } else {
                buttonState = DvrButtonAction.Record;
            }
        } else if (
            searchResult.SubscriptionItem.ItemState === DvrItemState.CONFLICTS
        ) {
            if (!isInThePast(searchResult.SubscriptionItem)) {
                buttonState = DvrButtonAction.ResolveConflicts;
            }
        } else {
            if (isInThePast(searchResult.SubscriptionItem) && !!schedule) {
                buttonState =
                    new Date(schedule.EndUtc) < new Date()
                        ? DvrButtonAction.Edit
                        : DvrButtonAction.Record;
            } else {
                // SINGLE_TIME recordings should not be shown on the TVGuide
                if (
                    searchResult.SubscriptionGroup.Definition ===
                    Definition.SINGLE_TIME
                ) {
                    buttonState = DvrButtonAction.Record;
                } else {
                    buttonState = DvrButtonAction.Edit;
                }
            }
        }
    } else {
        if (schedule) {
            const scheduleEnded = Date.parse(schedule.EndUtc) <= Date.now();
            if (!scheduleEnded) {
                buttonState = DvrButtonAction.Record;
            }
        }
    }
    return buttonState;
};

export const getProgramButtonStateForVodModel = (
    liveSchedule: any,
    searchResult: any
): DvrButtonAction => {
    let buttonState = DvrButtonAction.None;

    if (liveSchedule) {
        buttonState = DvrButtonAction.Record;
    }

    if (isValidResult(searchResult)) {
        const subscriptionItemState = searchResult.SubscriptionItem.ItemState;

        if (subscriptionItemState !== DvrItemState.CANCELED) {
            if (subscriptionItemState === DvrItemState.CONFLICTS) {
                buttonState = DvrButtonAction.ResolveConflicts;
            } else {
                buttonState = DvrButtonAction.Edit;
            }
        }
    }

    return buttonState;
};

const isPendingLive = (
    startTime: string,
    channelNumber: number,
    actionRequests: any
): boolean => {
    // Either original channel number and time match
    // OR new channel number and time match. (required to prevent ProgramAlreadyTargeted error)
    return actionRequests.some(
        (requestDetails: any) =>
            (requestDetails.ChannelNumber === channelNumber &&
                new Date(requestDetails.StartUtc).getTime() ===
                new Date(startTime).getTime()) ||
            (requestDetails.SubscriptionSetting &&
                requestDetails.SubscriptionSetting.ChannelNumber ===
                channelNumber &&
                new Date(
                    requestDetails.SubscriptionSetting.StartUtc
                ).getTime() === new Date(startTime).getTime()) ||
            requestDetails.RequestType === RequestType.STOP ||
            requestDetails.RequestType === RequestType.RESOLVE_CONFLICT
    );
};

function isPendingVod(actionRequests: any): boolean {
    return !!actionRequests && actionRequests.length > 0;
}

const searchScheduleByStartTime = (
    startTimeUtc: string,
    programId: string,
    stationId: string,
    schedules: []
): any => {
    return _.find(schedules, (s: any) => {
        return (
            s.ProgramId === programId &&
            s.StationId === stationId &&
            new Date(s.StartUtc).getTime() === new Date(startTimeUtc).getTime()
        );
    });
};

export const buildFilterDataSource = (
    subcriptionGroups: any,
    currentSelectedMenu: number,
    channelMap: LiveChannelMap,
    excludeShowType: boolean
): any => {
    // Get list of filter types
    let sortByTypes: string[];

    if (dvrFilterSortEnabled) {
        sortByTypes = ["A-Z", "Date"];
    } else {
        sortByTypes = ["A-Z", "Oldest", "Latest"];
    }

    const sortByOptions = _.map(sortByTypes, (sortBy) => ({
        Id: sortBy,
        Name: sortBy,
    }));
    const programs: any = subcriptionGroups
        .map((s: any) =>
            s?.SubscriptionItems.map((si: any) => si && si.ProgramDetails)
        )
        .flat();

    let filterSortObject = {
        SortBy: buildFilterHead(DvrGroupShowType.SortBy, sortByOptions),
        FilterBy: buildFilterByTypeFilter(
            subcriptionGroups,
            currentSelectedMenu,
            channelMap,
            excludeShowType
        ),
        Category: buildGenreFilter(programs),
    };

    return Object.values(filterSortObject);
};

const buildFilterHead = (name: string, items: any[]): any => {
    const filterHead = {
        Id: name,
        Name: getLocalizedFilterName(name),
        Pivots: items.map((item) => {
            return {
                Id: `${name}|${item.Id}`,
                Name: item.Name,
            };
        }),
    };

    return filterHead;
};

const sortQualityTypes = (qualityTypes: QualityLevels[]): QualityLevels[] => {
    const standartSortedQualityLevels: QualityLevels[] = [
        QualityLevels.UHD,
        QualityLevels.HD,
        QualityLevels.SD,
    ];

    const sortedQualityTypes = standartSortedQualityLevels.filter((type) =>
        qualityTypes.includes(type)
    );

    return sortedQualityTypes;
};

const buildFilterByTypeFilter = (
    subcriptionGroup: any[],
    isRecordMode: number,
    channelMap: LiveChannelMap,
    excludeShowType: boolean
) => {
    const showTypes = !excludeShowType ? getShowTypes(subcriptionGroup) : [],
        qualityTypes = getQualityTypes(subcriptionGroup, channelMap),
        sortedQualityTypes = sortQualityTypes(qualityTypes),
        allTypes = _.union(sortedQualityTypes, showTypes);

    if (isRecordMode === 0 && isSavedState(subcriptionGroup)) {
        allTypes.unshift(FilterByOption.SAVED);
    }

    const subscriptionItems: any = subcriptionGroup
        .map((s: any) => s?.SubscriptionItems)
        .flat();

    if (isRecordMode === 0 && isExpireSoon(subscriptionItems)) {
        allTypes.unshift(FilterByOption.EXPIRING);
    }

    allTypes.unshift(FilterByOption.ALL);

    let options = _.map(allTypes, (type: string) => ({
        Id: type,
        Name: getLocalizedFilterName(type),
    }));
    options = _.uniqBy(options, "Name");

    return buildFilterHead(DvrGroupShowType.FilterBy, options);
};

const buildGenreFilter = (programs: any[]) => {
    let genres: any[] = _.compact(
        _.flatten(_.map(programs, (program) => program?.Genres))
    );

    let otherFilter = null;
    genres = _.uniqBy(genres, "Id");
    genres = genres.filter((genre) => {
        genre.Name = (Genre && (Genre[genre.Id] as any)) || genre?.Name;
        if (genre.Id === "2023") {
            otherFilter = genre; // Other Filter 2023 code
            return false;
        }
        return genre;
    });

    genres = _.sortBy(genres, (genre) => genre?.Name);

    const all = { Id: "All", Name: "All" };
    genres.unshift(all);
    otherFilter && genres.push(otherFilter);

    return buildFilterHead("Category", genres);
};

const getShowTypes = (subcriptionGroups: any[]) => {
    const programsShowTypes = subcriptionGroups.map((subcriptionGroup: any) => {
        if (subcriptionGroup?.SubscriptionItems[0]?.ProgramDetails) {
            return subcriptionGroup.SubscriptionItems[0].ProgramDetails
                .ShowType;
        }
    });
    return _.compact(programsShowTypes);
};

const getQualityTypeByChannelNumber = (
    channelMap: LiveChannelMap,
    channelNumber: number
): any => {
    const channel = channelMap.findChannelByNumber(channelNumber).channel;
    const service = channel && channelMap.getService(channel);
    const serviceQuality = service ? service.QualityLevel : null;

    return serviceQuality;
};

const getQualityUniversalName = (type: string): QualityLevels | undefined => {
    let name: QualityLevels | undefined;

    switch (type) {
        case QualityLevels.UHD:
        case QualityLevels.ReachUHD:
            name = QualityLevels.UHD;
            break;
        case QualityLevels.HD:
        case QualityLevels.ReachHD:
            name = QualityLevels.HD;
            break;
        case QualityLevels.SD:
        case QualityLevels.ReachSD:
            name = QualityLevels.SD;
            break;
    }
    return name;
};

const getQualityTypes = (
    subcriptionGroups: any[],
    channelMap: LiveChannelMap
): QualityLevels[] => {
    const programsQualityTypes = subcriptionGroups.map((subcriptionGroup) => {
        const channelNumber = subcriptionGroup.Settings.ChannelNumber,
            programQuality = getQualityTypeByChannelNumber(
                channelMap,
                channelNumber
            ),
            programQualityUniversalName = getQualityUniversalName(
                programQuality
            );
        return programQualityUniversalName;
    });

    return _.compact(programsQualityTypes);
};

const getLocalizedFilterName = (type: string): string => {
    let name: string;
    switch (type) {
        case FilterByOption.ALL:
            name = AppStrings?.str_filter_all;
            break;
        case FilterByOption.SAVED:
            name = AppStrings?.str_filter_saved;
            break;
        case FilterByOption.EXPIRING:
            name = AppStrings?.str_filter_expiry;
            break;
        case QualityLevels.UHD:
        case QualityLevels.ReachUHD:
            name = AppStrings?.str_filter_quality_UHD;
            break;
        case QualityLevels.HD:
        case QualityLevels.ReachHD:
            name = AppStrings?.str_filter_quality_HD;
            break;
        case QualityLevels.SD:
        case QualityLevels.ReachSD:
            name = AppStrings?.str_filter_quality_SD;
            break;
        case DvrGroupShowType.FirstRunOnly:
            name = AppStrings?.str_dvr_filter_head_FirstRunOnly;
            break;
        case DvrGroupShowType.SortBy:
            name = AppStrings?.str_dvr_filter_head_SortBy;
            break;
        case DvrGroupShowType.FilterBy:
            name = AppStrings?.str_dvr_filter_head_FilterBy;
            break;
        default:
            name = type;
    }
    return name;
};

const isSavedState = (subcriptionGroup: any[]): boolean => {
    const savedState = _.find(subcriptionGroup, (item: any) => {
        const settings = item.Settings;
        const subscriptionItemSettings = item.SubscriptionItems?.filter(
            (si: any) => {
                return si?.Settings?.RecyclingDisabled === true;
            }
        );
        return (
            (!!settings &&
                settings.RecyclingDisabled &&
                item?.SubscriptionItems?.length > 0) ||
            subscriptionItemSettings.length > 0
        );
    });
    return !!savedState;
};

export const isDateWithinExpiryThreshold = (
    expiryDate: Date,
    thresholdInDays: number
): boolean => {
    const currentDate = new Date();

    let currentDateUtc = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds()
    );
    let expiryDateUtc = Date.UTC(
        expiryDate.getFullYear(),
        expiryDate.getMonth(),
        expiryDate.getDate(),
        expiryDate.getHours(),
        expiryDate.getMinutes(),
        expiryDate.getSeconds(),
        expiryDate.getMilliseconds()
    );

    let daysBetweenDates = Math.floor(
        (expiryDateUtc - currentDateUtc) / MILLISECONDS_IN_24HRS
    );

    return daysBetweenDates < 0 ? false : thresholdInDays >= daysBetweenDates;
};

export const hasRecordingExpired = (expiryDate: Date): boolean => {
    let currentDate = new Date();

    let currentDateUtc = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds(),
        currentDate.getMilliseconds()
    );
    let expiryDateUtc = Date.UTC(
        expiryDate.getFullYear(),
        expiryDate.getMonth(),
        expiryDate.getDate(),
        expiryDate.getHours(),
        expiryDate.getMinutes(),
        expiryDate.getSeconds(),
        expiryDate.getMilliseconds()
    );

    let daysBetweenDates = Math.floor(
        (expiryDateUtc - currentDateUtc) / MILLISECONDS_IN_24HRS
    );

    return daysBetweenDates < 0 ? true : false;
};

const isItemExpires = (itemState: string, expiryUtc: Date): boolean => {
    let itemExpires = false;
    if (itemState === DvrItemState.RECORDED) {
        const expiryThreshold: number = dvrFilterSoonToBeExpiredDays;
        itemExpires =
            isDateWithinExpiryThreshold(expiryUtc, expiryThreshold) ||
            hasRecordingExpired(expiryUtc);
    }

    return itemExpires;
};

const isItemExpiresSoon = (expiryDate: Date, daysSoon: string): boolean => {
    const currentDate = new Date(),
        currentDateUtc = Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()
        ),
        expiryDateUtc = Date.UTC(
            expiryDate.getFullYear(),
            expiryDate.getMonth(),
            expiryDate.getDate(),
            expiryDate.getHours(),
            expiryDate.getMinutes(),
            expiryDate.getSeconds()
        ),
        daysBetweenDates = Math.floor(
            (expiryDateUtc - currentDateUtc) / MILLISECONDS_IN_24HRS
        );

    return daysBetweenDates <= +daysSoon;
};

export const isExpireSoon = (
    subcriptionitem: any[],
    forcedThreshold?: number
): boolean => {
    const expiryItem = _.find(subcriptionitem, (item: any) => {
        const expiryDate = new Date(item.ContentExpiryUtc),
            isItemExp: boolean = isItemExpires(item.ItemState, expiryDate),
            isItemExpSoon: boolean =
                isItemExp &&
                isItemExpiresSoon(
                    expiryDate,
                    forcedThreshold || dvrFilterSoonToBeExpiredDays
                );
        return isItemExpSoon;
    });

    return !!expiryItem;
};

const expiringSoonSubsctiptionItems = (subcriptionitem: any[]): any => {
    const filteredSubscriptionItems = subcriptionitem.filter((si: any) => {
        const expiryDate = new Date(si.ContentExpiryUtc);
        return (
            isItemExpires(si.ItemState, expiryDate) &&
            isItemExpiresSoon(expiryDate, dvrFilterSoonToBeExpiredDays)
        );
    });
    return filteredSubscriptionItems;
};

const getRecordingTitle = (subcriptionGroup: any) => {
    let title = "";
    if (subcriptionGroup) {
        const { SeriesDetails, SubscriptionItems = [] } = subcriptionGroup;
        if (SeriesDetails) {
            title = SeriesDetails.Title;
        } else if (
            SubscriptionItems.length &&
            SubscriptionItems[0].ProgramDetails
        ) {
            title = SubscriptionItems[0].ProgramDetails.Title;
        }
    }
    return title;
};

const getEarliestTime = (subcriptionGroup: any) => {
    if (subcriptionGroup) {
        const { SubscriptionItems = [] } = subcriptionGroup;
        if (SubscriptionItems && SubscriptionItems.length) {
            return SubscriptionItems[0].ActualAvailabilityStartUtc;
        }
    }
};

export const filterRecordings = (
    filterState: FilterValue,
    subcriptionGroups: any,
    liveChannelMap: LiveChannelMap
): any => {
    // spread, dont modify original collection, subcriptionGroup and subscriptionItem Array
    let filteredResults = [...subcriptionGroups];
    const filterSortyBy = filterState.SortBy.selectedIds[0]?.split("|")[1];
    if (filterState.SortBy.selectedIds.length > 0) {
        // sort
        if (filterSortyBy === "Date" || filterSortyBy === "Oldest") {
            // sort items by date
            filteredResults = filteredResults.sort((x: any, y: any) => {
                const xd = new Date(getEarliestTime(x));
                const yd = new Date(getEarliestTime(y));
                return xd.getTime() - yd.getTime();
            });
            filteredResults = filteredResults.map((sg: any) => {
                const clonedSi = [...sg?.SubscriptionItems];
                const sortedSi = clonedSi.sort((m: any, n: any) => {
                    const md = new Date(m.ActualAvailabilityStartUtc);
                    const nd = new Date(n.ActualAvailabilityStartUtc);
                    return md.getTime() - nd.getTime();
                });
                return { ...sg, SubscriptionItems: sortedSi };
            });
        }

        if (filterSortyBy === "A-Z") {
            // sort items alphabetically
            filteredResults = filteredResults.sort((a: any, b: any) =>
                getRecordingTitle(a).localeCompare(getRecordingTitle(b))
            );

            filteredResults = filteredResults.map((sg: any) => {
                const clonedSi: any = [...sg?.SubscriptionItems];
                const sortedSi = clonedSi.sort((m: any, n: any) => {
                    m.ProgramDetails?.Title.localeCompare(
                        n.ProgramDetails?.Title
                    );
                });
                return { ...sg, SubscriptionItems: sortedSi };
            });
        }

        if (filterSortyBy === "Latest") {
            // sort items date descending
            filteredResults = filteredResults.sort((a: any, b: any) => {
                const ad = new Date(a.Settings.StartUtc);
                const bd = new Date(b.Settings.StartUtc);
                return ad.getTime() - bd.getTime();
            });
            filteredResults = filteredResults.map((sg: any) => {
                const clonedSi: any = [...sg?.SubscriptionItems];
                const sortedSi = clonedSi.sort((m: any, n: any) => {
                    const md = new Date(m.ActualAvailabilityStartUtc);
                    const nd = new Date(n.ActualAvailabilityStartUtc);
                    return md.getTime() - nd.getTime();
                });
                return { ...sg, SubscriptionItems: sortedSi };
            });
        }
    }

    const filterByCategory = filterState.Category.selectedIds[0]?.split("|")[1];
    const filterBy = filterState.FilterBy.selectedIds[0]?.split("|")[1];
    if (filterState.FilterBy.selectedIds.length > 0) {
        // filter by, channels
        if (["HD", "SD"].includes(filterBy)) {
            // by quality
            const qualityToFilter = filterBy;
            filteredResults = filteredResults.filter((sg: any) => {
                const quality = getQualityTypeByChannelNumber(
                    liveChannelMap,
                    sg.Settings.ChannelNumber
                );
                return getQualityUniversalName(quality) === qualityToFilter;
            });
        }

        if (
            [DvrGroupShowType.Any, DvrGroupShowType.FirstRunOnly].includes(
                //@ts-ignore
                filterBy
            )
        ) {
            // by Group Show type
            const filterShowType = filterBy;
            filteredResults = filteredResults.filter((sg: any) => {
                return sg.Settings.ShowType == filterShowType;
            });
        }
        //@ts-ignore
        if ([ItemShowType.TVShow, ItemShowType.Movie].includes(filterBy)) {
            const filterShowType = filterBy;
            filteredResults = filteredResults.filter(
                (subcriptionGroup: any) => {
                    return (
                        subcriptionGroup?.SubscriptionItems[0]?.ProgramDetails
                            ?.ShowType === filterShowType
                    );
                }
            );
        }

        if (filterBy === "ExpireSoon") {
            // By expiry
            filteredResults = filteredResults.map((sg: any) => {
                if (sg && sg.SubscriptionItems) {
                    const clonedSi = [...sg.SubscriptionItems];
                    const clonedSg = { ...sg };
                    const siExpiringSoon = expiringSoonSubsctiptionItems(
                        clonedSi
                    );
                    clonedSg.SubscriptionItems = siExpiringSoon;
                    return clonedSg;
                } else {
                    return sg;
                }
            });
        }

        if (filterBy === "Saved") {
            // By Saved
            filteredResults = filteredResults.filter((sg: any) => {
                return sg.SubscriptionItems?.some((si: any) => {
                    return si?.Settings?.RecyclingDisabled === true;
                });
            });
        }
    }

    // by genre

    if (filterState.Category.selectedIds.length > 0) {
        const genreId = filterByCategory;
        if (genreId !== "All") {
            filteredResults = filteredResults.map((sg: any) => {
                const clonedSi = [...sg?.SubscriptionItems];
                const filteredSi = clonedSi.filter(
                    (si: any) =>
                        si &&
                        si.ProgramDetails?.Genres?.some(
                            (g: any) => g.Id === genreId
                        )
                );
                return { ...sg, SubscriptionItems: filteredSi };
            });
        }
    }

    filteredResults = filteredResults.filter(
        (sg: any) => sg?.SubscriptionItems.length > 0
    );

    return filteredResults;
};

export const filteredGroupedRecordings = (
    filterState: FilterValue,
    groups: any,
    liveChannelMap: LiveChannelMap
): any => {
    // filter each group individually
    type GroupedType = { [key: string]: any[] };
    const filteredGrouped: GroupedType = {};
    Object.entries(groups).forEach(([key, value]) => {
        let filteredResults = [...((value as any[]) || [])];
        filteredResults = filterRecordings(
            filterState,
            filteredResults,
            liveChannelMap
        );
        groups[key as string] = filteredResults;
    });

    const emptyKeys = [];
    const keys = Object.keys(groups);
    for (let i = 0; i < keys.length; i++) {
        if (groups[keys[i]].length === 0) {
            emptyKeys.push(keys[i]);
        }
    }
    emptyKeys.forEach((key) => {
        delete groups[key];
    });
    console.log("groups ", groups);
    return groups;
};

// Button State Fix

export const filterLiveSchedules = (
    liveSchedules: any,
    recordersModels: any,
    channelsByStationId: any,
    serviceMap: any,
    isCloudDVRCapable: boolean
): any => {
    if (liveSchedules && recordersModels) {
        let fiteredLiveSchedules = filterLiveSchedulesForRecordRights(
            liveSchedules,
            recordersModels
        );
        return filterSchedules(
            fiteredLiveSchedules,
            channelsByStationId,
            serviceMap,
            isCloudDVRCapable
        );
    }
};

const filterLiveSchedulesForRecordRights = (
    schedules: any,
    recorderModels: any = []
): any => {
    return _.filter(schedules, (sch: any) => {
        return validateEntitlements(sch?.Entitlements, recorderModels);
    });
};

export const validateEntitlements = (
    entitlements: string[],
    recorderModels: any
) => {
    let hasLocalRecorder = false;
    let hasPrivateRecorder = false;
    let hasSharedRecorder = false;

    recorderModels?.forEach((model: any) => {
        if (model?.RecorderModel === RecorderModel.Local) {
            hasLocalRecorder = true;
        } else if (model?.RecorderModel === RecorderModel.Private) {
            hasPrivateRecorder = true;
        } else if (model?.RecorderModel === RecorderModel.Shared) {
            hasSharedRecorder = true;
        }
    });

    const blockedRecorders = _.invert(
        _.map(entitlements, (entitlement: string) => entitlement.toLowerCase())
    );

    const blockedLocal = !!blockedRecorders.lb;
    const blockedNetwork = !!blockedRecorders.nb;
    const blockedShared =
        !!blockedRecorders.sb || !!blockedRecorders.record_blocked;

    const isAllowed =
        (hasLocalRecorder && !blockedLocal) ||
        (!hasLocalRecorder && hasPrivateRecorder && !blockedNetwork) ||
        (!hasLocalRecorder &&
            hasSharedRecorder &&
            !blockedNetwork &&
            !blockedShared);

    return isAllowed;
};

const filterSchedules = (
    schedules: any,
    channels: any,
    serviceMap: any,
    isCloudDVRCapable: boolean
): any => {
    if (!channels) {
        return [];
    }

    const filteredChannels = filterChannels(
        channels,
        serviceMap,
        isCloudDVRCapable
    );

    const availableStations = _.keys(filteredChannels);
    return _.filter(schedules, (schedule: any) =>
        _.includes(availableStations, schedule?.StationId)
    );
};

const filterChannels = (
    channels: any,
    serviceMap: any,
    isCloudDVRCapable: boolean
): any => {
    if (!channels) {
        return {};
    }

    return filterChannelsByLiveRights(channels, serviceMap, isCloudDVRCapable);
};

const filterChannelsByLiveRights = (
    channelsByStationId: any,
    serviceMap: any,
    isCloudDVRCapable: boolean
): any => {
    let filteredChannelsByStationId: any = {};

    Object.keys(channelsByStationId).forEach((stationId: string) => {
        const recordGrants = hasRecordGrants(
            channelsByStationId[stationId],
            serviceMap,
            isCloudDVRCapable
        );
        if (recordGrants) {
            filteredChannelsByStationId[stationId] =
                channelsByStationId[stationId];
        }
    });

    return filteredChannelsByStationId;
};

const hasRecordGrants = (
    channels: any,
    serviceMap: any,
    isCloudDVRCapable: boolean
): boolean => {
    if (channels && channels.length > 0) {
        if (!isCloudDVRCapable) {
            return false;
        }
        const hasCloudRecorder = true;

        let isChannelsAvailableForRecording = false;

        channels.forEach((channel: any) => {
            const service: any = serviceMap[channel.ServiceCollectionId];

            //If channel is recordable on STB then show record buttons on all devices.
            if (isChannelSubscribed(channel, service) && channel.recordOnSTB) {
                isChannelsAvailableForRecording = true;
                return;
            }

            if (service) {
                // if no service found, user probably doesn't have rights to it.
                const rights = channel.LiveRights;
                if (rights) {
                    rights.forEach((right: any) => {
                        if (!right.q || right.q === service.QualityLevel) {
                            if (right.r) {
                                let restrictions: string[] = right.r.split(",");
                                // showing record button only if there is no DVR cloud restriction
                                let canRecord =
                                    hasCloudRecorder &&
                                    !_.includes(
                                        restrictions,
                                        "nb" // recording network blocked
                                    );
                                isChannelsAvailableForRecording = canRecord;
                            } else {
                                isChannelsAvailableForRecording = true;
                            }
                        }
                    });
                }
            }
        });

        return isChannelsAvailableForRecording;
    }

    return false;
};

const isChannelSubscribed = (channel: any, service: any): boolean => {
    if (!channel) {
        return false;
    }

    const isSubscribed: boolean =
        channel.isSubscribed && channel.isPermitted && !!service;
    const isApp =
        !!channel.ApplicationData ||
        (channel.IsApplication && channel.IsGenericApplicationService);

    return isSubscribed || !isApp; // Apps are nnot considered in current iteration
};

const searchSubscriptionItemsLaterThen = (
    startTimeUtc: string,
    stationId: string,
    channelNumber: number,
    subscriptionGroups: any
): any => {
    let searchedUtcTime = new Date(startTimeUtc).getTime();

    for (let g in subscriptionGroups) {
        let sg = subscriptionGroups[g];
        if (sg.Settings.ChannelNumber !== channelNumber) {
            continue;
        }
        for (let i in sg.SubscriptionItems) {
            let si = sg.SubscriptionItems[i];
            if (
                si.StationId === stationId &&
                new Date(getStartTime(si)).getTime() >= searchedUtcTime
            ) {
                return {
                    SubscriptionGroup: sg,
                    SubscriptionItem: si,
                };
            }
        }
    }

    return {
        SubscriptionGroup: null,
        SubscriptionItem: null,
    };
};

export const showDvrErrorDetails = (
    errorCode: string,
    programName?: string
) => {
    let errorMessage = "";
    switch (errorCode) {
        case DvrItemErrorCode.NO_RECORDERS_AVAILABLE:
        case DvrItemErrorCode.NO_RECORD_RIGHTS:
        case DvrItemErrorCode.EXT_ACCOUNT_NOT_FOUND:
        case DvrItemErrorCode.ERROR_CONTACTING_SERVER:
        case DvrItemErrorCode.MEDIAROOM_EXCEPTION:
        case DvrItemErrorCode.MEDIAROOM_QUEUE_FULL:
        case DvrItemErrorCode.EPG_DATA_MISMATCH:
        case DvrItemErrorCode.PROGRAM_ALREADY_TARGETED:
        case DvrItemErrorCode.NO_EPG_DATA:
        case DvrItemErrorCode.RECORDING_NOT_FOUND:
        case DvrItemErrorCode.MISSING_CACHE_ID:
            errorMessage =
                AppStrings?.str_live_tv_provisioning_error_message;
            break;
        case DvrItemErrorCode.BLACKED_OUT:
            errorMessage = AppStrings?.str_dvr_blackout;
            break;
        case DvrItemErrorCode.NO_RECORD_RIGHTS_FOR_PPV:
            errorMessage =
                AppStrings
                    ?.str_dvr_no_recording_rights_for_ppv_error_message;
            break;
        case DvrItemErrorCode.RECORDING_QUOTA_EXCEDDED:
            errorMessage = `${programName} ${AppStrings?.str_dvr_quota_exceeded}`;
            break;
        case DvrItemErrorCode.GENERIC:
            errorMessage = 'Failed to update. Generic error encountered'
            break;
    }
    if (errorMessage) {
        Alert.alert(errorMessage)
        console.warn("Help")
        // displayModal({
        //     text: errorMessage,
        //     defaultFocusTitle: AppStrings?.str_ok,
        //     buttonDataSource: [
        //         {
        //             title: AppStrings?.str_ok,
        //             onPress: () => { },
        //         },
        //     ],
        // });
    }
};


export const getDurationSeconds = (subscriptionItem: any): number => {
    // calculates actual runtime seconds for all recordings
    // based on actual start and actual end time
    // includes endLateSeconds setting
    return calculateActualRuntimeSeconds(
        getStartTimeIgnoreState(subscriptionItem),
        getEndTimeIgnoreState(subscriptionItem)
    );
};


export const calculateActualRuntimeSeconds = (
    actualStartUtc: Date,
    actualEndUtc: Date
): number => {
    const timeSpanSeconds =
        (actualEndUtc.getTime() - actualStartUtc.getTime()) / 1000;

    // If recording time is less than 1 min return 60 sec.
    return Math.max(timeSpanSeconds, 60);
};

export const getStartTimeIgnoreState = (subscriptionItem: any): Date => {
    // TV2 ActualAvailabilityStartUtc sometimes returns incorrect date for in-progress recordings.
    const {
        ActualAvailabilityStartUtc = undefined,
        ScheduledAvailabilityStartUtc = undefined,
    } = subscriptionItem || {};

    const useActualAvailabilityStartUtc =
        ActualAvailabilityStartUtc &&
        ActualAvailabilityStartUtc !== "0001-01-01T00:00:00Z";
    const actualStartTime: Date =
        ActualAvailabilityStartUtc && new Date(ActualAvailabilityStartUtc);
    const startTime: Date =
        useActualAvailabilityStartUtc &&
            actualStartTime &&
            !isNaN(actualStartTime.getFullYear())
            ? actualStartTime
            : new Date(ScheduledAvailabilityStartUtc);

    return startTime;
};

export const getEndTimeIgnoreState = (subscriptionItem: any): Date => {
    const { ItemState = "", ActualAvailabilityEndUtc = undefined } =
        subscriptionItem || {};
    const useActualAvailabilityEndUtc = !(
        subscriptionItem && ItemState !== DvrItemState.RECORDED
    );
    const actualEndTime: Date =
        ActualAvailabilityEndUtc && new Date(ActualAvailabilityEndUtc);
    const endTime: Date =
        useActualAvailabilityEndUtc &&
            actualEndTime &&
            !isNaN(actualEndTime.getFullYear())
            ? actualEndTime
            : getScheduledEndTime(subscriptionItem);

    return endTime;
};

export const getStopRecordingOptions = () => {
    return [
        {
            title: AppStrings?.str_dvr_recording.stop_recording_at_scheduled_time,
            key: 0,
        },
        {
            title: format(
                AppStrings?.str_dvr_recording.stop_recording_after_minutes,
                "5"
            ),
            key: 300, // seconds
        },
        {
            title: format(
                AppStrings?.str_dvr_recording.stop_recording_after_minutes,
                "15"
            ),
            key: 900, // seconds
        },
        {
            title: format(
                AppStrings?.str_dvr_recording.stop_recording_after_minutes,
                "30"
            ),
            key: 1800, // seconds
        },
        {
            title: format(
                AppStrings?.str_dvr_recording.stop_recording_after_hours,
                "1"
            ),
            key: 3600,
        },
        {
            title: format(
                AppStrings?.str_dvr_recording.stop_recording_after_hours,
                "2"
            ),
            key: 7200,
        },
        {
            title: format(
                AppStrings?.str_dvr_recording.stop_recording_after_hours,
                "3"
            ),
            key: 10800,
        },
    ];
};

function cleanupScheduledSubscriptionGroups(subscriptionGroups: any[]): any[] {
    subscriptionGroups = subscriptionGroups?.concat().filter((sg: any) => {
        if (isEmpty(sg.SubscriptionItems)) {
            return false;
        } else {
            return true;
        }
    });
    return subscriptionGroups;
}


export const createSubscriptionGroups = (
    rawSubscriptionGroupResponse: any,
    type: DVRSubscriptionGroupDataFilterType
): any => {
    const recordingStateIsViewable =
        type === DVRSubscriptionGroupDataFilterType.Viewable;

    if (
        !rawSubscriptionGroupResponse ||
        !rawSubscriptionGroupResponse.SubscriptionGroups ||
        !rawSubscriptionGroupResponse.SubscriptionGroups.length
    ) {
        // Early exit if missing required data.
        return;
    }

    let subscriptionGroups = rawSubscriptionGroupResponse.SubscriptionGroups.slice();

    const uniqueSubscriptionItemIds = new Set();
    const now = new Date();

    subscriptionGroups.forEach((subg: any) => {
        let sg = { ...subg };
        if (sg.SubscriptionItems && sg.SubscriptionItems.length > 0) {
            let sgsi = [...sg.SubscriptionItems];
            sg.SubscriptionItems = sgsi;
            sg.SubscriptionItems = sg.SubscriptionItems.concat().filter(
                (si: any) => {
                    if (uniqueSubscriptionItemIds.has(si.Id)) {
                        return false;
                    }
                    uniqueSubscriptionItemIds.add(si.Id);
                    return isItemStateMatchingFilter(si.ItemState, type);
                }
            );

            if (!recordingStateIsViewable) {
                // correct removal of recording items from scheduled section
                // roots of this update are on backend, some issues with caches and internal workflow
                sg.SubscriptionItems = sg.SubscriptionItems.filter(
                    (item: any) => getEndTimeIgnoreState(item) > now
                );
            }
        }
    });

    if (!recordingStateIsViewable) {
        subscriptionGroups = cleanupScheduledSubscriptionGroups(
            subscriptionGroups
        );
    }

    //@ts-ignore
    if (config?.dvr?.enableManualRecording) {
        subscriptionGroups = subscriptionGroups.filter((sg: any) => {
            return sg.Definition !== Definition.SINGLE_TIME;
        });
    }

    if (recordingStateIsViewable) {
        subscriptionGroups = subscriptionGroups.filter((sg: any) => {
            return sg.SubscriptionItems && sg.SubscriptionItems.length > 0;
        });
    } else {
        subscriptionGroups = subscriptionGroups.filter((sg: any) => {
            return sg.State === DvrGroupState.KNOWN_SCHEDULE;
        });
    }

    return subscriptionGroups;
};

function isItemStateMatchingFilter(
    itemState: string,
    filterParam: DVRSubscriptionGroupDataFilterType
): boolean {
    if (!filterParam) {
        return true;
    }

    if (filterParam === DVRSubscriptionGroupDataFilterType.Viewable) {
        return (
            itemState === DvrItemState.RECORDED ||
            itemState === DvrItemState.RECORDING ||
            itemState === DvrItemState.INVALID
        );
    } else if (filterParam === DVRSubscriptionGroupDataFilterType.Scheduled) {
        return (
            itemState === DvrItemState.CONFLICTS ||
            itemState === DvrItemState.SCHEDULED ||
            itemState === DvrItemState.RECORDING
        );
    }

    return false;
}