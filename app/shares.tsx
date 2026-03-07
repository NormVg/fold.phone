import { ShareCard, SharesEmptyState, SharesStatsCard } from '@/components/shares';
import { SCALE } from '@/components/shares/constants';
import { TimelineColors } from '@/constants/theme';
import { deleteShare, getShares, type ShareResponse, updateShare } from '@/lib/api';
import {
  clearWatchHistory,
  extractToken,
  getWatchHistory,
  removeFromWatchHistory,
  type WatchHistoryItem,
} from '@/lib/watch-history';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Tab = 'yours' | 'received';

// ============== ICONS ==============

function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LinkIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowRightIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="#fff"
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

function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#888" strokeWidth={2} />
      <Path d="M12 6V12L16 14" stroke="#888" strokeWidth={2} strokeLinecap="round" />
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

const ENTRY_TYPE_LABELS: Record<string, string> = {
  text: 'Text',
  audio: 'Voice',
  photo: 'Photo',
  video: 'Video',
  story: 'Story',
};

// ============== WATCH HISTORY CARD ==============

function HistoryCard({
  item,
  onPress,
  onRemove,
}: {
  item: WatchHistoryItem;
  onPress: () => void;
  onRemove: () => void;
}) {
  const typeLabel = ENTRY_TYPE_LABELS[item.entryType] || item.entryType;
  const viewedDate = new Date(item.viewedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const viewedTime = new Date(item.viewedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.historyCard, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={styles.historyCardTop}>
        <View style={styles.historyTypeBadge}>
          <Text style={styles.historyTypeBadgeText}>{typeLabel}</Text>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          hitSlop={8}
          style={styles.historyRemoveBtn}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6L18 18" stroke="#aaa" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>

      <Text style={styles.historyPreview} numberOfLines={2}>
        {item.preview || 'No preview'}
      </Text>

      <View style={styles.historyMeta}>
        <View style={styles.historyMetaItem}>
          <ClockIcon size={12 * SCALE} />
          <Text style={styles.historyMetaText}>{viewedDate}, {viewedTime}</Text>
        </View>
        <View style={styles.historyMetaItem}>
          <EyeIcon size={12 * SCALE} />
          <Text style={styles.historyMetaText}>{item.viewCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ============== RECEIVED TAB EMPTY STATE ==============

function ReceivedEmptyState() {
  return (
    <View style={styles.receivedEmpty}>
      <View style={styles.receivedEmptyIcon}>
        <Svg width={36 * SCALE} height={36 * SCALE} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 19.5304 3 19V15"
            stroke="rgba(129, 1, 0, 0.3)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M7 10L12 15L17 10"
            stroke="rgba(129, 1, 0, 0.3)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 15V3"
            stroke="rgba(129, 1, 0, 0.3)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <Text style={styles.receivedEmptyTitle}>No Watch History</Text>
      <Text style={styles.receivedEmptySubtitle}>
        Paste a shared link above to view someone's memory. Your viewing history will appear here.
      </Text>
    </View>
  );
}

// ============== MAIN SCREEN ==============

export default function SharesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('yours');

  // Your shares state
  const [shares, setShares] = useState<ShareResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Received state
  const [linkInput, setLinkInput] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch your shares
  const fetchShares = useCallback(async () => {
    const result = await getShares();
    if (result.data) {
      setShares(result.data);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  // Fetch watch history
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    const items = await getWatchHistory();
    setHistory(items);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    fetchShares();
    fetchHistory();
  }, [fetchShares, fetchHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (activeTab === 'yours') {
      fetchShares();
    } else {
      fetchHistory().then(() => setRefreshing(false));
    }
  }, [activeTab, fetchShares, fetchHistory]);

  // Stats
  const stats = useMemo(() => {
    const totalShares = shares.length;
    const totalViews = shares.reduce((sum, s) => sum + (s.viewCount || 0), 0);
    const activeCount = shares.filter((s) => s.status === 'active').length;
    return { totalShares, totalViews, activeCount };
  }, [shares]);

  // Your shares handlers
  const handleToggleStatus = useCallback(async (id: string, currentStatus: 'active' | 'paused') => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const result = await updateShare(id, newStatus);
    if (!result.error) {
      setShares((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const result = await deleteShare(id);
    if (result.success) {
      setShares((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  // Received handlers
  const handleOpenLink = useCallback(() => {
    Keyboard.dismiss();
    setLinkError(null);
    const token = extractToken(linkInput);
    if (!token) {
      setLinkError('Invalid link. Paste a Fold share link or token.');
      return;
    }
    setLinkInput('');
    router.push(`/shared/${token}`);
  }, [linkInput, router]);

  const handleHistoryPress = useCallback(
    (item: WatchHistoryItem) => {
      router.push(`/shared/${item.token}`);
    },
    [router]
  );

  const handleHistoryRemove = useCallback(async (token: string) => {
    await removeFromWatchHistory(token);
    setHistory((prev) => prev.filter((h) => h.token !== token));
  }, []);

  const handleClearHistory = useCallback(() => {
    Alert.alert('Clear History', 'Remove all watch history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearWatchHistory();
          setHistory([]);
        },
      },
    ]);
  }, []);

  const handleBack = () => router.back();

  // Reload history when coming back from viewer (tab switch or focus)
  useEffect(() => {
    if (activeTab === 'received') {
      fetchHistory();
    }
  }, [activeTab, fetchHistory]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <View style={styles.topBarCenter}>
          <View style={styles.iconCircle}>
            <LinkIcon size={18 * SCALE} />
          </View>
          <Text style={styles.topBarTitle}>Shares</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Subtle tab switcher */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabItem, activeTab === 'yours' && styles.tabItemActive]}
          onPress={() => setActiveTab('yours')}
        >
          <Text style={[styles.tabText, activeTab === 'yours' && styles.tabTextActive]}>
            Your Shares
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabItem, activeTab === 'received' && styles.tabItemActive]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}>
            Received
          </Text>
        </Pressable>
      </View>

      {/* ============= YOUR SHARES TAB ============= */}
      {activeTab === 'yours' && (
        <>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={TimelineColors.primary} />
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={TimelineColors.primary}
                />
              }
            >
              {shares.length === 0 ? (
                <SharesEmptyState />
              ) : (
                <>
                  <SharesStatsCard
                    totalShares={stats.totalShares}
                    totalViews={stats.totalViews}
                    activeCount={stats.activeCount}
                  />
                  <View style={styles.listHeader}>
                    <Text style={styles.listHeaderTitle}>Your Shares</Text>
                    <Text style={styles.listHeaderCount}>{shares.length} links</Text>
                  </View>
                  <View style={styles.sharesList}>
                    {shares.map((share) => (
                      <ShareCard
                        key={share.id}
                        share={share}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                      />
                    ))}
                  </View>
                </>
              )}
              <View style={styles.bottomPadding} />
            </ScrollView>
          )}
        </>
      )}

      {/* ============= RECEIVED TAB ============= */}
      {activeTab === 'received' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={TimelineColors.primary}
            />
          }
        >
          {/* Paste link input */}
          <View style={styles.pasteSection}>
            <Text style={styles.pasteSectionTitle}>Open Shared Link</Text>
            <Text style={styles.pasteSectionSubtitle}>
              Paste a Fold share link to view the memory
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.linkInput}
                placeholder="Paste link here..."
                placeholderTextColor="#aaa"
                value={linkInput}
                onChangeText={(t) => {
                  setLinkInput(t);
                  setLinkError(null);
                }}
                onSubmitEditing={handleOpenLink}
                returnKeyType="go"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <Pressable
                style={[styles.goButton, !linkInput.trim() && styles.goButtonDisabled]}
                onPress={handleOpenLink}
                disabled={!linkInput.trim()}
              >
                <ArrowRightIcon size={18 * SCALE} />
              </Pressable>
            </View>
            {linkError && <Text style={styles.linkError}>{linkError}</Text>}
          </View>

          {/* Watch history */}
          {historyLoading ? (
            <View style={styles.historyLoading}>
              <ActivityIndicator size="small" color={TimelineColors.primary} />
            </View>
          ) : history.length === 0 ? (
            <ReceivedEmptyState />
          ) : (
            <>
              <View style={styles.historyHeader}>
                <Text style={styles.historyHeaderTitle}>Watch History</Text>
                <Pressable onPress={handleClearHistory} hitSlop={8}>
                  <Text style={styles.historyClearText}>Clear All</Text>
                </Pressable>
              </View>
              <View style={styles.historyList}>
                {history.map((item) => (
                  <HistoryCard
                    key={item.token}
                    item={item}
                    onPress={() => handleHistoryPress(item)}
                    onRemove={() => handleHistoryRemove(item.token)}
                  />
                ))}
              </View>
            </>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ============== STYLES ==============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  iconCircle: {
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  placeholder: {
    width: 40 * SCALE,
  },

  // Subtle tab switcher
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 17 * SCALE,
    gap: 4 * SCALE,
    marginBottom: 4 * SCALE,
  },
  tabItem: {
    paddingVertical: 8 * SCALE,
    paddingHorizontal: 16 * SCALE,
    borderRadius: 20 * SCALE,
  },
  tabItemActive: {
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
  },
  tabText: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: TimelineColors.primary,
    fontWeight: '600',
  },

  // Shared
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * SCALE,
  },
  listHeaderTitle: {
    fontSize: 20 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
  },
  listHeaderCount: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  sharesList: {
    gap: 12 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },

  // Paste section
  pasteSection: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 18 * SCALE,
    marginBottom: 20 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  pasteSectionTitle: {
    fontSize: 17 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 4 * SCALE,
  },
  pasteSectionSubtitle: {
    fontSize: 13 * SCALE,
    fontWeight: '400',
    color: '#888',
    marginBottom: 14 * SCALE,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10 * SCALE,
  },
  linkInput: {
    flex: 1,
    height: 46 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 14 * SCALE,
    paddingHorizontal: 14 * SCALE,
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  goButton: {
    width: 46 * SCALE,
    height: 46 * SCALE,
    borderRadius: 14 * SCALE,
    backgroundColor: TimelineColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goButtonDisabled: {
    opacity: 0.35,
  },
  linkError: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#C62828',
    marginTop: 8 * SCALE,
  },

  // Watch history
  historyLoading: {
    paddingTop: 40 * SCALE,
    alignItems: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * SCALE,
  },
  historyHeaderTitle: {
    fontSize: 17 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
  },
  historyClearText: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: '#C62828',
  },
  historyList: {
    gap: 10 * SCALE,
  },
  historyCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 14 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * SCALE,
  },
  historyTypeBadge: {
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 8 * SCALE,
    paddingVertical: 3 * SCALE,
  },
  historyTypeBadgeText: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  historyRemoveBtn: {
    width: 28 * SCALE,
    height: 28 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyPreview: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
    lineHeight: 20 * SCALE,
    marginBottom: 8 * SCALE,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14 * SCALE,
  },
  historyMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * SCALE,
  },
  historyMetaText: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: '#999',
  },

  // Received empty state
  receivedEmpty: {
    alignItems: 'center',
    paddingTop: 32 * SCALE,
    paddingHorizontal: 20 * SCALE,
  },
  receivedEmptyIcon: {
    width: 72 * SCALE,
    height: 72 * SCALE,
    borderRadius: 36 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16 * SCALE,
  },
  receivedEmptyTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 8 * SCALE,
  },
  receivedEmptySubtitle: {
    fontSize: 13 * SCALE,
    fontWeight: '400',
    color: '#888',
    textAlign: 'center',
    lineHeight: 20 * SCALE,
  },
});
