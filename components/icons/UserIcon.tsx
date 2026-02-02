import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface UserIconProps {
  size?: number;
  color?: string;
}

// Simple user/person icon for forms
export function UserIcon({ size = 20, color = '#810100' }: UserIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      {/* Body */}
      <Path
        d="M4 21C4 17.134 7.582 14 12 14C16.418 14 20 17.134 20 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
