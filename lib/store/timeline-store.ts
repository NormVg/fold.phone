import type { MoodType } from '@/components/mood';
import {
  createTimelineEntry,
  deleteTimelineEntry,
  getOnThisDayEntries,
  getTimelineEntries,
  type CreateEntryPayload,
  type OnThisDayGroup,
  type TimelineEntryResponse,
} from '@/lib/api';
import { uploadToAppwrite } from '@/lib/appwrite';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { useAuthStore } from './auth-store';

export type EntryType = 'text' | 'audio' | 'photo' | 'video' | 'story';

export interface EntryMedia {
  id?: string;
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
    media: (r.media || []).map((m) => ({
      id: m.id,
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

interface TimelineState {
  entries: TimelineEntry[];
  onThisDayGroups: OnThisDayGroup[];
  isLoading: boolean;
  isSaving: boolean;
  _lastUserId: string | null;

  // Actions
  addEntry: (entry: Omit<TimelineEntry, 'id' | 'createdAt'>) => Promise<TimelineEntry | null>;
  removeEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
  fetchOnThisDay: () => Promise<void>;
  clearEntries: () => void;
  /** Called from StoreInitializer when auth state changes */
  onAuthChange: (isAuthenticated: boolean, userId: string | null) => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  entries: [],
  onThisDayGroups: [],
  isLoading: true,
  isSaving: false,
  _lastUserId: null,

  fetchOnThisDay: async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) return;
    try {
      const { data, error } = await getOnThisDayEntries();
      if (error) {
        console.error('[Timeline] On-this-day fetch error:', error);
        return;
      }
      if (data) {
        set({ onThisDayGroups: data });
      }
    } catch (err) {
      console.error('[Timeline] On-this-day fetch error:', err);
    }
  },

  refreshEntries: async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || !user) {
      set({ isLoading: true });
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await getTimelineEntries(50, 0);
      if (error) {
        console.error('[Timeline] Fetch error:', error);
        return;
      }
      if (data) {
        set({ entries: data.map(mapResponseToEntry) });
      }
    } catch (err) {
      console.error('[Timeline] Fetch error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  onAuthChange: (isAuthenticated: boolean, userId: string | null) => {
    const { _lastUserId, refreshEntries, fetchOnThisDay } = get();

    if (isAuthenticated && userId) {
      if (_lastUserId !== userId) {
        console.log('[Timeline] User changed:', _lastUserId, '->', userId);
        set({ _lastUserId: userId, entries: [], onThisDayGroups: [] });
        refreshEntries();
        fetchOnThisDay();
      }
    } else {
      set({ _lastUserId: null, entries: [], onThisDayGroups: [], isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isSaving: true });
    try {
      // 1. Upload any local media files
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
      set((state) => ({ entries: [newEntry, ...state.entries] }));
      return newEntry;
    } catch (err) {
      console.error('[Timeline] addEntry error:', err);
      Alert.alert('Upload Failed', 'Could not upload media. Entry was not saved.');
      return null;
    } finally {
      set({ isSaving: false });
    }
  },

  removeEntry: async (id: string) => {
    try {
      const { error } = await deleteTimelineEntry(id);
      if (error) {
        console.error('[Timeline] Delete error:', error);
        return;
      }
      set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
    } catch (err) {
      console.error('[Timeline] removeEntry error:', err);
    }
  },

  clearEntries: () => {
    set({ entries: [], onThisDayGroups: [] });
  },
}));

// Compatibility shim — keeps existing consumers working without any import changes
export function useTimeline() {
  return useTimelineStore();
}
