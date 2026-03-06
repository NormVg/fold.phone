import { HeartEKGIcon } from '@/components/hub';
import {
  CurrentStreakCard,
  DurationPicker,
  getDayKey,
  getDaysForPeriod,
  MOOD_SCORE,
  MoodDistributionCard,
  MoodTrendGraph,
  PERIODS,
  RecentMoodsTimeline,
  SCALE,
  type DayMood,
  type PeriodKey,
} from '@/components/emotions';
import type { MoodType } from '@/components/mood';
import { TimelineColors } from '@/constants/theme';
import { useTimeline, type TimelineEntry } from '@/lib/timeline-context';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function EmotionsScreen() {
  const router = useRouter();
  const { entries, refreshEntries } = useTimeline();
  const [period, setPeriod] = useState<PeriodKey>('30D');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refreshEntries(); } finally { setRefreshing(false); }
  }, [refreshEntries]);

  const filteredEntries = useMemo(() => {
    const days = getDaysForPeriod(period);
    if (days === null) return entries;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return entries.filter((e) => e.createdAt >= cutoff);
  }, [entries, period]);

  const periodLabel = useMemo(() => {
    const p = PERIODS.find((p) => p.key === period);
    return p ? p.label : '';
  }, [period]);

  const dayMoods = useMemo(() => {
    const dayMap = new Map<
      string,
      { scores: number[]; moods: MoodType[]; date: Date }
    >();

    for (const entry of filteredEntries) {
      if (!entry.mood) continue;
      const key = getDayKey(entry.createdAt);
      if (!dayMap.has(key)) {
        dayMap.set(key, { scores: [], moods: [], date: entry.createdAt });
      }
      const day = dayMap.get(key)!;
      day.scores.push(MOOD_SCORE[entry.mood] ?? 0);
      day.moods.push(entry.mood);
    }

    const result: DayMood[] = [];
    for (const [dayKey, { scores, moods, date }] of dayMap) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const freq: Record<string, number> = {};
      for (const m of moods) freq[m] = (freq[m] || 0) + 1;
      const dominantMood = Object.entries(freq).sort(
        (a, b) => b[1] - a[1]
      )[0][0] as MoodType;

      result.push({ date, dayKey, avgScore, dominantMood });
    }

    return result.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEntries]);

  const handleBack = () => router.back();

  const handleEntryPress = (entry: TimelineEntry) => {
    const dateStr = getDayKey(entry.createdAt);
    router.push({ pathname: '/day-view', params: { date: dateStr } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <View style={styles.topBarCenter}>
          <View style={styles.iconCircle}>
            <HeartEKGIcon size={18 * SCALE} color={TimelineColors.primary} />
          </View>
          <Text style={styles.topBarTitle}>Emotions</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={TimelineColors.primary}
            colors={[TimelineColors.primary]}
          />
        }
      >
        <DurationPicker selected={period} onSelect={setPeriod} />
        <MoodTrendGraph dayMoods={dayMoods} periodLabel={periodLabel} />
        <CurrentStreakCard entries={entries} />
        <MoodDistributionCard entries={filteredEntries} periodLabel={periodLabel} />
        <RecentMoodsTimeline entries={entries} onEntryPress={handleEntryPress} />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  iconCircle: {
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  placeholder: {
    width: 40 * SCALE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 8 * SCALE,
  },
  bottomPadding: {
    height: 60 * SCALE,
  },
});
