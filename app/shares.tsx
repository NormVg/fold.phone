import { ShareCard, SharesEmptyState, SharesStatsCard } from '@/components/shares';
import { SCALE } from '@/components/shares/constants';
import { TimelineColors } from '@/constants/theme';
import { deleteShare, getShares, type ShareResponse, updateShare } from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

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

// ============== MAIN SCREEN ==============

export default function SharesScreen() {
  const router = useRouter();
  const [shares, setShares] = useState<ShareResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShares = useCallback(async () => {
    const result = await getShares();
    if (result.data) {
      setShares(result.data);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShares();
  }, [fetchShares]);

  // Stats
  const stats = useMemo(() => {
    const totalShares = shares.length;
    const totalViews = shares.reduce((sum, s) => sum + (s.viewCount || 0), 0);
    const activeCount = shares.filter((s) => s.status === 'active').length;
    return { totalShares, totalViews, activeCount };
  }, [shares]);

  // Handlers
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

  const handleBack = () => {
    router.back();
  };

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
              {/* Stats overview */}
              <SharesStatsCard
                totalShares={stats.totalShares}
                totalViews={stats.totalViews}
                activeCount={stats.activeCount}
              />

              {/* List header */}
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderTitle}>Your Shares</Text>
                <Text style={styles.listHeaderCount}>{shares.length} links</Text>
              </View>

              {/* Share cards list */}
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
});
