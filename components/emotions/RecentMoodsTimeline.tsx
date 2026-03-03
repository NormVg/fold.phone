import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TimelineColors } from '@/constants/theme';
import type { TimelineEntry } from '@/lib/timeline-context';
import { MOOD_COLORS, MOOD_ICONS, SCALE } from './constants';

interface RecentMoodsTimelineProps {
  entries: TimelineEntry[];
  onEntryPress: (entry: TimelineEntry) => void;
}

export function RecentMoodsTimeline({ entries, onEntryPress }: RecentMoodsTimelineProps) {
  const recentMoods = useMemo(() => {
    return entries
      .filter((e) => e.mood)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 7);
  }, [entries]);

  if (recentMoods.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Moods</Text>
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>No mood entries yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Recent Moods</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recentScrollContent}
      >
        {recentMoods.map((entry) => {
          const MoodIcon = MOOD_ICONS[entry.mood!];
          const chipBg = MOOD_COLORS[entry.mood!];
          const dateObj = entry.createdAt;
          const timeLabel = dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <Pressable
              key={entry.id}
              style={[styles.recentChip, { backgroundColor: chipBg + '30' }]}
              onPress={() => onEntryPress(entry)}
            >
              <View style={styles.recentChipIcon}>
                <MoodIcon size={44 * SCALE} />
              </View>
              <Text style={styles.recentChipMood}>{entry.mood}</Text>
              <Text style={styles.recentChipTime}>{timeLabel}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
  recentScrollContent: {
    gap: 10 * SCALE,
    paddingTop: 10 * SCALE,
    paddingBottom: 4 * SCALE,
  },
  recentChip: {
    alignItems: 'center',
    borderRadius: 16 * SCALE,
    paddingHorizontal: 14 * SCALE,
    paddingTop: 12 * SCALE,
    paddingBottom: 10 * SCALE,
    minWidth: 80 * SCALE,
  },
  recentChipIcon: {
    marginBottom: 6 * SCALE,
    borderRadius: (10 / 64) * 44 * SCALE + 2,
    borderWidth: 1,
    borderColor: '#181717',
    overflow: 'hidden',
  },
  recentChipMood: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
    marginBottom: 3 * SCALE,
  },
  recentChipTime: {
    fontSize: 10 * SCALE,
    fontWeight: '400',
    color: '#AAA',
    marginTop: 1 * SCALE,
  },
});
