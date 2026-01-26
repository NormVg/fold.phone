import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface DropletIconProps {
  size?: number;
  color?: string;
}

/**
 * Droplet/Water icon for the streak card
 * Based on home:profile:folddata.svg
 */
export function DropletIcon({ size = 24, color = '#810100' }: DropletIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 9.5 12 2.5 12 2.5C12 2.5 4.5 9.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z"
        fill={color}
        fillOpacity={0.2}
      />
      <Circle cx="12" cy="14" r="7" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M12 3C12 3 5 9.5 5 14C5 17.866 8.13401 21 12 21C15.866 21 19 17.866 19 14C19 9.5 12 3 12 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner highlight for droplet effect */}
      <Path
        d="M9 14.5C9 14.5 9.5 12 12 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.5}
      />
    </Svg>
  );
}
