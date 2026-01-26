import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FlameIconProps {
  size?: number;
  color?: string;
}

/**
 * Flame/Fire icon for "On Fire" badge
 * Based on home:profile:badges.svg
 */
export function FlameIcon({ size = 24, color = '#FDFBF7' }: FlameIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Main flame */}
      <Path
        d="M16 4C16 4 10 10 10 18C10 22.418 12.582 26 16 26C19.418 26 22 22.418 22 18C22 10 16 4 16 4Z"
        fill={color}
      />
      {/* Inner flame highlight */}
      <Path
        d="M16 12C16 12 13 15 13 19C13 21.761 14.343 24 16 24C17.657 24 19 21.761 19 19C19 15 16 12 16 12Z"
        fill={color === '#FDFBF7' ? '#E84D2B' : '#FDFBF7'}
        opacity={0.6}
      />
    </Svg>
  );
}
