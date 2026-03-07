import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'fold_watch_history';
const MAX_HISTORY = 50;

export interface WatchHistoryItem {
  token: string;
  url: string;
  entryType: string;
  preview: string;
  mood: string | null;
  viewedAt: string; // ISO date
  sharedAt: string;
  viewCount: number;
}

export async function getWatchHistory(): Promise<WatchHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchHistoryItem[];
  } catch {
    return [];
  }
}

export async function addToWatchHistory(item: WatchHistoryItem): Promise<void> {
  try {
    const history = await getWatchHistory();
    // Remove existing entry for the same token (move to top)
    const filtered = history.filter((h) => h.token !== item.token);
    // Prepend new item
    const updated = [item, ...filtered].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

export async function removeFromWatchHistory(token: string): Promise<void> {
  try {
    const history = await getWatchHistory();
    const updated = history.filter((h) => h.token !== token);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail
  }
}

export async function clearWatchHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Extract a share token from a URL or raw token string.
 * Accepts:
 *   - https://link.fold.taohq.org/abc123
 *   - link.fold.taohq.org/abc123
 *   - abc123 (raw 10-char token)
 */
export function extractToken(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try to extract from URL
  try {
    const url = new URL(
      trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    );
    if (url.hostname === 'link.fold.taohq.org') {
      const token = url.pathname.replace(/^\/+/, '').split('/')[0];
      return token && token.length > 0 ? token : null;
    }
  } catch {
    // Not a URL — fall through
  }

  // Treat as raw token (alphanumeric, ~10 chars)
  if (/^[a-z0-9]{6,20}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}
