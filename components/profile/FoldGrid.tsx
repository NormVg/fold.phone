import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * FoldGrid - Activity heatmap grid showing weekly activity
 * Based on home:profie:foldgrid.svg (exact measurements)
 * 
 * SVG Analysis:
 * - Card: rect x=4 y=2 width=358 height=310 rx=20
 * - Day labels (M T W T F S S) at approx y=30-45
 * - Grid: 7 columns x 5 rows of 40x40 cells with rx=5
 * - Column X positions: 19, 66, 113, 160, 207, 254, 301 (relative to SVG, gap=7)
 * - Row Y positions: 65, 113, 161, 209, 257 (relative to SVG, gap=8)
 */

// Card dimensions
const CARD_WIDTH = 358 * SCALE;
const CARD_RADIUS = 20 * SCALE;

// Cell dimensions
const CELL_SIZE = 40 * SCALE;
const CELL_RADIUS = 5 * SCALE;
const ROW_GAP = 8 * SCALE;
const COL_GAP = 7 * SCALE;

// Calculate equal padding for top and bottom
// Grid: 5 rows of 40px cells with 8px gaps = 5*40 + 4*8 = 232px
// Header: ~18px height + 15px gap to grid = 33px
// Total content height: 232 + 33 = 265px
const VERTICAL_PADDING = 20 * SCALE;
const HEADER_HEIGHT = 18 * SCALE;
const HEADER_TO_GRID_GAP = 15 * SCALE;

// Card height = padding + header + gap + grid + padding
const GRID_HEIGHT = (CELL_SIZE * 5) + (ROW_GAP * 4);
const CARD_HEIGHT = VERTICAL_PADDING + HEADER_HEIGHT + HEADER_TO_GRID_GAP + GRID_HEIGHT + VERTICAL_PADDING;

// Grid positions (centered horizontally)
// Total grid width: 7 cells * 40 + 6 gaps * 7 = 280 + 42 = 322
const GRID_WIDTH = (CELL_SIZE * 7) + (COL_GAP * 6);
const HORIZONTAL_PADDING = (CARD_WIDTH - GRID_WIDTH) / 2;

const COLUMN_X = Array.from({ length: 7 }, (_, i) => 
  HORIZONTAL_PADDING + (i * (CELL_SIZE + COL_GAP))
);

const ROW_Y = Array.from({ length: 5 }, (_, i) => 
  VERTICAL_PADDING + HEADER_HEIGHT + HEADER_TO_GRID_GAP + (i * (CELL_SIZE + ROW_GAP))
);

// Header Y position
const HEADER_Y = VERTICAL_PADDING;

// Activity levels map to colors from SVG
export type ActivityLevel = 0 | 1 | 2 | 3;

const ACTIVITY_COLORS: Record<ActivityLevel, string> = {
  0: '#EDEADC', // No activity (background)
  1: '#C19999', // Low activity
  2: '#9A3433', // Medium activity  
  3: '#810100', // High activity
};

// Days header
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface FoldGridProps {
  activityData: ActivityLevel[][];
}

export function FoldGrid({ activityData }: FoldGridProps) {
  // Ensure we have 5 rows of 7 days each
  const rows: ActivityLevel[][] = [];
  for (let i = 0; i < 5; i++) {
    if (activityData[i]) {
      const row: ActivityLevel[] = [];
      for (let j = 0; j < 7; j++) {
        row.push(activityData[i][j] ?? 0);
      }
      rows.push(row);
    } else {
      rows.push([0, 0, 0, 0, 0, 0, 0]);
    }
  }

  return (
    <View style={styles.card}>
      {/* Day labels header - positioned absolutely */}
      {DAYS.map((day, index) => (
        <Text 
          key={`header-${index}`} 
          style={[
            styles.headerText,
            { 
              left: COLUMN_X[index] + (CELL_SIZE / 2),
              top: HEADER_Y,
            }
          ]}
        >
          {day}
        </Text>
      ))}
      
      {/* Activity grid - each cell positioned absolutely */}
      {rows.map((week, rowIndex) => (
        week.map((level, colIndex) => (
          <View
            key={`cell-${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              {
                left: COLUMN_X[colIndex],
                top: ROW_Y[rowIndex],
                backgroundColor: ACTIVITY_COLORS[level],
              },
            ]}
          />
        ))
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FDFBF7',
    borderRadius: CARD_RADIUS,
    position: 'relative',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  headerText: {
    position: 'absolute',
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    // Center the text on the column
    transform: [{ translateX: -CELL_SIZE / 2 }],
    width: CELL_SIZE,
  },
  cell: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_RADIUS,
  },
});
