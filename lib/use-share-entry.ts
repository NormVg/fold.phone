import { createShare, getShareUrl } from '@/lib/api';
import { useCallback, useRef, useState } from 'react';
import { Alert, Share } from 'react-native';

const DEBOUNCE_MS = 1000;

/**
 * Hook for sharing a timeline entry.
 * Returns { shareEntry, sharingEntryId } — sharingEntryId is the entry currently
 * being shared (for showing a loading indicator), or null if idle.
 */
export function useShareEntry() {
  const [sharingEntryId, setSharingEntryId] = useState<string | null>(null);
  const lastCallRef = useRef<number>(0);

  const shareEntry = useCallback(async (entryId?: string) => {
    if (!entryId) return;

    // Debounce — ignore rapid taps within DEBOUNCE_MS
    const now = Date.now();
    if (now - lastCallRef.current < DEBOUNCE_MS) return;
    lastCallRef.current = now;

    // Already sharing this entry
    if (sharingEntryId === entryId) return;

    setSharingEntryId(entryId);
    try {
      const result = await createShare(entryId);
      if (result.data) {
        const url = getShareUrl(result.data.token);
        await Share.share({
          message: url,
          url: url,
        });
      } else if (result.error) {
        Alert.alert('Error', result.error);
      }
    } catch (e) {
      console.error('Share error:', e);
      Alert.alert('Error', 'Failed to create share link.');
    } finally {
      setSharingEntryId(null);
    }
  }, [sharingEntryId]);

  return { shareEntry, sharingEntryId };
}
