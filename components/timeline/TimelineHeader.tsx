import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { TimelineColors, GOLDEN_RATIO } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

// Base font size for golden ratio calculations
const BASE_FONT_SIZE = 14;
const DATE_FONT_SIZE = Math.round(BASE_FONT_SIZE * GOLDEN_RATIO * GOLDEN_RATIO); // ~37

interface TimelineHeaderProps {
  dayOfWeek: string; // "THURSDAY" - full day name in caps
  date: string; // "Oct 24"
}

export function TimelineHeader({ dayOfWeek, date }: TimelineHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      
      <View style={styles.avatarContainer}>
        <Image 
          source={require('@/assets/images/pfp.png')} 
          style={styles.avatar} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24 * SCALE,
    paddingTop: 10 * SCALE,
  },
  dateContainer: {
    flexDirection: 'column',
  },
  dayOfWeek: {
    fontFamily: 'Inter',
    fontSize: BASE_FONT_SIZE * SCALE,
    fontWeight: '700',
    color: TimelineColors.primary,
    letterSpacing: 1.5,
  },
  date: {
    fontFamily: 'Inter',
    fontSize: DATE_FONT_SIZE * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginTop: 0,
  },
  avatarContainer: {
    width: 49.54 * SCALE,
    height: 49.54 * SCALE,
    borderRadius: 24.77 * SCALE,
    borderWidth: 2,
    borderColor: TimelineColors.avatarStroke,
    overflow: 'hidden',
    backgroundColor: TimelineColors.avatarBackground,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
