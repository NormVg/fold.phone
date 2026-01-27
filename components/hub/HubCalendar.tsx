import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * HubCalendar - Monthly calendar with activity heatmap
 * Based on home:hub:calander.svg (exact measurements)
 *
 * SVG Analysis (viewBox 0 0 368 408):
 * - Total component height: 408
 * - Header pill: x=4 y=2 width=358 height=60 rx=30 (floating above card)
 * - Main card: x=6 y=78 width=358 height=324 rx=20
 * - The header overlaps top of main card
 * - Day labels (M T W T F S S) at y≈108-123, opacity=0.5
 * - Grid cells: 40x40 with various fill-opacity levels
 * - Today cell: fill=#810100 with white text (full circle rx=20)
 * - Activity cells: fill=#810100 with various fill-opacity (0.1, 0.19-0.23, 0.3)
 */

// Component wrapper dimensions (from viewBox)
const COMPONENT_WIDTH = 358 * SCALE;
const COMPONENT_HEIGHT = 408 * SCALE;

// Header pill dimensions (x=4, y=2, 358x60, rx=30)
const HEADER_HEIGHT = 60 * SCALE;
const HEADER_RADIUS = 30 * SCALE;
const HEADER_TOP = 0; // Starts at top

// Main card dimensions (x=6, y=78, 358x324, rx=20)
const CARD_TOP = 78 * SCALE;
const CARD_HEIGHT = 324 * SCALE;
const CARD_RADIUS = 20 * SCALE;

// Day labels section (y≈108 in SVG, which is 30px below card top)
const DAY_LABELS_TOP_IN_CARD = 30 * SCALE;
const DAY_SECTION_HEIGHT = 26 * SCALE;

// Grid dimensions
const CELL_SIZE = 40 * SCALE;
const CELL_RADIUS = 5 * SCALE;
const CELL_RADIUS_TODAY = 20 * SCALE; // Full circle for today
const GRID_TOP_IN_CARD = DAY_LABELS_TOP_IN_CARD + DAY_SECTION_HEIGHT + 12 * SCALE;
const CELL_GAP_V = 8 * SCALE;

// Calculate horizontal spacing
const HORIZONTAL_PADDING = 18 * SCALE;
const CELL_GAP_H = ((COMPONENT_WIDTH - (2 * HORIZONTAL_PADDING) - (7 * CELL_SIZE)) / 6);

// Colors
const COLORS = {
  background: '#FDFBF7',
  dayLabel: 'rgba(0, 0, 0, 0.5)',
  dateText: 'rgba(0, 0, 0, 0.5)',
  chevron: '#000000',
  headerText: '#181717',
  today: '#810100',
  todayText: '#FDFBF7',
};

// Activity levels map to opacity values from SVG
export type ActivityLevel = 0 | 1 | 2 | 3;

const getActivityColor = (level: ActivityLevel): string | undefined => {
  switch (level) {
    case 0: return undefined; // No background
    case 1: return 'rgba(129, 1, 0, 0.1)';  // fill-opacity="0.1"
    case 2: return 'rgba(129, 1, 0, 0.2)';  // fill-opacity="0.19-0.23" (averaged)
    case 3: return 'rgba(129, 1, 0, 0.3)';  // fill-opacity="0.3"
    default: return undefined;
  }
};

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DayData {
  day: number;
  activity: ActivityLevel;
}

interface HubCalendarProps {
  year?: number;
  month?: number; // 0-indexed (0 = January)
  activityData?: Map<number, ActivityLevel>; // day -> activity level
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onDayPress?: (day: number) => void;
}

export function HubCalendar({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  activityData = new Map(),
  onPrevMonth,
  onNextMonth,
  onDayPress,
}: HubCalendarProps) {

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDay = isCurrentMonth ? today.getDate() : -1;

  // Calculate calendar grid
  const calendarWeeks = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get day of week for first day (0=Sun, 1=Mon, etc.)
    // Convert to Monday-first (0=Mon, 1=Tue, etc.)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const weeks: (DayData | null)[][] = [];
    let currentWeek: (DayData | null)[] = [];

    // Add empty cells for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day,
        activity: activityData.get(day) ?? 0,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining cells in last week
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [year, month, activityData]);

  const monthYear = `${MONTHS[month]} ${year}`;

  return (
    <View style={styles.container}>
      {/* Month navigation header - floating above card */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={styles.chevronButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft />
        </TouchableOpacity>

        <Text style={styles.monthText}>{monthYear}</Text>

        <TouchableOpacity
          onPress={onNextMonth}
          style={styles.chevronButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronRight />
        </TouchableOpacity>
      </View>

      {/* Main card body */}
      <View style={styles.card}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAYS.map((day, index) => (
            <View key={`day-${index}`} style={styles.dayLabelCell}>
              <Text style={styles.dayLabelText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {calendarWeeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.week}>
              {week.map((dayData, dayIndex) => {
                if (!dayData) {
                  return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.emptyCell} />;
                }

                const isToday = dayData.day === currentDay;
                const hasActivity = dayData.activity > 0;
                const activityColor = getActivityColor(dayData.activity);

                return (
                  <TouchableOpacity
                    key={`day-${weekIndex}-${dayIndex}`}
                    style={[
                      styles.cell,
                      isToday && styles.todayCell,
                      !isToday && hasActivity && activityColor && {
                        backgroundColor: activityColor,
                        borderRadius: CELL_RADIUS,
                      },
                    ]}
                    onPress={() => onDayPress?.(dayData.day)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dateText,
                      isToday && styles.todayText,
                    ]}>
                      {dayData.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/**
 * Left chevron icon - from SVG
 * Path: "M29.6479 38L23.3887 32L29.6479 26"
 */
function ChevronLeft() {
  const size = 16 * SCALE;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10 12L6 8L10 4"
        stroke={COLORS.chevron}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Right chevron icon - from SVG
 * Path: "M336.352 38L342.611 32L336.352 26"
 */
function ChevronRight() {
  const size = 16 * SCALE;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 4L10 8L6 12"
        stroke={COLORS.chevron}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    width: COMPONENT_WIDTH,
    // Height is flexible based on number of weeks
  },
  header: {
    height: HEADER_HEIGHT,
    borderRadius: HEADER_RADIUS,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25 * SCALE,
    marginBottom: 16 * SCALE, // Gap between header and card
    // Header shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  chevronButton: {
    padding: 8 * SCALE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18 * SCALE,
    fontWeight: '700',
    color: COLORS.headerText,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: CARD_RADIUS,
    paddingTop: DAY_LABELS_TOP_IN_CARD,
    paddingBottom: 20 * SCALE,
    // Card shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  dayLabels: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    height: DAY_SECTION_HEIGHT,
    alignItems: 'center',
  },
  dayLabelCell: {
    width: CELL_SIZE,
    marginRight: CELL_GAP_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabelText: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: COLORS.dayLabel,
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 12 * SCALE,
  },
  week: {
    flexDirection: 'row',
    marginBottom: CELL_GAP_V,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginRight: CELL_GAP_H,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CELL_RADIUS,
  },
  emptyCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginRight: CELL_GAP_H,
  },
  todayCell: {
    backgroundColor: COLORS.today,
    borderRadius: CELL_RADIUS_TODAY,
  },
  dateText: {
    fontSize: 14 * SCALE,
    fontWeight: '400',
    color: COLORS.dateText,
    textAlign: 'center',
  },
  todayText: {
    color: COLORS.todayText,
    fontWeight: '600',
  },
});
