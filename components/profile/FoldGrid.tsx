import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions from SVG: rect x=4 y=2 width=358 height=310 rx=20
const CARD_WIDTH = 358 * SCALE;
const CARD_PADDING = 15 * SCALE;

// Grid cell dimensions from SVG: 40x40, rx=5
// Cells positioned at x=19, 66, 113, 160, 207, 254, 301 (gap = 47 - 40 = 7)
const CELL_SIZE = 40 * SCALE;
const CELL_RADIUS = 5 * SCALE;
const CELL_GAP = 7 * SCALE;

// Activity levels map to colors from SVG
export type ActivityLevel = 0 | 1 | 2 | 3;

const ACTIVITY_COLORS: Record<ActivityLevel, string> = {
  0: '#EDEADC', // No activity (background)
  1: '#C19999', // Low activity
  2: '#9A3433', // Medium activity  
  3: '#810100', // High activity
};

// Days header - positioned at y~30 in SVG
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface FoldGridProps {
  activityData: ActivityLevel[][];
  onNextPress?: () => void;
}

/**
 * FoldGrid - Activity heatmap grid showing weekly activity
 * Based on home:profie:foldgrid.svg (exact measurements)
 * 
 * SVG Analysis:
 * - Card: rect x=4 y=2 width=358 height=310 rx=20
 * - Day labels at y~30-45 (M T W T F S S)
 * - Grid rows at y=65, 113, 161, 209, 257 (gap = 48, but cell is 40 so gap = 8)
 * - Cells at x=19, 66, 113, 160, 207, 254, 301 (gap = 47, cell 40, so spacing = 7)
 * - Arrow button: circle cx=327.36 cy=284.36 r=12.36
 */
export function FoldGrid({ 
  activityData,
  onNextPress,
}: FoldGridProps) {
  // Ensure we have 5 rows
  const rows = [...activityData];
  while (rows.length < 5) {
    rows.push([0, 0, 0, 0, 0, 0, 0]);
  }

  return (
    <View style={styles.card}>
      {/* Day labels header */}
      <View style={styles.headerRow}>
        {DAYS.map((day, index) => (
          <View key={index} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>
      
      {/* Activity grid - 5 rows */}
      <View style={styles.gridContainer}>
        {rows.slice(0, 5).map((week, weekIndex) => (
          <View key={weekIndex} style={styles.gridRow}>
            {week.slice(0, 7).map((level, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.cell,
                  { backgroundColor: ACTIVITY_COLORS[level as ActivityLevel] || ACTIVITY_COLORS[0] },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      
      {/* Arrow button for navigation - positioned at bottom right */}
      <View style={styles.arrowContainer}>
        <Pressable onPress={onNextPress} style={styles.arrowButton}>
          <ArrowCircle size={25 * SCALE} />
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Arrow icon with circular background
 * Based on SVG: circle r=12.36, arrow path inside
 */
function ArrowCircle({ size = 25 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
      <Circle cx="12.5" cy="12.5" r="12.36" fill="rgba(141, 26, 26, 0.2)" />
      <Path
        d="M16.5 12.5L11.5 17.5M16.5 12.5L11.5 7.5M16.5 12.5H8.5"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    paddingHorizontal: CARD_PADDING,
    paddingTop: 20 * SCALE,
    paddingBottom: 45 * SCALE, // Extra padding for arrow button
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12 * SCALE,
  },
  headerCell: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  gridContainer: {
    gap: CELL_GAP + 1 * SCALE, // Slight adjustment for visual match
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_RADIUS,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 15 * SCALE,
    right: 15 * SCALE,
  },
  arrowButton: {
    // Touch target
  },
});
