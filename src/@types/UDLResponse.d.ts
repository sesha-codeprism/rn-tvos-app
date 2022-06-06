export interface UDLResponse {
  Libraries: Library[];
  LibraryItems: LibraryItem[];
}

export interface LibraryItem {
  Id: string;
  ItemType: string;
  IsPinned: boolean;
  PurchaseActions?: PurchaseAction[];
  CatalogInfo: CatalogInfo;
  IsContentRestrictedForGeolocation: boolean;
  PlayActions?: PlayAction[];
}

interface PlayAction {
  VideoProfile: VideoProfile2;
  ExpirationUtc: string;
  TimeToExpiry: string;
  HoursToExpiry: number;
  StartUtc: string;
  Restrictions: any[];
  Terms: string;
  OfferId?: string;
  ExternalOfferId?: string;
}

interface VideoProfile2 {
  PlaybackUri: string;
  PlaybackOrigin: string;
  Id: string;
  Encoding: string;
  QualityLevel: string;
  ClientType: string;
}

interface CatalogInfo {
  Name: string;
  ShowType: string;
  Description: string;
  UniversalProgramId: string;
  RuntimeSeconds: number;
  Ratings: Rating[];
  Tags: string[];
  IsAdult: boolean;
  ReleaseYear?: number;
  Locale: string;
  HasContentAdvisory: boolean;
  Images?: PackageImage[];
  ImageBucketId?: string;
  SupportedImages?: string[];
  Entitlements?: string[];
  DPS?: AudioTags;
  Network?: Network;
  OriginalAirDate?: string;
  SeriesId?: string;
  EpisodeName?: string;
  SeasonNumber?: number;
  SeasonId?: string;
  EpisodeNumber?: string;
  NewEpisodeCount?: number;
}

interface Network {
  Id: string;
  Name: string;
  PFImages: PackageImage[];
  Images: PackageImage[];
}

interface Rating {
  System: string;
  Value: string;
}

interface PurchaseAction {
  OfferId: string;
  ExternalOfferId: string;
  VideoProfiles: VideoProfile[];
  QualityLevels: string[];
  Price: number;
  Currency: string;
  TransactionType: string;
  Terms: string;
  ExpirationUtc: string;
  TimeToExpiry: string;
  HoursToExpiry: number;
  RentalWindow?: string;
  Restrictions: any[];
  PackageId?: string;
  ExternalPackageId?: string;
  PackageName?: string;
  ResourceType?: string;
  ResourceId?: string;
  ExternalResourceId?: string;
  ExternalName?: string;
  PackageTitleCount?: number;
  PackageImages?: PackageImage[];
  BillingId?: string;
}

interface PackageImage {
  Size: string;
  ImageType: string;
  Uri: string;
}

interface VideoProfile {
  Id: string;
  Encoding: string;
  QualityLevel: string;
  ClientType: string;
  Owner?: string;
  AudioTags?: AudioTags;
}

interface AudioTags {}

interface Library {
  Id: string;
  Name: string;
  Description: string;
  HasMore: boolean;
  ItemCount: number;
  LibraryItems: string[];
}
