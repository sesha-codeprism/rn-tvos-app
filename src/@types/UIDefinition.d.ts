export interface UIDefinition {
  skin: string;
  version: string;
  theme: Theme;
  assets: Assets;
  components: Component[];
  onScreenLanguages: OnScreenLanguage[];
  config: Config;
  onscreenLanguage: OnscreenLanguage[];
  metadataByItemType: MetadataByItemType;
  metadataByFeedType: MetadataByFeedType;
  metadataStyles: MetadataStyles;
}

interface MetadataStyles {
  RECOMM: RECOMM2;
}

interface RECOMM2 {
  metadata1: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadata2: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadata3: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadataImageStyle: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadataIconStyles: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadataImageContainerStyle: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadataIconContainerStyle: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadataContainer1Styles: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  metadataContainer2Styles: StyleProp<ViewStyle | TextStyle | ImageStyle>;
}

interface MetadataImageStyle {
  width: number;
  height: number;
  alignSelf: string;
}

interface Metadata2 {
  fontFamily: string;
  fontSize: number;
  color: string;
  lineHeight: number;
  textAlign: string;
}

interface Metadata1 {
  width: number;
  height: number;
  marginRight: number;
  backgroundColor: string;
  borderRadius: number;
  opacity: number;
  alignContent: string;
  justifyContent: string;
}

interface MetadataByFeedType {
  CONTINUE: PROGRAMLIVE;
  PINS: PROGRAMLIVE;
  PURCHASES: PURCHASES;
  SIMILAR: PROGRAMLIVE;
  STACKEDCARD: DEVICEAPP;
  STACKEDCARDFORAPP: STACKEDCARDFORAPP;
  NETFLIX: DEVICEAPP;
  DVRSWIMLANE: DVRSWIMLANE;
  DVRGROUPSWIMLANE: DVRGROUPSWIMLANE;
}

interface DVRGROUPSWIMLANE {
  metadata3_selected: string;
  metadata4_selected: string;
  metadata5_selected: string;
}

interface DVRSWIMLANE {
  metadata1: string;
  metadata1_selected: string;
  metadata2_selected: string;
  metadata2: string;
  metadata3_selected: string;
  metadata4_selected: string;
  metadata5_selected: string;
}

interface STACKEDCARDFORAPP {
  metadata_selected: string;
}

interface PURCHASES {
  metadata: string;
  metadata_selected: string;
  metadata2: string;
}

interface MetadataByItemType {
  'PROGRAM-LIVE': PROGRAMLIVE;
  'PROGRAM-UPCOMING': PROGRAMLIVE;
  'PROGRAM-VOD': PROGRAMVOD;
  'PROGRAM-DVR': PROGRAMLIVE;
  'PROGRAM-CATCHUP': PROGRAMCATCHUP;
  'PROGRAM-PACKAGE': PROGRAMCATCHUP;
  'EPISODE-LIVE': EPISODELIVE;
  'EPISODE-UPCOMING': EPISODEUPCOMING;
  'EPISODE-VOD': EPISODELIVE;
  'EPISODE-DVR': EPISODELIVE;
  'SINGLETIME-DVR': EPISODEUPCOMING;
  'EPISODE-CATCHUP': EPISODELIVE;
  'EPISODE-PACKAGE': EPISODEPACKAGE;
  'GENERIC-LIVE': PROGRAMLIVE;
  'GENERIC-DVR': PROGRAMLIVE;
  'GENERIC-CATCHUP': PROGRAMCATCHUP;
  'PPVEVENT-LIVE': PROGRAMLIVE;
  SERIES: PROGRAMCATCHUP;
  PACKAGE: PACKAGE;
  SVODPACKAGE: PROGRAMVOD;
  APP: PROGRAMLIVE;
  'SERIES-NETFLIX': SERIESNETFLIX;
  'PROGRAM-NETFLIX': SERIESNETFLIX;
  'RESUMED-NETFLIX': SERIESNETFLIX;
  'SIGNUP-NETFLIX': SIGNUPNETFLIX;
  'PROFILES-NETFLIX': SERIESNETFLIX;
  'STATIC-NETFLIX': SIGNUPNETFLIX;
  DEVICEAPP: DEVICEAPP;
  RECOMM: RECOMM;
  STORE: PROGRAMLIVE;
  PERSON: PROGRAMLIVE;
  CHANNEL: PROGRAMCATCHUP;
  'CHANNEL-LIVE': DEVICEAPP;
  contentRating: ContentRating;
  'PROGRAM-LASTWATCHED': PROGRAMLASTWATCHED;
  'CHANNEL-LASTWATCHED': PROGRAMLASTWATCHED;
  'EPISODE-LASTWATCHED': EPISODELASTWATCHED;
  'GENERIC-LASTWATCHED': PROGRAMLASTWATCHED;
  'GENERIC_SERIES-LIVE': PROGRAMLIVE;
  'GENERIC_SERIES-CATCHUP': PROGRAMLIVE;
  'GENERIC_SERIES-VOD': RECOMM;
  'Native-APP': PROGRAMLIVE;
}

interface EPISODELASTWATCHED {
  metadataIcon: string;
  metadata: string;
  metadata3: string;
  metadata4: string;
  metadata5: string;
  metadata6_selected: string;
}

interface PROGRAMLASTWATCHED {
  metadataIcon: string;
  metadata: string;
  metadata3: string;
  metadata4: string;
  metadata6_selected: string;
}

interface ContentRating {
  Rating_en: string;
  Rating_fr: string;
}

interface RECOMM {
  metadata1: string;
  metadata2: string;
  metadata3: string;
}

interface DEVICEAPP {
  metadata: string;
  metadata_selected: string;
}

interface SIGNUPNETFLIX {
  metadata: string;
}

interface SERIESNETFLIX {
  metadata: string;
  metadata3: string;
  metadataSettingsOverride: string;
}

interface PACKAGE {
  metadata: string;
  metadata2: string;
  metadata3: string;
  metadata_selected: string;
  metadata2_selected: string;
}

interface EPISODEPACKAGE {
  metadata: string;
  metadata3: string;
  metadata_selected: string;
  metadata3_selected: string;
  metadata_extra_height: string;
}

interface EPISODEUPCOMING {
  metadata: string;
  metadata2: string;
  metadata3: string;
  metadata_selected: string;
  metadata3_selected: string;
  metadata_extra_height: string;
}

interface EPISODELIVE {
  metadata: string;
  metadata2: string;
  metadata2_selected: string;
  metadata3: string;
  metadata_selected: string;
  metadata3_selected: string;
  metadata_extra_height: string;
}

interface PROGRAMCATCHUP {
  metadata: string;
  metadata2: string;
  metadata2_selected: string;
  metadata3: string;
  metadata_selected: string;
  metadata3_selected: string;
}

interface PROGRAMVOD {
  metadata: string;
  metadata2: string;
  metadata_selected: string;
  metadata2_selected: string;
}

interface PROGRAMLIVE {
  metadata: string;
  metadata2: string;
  metadata3: string;
  metadata_selected: string;
  metadata3_selected: string;
}

interface OnscreenLanguage {
  onScreenName: string;
  languageCode: string;
  isRTL: boolean;
}

interface Config {
  enableRTL: boolean;
  debounceTime: number;
  protocol: string;
  hostname: string;
  currentLocale: CurrentLocale;
  useLottieAnimationOnSplash: boolean;
  height16x9: number;
  height2x3: number;
  height4x3: number;
  queryCacheTime: number;
  queryStaleTime: number;
  enableMarquee: boolean;
  metadataTemplate: string;
}

interface CurrentLocale {
  full: string;
  short: string;
}

interface OnScreenLanguage {
  title: string;
  action: string;
}

interface Component {
  id: string;
  subComponents: SubComponent[];
}

interface SubComponent {
  id: string;
  variant: string;
  source?: string;
  style: Style;
  iconStyles?: IconStyles;
  focusedStyle: FocusedStyle;
  label?: string;
  textStyle?: TextStyle;
  focusedTextStyle?: TextStyle;
  avatarStyles?: AvatarStyles;
  imageStyles?: ImageStyles;
}

interface ImageStyles {
  width: number;
  resizeMode: string;
  display: string;
}

interface AvatarStyles {
  alignItems: string;
  justifyContent: string;
  height: number;
  width: number;
  borderRadius: number;
  marginTop: number;
}

interface TextStyle {
  fontSize: number;
  color: string;
}

interface FocusedStyle {
  paddingVertical: number;
  paddingHorizontal: number;
  display: string;
  borderRadius: number;
  marginHorizontal: number;
  padding: number;
  textDecorationLine?: string;
  marginTop?: number;
  marginRight?: number;
}

interface IconStyles {
  height: number;
  width: number;
  resizeMode: string;
  marginTop?: number;
}

interface Style {
  paddingVertical?: number;
  paddingHorizontal: number;
  display?: string;
  borderRadius: number;
  marginHorizontal: number;
  padding?: number;
  marginTop?: number;
  marginRight?: number;
}

interface Assets {
  images: Images;
}

interface Images {
  logo: string;
  logo_short: string;
  search: string;
  message: string;
  onboarding: string;
  settings: string;
  viewMore: string;
  avatar: string;
  splashImage: string;
  splashAnimation: string;
}

interface Theme {
  colors: Colors;
  fonts: Fonts;
  fontSizes: FontSizes;
  lineHeights: LineHeights;
  backgroundColors: BackgroundColors;
  auxiliaryColors: AuxiliaryColors;
}

interface AuxiliaryColors {
  overlay1: string;
  overlay2: string;
  overlay3: string;
  overlay4: string;
  statusWarning: string;
  statusError: string;
  statusSuccess: string;
}

interface BackgroundColors {
  primary1: string;
  primary2: string;
  shade1: string;
  shade2: string;
  shade3: string;
  shade4: string;
  shade5: string;
  white: string;
  black: string;
}

interface LineHeights {
  caption1: number;
  body1: number;
  body2: number;
  heading1: number;
  heading2: number;
  heading3: number;
  subTitle1: number;
  subTitle2: number;
}

interface FontSizes {
  caption1: number;
  caption2: number;
  body1: number;
  body2: number;
  heading1: number;
  heading2: number;
  heading3: number;
  subTitle1: number;
  subTitle2: number;
}

interface Fonts {
  regular: string;
  semiBold: string;
  bold: string;
  icons: string;
}

interface Colors {
  primary: string;
  secondary: string;
  white: string;
  darkGrey: string;
  blue: string;
}
