import { TimelineColors } from '@/constants/theme';
import type { ShareResponse } from '@/lib/api';
import { getShareUrl } from '@/lib/api';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { ENTRY_TYPE_LABELS, SCALE } from './constants';

// ============== ICONS ==============

function CopyIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="9" width="13" height="13" rx="2" stroke="#666" strokeWidth={2} />
      <Path
        d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
        stroke="#666"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TrashIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H5H21" stroke="#C62828" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
        stroke="#C62828"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke="#888"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke="#888" strokeWidth={2} />
    </Svg>
  );
}

// ============== ENTRY TYPE BADGE ==============

function EntryTypeBadge({ type }: { type: string }) {
  const label = ENTRY_TYPE_LABELS[type] || type;
  return (
    <View style={styles.typeBadge}>
      <Text style={styles.typeBadgeText}>{label}</Text>
    </View>
  );
}

// ============== STATUS BADGE ==============

function StatusBadge({ status }: { status: 'active' | 'paused' }) {
  const isActive = status === 'active';
  return (
    <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusPaused]}>
      <View style={[styles.statusDot, { backgroundColor: isActive ? '#4CAF50' : '#FF9800' }]} />
      <Text style={[styles.statusText, { color: isActive ? '#2E7D32' : '#E65100' }]}>
        {isActive ? 'Active' : 'Paused'}
      </Text>
    </View>
  );
}

// ============== SHARE CARD ==============

interface ShareCardProps {
  share: ShareResponse;
  onToggleStatus: (id: string, currentStatus: 'active' | 'paused') => void;
  onDelete: (id: string) => void;
}

export default function ShareCard({ share, onToggleStatus, onDelete }: ShareCardProps) {
  const entryType = share.entryType || 'text';
  const preview = share.entryTitle || share.entryCaption || share.entryContent || 'No preview available';
  const truncatedPreview = preview.length > 100 ? preview.slice(0, 100) + '...' : preview;

  // Format date
  const createdDate = new Date(share.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyLink = async () => {
    const url = getShareUrl(share.token);
    await Clipboard.setStringAsync(url);
    Alert.alert('Copied', 'Share link copied to clipboard');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Share',
      'This will permanently remove this share link. Anyone with the link will no longer be able to view it.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(share.id) },
      ]
    );
  };

  const handleToggle = () => {
    onToggleStatus(share.id, share.status as 'active' | 'paused');
  };

  return (
    <View style={styles.card}>
      {/* Top row: type badge + status */}
      <View style={styles.cardTopRow}>
        <EntryTypeBadge type={entryType} />
        <StatusBadge status={share.status as 'active' | 'paused'} />
      </View>

      {/* Preview text */}
      <Text style={styles.previewText} numberOfLines={2}>
        {truncatedPreview}
      </Text>

      {/* Meta row: date + views */}
      <View style={styles.metaRow}>
        <Text style={styles.metaDate}>{createdDate}</Text>
        <View style={styles.viewsRow}>
          <EyeIcon size={13 * SCALE} />
          <Text style={styles.viewsText}>{share.viewCount} views</Text>
        </View>
      </View>

      {/* Actions row */}
      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.actionButton, styles.toggleButton]}
          onPress={handleToggle}
        >
          <Text style={styles.toggleButtonText}>
            {share.status === 'active' ? 'Pause' : 'Activate'}
          </Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleCopyLink}>
          <CopyIcon size={16 * SCALE} />
          <Text style={styles.actionButtonText}>Copy Link</Text>
        </Pressable>

        <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
          <TrashIcon size={16 * SCALE} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 18 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * SCALE,
  },
  typeBadge: {
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    borderRadius: 8 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 4 * SCALE,
  },
  typeBadgeText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5 * SCALE,
    borderRadius: 8 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 4 * SCALE,
  },
  statusActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  statusPaused: {
    backgroundColor: 'rgba(255, 152, 0, 0.12)',
  },
  statusDot: {
    width: 6 * SCALE,
    height: 6 * SCALE,
    borderRadius: 3 * SCALE,
  },
  statusText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
  },
  previewText: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
    lineHeight: 22 * SCALE,
    marginBottom: 12 * SCALE,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14 * SCALE,
  },
  metaDate: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#888',
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * SCALE,
  },
  viewsText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#888',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: 12 * SCALE,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 * SCALE,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 8 * SCALE,
    borderRadius: 10 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  toggleButton: {
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
  },
  toggleButtonText: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  actionButtonText: {
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: '#555',
  },
  deleteButton: {
    backgroundColor: 'rgba(198, 40, 40, 0.08)',
    marginLeft: 'auto',
  },
});
