import type { MoodType } from '@/components/mood';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export type EntryType = 'text' | 'audio' | 'photo' | 'video' | 'story';

export interface TimelineEntry {
  id: string;
  type: EntryType;
  createdAt: Date;
  mood?: MoodType | null;
  caption?: string;
  location?: string;

  // Text entry
  content?: string;

  // Audio entry
  audioUri?: string;
  audioDuration?: number; // seconds

  // Photo entry (single or multiple)
  photoUri?: string;
  photoUris?: string[]; // For slideshow/carousel of photos

  // Video entry
  videoUri?: string;
  thumbnailUri?: string;
  videoDuration?: number;

  // Story entry
  title?: string;
  storyContent?: string;
  pageCount?: number;
  storyMedia?: { uri: string; type: 'image' | 'video'; duration?: number }[];
}

interface TimelineContextValue {
  entries: TimelineEntry[];
  addEntry: (entry: Omit<TimelineEntry, 'id' | 'createdAt'>) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);

  const addEntry = useCallback((entry: Omit<TimelineEntry, 'id' | 'createdAt'>) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    setEntries(prev => [newEntry, ...prev]); // Add to beginning (newest first)
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <TimelineContext.Provider value={{ entries, addEntry, removeEntry, clearEntries }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}
