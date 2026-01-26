/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Onboarding theme colors extracted from design
export const OnboardingColors = {
  background: '#EDEADC',
  primary: '#810100',
  primaryDark: '#8D1A1A',
  cardDark: '#181717',
  cardLight: '#FFFFFF',
  cardBackground: '#FDFBF7', // Light cream for input cards
  textDark: '#181717',
  textMuted: '#403E3B',
  textLight: '#FFFFFF',
  badgeBorder: 'rgba(24, 23, 23, 0.15)',
  badgeBackground: 'rgba(24, 23, 23, 0.1)',
  iconBackground: 'rgba(129, 1, 0, 0.15)',
  micBackground: 'rgba(255, 255, 255, 0.2)',
};

// Timeline/Home screen colors extracted from home:timeline.svg
export const TimelineColors = {
  background: '#EDEADC',
  primary: '#810100',
  textDark: '#181717', // Dark black shade for date text
  navBarBackground: '#F4F2E8',
  navBarStroke: '#810100',
  captureButtonBackground: '#FDFBF7',
  avatarBackground: '#D9D9D9',
  avatarStroke: '#7F0000',
  timelineMarker: '#810100',
};

// Golden ratio for proportional design
export const GOLDEN_RATIO = 1.618;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
