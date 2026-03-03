import { ConnectSetup, ConnectTimeline, ConnectTransitionOverlay } from '@/components/connect';
import type { TransitionMode } from '@/components/connect/ConnectTransitionOverlay';
import { TimelineColors } from '@/constants/theme';
import { endConnection, getConnectStatus, type ConnectStatus } from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

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

function ConnectIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MoreIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill={TimelineColors.textDark}
        stroke={TimelineColors.textDark}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ============== MAIN SCREEN ==============

export default function ConnectScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitionTarget, setTransitionTarget] = useState<TransitionMode>(null);

  const fetchStatus = useCallback(async () => {
    setError(null);
    const result = await getConnectStatus();
    if (result.data) {
      setStatus(result.data);
    } else {
      setError(result.error ?? 'Failed to load connection status.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleBack = () => {
    router.back();
  };

  const handleConnected = () => {
    // Refresh status after a non-animated connection change (decline, cancel, send)
    setLoading(true);
    fetchStatus();
  };

  // Called specifically when user accepts an incoming request — plays the animation
  const handleAccepted = useCallback(() => {
    setTransitionTarget('connect');
  }, []);

  // At animation midpoint (dots collide), swap the underlying view by refreshing status
  const handleTransitionMidpoint = useCallback(async () => {
    const result = await getConnectStatus();
    if (result.data) setStatus(result.data);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setTransitionTarget(null);
  }, []);

  const handleEndConnection = () => {
    Alert.alert(
      'End Connection',
      'Are you sure? There will be a 30-day cooldown before you can connect with someone else.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Connection',
          style: 'destructive',
          onPress: async () => {
            const result = await endConnection();
            if (result.error) {
              Alert.alert('Error', result.error);
            } else {
              handleConnected();
            }
          },
        },
      ]
    );
  };

  const hasActiveConnection = status?.active != null;

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
            <ConnectIcon size={18 * SCALE} />
          </View>
          <Text style={styles.topBarTitle}>
            {hasActiveConnection
              ? status?.active?.partner?.name || 'Connect'
              : 'Connect'}
          </Text>
        </View>
        {hasActiveConnection ? (
          <Pressable onPress={handleEndConnection} style={styles.moreButton}>
            <MoreIcon size={20 * SCALE} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={TimelineColors.primary} />
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => { setLoading(true); fetchStatus(); }}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : hasActiveConnection ? (
        <ConnectTimeline connection={status!.active!} />
      ) : (
        <ConnectSetup status={status!} onConnected={handleConnected} onAccepted={handleAccepted} />
      )}

      {/* Connection animation overlay */}
      <ConnectTransitionOverlay
        targetMode={transitionTarget}
        onMidpoint={handleTransitionMidpoint}
        onComplete={handleTransitionComplete}
      />
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
  moreButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15 * SCALE,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16 * SCALE,
    paddingHorizontal: 24 * SCALE,
  },
  retryButton: {
    backgroundColor: TimelineColors.primary,
    paddingHorizontal: 28 * SCALE,
    paddingVertical: 12 * SCALE,
    borderRadius: 12 * SCALE,
  },
  retryText: {
    color: '#fff',
    fontSize: 15 * SCALE,
    fontWeight: '600',
  },
});
