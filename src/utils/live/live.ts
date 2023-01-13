import { Rating } from "../common";

export type DateMs = number;


export type ImageType =
    | "2x3/Poster"
    | "2x3/KeyArt"
    | "3x4/Poster"
    | "3x4/Poster"
    | "3x4/KeyArt"
    | "4x3/Poster"
    | "4x3/KeyArt"
    | "16x9/Poster"
    | "16x9/KeyArt"
    | "LayoutMixed"
    | "1x1/Poster";

export type ImageSizeName = "XSmall" | "Small" | "Medium" | "Large" | "XLarge" | "XXLarge";

export type NetworkLogoImageType =
    | "TenFootSmall"
    | "TenFootLarge"
    | "OneFootSmall"
    | "OneFootSmall"
    | "TwoFootSmall"
    | "TwoFootSmall";

export interface IRatingInfo {
    System: string;
    Value: string;
}
export interface IImage {
    Size: ImageSizeName;
    ImageType: ImageType | NetworkLogoImageType;
    Uri: string;
    Height?: number;
    Width?: number;
}

export interface IApplicationData {
    ApplicationId: string;
    Description: string;
    Images?: IImage[];
    Name: string;
    Ratings?: IRatingInfo[];
    StationType: StationType;
    Usage?: "Series" | "Package" | "Title" | "Generic" | "Subscribe";
    Uri?: string;
    AppUrlType?: "HTML5" | "Native"; // AppUrlType may contain 'MRPF'. However, MRPF is for NAPA client. Since reachclient does not take MRPF, removing it from AppUrlType.
    CallLetters?: string;
    IsAdult?: boolean;
    DeepLink?: string;
}

// dates are strings for a short time when retrieved, then converted to date numbers for faster processing.
export interface IQualityRights<DateType extends string | number = number> {
    s?: DateType; // StartDate
    e?: DateType; // EndDate
    q?: QualityLevelValue; // Quality
    r?: string; // Restrictions list, comma-separated
    isPPV?: boolean;
}

export interface IAppService {
    Usage?: string;
    ServiceUrl: string;
}

// This interface is an optimized version of IChannelCache
export interface IChannel {
    ApplicationData?: IApplicationData;
    Number: number;
    CallLetters: string;
    Name: string;
    StationId: string;
    NetworkLogo?: string;
    LogoUri: string;
    Description?: string;
    LiveRights: IQualityRights<number>[]; // assumes processed channel
    ServiceCollectionId: string;
    ProviderId?: string;
    AppService?: IAppService[];
    isSubscribed: boolean;
    isPermitted: boolean;
    recordOnSTB: boolean;
    playOnSTB: boolean;
    hasMulticastRTPServiceType: boolean;
    hasHLSServiceType: boolean;
    LastCatchupEndUtc?: string;
    FirstCatchupStartUtc?: string;
    Genres: { Id: string; Name: string }[];
    isAdult?: boolean;
    hasPPV: boolean;
    StoreIds?: string[];
    StationType?: string;
    LocalizedStoresIds?: string[];
    ConcurrentViewerDisabled?: boolean;
    service?: any;
    schedule?: ILiveSchedule;
    IsApplication?: boolean;
    IsGenericApplicationService?: boolean;
    Service?: any;
    ChannelNumber?: number;
    IsTif?: boolean;
}

export interface IChannelInfo {
    channel: IChannel;
    service: IService;
    pipService?: IService;
    showPlayIcon?: boolean;
}
export interface IJsonArray {
    [key: number]: number | string | boolean | IJsonArray | IJsonObject;
}
export interface IJsonObject {
    [key: string]: number | string | boolean | IJsonArray | IJsonObject;
}

export type QualityLevelValue =
    | "UHD"
    | "HD"
    | "SD"
    | "ReachUHD"
    | "ReachHD"
    | "ReachSD"
    | "Mobile"
    | "";

export interface ChannelMap {
    Id: string;
    channelMapId: string;
    name: string;
    channels: IChannel[];
}

export interface ChannelMapLiveRights<DateType extends string | number = string> {
    accountId: string;
    channelMapId: string;
    channels: ChannelLiveRights<DateType>;
}

export interface ChannelLiveRights<DateType extends string | number = string> {
    [position: string]: QualityRights<DateType>[];
}

export interface ServiceCollection {
    Id: string;
    StationId: string;
    Name: string;
    SortName: string;
    ServiceItems: ServiceItem[];
}

export interface ServiceItem {
    ServiceId: string;
    ServiceGrouping: ServiceGroup;
}

export interface LiveScheduleStation {
    stationId: string;
    schedules: LiveSchedule[];
    // XXX probably a little bit more metadata
}

// The information returned by the Now Next Endpoint.
export interface ILiveSchedule {
    StartUtc: string; // ISO UTC Date
    EndUtc: string; // ISO UTC Date
    Name: string;
    NameUnlocked?: string; // Temp copy to store the unmasked title.
    StartDate?: Date;
    EndDate?: Date;
    Description?: string;
    ReleaseYear?: number;
    StationId: string;
    Ratings?: Rating[];
    ProgramId: string;
    SeriesId: string;
    GlfProgramId?: string;
    GlfSeriesId?: string;
    GlfStationId?: string;
    SeasonNumber?: string;
    SeasonId?: string;
    EpisodeNumber?: string;
    EpisodeName?: string;
    Images?: IImage[];
    Genres?: Genre[];
    ShowType: string;
    Entitlements?: string[];
    FirstCatchupStartUtc?: string;
    LastCatchupEndUtc?: string;
    SupportedImages?: string[];
    IsGeneric?: boolean;
    IsAdult?: boolean;
    $type?: string;
    AudioTags?: AudioTags;
    ChannelNumber?: number;
    ChannelCallLetters?: string; // CONSIDER: added and used by guide.ts view may not exist from cloud
    DvrSchedule?: DvrSchedule;
    IsNew?: boolean;
    Tags?: string[];
    start: DateMs;
    end: DateMs;
    isPlayable?: boolean;
    quality?: {
        q: QualityLevelValue;
        v: number;
    };
    ChannelInfo?: {
        channel?: IChannel;
        service?: IService | null;
    };
}

export interface Genre extends Result, Popularity {
    Name: string;
}

export interface Result {
    Id: string;
}

export interface Popularity {
    Popularity?: number;
}

export interface AudioTags {
    Subtitled?: string;
    Stereo?: string;
    Dolby?: string;
    DolbyDigital?: string;
    DolbyDigital71?: string;
    ClosedCaptioned?: string;
    AudioDescription?: string;
    Dubbed?: string;
    Sap?: string;
}

export interface DvrSchedule {
    EndUtc?: string;
    Name?: string;
    ProgramId?: string;
    SeriesId?: string;
    StartUtc?: string;
    StationId?: string;
}

export interface IChannelCache {
    StationId: string;
    ChannelNumber: number;
    CallLetters: string;
    Name: string;
    StationType: StationType;
    Images?: IImage[];
    ServiceCollectionId: string;
    ProviderId?: string;
    ApplicationId?: string; // App channel
    Description: string; // App channel
    Ratings?: Rating[]; // App channel
    IsAdult?: boolean; // Adult channel
    LastCatchupEndUtc?: string;
    FirstCatchupStartUtc?: string;
    Genres: { Id: string; Name: string }[];
    LocalizedStoresIds: string[];
    IsApplication?: boolean;
    IsGenericApplicationService?: boolean;
    ConcurrentViewerDisabled?: boolean;
}

export interface LiveSchedule extends ILiveSchedule {
    start: number; // ms UTC timestamp
    end: number; // ms UTC timestamp
    isLive?: boolean;
    isPlayable?: boolean;
    quality?: {
        q: QualityLevelValue;
        v: number;
    };
    channel?: IChannel;
    isCurrentSchedule?: boolean;
    IsTif?: boolean;
    TifPosterArtUri?: string;
}

// dates are strings for a short time when retrieved, then converted to date numbers for faster processing.
export interface QualityRights<DateType extends string | number = number> {
    s?: DateType; // StartDate
    e?: DateType; // EndDate
    q?: QualityLevelValue; // Quality
    r?: string; // Restrictions list, comma-separated
    isPPV?: boolean;
}

export type StationType =
    | "Application"
    | "Broadcast"
    | "Cable"
    | "Premium"
    | "Digital";

export interface ChannelMapInfo {
    Channels: IChannelCache[];
    ServiceCollections: ServiceCollection[];
    Services: IService[];
    ChannelEquivalences?: ChannelEquivalencesMap;
}

export interface NowNextScheduleMap {
    [stationId: string]: NowNextSchedule;
}

export interface NowNextSchedule {
    now: LiveSchedule; // channels in ChannelMap processed by udl.live have added start and end parsed time values, different than cloud.ILiveSchedule
    next: LiveSchedule;
    nowRecordingIndicator: RecordingIndicatorState;
    nextRecordingIndicator: RecordingIndicatorState;
}

export enum RecordingIndicatorState {
    Undefined,
    None,
    ScheduledProgram,
    ScheduledSeries,
    ScheduledProgramConflict,
    ScheduledSeriesConflict,
    PendingScheduledProgram,
    PendingScheduledSeries,
    PendingCancelScheduledProgram,
    PendingCancelScheduledSeries,
    Expiring
}

export class ServiceType {
    public static LIVESMOOTHSTREAMING = "LiveSmoothStreaming";
    public static HLSPLAYBACK = "HlsPlayback";
    public static MULTICAST_RTP = "MulticastRTP";
    public static Application = "Application";
}

export interface ChannelEquivalencesMap {
    [key: number]: number[];
}

export interface ServiceMap {
    [serviceCollectionId: string]: IService | null;
}

export enum ServiceGroup {
    Standard = 0,
    PPV = 1
}

export interface ServiceCollectionsMap {
    [serviceCollectionId: string]: ServiceCollection;
}

export class QualityLevels {
    public static UHD = <QualityLevelValue>"UHD";
    public static SD = <QualityLevelValue>"SD";
    public static HD = <QualityLevelValue>"HD";
    public static ReachUHD = <QualityLevelValue>"ReachUHD";
    public static ReachHD = <QualityLevelValue>"ReachHD";
    public static ReachSD = <QualityLevelValue>"ReachSD";
    public static MOBILE = <QualityLevelValue>"Mobile";
}

// moved from platformModel.ts
export enum Capability {
    DVR,
    InProgress_NDVR, // This has been depreciated as by default all the platform supports in-progress DVR recording.
    RTP_Live,
    VSPP_Live,
    VSPP_VOD,
    TimeShift,
    GoogleAssistant,
    SupportsBaidu,
    StreamManaged,
    Multicast_EAS,
    TVInputFramework,
    IsPrivileged
}

// The information returned by the getHubCatchupRecentlyAiredSlotsByChannelMapId.
export interface RecentlyAiredHubSlot {
    StartTime: string;
    EndTime: string;
    Schedules: ILiveSchedule[];
}

export interface ChannelIndex {
    channel: IChannel | undefined;
    channelIndex: number | undefined;
}

export interface IChannelInfo {
    channel: IChannel;
    service: IService;
    pipService?: IService;
    showPlayIcon?: boolean;
}

export interface LiveChannelMapInfo {
    Channels: IChannel[];
    ServiceMap: ServiceMap;
    PipServiceMap?: ServiceMap;
    ChannelMapId?: string;
    MultipleStoreChannelMap?: {
        [key: string]: any;
    };
    ChannelEquivalences?: ChannelEquivalencesMap;
}

export interface IParentalRatingDetail {
    RatingName: string;
    MinimumAge: number;
    IsAdult: boolean;
}

export interface IParentalRatings {
    RatingSystemName: string;
    RatingDetails: IParentalRatingDetail[];
}

export interface IGenreApplicabilities {
    Live?: string[];
    Movie?: string[];
    Pivot?: string[];
    Station?: string[];
    TVShow?: string[];
}

export interface IGenre {
    Id: string;
    Name: string;
    Popularity?: number;
}

export interface ISearchFilters {
    Id: string;
    ParentalRatings: IParentalRatings[];
    ContentDurations: number[]; // in minutes
    Genres: IGenre[];
    GenreApplicabilities?: IGenreApplicabilities;
}

export interface IService {
    Name?: string;
    Description?: string;
    Id: string;
    Type: string;
    IsEncrypted: boolean;
    HostName: string;
    OwnerId: string;
    MediaId: string;
    ServiceUrl: string;
    ServiceIntent: string;
    // added by client:
    ServiceUri?: string;
    Tv2Id: string;
    DataSource?: IVideoDataSource;
    TotalBitrate?: number;
    QualityLevel?: string;
    Usage?: string;
    IsValid?: boolean;
    IsMusicChannel?: boolean;
    Macrovision?: number;
}

export interface IVideoDataSource {
    appToken?: string;
    mediaId: string;
    ownerId: string;
    hostName: string;
    isLive: boolean;
    cdnURL?: string;
    startBookmark?: number;
    // current available bandwidth for the streamManagementEngine.
    availableBitrate?: number;
}

export interface IPrefix {
    (id: String): string;
}

export interface IChannelIndex {
    channel: IChannel | undefined;
    channelIndex: number | undefined;
}