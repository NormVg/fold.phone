// Re-export from Zustand store for backward compatibility.
// New code should import from '@/lib/store/timeline-store' directly.
export { useTimeline, useTimelineStore } from './store/timeline-store';
export type { TimelineEntry, EntryType, EntryMedia } from './store/timeline-store';

// Re-export TimelineProvider as a no-op wrapper for any remaining references
import React from 'react';
export function TimelineProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
