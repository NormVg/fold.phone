import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface GoogleIconProps {
  size?: number;
}

// Google "G" icon from auth.svg line 26
export function GoogleIcon({ size = 24 }: GoogleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M17.4744 9.088C17.4744 14.155 14.0045 17.761 8.8804 17.761C3.9675 17.761 0 13.793 0 8.881C0 3.968 3.9675 0 8.8804 0C11.2724 0 13.2848 0.877 14.8353 2.324L12.4182 4.648C9.2564 1.597 3.3767 3.889 3.3767 8.881C3.3767 11.978 5.851 14.488 8.8804 14.488C12.3968 14.488 13.7145 11.967 13.9222 10.66H8.8804V7.606H17.3347C17.4171 8.061 17.4744 8.497 17.4744 9.088Z"
        fill="#810100"
      />
    </Svg>
  );
}
