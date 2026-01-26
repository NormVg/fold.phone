import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface ArrowRightIconProps {
  size?: number;
  color?: string;
  showBackground?: boolean;
  backgroundColor?: string;
}

/**
 * Arrow right icon for pagination/navigation
 * Based on home:profie:foldgrid.svg arrow button
 */
export function ArrowRightIcon({ 
  size = 24, 
  color = '#810100',
  showBackground = true,
  backgroundColor = 'rgba(141, 26, 26, 0.2)',
}: ArrowRightIconProps) {
  const containerSize = showBackground ? size * 2 : size;
  
  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {showBackground && (
        <View 
          style={[
            styles.background, 
            { 
              width: containerSize, 
              height: containerSize, 
              borderRadius: containerSize / 2,
              backgroundColor,
            }
          ]} 
        />
      )}
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M14.5 12.5L10 17C9.9 17.1 9.77 17.15 9.64 17.15C9.51 17.15 9.38 17.1 9.28 17C9.18 16.9 9.13 16.77 9.13 16.64C9.13 16.51 9.18 16.38 9.28 16.28L13.5 12.5L9.28 8.72C9.18 8.62 9.13 8.49 9.13 8.36C9.13 8.23 9.18 8.1 9.28 8C9.38 7.9 9.51 7.85 9.64 7.85C9.77 7.85 9.9 7.9 10 8L14.5 12.5Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
  },
});
