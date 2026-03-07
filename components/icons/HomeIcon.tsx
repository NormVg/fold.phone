import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
  size?: number;
  color?: string;
}

// Simple house icon — matches the weight/style of GridIcon and ProfileIcon
export function HomeIcon({ size = 22, color = '#810100' }: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 1 22 24" fill="none">
      <Path
        d="M11.707 0.293a1 1 0 0 0-1.414 0l-10 10A1 1 0 0 0 1 12h1v8a2 2 0 0 0 2 2h5v-7h4v7h5a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 .707-1.707l-10-10Z"
        fill={color}
      />
    </Svg>
  );
}
