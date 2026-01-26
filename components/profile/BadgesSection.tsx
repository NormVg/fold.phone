import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions from SVG: rect x=4 y=2 width=358 height=160.64 rx=20
const CARD_WIDTH = 358 * SCALE;

// Badge dimensions from SVG:
// - Outer ring (gradient border): needs circle stroke
// - Inner colored circle: r=38.32 (diameter ~76.64)
const BADGE_OUTER_SIZE = 76.64 * SCALE;
const BADGE_INNER_SIZE = 76.64 * SCALE; // Inner circle fills most of it

export interface Badge {
  id: string;
  name: string;
  icon: 'bird' | 'microphone' | 'flame';
  color: string;
  earned: boolean;
}

interface BadgesSectionProps {
  badges?: Badge[];
}

// Default badges matching SVG design exactly
const DEFAULT_BADGES: Badge[] = [
  { id: 'early-bird', name: 'Early Bird', icon: 'bird', color: '#810100', earned: true },
  { id: 'the-voice', name: 'The Voice', icon: 'microphone', color: '#181717', earned: true },
  { id: 'on-fire', name: 'On Fire', icon: 'flame', color: '#E84D2B', earned: true },
];

/**
 * BadgesSection - Shows user's earned badges with gradient ring borders
 * Based on home:profile:badges.svg (exact measurements)
 * 
 * SVG Analysis:
 * - Card: rect x=4 y=2 width=358 height=160.64 rx=20
 * - Title "YOUR BADGES" at y~20
 * - Badge circles at y=48-124 area
 * - Badge 1: cx=90.32 (Early Bird, #810100)
 * - Badge 2: cx=182.96 (The Voice, #181717)
 * - Badge 3: cx=276.32 (On Fire, #E84D2B)
 * - Labels at y~137-145
 */
export function BadgesSection({ badges = DEFAULT_BADGES }: BadgesSectionProps) {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>YOUR BADGES</Text>
      
      {/* Badges row */}
      <View style={styles.badgesRow}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badgeWrapper}>
            <BadgeCircle badge={badge} />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Individual badge with angular gradient ring border
 * The SVG uses a conic gradient on the stroke, we approximate with a simple ring
 */
function BadgeCircle({ badge }: { badge: Badge }) {
  const size = BADGE_OUTER_SIZE;
  const innerSize = BADGE_INNER_SIZE - 4 * SCALE; // Slight inset for ring
  const iconSize = 28 * SCALE;
  
  return (
    <View style={[styles.badgeCircleContainer, { width: size, height: size }]}>
      {/* Gradient ring effect - using semi-transparent white strokes */}
      <Svg width={size} height={size} style={styles.ringOverlay}>
        {/* Angular gradient approximation with multiple arcs */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth={2}
          fill="none"
        />
      </Svg>
      
      {/* Inner colored circle */}
      <View style={[
        styles.innerCircle, 
        { 
          width: innerSize, 
          height: innerSize, 
          borderRadius: innerSize / 2,
          backgroundColor: badge.color 
        }
      ]}>
        <BadgeIcon type={badge.icon} size={iconSize} />
      </View>
    </View>
  );
}

/**
 * Badge icons - Bird, Microphone, Flame
 */
function BadgeIcon({ type, size }: { type: 'bird' | 'microphone' | 'flame'; size: number }) {
  const color = '#FDFBF7';
  
  switch (type) {
    case 'bird':
      return (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          {/* Bird silhouette - simplified from SVG */}
          <Path
            d="M21.5 11.5C21.5 12.5 21 13.5 20 14.5L17 17.5V20.5C17 21.5 16.5 22.5 15.5 23C14.5 23.5 13.5 23.5 12.5 23H8.5C8 23 7.5 22.5 7.5 22C7.5 21.5 7 21 7 20.5L7 19L11 14L10.5 11.5C10.5 10 11 9 12 8.5L14 7.5L16 6.5C17 6 18 6 19 6.5L21 7.5C21.5 8 21.5 9 21.5 10V11.5Z"
            fill={color}
          />
          <Circle cx="18" cy="10" r="1.5" fill={color} fillOpacity={0.5} />
        </Svg>
      );
    
    case 'microphone':
      return (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          {/* Microphone - based on SVG path */}
          <Path
            d="M14 5C12.9 5 12 5.9 12 7V14C12 15.1 12.9 16 14 16C15.1 16 16 15.1 16 14V7C16 5.9 15.1 5 14 5Z"
            fill={color}
          />
          <Path
            d="M18 14C18 16.2 16.2 18 14 18C11.8 18 10 16.2 10 14H8C8 17 10.3 19.4 13 19.9V23H15V19.9C17.7 19.4 20 17 20 14H18Z"
            fill={color}
          />
        </Svg>
      );
    
    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          {/* Flame icon - based on SVG path */}
          <Path
            d="M14 4C14 4 8 10 8 16C8 19.3 10.7 22 14 22C17.3 22 20 19.3 20 16C20 10 14 4 14 4Z"
            fill={color}
          />
          <Path
            d="M14 12C14 12 11 15 11 17.5C11 19.4 12.3 21 14 21C15.7 21 17 19.4 17 17.5C17 15 14 12 14 12Z"
            fill={color}
            fillOpacity={0.3}
          />
        </Svg>
      );
    
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    paddingHorizontal: 20 * SCALE,
    paddingTop: 18 * SCALE,
    paddingBottom: 20 * SCALE,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.5,
    marginBottom: 20 * SCALE,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  badgeWrapper: {
    alignItems: 'center',
  },
  badgeCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOverlay: {
    position: 'absolute',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLabel: {
    marginTop: 10 * SCALE,
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
});
