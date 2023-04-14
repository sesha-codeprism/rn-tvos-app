import { FeedItem } from "../@types/HubsResponse";

export interface NameValueString {
  name: string;
  value: string;
}
export interface supportedLocales extends NameValueString {
  isRTL: boolean;
}

export enum SourceType {
  UNDEFINED = 0,
  LIVE,
  VOD,
  DVR,
  CATCHUP,
  PACKAGE,
  NETFLIX,
  DOWNLOAD,
  UPCOMING,
  LASTWATCHED,
  PERSON,
}

export enum ContentType {
  UNDEFINED = 0,
  PROGRAM,
  EPISODE,
  SERIES,
  PACKAGE,
  SVODPACKAGE,
  PERSON,
  APP,
  STORE,
  CHANNEL,
  OFFER,
  GENERIC,
  RECOMM,
  DEVICEAPP,
  SETTINGS,
  PPVEVENT,
  PROFILES,
  SIGNUP,
  RESUMED,
  STATIC,
  SINGLETIME,
  PROFILE,
  PASSCODE,
  GENERIC_SERIES,
}

export class ItemType {
  public static APPLICATION = "App";
  public static DEVICEAPP = "DeviceApp";
  public static RECOMM = "Recomm";
  public static CHANNEL = "Channel";
  public static PROGRAM = "Program";
  public static CATCHUP = "Catchup";
  public static VIDEO = "Video"; // Discovery-only // Same as Title
  public static TITLE = "Title"; // Subscriber-only
  public static RECORDING = "Recording"; // Subscriber-only
  public static PPV = "PayPerView"; // Subscriber-only
  public static PERSON = "Person";
  public static SERIES = "Series";
  public static LIVE = "Live";
  public static TEAM = "Team";
  public static GENRE = "Genre";
  public static SCHEDULE = "Schedule";
  public static STATION = "Station";
  public static PACKAGE = "Package"; // "collection" in UI == "package" on the API.
  public static SVODPACKAGE = "SvodPackage";
  public static SVODPACKAGE_PROMOTION = "SubscriptionPackage"; // FUTURE: remove this value once Networks Fixed feed is removed
  public static STORE = "Store";
  public static GENERIC = "Generic";
  public static SETTINGS = "Settings";
  public static LIVEPROGRAM = "LiveProgram";
  public static LIVESERIES = "LiveSeries";
  public static GENERICLIVE = "GENERIC-LIVE"
  public static LIVETVGUIDE = "liveTvGuide"
}

export class ShowType {
  public static MOVIE = "Movie";
  public static TVSHOW = "TVShow";
  public static MOVIEANDTVSHOW = "MovieAndTVShow";
  public static LIVE = "Live";
  public static INVALID = "Invalid";
  public static STATION = "Station";
}

export class DvrSubscriptionDefinition {
  public static SINGLE_TIME = "SingleTime";
  public static SINGLE_PROGRAM = "SingleProgram";
  public static SERIES = "Series";
  public static GENERIC_SERIES = "GenericProgram";
  public static GENERIC_PROGRAM = "SingleProgram";
}

export enum Definition {
  SINGLE_TIME = "SingleTime",
  SINGLE_PROGRAM = "SingleProgram",
  SERIES = "Series",
  GENERIC_PROGRAM = "GenericProgram",
}

export interface Genre {
  Id: string;
  Name: string;
}

export interface Rating {
  System: string;
  Value: string;
}

export interface RatingValue {
  RatingScheme: string;
  Score: string;
  Image: string;
}

export interface ContentRating {
  ProviderId: string;
  ProgramId: string;
  RatingValues: RatingValue[];
}

export interface IAudioTags {
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

export interface IGeneralObj {
  [key: string]: any;
}

export enum ItemShowType {
  "Program" = "Program",
  "SingleProgram" = "SingleProgram",
  "TVShow" = "TVShow",
  "Series" = "Series",
  "Movie" = "Movie",
  "MovieAndTVShow" = "MovieAndTVShow",
  "SvodPackage" = "SvodPackage",
  "browseSvodPackage" = "browseSvodPackage",
  "liveTvGuide" = "liveTvGuide",
  "DvrScheduled" = "DvrScheduled",
  "DvrRecording" = "DvrRecording",
  "DvrProgram" = "DvrProgram",
  "DvrMovie" = "DvrMovie",
  "Package" = "Package",
  "discovery" = "discovery",
  "subscriber" = "subscriber",
  "Person" = "Person",
  "App" = "App",
  "Title" = "Title",
  "Episode" = "Episode",
  "Channel" = "Channel",
}

export const imageMappingObject: { [key: string]: string } = {
  "16x9/KeyArt": "16x9/keyartlarge.jpg",
  "16x9/Poster": "16x9/posterlarge.jpg",
  "2x3/KeyArt": "2x3/keyartlarge.jpg",
  "2x3/Poster": "2x3/posterlarge.jpg",
  "3x4/KeyArt": "3x4/keyartlarge.jpg",
  "3x4/Poster": "3x4/posterlarge.jpg",
};

export const browseType = {
  favorites: "favorites",
  libraries: "libraries",
  browsepromotions: "browsepromotions",
  browsemovies: "browsemovies",
  browsetv: "browsetv",
  restartTv: "restartTv",
  browsepackages: "browsepackages",
  browsemoviesandtv: "browsemoviesandtv",
  browserecommendations: "browserecommendations",
  browsemixedrecommendations: "browsemixedrecommendations",
  favoriteschannel: "favoriteschannel",
};
export type QualityLevelValue =
  | "UHD"
  | "HD"
  | "SD"
  | "ReachUHD"
  | "ReachHD"
  | "ReachSD"
  | "Mobile"
  | "";

export const feedBaseURI = {
  discovery: new RegExp(/^udl:\/\/discovery\/(\S)/),
  subscriber: new RegExp(/^udl:\/\/subscriber\/(\S)/),
};

export type feedType = FeedItem | any;

export function padLeft(num: number) {
  return num < 10 ? `0${num}` : num;
}

export interface IVideoProfile {
  PlaybackUri: string;
  Id: string;
  Encoding: string;
  Owner: string;

  /**
   * Quality level. See {QualityLevels} for the list of possible values.
   */
  QualityLevel: QualityLevelValue;
  AudioTags?: IAudioTags;
}
export interface ITitleVideoProfile extends IVideoProfile {
  PlaybackUri: string;
}

export class TransactionType {
  public static RENT = "Rent";
  public static PURCHASE = "Purchase";
  public static SUBSCRIBE = "Subscription";
}

export interface IStreamLimits {
  ManagedInHome?: number;
  ManagedOutOfHome?: number;
  ReachInHome?: number;
  ReachOutOfHome?: number;
}

export interface IPlayAction {
  VideoProfile: IVideoProfile;
  VideoProfiles: ITitleVideoProfile[];
  ExpirationUtc: string;
  StartUtc: string;
  TransactionType?: TransactionType;
  TimeToExpiry: string;
  Restrictions?: string[];
  HoursToExpiry?: number;
  QualityLevels?: QualityLevelValue[];
  ChannelNumber?: number;
  StreamLimits?: IStreamLimits;
}

export const orderedQualityLevels = {
  UHD: 0,
  ReachUHD: 1,
  HD: 2,
  ReachHD: 3,
  SD: 4,
  ReachSD: 5,
};

export const generalizeQualityLevels = {
  ReachUHD: "UHD",
  ReachHD: "HD",
  ReachSD: "SD",
};

export const encodings = {
  Hls: 1,
  SmoothStreaming: 1,
  Jitp: 1,
};

// Generated by https://quicktype.io
export interface NetworkInfo {
  Id: string;
  Name: string;
  PFImages: Image[];
  Images: Image[];
}

export interface ILibrary extends IResult {
  Name: string;
  Description: string;
  LibraryItems: string[];
  Udl: string;
}

export interface ILibrarySet {
  Libraries: ILibrary[];
  LibraryItems: ILibraryItem[];
}

export interface Image {
  Size: string;
  ImageType: string;
  Uri: string;
}

export enum DvrItemState {
  INVALID = "Invalid",
  PENDING_ADD = "PendingAdd",
  PENDING_UPDATE = "PendingUpdate",
  PENDING_DELETE = "PendingDelete",
  SCHEDULED = "Scheduled",
  CONFLICTS = "Conflicts",
  CANCELED = "Canceled",
  RECORDING = "Recording",
  RECORDED = "Recorded",
  UNAVAILABLE = "Unavailable",
  DELETED = "Deleted",
  EXPIRING = "Expiring",
}
export type LibraryItemType = "Default" | "Title" | "PayPerView" | "Recording";


export interface IResult {
  Id: string;
}

export interface INetworkInfo {
  Id: string;
  Name: string;
  Images: any[];
  PFImages: any[];
}

export interface IBookmark {
  TimeSeconds: number; // non-negative integer
  RuntimeSeconds?: number;
}

export interface ICatchupSchedule {
  CatchupEndUtc: string; // ISO UTC Date
  CatchupStartUtc: string; // ISO UTC Date
}

export interface IPromotion {
  EntityId: string;
  EntityType: string;
}

export interface IPurchaseAction {
  Promotions: IPromotion[];
  titleId?: string;
  PackageName?: string;
}

export interface IBookmarkDetail {
  LastBookmarkSeconds: number;
  RuntimeSeconds: number;
}

export interface ISeriesSeason extends IResult {
  /**
   * Season name.
   */
  Name: string;

  /**
   * Season number
   */
  SeasonNumber: number;

  /**
   * Episodes count
   */
  EpisodesCount: number;

  OriginalName?: string; // Only supported for GraceNote universal data, not clear if back-end ever includes this
}

export interface IRating {
  System: string;
  Value: string;
}

export interface ITitleCatalogInfo {
  /**
   * Library item name.
   */
  Name?: string;

  /**
   * Show type. Valid Item types are ShowType.MOVIE or ShowType.TVSHOW
   */
  ShowType?: string;

  /**
   * Library item description.
   */
  Description?: string;

  /**
   * Corresponding program id.
   */
  UniversalProgramId: string;

  /**
   * Library item Network info.
   */
  Network?: INetworkInfo;

  /**
   * Runtime in seconds
   */
  RuntimeSeconds: number;

  /**
   * Collection of resized images.
   */
  Images: any[];

  /**
   * Collection of supported image types.
   */
  SupportedImages?: string[];

  /**
   * Collection of PCON ratings.
   */
  Ratings: IRating[];

  /**
   * The tags of the title.
   */
  Tags: string[];

  /**
   * Is "new" flag.
   */
  IsNew: boolean;

  /**
   * Is "adult" flag.
   */
  IsAdult: boolean;

  /**
   * Release date as an ISO encoded string
   */
  ReleaseDate?: string;

  /**
   * Release year as a number.
   */
  ReleaseYear?: number;

  /**
   * Catalog star rating.
   */
  StarRating?: number;

  /**
   * The episode's original airing date. (Series/episodes only)
   */
  OriginalAirDate?: string;

  /**
   * The series ID the episode belongs to. (Series/episodes only)
   */
  SeriesId?: string;

  /**
   * The season ID the episode belongs to. (Series/episodes only)
   */
  SeasonId?: string;

  /**
   * The episode's name. (Episodes only)
   */
  EpisodeName?: string;

  /**
   * The episode's season number. (Episodes only)
   */
  SeasonNumber?: number;

  /**
   * The episode's number. (Episodes only)
   */
  EpisodeNumber?: string;

  /**
   * The series new episode count. (Episodes only)
   */
  NewEpisodeCount?: number;

  /**
   * The Entitlements
   */
  Entitlements?: string[];

  /**
   * Locale info
   */
  Locale?: string;

  // for Series
  Seasons?: ISeriesSeason[];

  /**
   *  If set to true, asset has pre-stitched advisory
   */
  HasContentAdvisory?: boolean;
}

export interface ILibraryItem extends IResult {
  /**
   * Library item type. Valid Item types are "Title" or "Recording"
   */
  ItemType: LibraryItemType;

  /**
   * Pinned flag.
   */
  IsPinned?: boolean;

  /**
   * Bookmark time.
   */
  Bookmark?: IBookmark;

  /**
   * Schedule data for catch up content.
   */
  Schedule?: ICatchupSchedule;

  /**
   * List of available play actions.
   */
  PlayActions: IPlayAction[];

  /**
   * List of available purchase actions.
   */
  PurchaseActions: IPurchaseAction[];

  /**
   * Catalog information.
   */
  CatalogInfo: ITitleCatalogInfo;

  /**
   * Entitlements information.
   */
  Entitlements?: string[];

  /**
   * Geo Block information.
   */
  IsGeoBlocked?: boolean;

  /**
   * True if and only if the item is a trailer.
   */
  IsTrailer?: boolean;

  /**
   * Library item Network info.
   */
  Network?: INetworkInfo;

  /**
   * Bookmark detail, undefined if no bookmarks.
   */
  BookmarkDetail?: IBookmarkDetail;

  /**
   * on PPV items
   */
  ServiceCollectionId?: string;
}

export type FilterValue = {
  [key: string]: {
    selectedIds: string[];
  };
};

export type Pivot = {
  Id: string;
  Name?: string;
  Language?: string;
  selectAll?: boolean;
};

export type ConfigData = {
  Id: string;
  Name: string;
  Pivots: Pivot[];
  MultiSelect?: boolean;
};

export interface BrowseGallery {
  page: number;
  lastPageReached: boolean;
  itemFeed: any[];
  filterData: FilterValue;
}

export var RestrictionsType = {
  DESKTOP_BLOCKED: "desktop_blocked",
  PHONE_BLOCKED: "phone_blocked",
  TABLET_BLOCKED: "tablet_blocked",
  FWD_BLOCKED: "fwd_blocked",
  RECORD_BLOCKED: "record_blocked",
  LOCAL_RECORD_BLOCKED: "local_record_blocked",
  FOURG_BLOCKED: "fourg_blocked",
  THREEG_BLOCKED: "threeg_blocked",
  CELLULAR_BLOCKED: "cellular_blocked",
  WIFI_BLOCKED: "wifi_blocked",
  OUTOFCOUNTRY_BLOCKED: "out_of_country",
  OUTOFHOME_BLOCKED: "out_of_home_blocked",
  AIRPLAY_BLOCKED: "airplay_blocked",
  HDMI_BLOCKED: "hdmi_blocked",
  CASTING_BLOCKED: "casting_blocked",
  RWD_BLOCKED: "rwd_blocked",
  RECENTLYAIRED_BLOCKED: "recentlyAired_blocked",
  TIMESHIFT_BLOCKED: "timeshift_blocked",
  CATCHUP_BLOCKED: "catchup_blocked",
  JAILBROKEN_BLOCKED: "jailbroken_blocked",
  PAUSE_RESUME_BLOCKED: "pause_resume_blocked",
  SEEK_SKIP_BLOCKED: "seek_skip_blocked",
  SEEK_SKIP_FWD_BLOCKED: "seek_skip_fwd_blocked",
  SEEK_SKIP_RWD_BLOCKED: "seek_skip_rwd_blocked",
  RESTART_NOW_BLOCKED: "restart_now_blocked",
  ANDROID_BLOCKED: "android_blocked",
  IOS_BLOCKED: "ios_blocked",
  PH: "ph", // phone blocked
  TB: "tb", // tablet blocked
  DT: "dt", // desktop blocked
  OH: "oh", // out of home blocked
  HI: "hi", // hdmi blocked
  CX: "cx", // casting blocked
  AP: "ap", // airplay blocked
  FW: "fw", // forward blocked
  RW: "rw", // rewind blocked
  WF: "wf", // wifi blocked
  CE: "ce", // cellular blocked
  PR: "pr", // pause resume blocked
  SS: "ss", // seek skip blocked NOTE: to be deprecated
  SF: "sf", // seek skip forward blocked
  SR: "sr", // seek skip rewind blocked
  RN: "rn", // restart now blocked
  CT: "ct", // catchup allowed
  SB: "sb", // recording network share blocked
  NB: "nb", // recording network blocked
  LB: "lb", // recording local blocked
  TS: "ts", // timeshift blocked
  RA: "ra", // recently aired blocked
  CU: "cu", // catch up blocked
  DOWNLOAD_BLOCKED: "download_blocked"
};

