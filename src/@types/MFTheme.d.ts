export interface MFThemeObject {
  colors: Colors;
  fonts: Fonts;
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

interface Colors {
  primary: string;
  secondary: string;
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
