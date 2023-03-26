// import { Rating, Genre } from "../common/common";
// import { IImage } from "../common/images";

import { Rating } from "../utils/common";
import { IImage } from "../utils/live/live";

export interface SeriesDetails {
    Description: string;
    Genres: Genre[];
    Images: IImage[];
    IsAdult: boolean;
    Ratings: Rating[];
    SeriesId: string;
    SupportedImages: string[];
    Title: string;
}

export interface Settings {
    AirtimeDomain: string;
    ChannelNumber: number;
    EndLateSeconds: number;
    ManualRDDurationSeconds: number;
    RecyclingDisabled: false;
    ServiceCollectionId: string;
    ShowType: string;
    StartUtc: string;
    StationId: string;
}

export interface SubscriptionItem {
    Id: string;
    SubscriptionId: string;
    SubscriptionExternalId?: string;
    ProgramDetails: any;
    ItemState: string;
    ItemType?: any;
    ScheduledAvailabilityStartUtc: string;
    ActualAvailabilityStartUtc: string;
    ActualAvailabilityEndUtc: string;
    ActualStartUtc?: string;
    ActualEndUtc?: string;
    ContentExpiryUtc: string;
    ScheduledRuntimeSeconds: number;
    ProgramId: string;
    StationId: string;
    Settings: any;
    ExceedsQuota: boolean;
    IsGeneric: boolean;
    IsAdult?: boolean;
    IsDownloadable?: boolean;
    // Fields below are augmented in the client
    ChannelName: string;
    ChannelLogo: string;
    ChannelCallLetters: string;
    SeasonNumber: number;
    EpisodeNumber: string;
    EpisodeTitle: string;
    Name: string;
    IsRecording?: boolean;
}

export interface SubscriptionGroup {
    Definition: string;
    Id: string;
    ScheduleVersion: 0;
    SeriesDetails: SeriesDetails;
    SeriesId: string;
    Settings: Settings;
    State: string;
    SubscriptionItems: SubscriptionItem[];
    IsRecording?: boolean;
}

export interface QuotaResponse {
    TotalQuotaTimeSeconds: number;
    ConsumedQuotaTimeSeconds: number;
}

export interface SubscriptionGroups {
    scheduled: SubscriptionGroup[];
    viewable: SubscriptionGroup[];
}

export interface SubscriptionGroupsData {
    ContinuationToken: string;
    DiskFullPercentage: number;
    Expired: boolean;
    QuotaResponse: QuotaResponse;
    SubscriptionGroups: SubscriptionGroup[];
}

export interface IRecordingToDelete {
    SubscriptionId: string;
    SubscriptionItemIds: string[];
    isSeries: boolean;
}

export interface IRecordingToStop {
    IsSeries: boolean;
    SubscriptionId: string;
    SubscriptionItemId: string;
}

export interface IConflictSolution {
    SubscriptionId: string;
    ScheduledSubscriptionItemIds: string[];
}

export interface IRecordingToCancel {
    SubscriptionIds: string[];
    SubscriptionItemIds: string[];
}
export interface IBatchDeleteRequest {
    RecordingsToDelete: IRecordingToDelete[];
}

export type SubscriptionGroupsTypeParam = "all" | "movies" | "series"

export type SubscriptionGroupsStateParam = "scheduled" | "viewable" | "viewable-scheduled"

export type SubscriptionGroupsOrderByParam = "startdate" | "title"

export type SubscriptionGroupsParam = {
    type: SubscriptionGroupsTypeParam
    state?: SubscriptionGroupsStateParam
    orderBy?: SubscriptionGroupsOrderByParam
}