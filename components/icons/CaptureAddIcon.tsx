import React from 'react';
import Svg, { Path, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';

interface CaptureAddIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

// Flower/badge shape with plus icon - extracted from home:timeline.svg lines 4-11
// This is the main capture button in the center of the bottom nav
export function CaptureAddIcon({ 
  size = 42, 
  color = '#810100', 
  backgroundColor = '#FDFBF7' 
}: CaptureAddIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <Defs>
        <Filter
          id="shadow"
          x="0"
          y="0"
          width="47"
          height="47"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dx="2" dy="2" />
          <FeGaussianBlur stdDeviation="2.5" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </Filter>
      </Defs>
      <G filter="url(#shadow)">
        {/* Flower/badge shape background */}
        <Path
          d="M6.737 15.084C6.482 13.934 6.521 12.737 6.851 11.606C7.181 10.475 7.792 9.445 8.626 8.612C9.46 7.78 10.491 7.172 11.623 6.844C12.756 6.516 13.952 6.479 15.102 6.737C15.735 5.747 16.607 4.932 17.638 4.368C18.668 3.804 19.825 3.508 21 3.508C22.175 3.508 23.331 3.804 24.361 4.368C25.392 4.932 26.264 5.747 26.897 6.737C28.049 6.478 29.247 6.515 30.381 6.843C31.515 7.172 32.548 7.782 33.382 8.617C34.217 9.451 34.827 10.484 35.156 11.618C35.485 12.752 35.521 13.95 35.262 15.102C36.252 15.735 37.067 16.607 37.631 17.638C38.195 18.668 38.491 19.824 38.491 20.999C38.491 22.174 38.195 23.331 37.631 24.361C37.067 25.392 36.252 26.264 35.262 26.897C35.52 28.047 35.483 29.244 35.155 30.376C34.828 31.508 34.219 32.539 33.387 33.373C32.554 34.207 31.524 34.818 30.393 35.148C29.262 35.478 28.065 35.517 26.915 35.262C26.282 36.256 25.41 37.074 24.377 37.641C23.345 38.208 22.186 38.505 21.008 38.505C19.831 38.505 18.672 38.208 17.639 37.641C16.607 37.074 15.734 36.256 15.102 35.262C13.952 35.52 12.756 35.483 11.623 35.155C10.491 34.827 9.46 34.219 8.626 33.386C7.792 32.554 7.181 31.524 6.851 30.393C6.521 29.261 6.482 28.065 6.737 26.914C5.74 26.283 4.918 25.41 4.348 24.376C3.779 23.341 3.48 22.18 3.48 20.999C3.48 19.819 3.779 18.657 4.348 17.623C4.918 16.589 5.74 15.716 6.737 15.084Z"
          fill={backgroundColor}
          stroke={color}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      {/* Vertical line of plus */}
      <Path
        d="M21 14V28"
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Horizontal line of plus */}
      <Path
        d="M14 21H28"
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
