import type { MoodType } from '@/components/mood';
import {
  createTimelineEntry,
  deleteTimelineEntry,
  getTimelineEntries,
  type CreateEntryPayload,
  type TimelineEntryResponse
} from '@/lib/api';
import { uploadToAppwrite } from '@/lib/appwrite';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

export type EntryType = 'text' | 'audio' | 'photo' | 'video' | 'story';

export interface EntryMedia {
  uri: string;
  type: 'image' | 'video' | 'audio';
  thumbnailUri?: string;
  duration?: number;
}

export interface TimelineEntry {
  id: string;
  type: EntryType;
  createdAt: Date;
  mood?: MoodType | null;
  caption?: string;
  location?: string;

  // Text entry
  content?: string;

  // Story entry
  title?: string;
  storyContent?: string;
  pageCount?: number;

  // All media (photos, videos, audio) in one array
  media: EntryMedia[];
}

interface TimelineContextValue {
  entries: TimelineEntry[];
  isLoading: boolean;
  isSaving: boolean;
  addEntry: (entry: Omit<TimelineEntry, 'id' | 'createdAt'>) => Promise<TimelineEntry | null>;
  removeEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
  clearEntries: () => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

/** Convert API response shape → local TimelineEntry shape */
function mapResponseToEntry(r: TimelineEntryResponse): TimelineEntry {
  return {
    id: r.id,
    type: r.type,
    createdAt: new Date(r.createdAt),
    mood: (r.mood as MoodType) || null,
    caption: r.caption || undefined,
    location: r.location || undefined,
    content: r.content || undefined,
    title: r.title || undefined,
    storyContent: r.storyContent || undefined,
    pageCount: r.pageCount || undefined,
    media: (r.media || []).map(m => ({
      uri: m.uri,
      type: m.type,
      thumbnailUri: m.thumbnailUri || undefined,
      duration: m.duration || undefined,
    })),
  };
}

/** Upload a local URI to Appwrite and return the remote URL. Throws on failure. */
async function ensureRemoteUri(uri: string): Promise<string> {
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;

  const remoteUrl = await uploadToAppwrite(uri);
  console.log('[Timeline] Uploaded to Appwrite:', remoteUrl);
  return remoteUrl;
}

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const hasFetched = useRef(false);

  // Fetch entries from backend on mount
  const refreshEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getTimelineEntries(50, 0);
      if (error) {
        console.error('[Timeline] Fetch error:', error);
        return;
      }
      if (data) {
        setEntries(data.map(mapResponseToEntry));
      }
    } catch (err) {
      console.error('[Timeline] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      refreshEntries();
    }
  }, [refreshEntries]);

  const addEntry = useCallback(async (entry: Omit<TimelineEntry, 'id' | 'createdAt'>): Promise<TimelineEntry | null> => {
    setIsSaving(true);
    try {
      // 1. Upload any local media files — all must succeed
      const uploadedMedia: CreateEntryPayload['media'] = [];

      if (entry.media && entry.media.length > 0) {
        for (const m of entry.media) {
          const remoteUri = await ensureRemoteUri(m.uri);
          const remoteThumbnail = m.thumbnailUri
            ? await ensureRemoteUri(m.thumbnailUri)
            : undefined;

          uploadedMedia.push({
            uri: remoteUri,
            type: m.type,
            thumbnailUri: remoteThumbnail || null,
            duration: m.duration || null,
          });
        }
      }

      // 2. Build payload
      const payload: CreateEntryPayload = {
        type: entry.type,
        mood: entry.mood || null,
        location: entry.location || null,
        caption: entry.caption || null,
        content: entry.content || null,
        title: entry.title || null,
        storyContent: entry.storyContent || null,
        pageCount: entry.pageCount || null,
        media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
      };

      // 3. Create entry in backend
      const { data, error } = await createTimelineEntry(payload);
      if (error || !data) {
        console.error('[Timeline] Create error:', error);
        Alert.alert('Error', 'Failed to save your entry. Please try again.');
        return null;
      }

      // 4. Add to local state (prepend, newest first)
      const newEntry = mapResponseToEntry(data);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('[Timeline] addEntry error:', err);
      Alert.alert('Upload Failed', 'Could not upload media. Entry was not saved.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const removeEntry = useCallback(async (id: string) => {
    try {
      const { error } = await deleteTimelineEntry(id);
      if (error) {
        console.error('[Timeline] Delete error:', error);
        return;
      }
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('[Timeline] removeEntry error:', err);
    }
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <TimelineContext.Provider value={{ entries, isLoading, isSaving, addEntry, removeEntry, refreshEntries, clearEntries }}>
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
