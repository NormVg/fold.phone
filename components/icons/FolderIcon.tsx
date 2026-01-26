import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface FolderIconProps {
  size?: number;
  color?: string;
  showBackground?: boolean;
  backgroundColor?: string;
}

/**
 * Folder icon extracted EXACTLY from home:profile.svg
 * Circle at (41.27, 43.27) r=24.27 with background
 * Folder path from SVG lines 31-32
 */
export function FolderIcon({ 
  size = 24, 
  color = '#810100',
  showBackground = true,
  backgroundColor = 'rgba(129, 1, 0, 0.2)', // #810100 at 20% opacity
}: FolderIconProps) {
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
      <Svg width={size} height={size} viewBox="0 0 26 22" fill="none">
        {/* Exact folder path from SVG - translated to 0,0 origin */}
        {/* Original: M52.3125 37.4375H42.3879... with offset (29.8125, 33.6875) */}
        <Path
          d="M22.5 3.75H12.5754L9.375 0.5496C9.2014 0.3749 8.9949 0.2363 8.7674 0.1419C8.5399 0.0476 8.2959 -0.0007 8.0496 0H1.875C1.3777 0 0.9008 0.1976 0.5492 0.5492C0.1975 0.9008 0 1.3777 0 1.875V18.8227C0.0009 19.3006 0.1913 19.7587 0.5293 20.0965C0.8674 20.4343 1.3256 20.6244 1.8035 20.625H22.6043C23.0737 20.6244 23.5238 20.4376 23.8557 20.1057C24.1876 19.7738 24.3744 19.3237 24.375 18.8543V5.625C24.375 5.1277 24.1775 4.6508 23.8258 4.2992C23.4742 3.9476 22.9973 3.75 22.5 3.75ZM1.875 1.875H8.0496L9.9246 3.75H1.875V1.875Z"
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
