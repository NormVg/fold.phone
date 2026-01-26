import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { TimelineColors } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

interface ProfileAvatarProps {
  imageSource?: any;
}

/**
 * Large profile avatar with outer cream ring - EXACT from home:profile.svg
 * From SVG:
 * - Outer cream circle: cx="196" cy="158" r="62" fill="#FDFBF7"
 * - Outer stroke: r="61.5" stroke="black" stroke-opacity="0.1"
 * - Inner avatar circle: cx="196" cy="158" r="50.5" fill="#D9D9D9" stroke="#7F0000"
 * - Avatar mask: r="50"
 * - Image rect: 100x100
 */
export function ProfileAvatar({ 
  imageSource,
}: ProfileAvatarProps) {
  // Exact sizes from SVG
  const outerRadius = 62 * SCALE; // r=62
  const innerRadius = 50 * SCALE; // r=50.5 (using 50 for image)
  const outerDiameter = outerRadius * 2;
  const innerDiameter = innerRadius * 2;

  return (
    <View style={[styles.container, { width: outerDiameter, height: outerDiameter }]}>
      {/* Outer cream circle with black stroke */}
      <View 
        style={[
          styles.outerRing, 
          { 
            width: outerDiameter, 
            height: outerDiameter, 
            borderRadius: outerRadius,
          }
        ]} 
      />
      
      {/* Inner avatar circle with dark red border */}
      <View 
        style={[
          styles.avatarContainer, 
          { 
            width: innerDiameter + 2, // +2 for border
            height: innerDiameter + 2,
            borderRadius: (innerDiameter + 2) / 2,
          }
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={[
              styles.avatarImage,
              {
                width: innerDiameter,
                height: innerDiameter,
                borderRadius: innerRadius,
              }
            ]}
          />
        ) : (
          <View 
            style={[
              styles.avatarPlaceholder,
              {
                width: innerDiameter,
                height: innerDiameter,
                borderRadius: innerRadius,
              }
            ]} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    backgroundColor: '#FDFBF7', // Exact from SVG
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)', // stroke="black" stroke-opacity="0.1"
  },
  avatarContainer: {
    backgroundColor: '#D9D9D9', // Exact from SVG
    borderWidth: 1,
    borderColor: '#7F0000', // Exact from SVG
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    backgroundColor: '#D9D9D9',
  },
});
