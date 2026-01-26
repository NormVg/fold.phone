import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions from SVG: 171x144 each
// Left card at x=4, Right card at x=191 (gap = 191-4-171 = 16)
const CARD_WIDTH = 171 * SCALE;
const CARD_HEIGHT = 144 * SCALE;
const GAP = 16 * SCALE;

interface FoldDataCardsProps {
  streakDays: number;
  isStreakActive?: boolean;
  audioMinutes: number;
}

/**
 * FoldDataCards - Two side-by-side cards showing streak and audio data
 * Based on home:profile:folddata.svg (exact measurements)
 * 
 * SVG Analysis:
 * - Left card: rect x=4 y=2 width=171 height=144 rx=20
 * - Right card: rect x=191 y=2 width=171 height=144 rx=20
 * - Active badge: rect x=19 y=29 width=48 height=19 rx=9.5
 * - Droplet icon circle: cx=141 cy=39 r=20 (right side of left card)
 * - Audio icon circle: cx=329.36 cy=38.36 r=19.36
 * - "8Days" uses JockeyOne font, "43m" uses regular weight
 */
export function FoldDataCards({ 
  streakDays = 8,
  isStreakActive = true,
  audioMinutes = 43,
}: FoldDataCardsProps) {
  return (
    <View style={styles.container}>
      {/* Streak Card (Left) */}
      <View style={styles.card}>
        {/* Top row: Active badge on left, droplet icon on right */}
        <View style={styles.topRow}>
          {isStreakActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          )}
          <View style={styles.iconCircle}>
            <DropletIcon size={24 * SCALE} color="#810100" />
          </View>
        </View>
        
        {/* Value - "8Days" in JockeyOne font */}
        <Text style={styles.valueTextJockey}>{streakDays}Days</Text>
        
        {/* Label - "FOLD STREAK" */}
        <Text style={styles.labelText}>FOLD STREAK</Text>
      </View>
      
      {/* Audio Logged Card (Right) */}
      <View style={styles.card}>
        {/* Top row: Audio wave icon on right */}
        <View style={styles.topRowRight}>
          <View style={styles.iconCircle}>
            <AudioWaveIcon size={24 * SCALE} color="#810100" />
          </View>
        </View>
        
        {/* Value - "43m" in regular font weight */}
        <Text style={styles.valueTextRegular}>{audioMinutes}m</Text>
        
        {/* Label - "AUDIO LOGGED" */}
        <Text style={styles.labelText}>AUDIO LOGGED</Text>
      </View>
    </View>
  );
}

/**
 * Droplet/Water icon for streak card
 * Based on SVG path from folddata.svg
 */
function DropletIcon({ size = 24, color = '#810100' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        fill={color}
        fillOpacity={0.2}
      />
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * Audio wave icon with vertical bars
 * Based on SVG paths from folddata.svg
 */
function AudioWaveIcon({ size = 24, color = '#810100' }: { size?: number; color?: string }) {
  const barWidth = size * 0.08;
  const gap = size * 0.12;
  const centerX = size / 2;
  const heights = [0.3, 0.5, 0.7, 0.5, 0.3]; // Relative heights for 5 bars
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} fillOpacity={0.2} />
      {heights.map((h, i) => {
        const barHeight = size * h * 0.5;
        const x = centerX + (i - 2) * (barWidth + gap) - barWidth / 2;
        const y = (size - barHeight) / 2;
        return (
          <Path
            key={i}
            d={`M${x} ${y + barHeight}V${y}`}
            stroke={color}
            strokeWidth={barWidth}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    paddingHorizontal: 15 * SCALE,
    paddingTop: 27 * SCALE, // Badge at y=29 from card, card starts at y=2
    paddingBottom: 15 * SCALE,
    // Shadow from SVG filter
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  activeBadge: {
    backgroundColor: 'rgba(129, 1, 0, 0.2)',
    borderRadius: 9.5 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(129, 1, 0, 0.25)',
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 3 * SCALE,
    minWidth: 48 * SCALE,
    alignItems: 'center',
  },
  activeBadgeText: {
    fontSize: 10 * SCALE,
    fontWeight: '600',
    color: '#810100',
    letterSpacing: 0.3,
  },
  iconCircle: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueTextJockey: {
    fontSize: 48 * SCALE,
    fontFamily: 'JockeyOne',
    color: '#000',
    marginTop: 8 * SCALE,
    lineHeight: 56 * SCALE,
  },
  valueTextRegular: {
    fontSize: 48 * SCALE,
    fontWeight: '400',
    color: '#000',
    marginTop: 8 * SCALE,
    lineHeight: 56 * SCALE,
  },
  labelText: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.5,
    marginTop: 4 * SCALE,
  },
});
