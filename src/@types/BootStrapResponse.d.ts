export interface BootStrapResponse {
  AccountId: string;
  DefaultProfileId: string;
  ProfileIds: string[];
  OriginalAccountId: string;
  DeviceId: string;
  RoutingGroupId?: any;
  ReleaseSlot: string;
  ServiceMap: ServiceMap;
  ChannelMapId: number;
  ChannelMapGroupName: string;
  SubscriberGroupIds: string;
  RightsGroupIds: string;
  NotificationGroupIds: string;
  UserId: string;
  DefaultUserId: string;
  TenantId: string;
  DvrEnabled: boolean;
  Features: string[];
  FeatureGroupId: string;
  BirthDate?: any;
  FeatureToggles: FeatureToggle[];
  TimeZoneInformation: TimeZoneInformation;
  EasProfile: EasProfile;
  InHomeToken?: any;
  DomainKeySeed: string;
  TermsAccepted: boolean;
  VersionSet?: any;
  MaxAccountDevices: number;
  DeviceBucket: string;
  DeviceCount: number;
  DeviceName: string;
  IhdServiceEnabled: boolean;
  DownloadAndGoMaxDownloadLimitPerAsset: number;
  VoiceStateReportEnabled: boolean;
  ExperienceGroup?: any;
  CatchupMode: string;
  VoiceToken?: any;
  GeoLocation: string;
}

interface EasProfile {
  GeoCode?: any;
  MulticastEndpoint: MulticastEndpoint;
  AudioBaseUri: string;
}

interface MulticastEndpoint {
  Host: string;
  Port: number;
}

interface TimeZoneInformation {
  Bias: number;
  StandardName: string;
  StandardDate: StandardDate;
  StandardBias: number;
  DaylightName: string;
  DaylightDate: StandardDate;
  DaylightBias: number;
}

interface StandardDate {
  Year: number;
  Month: number;
  DayOfWeek: number;
  Day: number;
  Hour: number;
  Minute: number;
  Second: number;
  Milliseconds: number;
}

interface FeatureToggle {
  Name: string;
  IsDefault: boolean;
  Properties: Properties;
  Description: string;
}

interface Properties {}

interface ServiceMap {
  Id: string;
  Services: Services;
  Prefixes: Prefixes;
  ClientProperties: ClientProperties;
  ReleaseSlot: string;
}

interface ClientProperties {
  ClientConnectionPrefixes: Prefixes;
}

interface Prefixes {
  "10ft": string;
  "10ft-android-stb": string;
  "1ft": string;
  "2ft": string;
  "certloginclient-10ft-stb": string;
}

interface Services {
  buildmakerweb: string;
  catchupPlaybackInfo: string;
  channelMapSlabs: string;
  client: string;
  clientTraceLog: string;
  collection: string;
  collectionReach: string;
  collectionstb: string;
  defaultAccHostName: string;
  discovery: string;
  discoverySSL: string;
  duplex: string;
  duplexLongPoll: string;
  dvr: string;
  dvrnotification: string;
  image: string;
  kafkaCollection: string;
  license: string;
  napaSlabs: string;
  PrerollAudio: string;
  scheduleCache: string;
  search: string;
  searchSSL: string;
  sts: string;
  subscriber: string;
  subscriberbkmark: string;
  ucGMSLog: string;
  uclicense: string;
  upgradeNapa: string;
  vodstorefront: string;
}
