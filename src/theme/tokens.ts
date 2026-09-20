/**
 * src/theme/tokens.ts
 *
 * Design token maps for light and dark themes.
 *
 * Rules:
 *   - Every UI component consumes tokens through useAppTheme() — zero hardcoded colors.
 *   - Swapping a client's brand = replace this file's palette values, nothing else.
 *   - Spacing / radii / typography are brand-agnostic and rarely change per client.
 *
 * Naming convention:
 *   - `bg*`    → backgrounds (surfaces, cards, modals)
 *   - `text*`  → foreground text
 *   - `border*`→ strokes, dividers
 *   - `brand*` → primary / secondary accent colors
 *   - Semantic names (`success`, `error`, `warning`, `info`) for feedback UI
 */

// ──────────────────────────────────────────────
// Palette — the raw colors that token maps reference
// ──────────────────────────────────────────────

const palette = {
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray850: '#303030',
  gray900: '#212121',
  gray950: '#121212',

  // Brand
  blue50: '#E3F2FD',
  blue100: '#BBDEFB',
  blue500: '#2196F3',
  blue600: '#1E88E5',
  blue700: '#1565C0',

  // Secondary
  teal50: '#E0F2F1',
  teal400: '#26A69A',
  teal600: '#00897B',

  // Semantic — feedback
  green500: '#4CAF50',
  green700: '#388E3C',
  red50: '#FFEBEE',
  red500: '#F44336',
  red700: '#D32F2F',
  amber500: '#FFC107',
  amber700: '#FFA000',
  lightBlue100: '#B3E5FC',
  lightBlue500: '#03A9F4',
} as const;

// ──────────────────────────────────────────────
// Spacing scale (4-point grid)
// ──────────────────────────────────────────────

export const spacing = {
  /** 2px */  xxs: 2,
  /** 4px */  xs: 4,
  /** 8px */  sm: 8,
  /** 12px */ md: 12,
  /** 16px */ lg: 16,
  /** 20px */ xl: 20,
  /** 24px */ xxl: 24,
  /** 32px */ xxxl: 32,
  /** 40px */ huge: 40,
  /** 48px */ massive: 48,
  /** 64px */ giant: 64,
} as const;

// ──────────────────────────────────────────────
// Border radii
// ──────────────────────────────────────────────

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ──────────────────────────────────────────────
// Typography
// ──────────────────────────────────────────────

export const typography = {
  /** Font families — swap these per client if using custom fonts */
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  /** Font sizes (px) */
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },

  /** Line heights (px) — roughly 1.4–1.6× font size */
  lineHeight: {
    xxs: 14,
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    xxl: 32,
    xxxl: 40,
    display: 44,
  },

  /** Font weight names mapped to numeric values for RN */
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  // ── Style Presets ─────────────────────────────
  headlineLarge: {
    fontSize: 30,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  headlineMedium: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  headlineSmall: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  titleLarge: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
} as const;

// ──────────────────────────────────────────────
// Color token type
// ──────────────────────────────────────────────

export type ColorTokens = {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgInverse: string;
  bgCard: string;
  bgModal: string;
  bgInput: string;
  bgDisabled: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textDisabled: string;
  textLink: string;

  // Brand
  brandPrimary: string;
  brandPrimaryLight: string;
  brandPrimaryDark: string;
  brandSecondary: string;

  // Borders
  borderDefault: string;
  borderFocused: string;
  borderError: string;

  // Semantic / feedback
  success: string;
  successBg: string;
  error: string;
  errorBg: string;
  warning: string;
  warningBg: string;
  info: string;
  infoBg: string;

  // Misc
  shadow: string;
  overlay: string;
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBar: 'light-content' | 'dark-content';

  // Ergonomic aliases
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  border: string;
  white: string;
  accent: string;
};

// ──────────────────────────────────────────────
// Light theme
// ──────────────────────────────────────────────

export const lightColors: ColorTokens = {
  // Backgrounds
  bgPrimary: palette.white,
  bgSecondary: palette.gray50,
  bgTertiary: palette.gray100,
  bgInverse: palette.gray900,
  bgCard: palette.white,
  bgModal: palette.white,
  bgInput: palette.gray100,
  bgDisabled: palette.gray200,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray700,
  textTertiary: palette.gray500,
  textInverse: palette.white,
  textDisabled: palette.gray400,
  textLink: palette.blue600,

  // Brand
  brandPrimary: palette.blue600,
  brandPrimaryLight: palette.blue50,
  brandPrimaryDark: palette.blue700,
  brandSecondary: palette.teal600,

  // Borders
  borderDefault: palette.gray300,
  borderFocused: palette.blue600,
  borderError: palette.red500,

  // Semantic
  success: palette.green500,
  successBg: '#E8F5E9',
  error: palette.red500,
  errorBg: palette.red50,
  warning: palette.amber500,
  warningBg: '#FFF8E1',
  info: palette.lightBlue500,
  infoBg: palette.lightBlue100,

  // Misc
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  tabBarBg: palette.white,
  tabBarActive: palette.blue600,
  tabBarInactive: palette.gray500,
  statusBar: 'dark-content',

  // Ergonomic aliases
  primary: palette.blue600,
  secondary: palette.teal600,
  background: palette.white,
  surface: palette.white,
  border: palette.gray300,
  white: palette.white,
  accent: palette.teal600,
};

// ──────────────────────────────────────────────
// Dark theme
// ──────────────────────────────────────────────

export const darkColors: ColorTokens = {
  // Backgrounds — Material Design dark surface elevation pattern
  bgPrimary: palette.gray950,
  bgSecondary: palette.gray900,
  bgTertiary: palette.gray850,
  bgInverse: palette.white,
  bgCard: palette.gray900,
  bgModal: palette.gray850,
  bgInput: palette.gray850,
  bgDisabled: palette.gray800,

  // Text
  textPrimary: palette.gray100,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.gray900,
  textDisabled: palette.gray600,
  textLink: palette.blue100,

  // Brand
  brandPrimary: palette.blue500,
  brandPrimaryLight: 'rgba(33, 150, 243, 0.15)',
  brandPrimaryDark: palette.blue700,
  brandSecondary: palette.teal400,

  // Borders
  borderDefault: palette.gray700,
  borderFocused: palette.blue500,
  borderError: palette.red500,

  // Semantic
  success: palette.green500,
  successBg: 'rgba(76, 175, 80, 0.15)',
  error: palette.red500,
  errorBg: 'rgba(244, 67, 54, 0.15)',
  warning: palette.amber500,
  warningBg: 'rgba(255, 193, 7, 0.15)',
  info: palette.lightBlue500,
  infoBg: 'rgba(3, 169, 244, 0.15)',

  // Misc
  shadow: 'rgba(0, 0, 0, 0.4)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  tabBarBg: palette.gray900,
  tabBarActive: palette.blue500,
  tabBarInactive: palette.gray500,
  statusBar: 'light-content',

  // Ergonomic aliases
  primary: palette.blue500,
  secondary: palette.teal400,
  background: palette.gray950,
  surface: palette.gray900,
  border: palette.gray700,
  white: palette.white,
  accent: palette.teal400,
};

// ──────────────────────────────────────────────
// Full theme type (colors + layout tokens)
// ──────────────────────────────────────────────

export type AppTheme = {
  dark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};

export const lightTheme: AppTheme = {
  dark: false,
  colors: lightColors,
  spacing,
  radii,
  typography,
};

export const darkTheme: AppTheme = {
  dark: true,
  colors: darkColors,
  spacing,
  radii,
  typography,
};
