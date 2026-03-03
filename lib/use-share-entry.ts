import { createShare, getShareUrl, shareToConnect } from '@/lib/api';
import { useCallback, useRef, useState } from 'react';
import { Alert, Share } from 'react-native';

const DEBOUNCE_MS = 1000;

/**
 * Hook for sharing a timeline entry.
 * Opens a custom bottom sheet with "Share Link" and "Share to Connect" options.
 * Returns { shareEntry, sharingEntryId, sheetEntryId, dismissSheet, handleShareLink, handleShareConnect }.
 */
export function useShareEntry() {
  const [sharingEntryId, setSharingEntryId] = useState<string | null>(null);
  const [sheetEntryId, setSheetEntryId] = useState<string | null>(null);
  const lastCallRef = useRef<number>(0);

  const doShareLink = async (entryId: string) => {
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
  };

  const doShareToConnect = async (entryId: string) => {
    setSharingEntryId(entryId);
    try {
      const result = await shareToConnect(entryId);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        Alert.alert('Shared', 'Memory shared to Connect timeline.');
      }
    } catch (e) {
      console.error('Connect share error:', e);
      Alert.alert('Error', 'Failed to share to Connect.');
    } finally {
      setSharingEntryId(null);
    }
  };

  const shareEntry = useCallback((entryId?: string) => {
    if (!entryId) return;

    const now = Date.now();
    if (now - lastCallRef.current < DEBOUNCE_MS) return;
    lastCallRef.current = now;

    if (sharingEntryId === entryId) return;

    // Open the custom sheet instead of native ActionSheet
    setSheetEntryId(entryId);
  }, [sharingEntryId]);

  const dismissSheet = useCallback(() => {
    setSheetEntryId(null);
  }, []);

  const handleShareLink = useCallback(() => {
    if (sheetEntryId) {
      const id = sheetEntryId;
      setSheetEntryId(null);
      doShareLink(id);
    }
  }, [sheetEntryId]);

  const handleShareConnect = useCallback(() => {
    if (sheetEntryId) {
      const id = sheetEntryId;
      setSheetEntryId(null);
      doShareToConnect(id);
    }
  }, [sheetEntryId]);

  const shareEntryAsLink = useCallback((entryId?: string) => {
    if (!entryId) return;

    const now = Date.now();
    if (now - lastCallRef.current < DEBOUNCE_MS) return;
    lastCallRef.current = now;

    if (sharingEntryId === entryId) return;

    // Skip the sheet, go straight to share link
    doShareLink(entryId);
  }, [sharingEntryId]);

  return {
    shareEntry,
    shareEntryAsLink,
    sharingEntryId,
    sheetEntryId,
    dismissSheet,
    handleShareLink,
    handleShareConnect,
  };
}
