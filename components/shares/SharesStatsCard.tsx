import { TimelineColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { SCALE } from './constants';

function TrendUpIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6H23V12"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke="#810100" strokeWidth={2} />
    </Svg>
  );
}

function LinkIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface SharesStatsCardProps {
  totalShares: number;
  totalViews: number;
  activeCount: number;
}

export default function SharesStatsCard({ totalShares, totalViews, activeCount }: SharesStatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <TrendUpIcon size={18 * SCALE} />
        </View>
        <Text style={styles.title}>Share Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconRow}>
            <LinkIcon size={14 * SCALE} />
          </View>
          <Text style={styles.statValue}>{totalShares}</Text>
          <Text style={styles.statLabel}>Total Shares</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.statIconRow}>
            <EyeIcon size={14 * SCALE} />
          </View>
          <Text style={styles.statValue}>{totalViews}</Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.activeDot, { backgroundColor: activeCount > 0 ? '#4CAF50' : '#999' }]} />
          <Text style={styles.statValue}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 20 * SCALE,
    marginBottom: 24 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
    marginBottom: 20 * SCALE,
  },
  iconCircle: {
    width: 36 * SCALE,
    height: 36 * SCALE,
    borderRadius: 18 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconRow: {
    marginBottom: 6 * SCALE,
  },
  statValue: {
    fontSize: 24 * SCALE,
    fontWeight: '700',
    color: TimelineColors.primary,
    marginBottom: 4 * SCALE,
  },
  statLabel: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 50 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  activeDot: {
    width: 8 * SCALE,
    height: 8 * SCALE,
    borderRadius: 4 * SCALE,
    marginBottom: 6 * SCALE,
  },
});
