import { ActivityLevel } from '@/components/hub/types';
import { getProfileStats } from '@/lib/api';
import { useTimeline } from '@/lib/store/timeline-store';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from './store/auth-store';

export interface UIProfileStats {
  streakDays: number;
  isStreakActive: boolean;
  audioMinutes: number;
  foldScore: number;
  percentile: number;
  storyStats?: {
    totalStories: number;
    totalStoryWords: number;
    happyStoryCount: number;
  };
  activityData: ActivityLevel[][]; // 7x5 grid (rows=days, cols=weeks)
}

export function useProfileStats() {
  const [stats, setStats] = useState<Partial<UIProfileStats>>({
    streakDays: 0,
    isStreakActive: false,
    audioMinutes: 0,
    foldScore: 0,
    percentile: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuthStore.getState();
  const { entries } = useTimeline();

  const fetchStats = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await getProfileStats();
      if (data) {
        setStats({
          streakDays: data.currentStreak || 0,
          isStreakActive: data.isStreakActive || false,
          audioMinutes: data.totalAudioMinutes || 0,
          foldScore: data.foldScore || 0,
          percentile: 10, // Mocked for now
          storyStats: data.storyStats,
        });
      } else if (error) {
        console.error('[ProfileStats] Failed to fetch stats:', error);
      }
    } catch (err) {
      console.error('[ProfileStats] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isAuthenticated]);

  // Calculate activity grid from local entries since backend doesn't send the matrix
  const activityData = useMemo(() => {
    const activityMap = new Map<string, number>();
    entries.forEach(e => {
      const dateStr = new Date(e.createdAt).toDateString();
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    });

    const grid: number[][] = [];
    for(let r=0; r<5; r++) {
        const row: number[] = [];
        for(let c=0; c<7; c++) {
            row.push(0);
        }
        grid.push(row);
    }

    const nowLocal = new Date();
    nowLocal.setHours(0,0,0,0);
    const jsDay = nowLocal.getDay();
    const todayCol = (jsDay + 6) % 7;

    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        const offsetDays = (4 - week) * 7 + (todayCol - day);
        if (offsetDays < 0) {
          grid[week][day] = 0;
          continue;
        }

        const date = new Date(nowLocal);
        date.setDate(date.getDate() - offsetDays);
        const count = activityMap.get(date.toDateString()) || 0;

        let level: number;
        if (count === 0) level = 0;
        else if (count === 1) level = 1;
        else if (count <= 3) level = 2;
        else if (count <= 5) level = 3;
        else level = 3;

        grid[week][day] = level as ActivityLevel;
      }
    }
    return grid as ActivityLevel[][];
  }, [entries]);

  return {
    streakDays: stats.streakDays || 0,
    isStreakActive: stats.isStreakActive || false,
    audioMinutes: stats.audioMinutes || 0,
    foldScore: stats.foldScore || 0,
    percentile: stats.percentile || 0,
    storyStats: stats.storyStats || { totalStories: 0, totalStoryWords: 0, happyStoryCount: 0 },
    activityData,
    isLoading,
    refresh: fetchStats
  };
}
