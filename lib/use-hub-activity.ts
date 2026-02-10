import { ActivityLevel } from '@/components/hub/types';
import { useTimeline } from '@/lib/timeline-context';
import { useMemo } from 'react';

export function useHubActivity(year: number, month: number): Map<number, ActivityLevel> {
  const { entries } = useTimeline();

  const activityMap = useMemo(() => {
    const map = new Map<number, ActivityLevel>();

    // Filter entries for the specific year and month
    const relevantEntries = entries.filter(e => {
      const d = new Date(e.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    // Count entries per day
    const dayCounts = new Map<number, number>();
    relevantEntries.forEach(e => {
      const day = new Date(e.createdAt).getDate();
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });

    // Map counts to activity levels
    dayCounts.forEach((count, day) => {
      let level: number;
      if (count === 0) level = 0;
      else if (count === 1) level = 1;
      else if (count <= 3) level = 2;
      else level = 3;

      map.set(day, level as ActivityLevel);
    });

    return map;
  }, [entries, year, month]);

  return activityMap;
}
