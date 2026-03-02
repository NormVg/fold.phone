import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TimelineColors } from '@/constants/theme';
import type { TimelineEntry } from '@/lib/timeline-context';
import { getDayKey, MOOD_ICONS, pluralize, SCALE } from './constants';

interface CurrentStreakCardProps {
  entries: TimelineEntry[];
}

export function CurrentStreakCard({ entries }: CurrentStreakCardProps) {
  const streak = useMemo(() => {
    const withMoods = entries
      .filter((e) => e.mood)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (withMoods.length === 0) return null;

    const latestMood = withMoods[0].mood!;
    let count = 0;
    let lastDayKey = '';

    for (const entry of withMoods) {
      const dayKey = getDayKey(entry.createdAt);
      if (dayKey === lastDayKey) continue;

      if (entry.mood === latestMood) {
        count++;
        lastDayKey = dayKey;
      } else {
        break;
      }
    }

    return { mood: latestMood, days: count };
  }, [entries]);

  if (!streak) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Current Streak</Text>
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>No mood data yet</Text>
        </View>
      </View>
    );
  }

  const MoodIcon = MOOD_ICONS[streak.mood];

  return (
    <View style={[styles.card, styles.streakCard]}>
      <View style={[styles.streakAccentBar, { backgroundColor: TimelineColors.primary }]} />
      <View style={styles.streakContent}>
        <View style={styles.streakIconWrap}>
          <MoodIcon size={48 * SCALE} />
        </View>
        <View style={styles.streakTextWrap}>
          <Text style={styles.streakLabel}>Current Streak</Text>
          <Text style={styles.streakValue}>
            {streak.days} {pluralize(streak.days, 'day', 'days')}
          </Text>
          <Text style={styles.streakDescription}>
            You've been feeling {streak.mood}
          </Text>
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
  streakCard: {
    overflow: 'hidden' as const,
    shadowColor: TimelineColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  streakAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5 * SCALE,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16 * SCALE,
    paddingLeft: 6 * SCALE,
  },
  streakIconWrap: {
    borderRadius: (10 / 64) * 48 * SCALE + 2,
    borderWidth: 1,
    borderColor: '#181717',
    overflow: 'hidden',
  },
  streakTextWrap: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2 * SCALE,
  },
  streakValue: {
    fontSize: 30 * SCALE,
    fontWeight: '700',
    color: TimelineColors.primary,
    lineHeight: 34 * SCALE,
    marginBottom: 2 * SCALE,
  },
  streakDescription: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
});
