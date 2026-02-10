import type { MoodType } from '@/components/mood';
import {
  createTimelineEntry,
  deleteTimelineEntry,
  getTimelineEntries,
  uploadMedia,
  type CreateEntryPayload,
  type TimelineEntryResponse,
} from '@/lib/api';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

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
  const entry: TimelineEntry = {
    id: r.id,
    type: r.type,
    createdAt: new Date(r.createdAt),
    mood: (r.mood as MoodType) || null,
    caption: r.caption || undefined,
    location: r.location || undefined,
    content: r.content || undefined,
    audioUri: r.audioUri || undefined,
    audioDuration: r.audioDuration || undefined,
    videoUri: r.videoUri || undefined,
    thumbnailUri: r.thumbnailUri || undefined,
    videoDuration: r.videoDuration || undefined,
    title: r.title || undefined,
    storyContent: r.storyContent || undefined,
    pageCount: r.pageCount || undefined,
  };

  // Map media array back to photoUris / storyMedia
  if (r.media && r.media.length > 0) {
    if (r.type === 'photo') {
      entry.photoUris = r.media.map(m => m.uri);
      entry.photoUri = r.media[0]?.uri;
    } else if (r.type === 'story') {
      entry.storyMedia = r.media.map(m => ({
        uri: m.uri,
        type: m.type,
        duration: m.duration || undefined,
      }));
    }
  }

  return entry;
}

/** Determine MIME type from file extension */
function guessMimeType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'm4a': return 'audio/mp4';
    case 'aac': return 'audio/aac';
    case 'wav': return 'audio/wav';
    case 'mp3': return 'audio/mpeg';
    case 'caf': return 'audio/x-caf';
    default: return 'application/octet-stream';
  }
}

/** Upload a local URI and return the remote URL, or pass through if already remote */
async function ensureRemoteUri(uri: string): Promise<string> {
  // Already a remote URL — pass through
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;

  const { url, error } = await uploadMedia(uri, guessMimeType(uri));
  if (error || !url) {
    console.error('[Timeline] Upload failed for', uri, error);
    // Fallback: return local URI so the entry still renders locally
    return uri;
  }
  return url;
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
      // 1. Upload any local media files first
      const payload: CreateEntryPayload = {
        type: entry.type,
        mood: entry.mood || null,
        location: entry.location || null,
        caption: entry.caption || null,
        content: entry.content || null,
      };

      // Audio
      if (entry.type === 'audio' && entry.audioUri) {
        payload.audioUri = await ensureRemoteUri(entry.audioUri);
        payload.audioDuration = entry.audioDuration || null;
      }

      // Photo
      if (entry.type === 'photo') {
        if (entry.photoUris && entry.photoUris.length > 0) {
          payload.photoUris = await Promise.all(entry.photoUris.map(ensureRemoteUri));
          payload.photoUri = payload.photoUris[0];
        } else if (entry.photoUri) {
          payload.photoUri = await ensureRemoteUri(entry.photoUri);
        }
      }

      // Video
      if (entry.type === 'video' && entry.videoUri) {
        payload.videoUri = await ensureRemoteUri(entry.videoUri);
        payload.thumbnailUri = entry.thumbnailUri ? await ensureRemoteUri(entry.thumbnailUri) : null;
        payload.videoDuration = entry.videoDuration || null;
      }

      // Story
      if (entry.type === 'story') {
        payload.title = entry.title || null;
        payload.storyContent = entry.storyContent || null;
        payload.pageCount = entry.pageCount || null;
        if (entry.storyMedia && entry.storyMedia.length > 0) {
          payload.storyMedia = await Promise.all(
            entry.storyMedia.map(async (m) => ({
              uri: await ensureRemoteUri(m.uri),
              type: m.type,
              duration: m.duration,
            }))
          );
        }
      }

      // 2. Create entry in backend
      const { data, error } = await createTimelineEntry(payload);
      if (error || !data) {
        console.error('[Timeline] Create error:', error);
        return null;
      }

      // 3. Add to local state (prepend, newest first)
      const newEntry = mapResponseToEntry(data);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('[Timeline] addEntry error:', err);
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
