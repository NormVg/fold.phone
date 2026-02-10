import { ActivityLevel } from '@/components/hub/types';
import { useTimeline } from '@/lib/timeline-context';
import { useMemo } from 'react';

export interface ProfileStats {
  streakDays: number;
  isStreakActive: boolean;
  audioMinutes: number;
  foldScore: number;
  percentile: number; // Mocked for now
  activityData: ActivityLevel[][]; // 7x5 grid (rows=days, cols=weeks) or similar structure expected by FoldGrid
}

export function useProfileStats(): ProfileStats {
  const { entries } = useTimeline();

  const stats = useMemo(() => {
    // 1. Calculate Audio Minutes
    const audioMinutes = Math.round(
      entries.reduce((total, entry) => {
        if (entry.type === 'audio') {
          // Find audio media duration
          const audio = entry.media?.find(m => m.type === 'audio');
          return total + (audio?.duration || 0);
        }
        return total;
      }, 0) / 60
    );

    // 2. Calculate Streak
    // unique days set
    const uniqueDays = new Set(
      entries.map(e => new Date(e.createdAt).toDateString())
    );
    const sortedDates = Array.from(uniqueDays)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime()); // Newest first

    let streak = 0;
    let isStreakActive = false;
    const now = new Date();
    const today = new Date(now.toDateString());
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    yesterday.setHours(0, 0, 0, 0);

    if (sortedDates.length > 0) {
      // Check if streak is active (has entry today or yesterday)
      const lastEntryDate = sortedDates[0];
      if (lastEntryDate.getTime() === today.getTime() || lastEntryDate.getTime() === yesterday.getTime()) {
        isStreakActive = true;
      }

      // Count consecutive days
      // We need to check if the gap between dates is 1 day.
      // Since we filtered unique days, we just check if dates are consecutive.
      // However, if the latest date is today, we start counting.
      // If the latest date is older than yesterday, streak is 0.

      if (isStreakActive) {
        streak = 1;
        let currentDate = sortedDates[0];

        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = sortedDates[i];
          const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            streak++;
            currentDate = prevDate;
          } else {
            break;
          }
        }
      }
    }

    // 3. Fold Score (arbitrary gamification)
    // 10 pts per entry, 50 pts per streak day
    const foldScore = (entries.length * 10) + (streak * 50);

    // 4. Activity Grid Data
    // We need 5 rows (weeks), 7 columns (days).
    // FoldGrid expects Column 0 = Monday, Column 6 = Sunday.
    // We need to align Today to the correct column in the last row (Row 4).

    const activityMap = new Map<string, number>();
    entries.forEach(e => {
      const dateStr = new Date(e.createdAt).toDateString();
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    });

    const grid: number[][] = [];

    // Initialize empty grid
    for(let r=0; r<5; r++) {
        const row: number[] = [];
        for(let c=0; c<7; c++) {
            row.push(0);
        }
        grid.push(row);
    }

    const nowLocal = new Date();
    // Reset time to boundaries for accurate date string comparison
    nowLocal.setHours(0,0,0,0);

    // Get Today's column index (0=Mon ... 6=Sun)
    const jsDay = nowLocal.getDay(); // 0=Sun, 1=Mon...
    // Transform: Mon(1)->0, Tue(2)->1 ... Sun(0)->6
    const todayCol = (jsDay + 6) % 7;

    // Fill grid relative to [4][todayCol] which is Today
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        // Calculate offset in days from Today
        // Form: (Weeks back * 7) + (Days back within week)
        const offsetDays = (4 - week) * 7 + (todayCol - day);

        if (offsetDays < 0) {
          // This cell is in the future (e.g., later this week)
          grid[week][day] = 0;
          continue;
        }

        const date = new Date(nowLocal);
        date.setDate(date.getDate() - offsetDays);

        const dateStr = date.toDateString();
        const count = activityMap.get(dateStr) || 0;

        let level: number;
        if (count === 0) level = 0;
        else if (count === 1) level = 1;
        else if (count <= 3) level = 2;
        else if (count <= 5) level = 3;
        else level = 3;

        grid[week][day] = level as ActivityLevel;
      }
    }

    return {
      streakDays: streak,
      isStreakActive,
      audioMinutes,
      foldScore,
      percentile: 10, // Placeholder
      activityData: grid as ActivityLevel[][],
    };
  }, [entries]);

  return stats;
}
