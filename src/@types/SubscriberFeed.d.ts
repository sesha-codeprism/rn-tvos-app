import { Network, NetworkInfo } from "../utils/common";

export interface SubscriberFeed {
  Id: string;
  ItemType: string;
  IsPinned: boolean;
  PurchaseActions: PurchaseAction[];
  IsGeoBlocked: boolean;
  CatalogInfo: CatalogInfo;
  IsContentRestrictedForGeolocation: boolean;
  libraryId: string;
  assetType: AssetType;
  title: string;
  image16x9PosterURL: Image16x9PosterURL;
  image16x9KeyArtURL: Image16x9PosterURL;
  image2x3PosterURL: Image16x9PosterURL;
  image2x3KeyArtURL: Image16x9PosterURL;
  durationMinutesString: string;
  Rating: string;
  runtime: string;
  metadataLine2: string;
  usablePlayActions: any[];
  isAssetPlayable: boolean;
}

interface Image16x9PosterURL {
  uri: string;
}

interface AssetType {
  itemType: string;
  contentType: string;
  sourceType: string;
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
  ReleaseYear: number;
  Locale: string;
  HasContentAdvisory: boolean;
  Images: Image[];
  Network: NetworkInfo
  ImageBucketId: string;
  SupportedImages: string[];
}

interface Image {
  Size: string;
  ImageType: string;
  Uri: string;
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
  RentalWindow: string;
  Restrictions: any[];
  PackageId?: string;
  ExternalPackageId?: string;
  PackageName?: string;
  ResourceType?: string;
  ResourceId?: string;
  ExternalResourceId?: string;
  ExternalName?: string;
  PackageTitleCount?: number;
}

interface VideoProfile {
  Id: string;
  Owner: string;
  Encoding: string;
  QualityLevel: string;
  ClientType: string;
}
