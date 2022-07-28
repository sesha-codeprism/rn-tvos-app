export interface UIDefinition {
  skin: string;
  version: string;
  theme: Theme;
  assets: Assets;
  components: Component[];
  config: Config;
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
}

interface CurrentLocale {
  full: string;
  short: string;
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
