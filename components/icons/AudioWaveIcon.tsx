import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface AudioWaveIconProps {
  size?: number;
  color?: string;
}

/**
 * Audio wave/bars icon for the audio logged card
 * Based on home:profile:folddata.svg - vertical bars of varying heights
 */
export function AudioWaveIcon({ size = 24, color = '#810100' }: AudioWaveIconProps) {
  const barWidth = 1.5;
  const gap = 2;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 5 vertical bars centered, varying heights */}
      {/* Bar 1 - short */}
      <Rect x="4" y="10" width={barWidth} height="4" rx="0.75" fill={color} />
      {/* Bar 2 - medium */}
      <Rect x="7.5" y="7" width={barWidth} height="10" rx="0.75" fill={color} />
      {/* Bar 3 - tall (center) */}
      <Rect x="11" y="4" width={barWidth} height="16" rx="0.75" fill={color} />
      {/* Bar 4 - medium */}
      <Rect x="14.5" y="8" width={barWidth} height="8" rx="0.75" fill={color} />
      {/* Bar 5 - short */}
      <Rect x="18" y="9" width={barWidth} height="6" rx="0.75" fill={color} />
    </Svg>
  );
}
