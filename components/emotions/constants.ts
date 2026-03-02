import {
  HappyMoodIcon,
  NormalMoodIcon,
  SadMoodIcon,
  VHappyMoodIcon,
  VSadMoodIcon,
} from '@/components/icons/MoodIcons';
import type { MoodType } from '@/components/mood';
import { Dimensions } from 'react-native';
import React from 'react';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCALE = SCREEN_WIDTH / 393;

// ---- Mood mappings ----

export const MOOD_SCORE: Record<MoodType, number> = {
  'V. Sad': -2,
  'Sad': -1,
  'Normal': 0,
  'Happy': 1,
  'V. Happy': 2,
};

export const MOOD_COLORS: Record<MoodType, string> = {
  'V. Sad': '#DCBCBC',
  'Sad': '#E5D4D4',
  'Normal': '#E5E3D4',
  'Happy': '#D4E5D5',
  'V. Happy': '#BCDCBE',
};

export const MOOD_BAR_COLORS: Record<MoodType, string> = {
  'V. Sad': '#C9A0A0',
  'Sad': '#D4BFBF',
  'Normal': '#D4D2BF',
  'Happy': '#BFD4C0',
  'V. Happy': '#A3C9A6',
};

export const MOOD_ICONS: Record<MoodType, React.FC<{ size?: number }>> = {
  'V. Sad': VSadMoodIcon,
  'Sad': SadMoodIcon,
  'Normal': NormalMoodIcon,
  'Happy': HappyMoodIcon,
  'V. Happy': VHappyMoodIcon,
};

export const ALL_MOODS: MoodType[] = ['V. Happy', 'Happy', 'Normal', 'Sad', 'V. Sad'];

// ---- Period filter ----

export const PERIODS = [
  { key: '7D', label: '7 Days' },
  { key: '30D', label: '30 Days' },
  { key: '90D', label: '90 Days' },
  { key: 'all', label: 'All Time' },
] as const;

export type PeriodKey = (typeof PERIODS)[number]['key'];

export function getDaysForPeriod(period: PeriodKey): number | null {
  if (period === '7D') return 7;
  if (period === '30D') return 30;
  if (period === '90D') return 90;
  return null;
}

// ---- Helpers ----

export function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// ---- Shared types ----

export interface DayMood {
  date: Date;
  dayKey: string;
  avgScore: number;
  dominantMood: MoodType;
}
