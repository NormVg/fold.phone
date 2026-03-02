import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineColors } from '@/constants/theme';
import type { MoodType } from '@/components/mood';
import type { TimelineEntry } from '@/lib/timeline-context';
import { ALL_MOODS, MOOD_BAR_COLORS, pluralize, SCALE } from './constants';

interface MoodDistributionCardProps {
  entries: TimelineEntry[];
  periodLabel: string;
}

export function MoodDistributionCard({ entries, periodLabel }: MoodDistributionCardProps) {
  const distribution = useMemo(() => {
    const withMoods = entries.filter((e) => e.mood);
    const total = withMoods.length;
    if (total === 0) return null;

    const counts: Record<MoodType, number> = {
      'V. Happy': 0,
      'Happy': 0,
      'Normal': 0,
      'Sad': 0,
      'V. Sad': 0,
    };

    for (const entry of withMoods) {
      if (entry.mood && counts[entry.mood] !== undefined) {
        counts[entry.mood]++;
      }
    }

    return { counts, total };
  }, [entries]);

  if (!distribution) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mood Distribution</Text>
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>No mood data yet</Text>
        </View>
      </View>
    );
  }

  const maxCount = Math.max(...Object.values(distribution.counts));

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Mood Distribution</Text>
      <Text style={styles.sectionSubtitle}>{periodLabel}</Text>
      <View style={styles.distList}>
        {ALL_MOODS.map((mood) => {
          const count = distribution.counts[mood];
          const pct = Math.round((count / distribution.total) * 100);
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <View key={mood} style={styles.distRow}>
              <Text style={styles.distLabel}>{mood}</Text>
              <View style={styles.distBarTrack}>
                <View
                  style={[
                    styles.distBarFill,
                    {
                      width: `${Math.max(barWidth, 3)}%`,
                      backgroundColor: MOOD_BAR_COLORS[mood],
                    },
                  ]}
                />
              </View>
              <Text style={styles.distCount}>{count}</Text>
              <Text style={styles.distPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.distTotal}>
        {distribution.total} {pluralize(distribution.total, 'entry', 'entries')} total
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 20 * SCALE,
    marginBottom: 14 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 2 * SCALE,
  },
  sectionSubtitle: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#999',
    marginBottom: 14 * SCALE,
  },
  emptySection: {
    paddingVertical: 24 * SCALE,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13 * SCALE,
    fontWeight: '400',
    color: '#999',
    textAlign: 'center',
  },
  distList: {
    gap: 12 * SCALE,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distLabel: {
    width: 58 * SCALE,
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: '#555',
  },
  distBarTrack: {
    flex: 1,
    height: 22 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 11 * SCALE,
    overflow: 'hidden',
    marginHorizontal: 8 * SCALE,
  },
  distBarFill: {
    height: '100%',
    borderRadius: 11 * SCALE,
  },
  distCount: {
    width: 26 * SCALE,
    fontSize: 14 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    textAlign: 'right',
  },
  distPct: {
    width: 36 * SCALE,
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#999',
    textAlign: 'right',
  },
  distTotal: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: '#BBB',
    textAlign: 'center',
    marginTop: 14 * SCALE,
  },
});
