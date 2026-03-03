import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { MoodType } from '../mood/MoodPicker';

// Small inline mood icons for timeline cards (all 5 moods)

export function VSadSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#DCBCBC"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 11c.7-.8 1.5-1 2.5-1s1.8.2 2.5 1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M4.5 7v3M11.5 7v3" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
      <Path d="M4.5 5.5l1.5.5M11.5 5.5l-1.5.5" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

export function SadSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#E5D4D4"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 11c.7-.8 1.5-1 2.5-1s1.8.2 2.5 1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

export function NormalSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#E5E3D4"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 10h5" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

export function HappySmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#D4E5D5"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 9.5c.7.8 1.5 1 2.5 1s1.8-.2 2.5-1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

export function VHappySmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#BCDCBE"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5 9c0 0 1 2.5 3 2.5s3-2.5 3-2.5" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M4.5 6c.5-.5 1.5-.5 2 0" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
      <Path d="M9.5 6c.5-.5 1.5-.5 2 0" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

/** Map of MoodType to the corresponding small inline icon component */
export const MOOD_ICONS: Record<MoodType, React.FC<{ size?: number }>> = {
  'V. Sad': VSadSmallIcon,
  'Sad': SadSmallIcon,
  'Normal': NormalSmallIcon,
  'Happy': HappySmallIcon,
  'V. Happy': VHappySmallIcon,
};

/** Get the mood icon component for a given mood string. Falls back to NormalSmallIcon. */
export function getMoodIcon(mood: string): React.FC<{ size?: number }> {
  return MOOD_ICONS[mood as MoodType] || NormalSmallIcon;
}
