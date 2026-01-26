import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BirdIconProps {
  size?: number;
  color?: string;
}

/**
 * Bird icon for "Early Bird" badge
 * Based on home:profile:badges.svg
 */
export function BirdIcon({ size = 24, color = '#FDFBF7' }: BirdIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Simple bird silhouette */}
      <Path
        d="M8 20C8 20 10 18 12 18C14 18 14 20 16 20C18 20 18 18 20 18C22 18 24 20 24 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bird body */}
      <Path
        d="M10 16C10 13.79 11.79 12 14 12H18C20.21 12 22 13.79 22 16V18H10V16Z"
        fill={color}
      />
      {/* Bird head */}
      <Path
        d="M20 10C20 8.34 18.66 7 17 7C15.34 7 14 8.34 14 10C14 11.66 15.34 13 17 13C18.66 13 20 11.66 20 10Z"
        fill={color}
      />
      {/* Beak */}
      <Path
        d="M20 10L23 9L20 11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Eye */}
      <Path
        d="M17.5 9.5C17.5 9.78 17.28 10 17 10C16.72 10 16.5 9.78 16.5 9.5C16.5 9.22 16.72 9 17 9C17.28 9 17.5 9.22 17.5 9.5Z"
        fill={color === '#FDFBF7' ? '#810100' : '#FDFBF7'}
      />
      {/* Tail */}
      <Path
        d="M10 17L7 15L10 16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
