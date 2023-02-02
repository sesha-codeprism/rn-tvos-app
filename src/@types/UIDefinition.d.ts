export interface UIDefinition {
  skin: string;
  version: string;
  theme: Theme;
  assets: Assets;
  components: Component2[];
  onScreenLanguages: OnScreenLanguage[];
  config: Config3;
  onscreenLanguage: OnscreenLanguage[];
  metadataByItemType: MetadataByItemType;
  metadataByFeedType: MetadataByFeedType;
  metadataStyles: MetadataStyles;
}

interface MetadataStyles {
  RECOMM: RECOMM2;
}

interface RECOMM2 {
  metadata1: Metadata1;
  metadata2: Metadata2;
  metadata3: Metadata2;
  metadataImageStyle: MetadataImageStyle;
  metadataIconStyles: MetadataImageStyle;
  metadataImageContainerStyle: Metadata1;
  metadataIconContainerStyle: Metadata1;
  metadataContainer1Styles: MetadataContainer1Styles;
  metadataContainer2Styles: FlexRow;
}

interface MetadataContainer1Styles {
  width: number;
  height: number;
  flexDirection: string;
  marginTop: number;
  paddingLeft: number;
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
  metadata3: string;
  metadata2: string;
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

interface Config3 {
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
  limitSwimlaneItemsTo: number;
  maxProfileNameLength: number;
  viewAllPeekValue: number;
}

interface CurrentLocale {
  full: string;
  short: string;
}

interface OnScreenLanguage {
  title: string;
  action: string;
}

interface Component2 {
  id: string;
  config?: Config;
  components?: Component[];
  style?: Style2;
}

interface Style2 {
  container?: Container2;
  backgroundImageStyle?: BackgroundImageStyle;
  gradientViewStyle?: ShowcardImage;
  metadataViewStyle?: MainContainer;
  metadataInnerViewStyle?: MetadataInnerViewStyle;
  imageStyle?: ImageStyle;
  contentRatingsContainer?: ContentRatingsContainer2;
  contentRatingsIcon?: ShowcardImage;
  contentRatingText?: ContentRatingText;
  ratingBlock?: RatingBlock;
  metadataContainer?: ContentRatingsContainer2;
  ratingTextStyle?: RatingTextStyle;
  metadataTitle?: MetadataTitle;
  metadataLine2?: MetadataLine2;
  fontIconStyle?: FontIconStyle;
  statusTextStyle?: StatusTextStyle2;
  filterViewStyle?: FilterViewStyle;
  filterContainerStyle?: FilterContainerStyle;
  buttonContainerStyle?: ButtonContainerStyle2;
  innerViewStyle1?: MainContainer;
  showcardViewStyle?: ShowcardViewStyle;
  headerViewStyle?: HeaderViewStyle;
  headerInnerStyle?: ShowcardImage;
  headerTitleViewStyle?: HeaderTitleViewStyle;
  headerUnderLine?: HeaderUnderLine;
  headerTitleStyle?: RatingTextStyle;
  emptyMessageContainer?: EmptyMessageContainer;
  image?: Image;
  networkImage?: NetworkImage2;
  networkImageView?: NetworkImageView;
  subtitleEmptyMessage?: StatusTextStyles;
  FullPage?: FullPage;
  TabPage?: TabPage;
  overlay?: SolidBackground;
  containerStyle?: ContainerStyle;
  firstBlock?: FirstBlock;
  titleBlock?: TitleBlock;
  seasonTitle?: EpisodeBlockTitle;
  seasonMetadata?: RatingTextStyle;
  flexOne?: MainContainer;
  seasonScrollView?: TitleBlock;
  secondBlock?: MainContainer;
  seasonBlock?: Image;
  seasonText?: TextStyle;
  seasonTextSelected?: TextStyle;
  episodeItemContainer?: EpisodeItemContainer;
  selectedEpisode?: SolidBackground;
  unSelectedEpisode?: Focused;
  episodeItemImage?: ShowcardImage;
  episodeItemShowcard?: FlexRow;
  episodeItemCTA?: ContentRatingText;
  episodeItemInfo?: EpisodeItemInfo;
  episodeItemTitle?: BodyTextStyle;
  episodeItemMetadata?: BodyTextStyle;
  episodeItemDescription?: BodyTextStyle;
  imageContainer?: ImageContainer2;
  textOnImage?: TextOnImage;
  ctaBtnContainer?: CtaBtnContainer;
  buttonGroupContainer?: ButtonGroupContainer;
  iconContainer?: FirstBlock;
  solidBackground?: SolidBackground;
  focusedBackground?: SolidBackground;
  buttonIconContainer?: ShowcardImage;
  ctaButtonStyle?: CtaButtonStyle;
  ctaFontIconStyle?: TextStyle;
  buttonContainer?: ButtonContainer2;
  statusIcon?: ButtonTextStyle;
  descriptionStyle?: TextStyle;
  metadataStyle?: TextStyle;
  titleStyle?: TextStyle;
  seasonNumberTextStyle?: TextStyle;
  networkImageStyle?: NetworkImage2;
  separatorTextStyle?: SeparatorTextStyle;
  focusedUnderLine?: SolidBackground;
  conflictListContainer?: ShowcardImage;
  conflictItemContainer?: ConflictItemContainer;
  conflictItemMetadataContainer?: ShowcardImage;
  conflictItemMetadataLine1Container?: FlexRow;
  conflictItemMetadataLine1?: ConflictItemMetadataLine1;
  conflictIcon?: RatingTextStyle;
  conflictIconContainer?: ConflictIconContainer;
  conflictItemMetadataLine2?: ConflictItemMetadataLine1;
  conflictItemActionButtonContainer?: ConflictItemActionButtonContainer;
  conflictItemActionButtonTextStyle?: RatingTextStyle;
  conflicItemActionButtonStyleProp?: ConflicItemActionButtonStyleProp;
  conflictItemActionButtonSolidBackground?: SolidBackground;
  conflictItemActionButtonBorder?: SolidBackground;
  saveButton?: SaveButton;
  cancelButton?: SaveButton;
  showNotRecordedMessage?: ShowNotRecordedMessage;
  selectButtonContainer?: ConflictItemActionButtonContainer;
  selectButtonTitle?: TextStyle;
  selectButtonContent?: TextStyle;
  selectButtonContentActive?: SelectButtonContentActive;
  selectButtonIcon?: ShowcardImage;
  buttonTextStyle?: RatingTextStyle;
}

interface SelectButtonContentActive {
  color: string;
  opacity: number;
  fontFamily: string;
}

interface ShowNotRecordedMessage {
  fontSize: number;
  fontFamily: string;
  color: string;
  marginBottom: number;
  marginLeft: number;
  marginTop: number;
}

interface SaveButton {
  height: number;
  width: number;
  backgroundColor: string;
  marginBottom: number;
}

interface ConflicItemActionButtonStyleProp {
  borderRadius: number;
  width: number;
  height: number;
  overflow: string;
  backgroundColor: string;
}

interface ConflictItemActionButtonContainer {
  width: number;
  height: number;
  marginLeft: number;
}

interface ConflictIconContainer {
  backgroundColor: string;
  borderRadius: number;
  width: number;
  height: number;
  alignItems: string;
  justifyContent: string;
}

interface ConflictItemMetadataLine1 {
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

interface ConflictItemContainer {
  width: number;
  height: number;
  flexDirection: string;
  justifyContent: string;
  marginLeft: number;
}

interface SeparatorTextStyle {
  color: string;
}

interface ButtonContainer2 {
  flexDirection?: string;
  alignItems?: string;
  marginTop: number;
  width?: number;
  marginLeft?: number;
}

interface ButtonGroupContainer {
  flex: number;
  flexDirection: string;
}

interface CtaBtnContainer {
  flex: number;
  marginTop: number;
}

interface TextOnImage {
  zIndex: number;
  position: string;
  right: number;
  top: number;
  fontFamily: string;
  fontSize: number;
  color: string;
}

interface ImageContainer2 {
  borderRadius: number;
  overflow: string;
  height: number;
}

interface EpisodeItemInfo {
  height: number;
  justifyContent: string;
  flex: number;
  paddingLeft: number;
  paddingRight: number;
}

interface EpisodeItemContainer {
  padding: number;
  marginBottom: number;
  borderRadius: number;
}

interface TitleBlock {
  marginBottom: number;
}

interface FirstBlock {
  width: number;
}

interface ContainerStyle {
  flex: number;
  flexDirection: string;
  paddingTop: number;
  paddingLeft: number;
  paddingRight: number;
  backgroundColor: string;
  opacity: number;
}

interface TabPage {
  backgroundColor: string;
  flex: number;
  paddingTop: number;
}

interface FullPage {
  backgroundColor: string;
  flex: number;
}

interface NetworkImage2 {
  width: number;
  height: number;
  resizeMode: string;
}

interface Image {
  width: number;
  height: number;
  marginBottom: number;
}

interface EmptyMessageContainer {
  flex: number;
  justifyContent: string;
  alignItems: string;
}

interface HeaderUnderLine {
  width: number;
  opacity: number;
  height: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  alignSelf?: string;
  marginLeft?: number;
}

interface HeaderTitleViewStyle {
  flexDirection: string;
  left: number;
  flex: number;
  alignItems: string;
}

interface HeaderViewStyle {
  flexDirection: string;
  flex: number;
  position: string;
  height: number;
  width: number;
}

interface ShowcardViewStyle {
  paddingTop: number;
  paddingBottom: number;
  flex: number;
  marginTop: number;
  flexDirection: string;
}

interface ButtonContainerStyle2 {
  height: number;
  width: number;
  marginTop: number;
}

interface FilterContainerStyle {
  flexDirection: string;
  alignItems: string;
}

interface FilterViewStyle {
  position: string;
  flexDirection: string;
  flex: number;
  top: number;
  right: number;
  alignItems: string;
  alignContent: string;
  zIndex: number;
}

interface StatusTextStyle2 {
  color: string;
  fontFamily: string;
  fontSize?: number;
  marginTop?: number;
}

interface MetadataLine2 {
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  width: number;
}

interface MetadataTitle {
  color: string;
  fontFamily: string;
  fontSize: number;
  paddingTop: number;
  lineHeight: number;
  width: number;
}

interface ContentRatingsContainer2 {
  marginTop: number;
  flexDirection: string;
}

interface MetadataInnerViewStyle {
  flex: number;
  paddingLeft: number;
  paddingRight: number;
  justifyContent: string;
  width: string;
}

interface BackgroundImageStyle {
  position: string;
  top: number;
  height: number;
  width: number;
  flex: number;
  shadowOpacity: number;
}

interface Container2 {
  flex?: number;
  flexDirection?: string;
  flexGrow?: number;
}

interface Component {
  id: string;
  title?: string;
  config?: Config2;
  style?: Style;
}

interface Style {
  container?: Container;
  mainContainer?: MainContainer;
  scrollView?: ScrollView;
  backgroundImageStyle?: MainContainer;
  imageStyle?: ImageStyle;
  detailsBlock?: DetailsBlock;
  secondBlock?: SecondBlock;
  flexRow?: FlexRow;
  ctaBlock?: FlexRow;
  favoriteBlock?: FavoriteBlock;
  ctaButtonGroupBlock?: CtaButtonGroupBlock;
  containerOpacity?: ContainerOpacity;
  firstColumn?: FirstColumn;
  imageContainer?: ImageContainer;
  secondColumn?: SecondColumn;
  thirdColumn?: ThirdColumn;
  networkImageView?: NetworkImageView;
  networkImage?: NetworkImage;
  marginRight20?: MarginRight20;
  networkTitle?: NetworkTitle;
  metadataContainer?: MetadataContainer;
  title?: Title;
  metadataLine1?: MetadataLine1;
  description?: Description;
  showcardImage?: ShowcardImage;
  buttonContainerStyle?: ButtonContainerStyle;
  buttonIconContainer?: ButtonIconContainer;
  solidBackground?: SolidBackground;
  focusedBackground?: SolidBackground;
  moreDetailsContainer?: CtaButtonGroupBlock;
  contentRatingsContainer?: ContentRatingsContainer;
  contentRatingsIcon?: ShowcardImage;
  contentRatingText?: ContentRatingText;
  ratingBlock?: RatingBlock;
  textStyle?: TextStyle;
  progressBarContainer?: ProgressBarContainer;
  progressInfoText?: ProgressInfoText;
  statusTextStyle?: StatusTextStyle;
  fontIconStyle?: FontIconStyle;
  flexOne?: FlexOne;
  ctaButtonStyle?: CtaButtonStyle;
  ctaFontIconStyle?: TextStyle;
  buttonContainer?: ButtonContainer;
  modalContainer?: ModalContainer;
  episodeBlockContainer?: CtaButtonGroupBlock;
  episodeBlockTitle?: EpisodeBlockTitle;
  episodeMetadata?: EpisodeBlockTitle;
  badgeStyle?: BadgeStyle;
  marginTop?: CtaButtonGroupBlock;
  hourGlass?: HourGlass;
  descriptionText?: DescriptionText;
  bodyRoot?: BodyRoot;
  statusTextStyles?: StatusTextStyles;
  headerContainer?: HeaderContainer;
  titleStyles?: TitleStyles;
  subTitleStyles?: TitleStyles;
  genreTextStyle?: DescriptionText;
  bodyTextStyle?: BodyTextStyle;
  ratingTextStyle?: RatingTextStyle;
  row?: Row;
  audioText?: Row;
  ratingContainer?: RatingContainer;
  ratingIndicator?: RatingIndicator;
  separatorStyle?: SeparatorStyle;
  entitlementRow?: ContentRatingsContainer;
  sourceIcon?: SourceIcon;
  indicatorIconStyle?: SourceIcon;
  root?: Root;
  selectButtonContainer?: SelectButtonContainer;
  confirmButton?: ConfirmButton;
  loaderButton?: LoaderButton;
  scrollViewContainer?: ScrollViewContainer;
  viewContainer?: MainContainer;
  innerScrollViewContainerRentBuy?: InnerScrollViewContainerRentBuy;
  innerScrollViewContainer?: InnerScrollViewContainerRentBuy;
  subTextStyle?: SubTextStyle;
  dayTitle?: DayTitle;
  rowMarginTop?: CtaButtonGroupBlock;
  dayText?: RatingTextStyle;
  secondaryText?: BodyTextStyle;
  scheduleContainer?: ScheduleContainer;
  scheduleContentContainer?: MainContainer;
  scheduleImageContainer?: ScheduleImageContainer;
  scheduleImageStyle?: ScheduleImageStyle;
  timeText?: StatusTextStyles;
  divider?: Divider;
  focused?: Focused;
  unfocused?: Focused;
  scheduleTitle?: ScheduleTitle;
  scheduleDescription?: ScheduleDescription;
  scheduleInfoContainer?: ScheduleInfoContainer;
  subscriptionStatusMessage?: SubscriptionStatusMessage;
  buttonTextStyle?: ButtonTextStyle;
  imageBackgroundContainer?: ContainerOpacity;
  sideMenuContainer?: SideMenuContainer;
  header1?: RatingTextStyle;
  header2?: RatingTextStyle;
  header1Spacing?: Header1Spacing;
  headerContainerStyle?: HeaderContainerStyle;
  detailContainer?: ScheduleInfoContainer;
  metadataViewStyle?: MetadataViewStyle;
  imageBackgroundStyle?: MainContainer;
  bgImageStyle?: ImageStyle;
}

interface MetadataViewStyle {
  paddingLeft: number;
}

interface HeaderContainerStyle {
  paddingRight: number;
}

interface Header1Spacing {
  marginTop: number;
  paddingBottom: number;
  paddingRight: number;
}

interface SideMenuContainer {
  backgroundColor: string;
  width?: number;
  position?: string;
  right?: number;
  top?: number;
  zIndex?: number;
  paddingTop?: number;
}

interface ButtonTextStyle {
  fontFamily: string;
}

interface SubscriptionStatusMessage {
  marginLeft: number;
  marginTop: number;
  lineHeight: string;
  fontFamily: string;
  fontSize: string;
  color: string;
}

interface ScheduleInfoContainer {
  paddingTop: number;
  paddingLeft: number;
  flexDirection: string;
}

interface ScheduleDescription {
  width: string;
  lineHeight: string;
  fontFamily: string;
  fontSize: string;
  color: string;
}

interface ScheduleTitle {
  lineHeight: string;
  fontFamily: string;
  fontSize: string;
  color: string;
}

interface Focused {
  opacity: number;
}

interface Divider {
  width: string;
  height: number;
  marginVertical: number;
  backgroundColor: string;
}

interface ScheduleImageStyle {
  height: number;
  width: number;
  resizeMode: string;
  alignSelf: string;
}

interface ScheduleImageContainer {
  flex: number;
  alignSelf: string;
  flexDirection: string;
  justifyContent: string;
  paddingLeft: number;
}

interface ScheduleContainer {
  paddingVertical: number;
  flexDirection: string;
}

interface DayTitle {
  flexDirection: string;
  alignItems: string;
  marginBottom: number;
}

interface SubTextStyle {
  color: string;
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
}

interface InnerScrollViewContainerRentBuy {
  height: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

interface ScrollViewContainer {
  paddingTop: number;
  paddingLeft: number;
  paddingRight: number;
  marginBottom: number;
}

interface LoaderButton {
  height: number;
  width: number;
  marginHorizontal: number;
  marginBottom: number;
  alignSelf: string;
}

interface ConfirmButton {
  height: number;
  width: number;
  marginHorizontal: number;
  marginBottom: number;
}

interface SelectButtonContainer {
  width: string;
  height: number;
  paddingLeft?: number;
  paddingRight?: number;
}

interface Root {
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingBottom?: number;
  flexDirection?: string;
  alignItems?: string;
}

interface SourceIcon {
  fontFamily: string;
  color: string;
  fontSize: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

interface SeparatorStyle {
  width: number | string;
  height: number;
  opacity: number;
  backgroundColor: string;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
}

interface RatingIndicator {
  width: number;
  height: string;
  backgroundColor: string;
  marginRight: number;
}

interface RatingContainer {
  flexDirection: string;
  marginTop: number;
  marginBottom: number;
}

interface Row {
  paddingBottom: number;
}

interface RatingTextStyle {
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface BodyTextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  lineHeight: number;
}

interface TitleStyles {
}

interface HeaderContainer {
  flex?: number;
  flexDirection?: string;
  height?: number;
  width?: number;
  paddingLeft?: number;
  paddingTop?: number;
  backgroundColor?: string;
}

interface StatusTextStyles {
  fontSize: number;
  color: string;
  marginTop: number;
}

interface BodyRoot {
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  backgroundColor: string;
}

interface DescriptionText {
  fontSize: number;
  fontFamily: string;
  color: string;
  lineHeight: number;
  marginBottom: number;
}

interface HourGlass {
  width: number;
  height: number;
  marginTop: number;
  marginLeft: number;
}

interface BadgeStyle {
  fontFamily: string;
  color: string;
  fontSize: number;
  marginLeft: number;
  marginTop: number;
}

interface EpisodeBlockTitle {
  fontFamily: string;
  fontSize: number;
  color: string;
  marginBottom: number;
}

interface ModalContainer {
  position: string;
  top: number;
  right: number;
  zIndex: number;
}

interface ButtonContainer {
  flexDirection: string;
  alignItems: string;
  marginTop: number;
}

interface CtaButtonStyle {
  height: number;
  fontFamily: string;
}

interface FlexOne {
  flex: number;
  marginHorizontal: number;
  marginVertical: number;
}

interface FontIconStyle {
  fontFamily: string;
  color: string;
  fontSize: number;
  marginRight: number;
  marginBottom: number;
}

interface StatusTextStyle {
  fontSize: number;
  color: string;
  paddingBottom: number;
}

interface ProgressInfoText {
  fontFamily: string;
  fontSize: number;
  color: string;
  paddingBottom: number;
  lineHeight: number;
  marginBottom: number;
}

interface ProgressBarContainer {
  height: number;
}

interface TextStyle {
  fontFamily: string;
  color: string;
}

interface RatingBlock {
  marginRight: number;
  flexDirection: string;
}

interface ContentRatingText {
  marginLeft: number;
}

interface ContentRatingsContainer {
  flexDirection: string;
  marginBottom: number;
}

interface SolidBackground {
  backgroundColor: string;
}

interface ButtonIconContainer {
  width: number;
  height: number;
  marginLeft?: number;
  marginTop?: number;
  borderRadius?: number;
  overflow?: string;
  marginHorizontal?: number;
}

interface ButtonContainerStyle {
  flexDirection: string;
  alignItems: string;
  justifyContent: string;
}

interface ShowcardImage {
  width: number;
  height: number;
}

interface Description {
  fontFamily: string;
  fontSize: number;
  color: string;
  lineHeight: number;
  textAlign?: string;
  width?: number;
}

interface MetadataLine1 {
  fontSize: number;
  color: string;
  fontFamily: string;
  paddingBottom?: number;
}

interface Title {
  fontFamily: string;
  fontSize: number;
  color: string;
  paddingBottom: number;
  marginTop?: number;
}

interface MetadataContainer {
  flexDirection: string;
  paddingBottom: number;
}

interface NetworkTitle {
  fontFamily: string;
  fontSize: number | string;
  color: string;
  paddingTop?: number;
}

interface MarginRight20 {
  marginRight: number;
}

interface NetworkImage {
  width: number;
  height: number;
  resizeMode: string;
  marginRight?: number;
}

interface NetworkImageView {
  justifyContent: string;
  alignItems: string;
  backgroundColor: string;
  borderRadius: number;
  height: number;
  width: number;
  padding: number;
  marginBottom: number;
}

interface ThirdColumn {
  flex?: number;
  paddingRight?: number;
  alignItems: string;
  paddingTop?: number;
  paddingLeft?: number;
}

interface SecondColumn {
  flex: number;
  height: number;
}

interface ImageContainer {
  borderRadius: number;
  overflow: string;
  marginTop: number;
  height: number;
}

interface FirstColumn {
  width: number;
  alignItems: string;
}

interface ContainerOpacity {
  flex: number;
  backgroundColor: string;
  opacity: number;
}

interface CtaButtonGroupBlock {
  marginTop: number;
}

interface FavoriteBlock {
  width: number;
  marginTop: number;
}

interface FlexRow {
  flexDirection: string;
}

interface SecondBlock {
  flexDirection: string;
  flex: number;
  height: number;
}

interface DetailsBlock {
  height: number;
  flexDirection: string;
}

interface ImageStyle {
  resizeMode: string;
}

interface ScrollView {
  flex: number;
  marginTop: number;
  paddingTop: number;
}

interface MainContainer {
  flex: number;
}

interface Container {
  flexGrow?: number;
  flex?: number;
}

interface Config2 {
  gradientType?: string;
  startColor?: StartColor;
  endColor?: StartColor;
  start?: Start;
  end?: Start;
  snapToInterval?: number;
  snapToAlignment?: string;
  horizontal?: boolean;
  numColumns?: number;
  placeHolder?: PlaceHolder;
}

interface PlaceHolder {
  uri: string;
}

interface Start {
  x: number;
  y: number;
}

interface StartColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface Config {
  '$top'?: number;
  '$skip'?: number;
  browserecommendations?: Browserecommendations;
  browsemovies?: Browsemovies;
  browsetv?: Browsemovies;
  browsemoviesandtv?: Browsemoviesandtv;
  browsepackages?: Browsepackages;
  browsepromotions?: Browsepromotions;
  browsemixedrecommendations?: Browsemixedrecommendations;
  libraries?: Subscriber;
  continue?: Subscriber;
  favorites?: SvodPackage;
  restartTv?: RestartTv;
  browseSvodPackage?: BrowseSvodPackage;
  browsepayperview?: Browsepayperview;
  browsetrending?: Browsepayperview;
  browsedvrtvshows?: Browsedvrtvshows;
  browsedvrmovies?: Browsedvrtvshows;
  browsesearch?: Browsesearch;
  browsepromotionsCategory?: BrowsepromotionsCategory;
  snapToInterval?: number;
  snapToAlignment?: string;
  minQueryLength?: number;
  assetExpiryDaysThreshold?: number;
  seriesPopup?: SeriesPopup;
}

interface SeriesPopup {
  containerWidth: number;
  buttonWidth: number;
}

interface BrowsepromotionsCategory {
  uri: string;
  params: Params8;
}

interface Browsesearch {
  uri: string;
  params: Params14;
}

interface Params14 {
  '$top': number;
  '$skip': number;
  searchLive: boolean;
}

interface Browsedvrtvshows {
  uri: string;
  params: Params13;
}

interface Params13 {
  showType: string;
  pivotSource: string;
  baseFilters: string;
  '$top': number;
  recordingState: number;
  '$orderBy': string;
  '$skip': number;
}

interface Browsepayperview {
  uri: string;
  params: Params12;
}

interface Params12 {
  '$itemsPerRow': number;
  baseFilters: string;
  '$top': number;
  '$skip': number;
  client: string;
}

interface BrowseSvodPackage {
  uri: string;
  params: Params11;
}

interface Params11 {
  '$top': number;
  '$skip': number;
  '$itemsPerRow'?: number;
}

interface RestartTv {
  uri: string;
  params: Params10;
}

interface Params10 {
  pivots?: string;
  '$top': number;
  '$skip': number;
  '$orderBy'?: string;
  baseFilters?: string;
  '$itemsPerRow'?: number;
}

interface Browsemixedrecommendations {
  uri: string;
  params: Params9;
}

interface Params9 {
  pivotSource?: string;
  baseFilters?: string;
  '$top': number;
  '$skip': number;
  ShowType?: string;
}

interface Browsepromotions {
  discovery?: Browsepackages;
  subscriber?: Subscriber;
  SvodPackage?: SvodPackage;
  catchup?: SvodPackage;
  uri?: string;
  params?: Params8;
}

interface Params8 {
  '$itemsPerRow': number;
  '$top': number;
  '$skip': number;
  client: string;
}

interface Subscriber {
  uri: string;
  params: Params7;
}

interface Params7 {
  '$top': number;
  '$skip': number;
  types: string;
}

interface Browsepackages {
  uri: string;
  params: Params6;
}

interface Params6 {
  pivotSource: string;
  baseFilters: string;
  '$top': number;
  '$orderBy': string;
  '$skip': number;
}

interface Browsemoviesandtv {
  Program?: Program;
  SvodPackage?: SvodPackage;
  uri?: string;
  params?: Params5;
}

interface Params5 {
  pivotGroup: string;
  '$itemsPerRow': number;
  pivotSource: string;
  baseFilters: string;
  '$top': number;
  '$skip': number;
  client: string;
}

interface SvodPackage {
  uri: string;
  params: Params4;
}

interface Params4 {
  '$top': number;
  '$skip': number;
}

interface Program {
  uri: string;
  params: Params3;
}

interface Params3 {
  showType: string;
  pivotSource: string;
  baseFilters: string;
  '$top': number;
  '$orderBy': string;
  '$skip': number;
}

interface Browsemovies {
  uri: string;
  params: Params2;
}

interface Params2 {
  showType?: string;
  pivotSource: string;
  baseFilters: string;
  '$top': number;
  '$orderBy'?: string;
  '$skip': number;
  pivotGroup?: string;
  '$itemsPerRow'?: number;
  client?: string;
}

interface Browserecommendations {
  uri: string;
  params: Params;
}

interface Params {
  '$top': number;
  '$skip': number;
  atHome?: boolean;
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
  fontColors: FontColors;
  fontFamily: FontFamily;
  fontSizes: FontSizes;
  lineHeights: FontSizes;
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

interface FontSizes {
  caption1: number;
  body1: number;
  body2: number;
  heading1: number;
  heading2: number;
  heading3: number;
  subTitle1: number;
  subTitle2: number;
}

interface FontFamily {
  regular: string;
  semiBold: string;
  bold: string;
  icons: string;
}

interface FontColors {
  light: string;
  lightGrey: string;
  darkGrey: string;
  orange: string;
  statusWarning: string;
  statusError: string;
  badge: string;
}