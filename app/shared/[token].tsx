import PhotoCard from '@/components/timeline/PhotoCard';
import StoryCard from '@/components/timeline/StoryCard';
import TextCard from '@/components/timeline/TextCard';
import VideoCard from '@/components/timeline/VideoCard';
import VoiceCard from '@/components/timeline/VoiceCard';
import { getPublicShare, type PublicShareEntry } from '@/lib/api';
import { addToWatchHistory } from '@/lib/watch-history';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const COLORS = {
  background: '#EDEADC',
  card: '#FDFBF7',
  primary: '#810100',
  text: '#181717',
  textLight: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
};

const TYPE_LABELS: Record<string, string> = {
  text: 'Text Entry',
  audio: 'Voice Note',
  photo: 'Photo',
  video: 'Video',
  story: 'Story',
};

// ============== ICONS ==============

function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={COLORS.primary}
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

// ============== LOCAL AUDIO HOOK ==============

function useLocalAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const togglePlayback = useCallback(async (uri: string) => {
    // If already loaded, toggle play/pause
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    // Load and play
    setIsLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            const dur = status.durationMillis || 1;
            setProgress(status.positionMillis / dur);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
              soundRef.current?.setPositionAsync(0);
            }
          }
        }
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch {
      // ignore load errors
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (newProgress: number) => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if ('durationMillis' in status && status.durationMillis) {
        const positionMillis = status.durationMillis * Math.max(0, Math.min(1, newProgress));
        await soundRef.current.setPositionAsync(positionMillis);
        setProgress(newProgress);
      }
    } catch {
      // ignore
    }
  }, []);

  return { isPlaying, isLoading, progress, togglePlayback, seekTo };
}

// ============== MAIN SCREEN ==============

export default function SharedEntryScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [data, setData] = useState<PublicShareEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isPlaying, isLoading: audioLoading, progress, togglePlayback, seekTo } = useLocalAudio();

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await getPublicShare(token);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setData(result.data);
        // Save to watch history
        const entry = result.data.entry;
        const preview = entry.title || entry.caption || entry.content || '';
        await addToWatchHistory({
          token,
          url: `https://link.fold.taohq.org/${token}`,
          entryType: entry.type,
          preview: preview.length > 120 ? preview.slice(0, 120) + '...' : preview,
          mood: entry.mood,
          viewedAt: new Date().toISOString(),
          sharedAt: result.data.sharedAt,
          viewCount: result.data.viewCount,
        });
      }
      setLoading(false);
    })();
  }, [token]);

  const handleBack = () => router.back();

  // ===== Loading state =====
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.topBar}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <BackIcon size={24 * SCALE} />
          </Pressable>
          <Text style={styles.topBarTitle}>Shared Memory</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading shared entry...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===== Error state =====
  if (error || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.topBar}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <BackIcon size={24 * SCALE} />
          </Pressable>
          <Text style={styles.topBarTitle}>Shared Memory</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <View style={styles.errorIconCircle}>
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke={COLORS.primary}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <Text style={styles.errorTitle}>
            {error === 'Network error' ? 'Connection Error' : 'Link Unavailable'}
          </Text>
          <Text style={styles.errorSubtitle}>
            {error === 'Network error'
              ? 'Check your internet connection and try again.'
              : 'This share link may have expired, been paused, or deleted by the owner.'}
          </Text>
          <Pressable onPress={handleBack} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ===== Render the entry card =====
  const { entry, sharedAt, viewCount } = data;
  const typeLabel = TYPE_LABELS[entry.type] || entry.type;
  const sharedDate = new Date(sharedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const entryTime = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const mood = entry.mood || 'Normal';

  const renderEntryCard = () => {
    if (entry.type === 'text') {
      return (
        <TextCard
          content={entry.content || ''}
          time={entryTime}
          mood={mood}
        />
      );
    }

    if (entry.type === 'audio') {
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
      const audioMedia = entry.media?.find(m => m.type === 'audio');
      return (
        <VoiceCard
          title={entry.caption || 'Voice memo'}
          time={entryTime}
          duration={formatDuration(audioMedia?.duration || 0)}
          mood={mood}
          isPlaying={isPlaying}
          isLoading={audioLoading}
          progress={progress}
          onSeek={seekTo}
          onPlayPress={() => audioMedia?.uri && togglePlayback(audioMedia.uri)}
        />
      );
    }

    if (entry.type === 'photo') {
      const photoUris = (entry.media || []).filter(m => m.type === 'image').map(m => m.uri);
      return (
        <PhotoCard
          title={entry.caption || 'Photo'}
          time={entryTime}
          imageUri={photoUris[0]}
          imageUris={photoUris.length > 1 ? photoUris : undefined}
          mood={mood}
        />
      );
    }

    if (entry.type === 'video') {
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
      const videoMedia = entry.media?.find(m => m.type === 'video');
      return (
        <VideoCard
          title={entry.caption || 'Video'}
          time={entryTime}
          duration={formatDuration(videoMedia?.duration || 0)}
          thumbnailUri={videoMedia?.thumbnailUri ?? undefined}
          videoUri={videoMedia?.uri}
          mood={mood}
        />
      );
    }

    if (entry.type === 'story') {
      const fullContent = entry.storyContent || entry.content || '';
      const firstPageContent = fullContent.split('\n\n---\n\n')[0];
      const storyMediaItems = (entry.media || []).filter(
        m => m.type === 'image' || m.type === 'video'
      );
      return (
        // Wrap in pointerEvents="none" to prevent StoryCard's internal
        // navigation to /story/[id] (shared entries have no real ID)
        <View pointerEvents="none">
          <StoryCard
            id="__shared__"
            title={entry.title || 'Untitled Story'}
            content={firstPageContent}
            time={entryTime}
            mood={mood}
            pageCount={entry.pageCount ?? undefined}
            storyMedia={
              storyMediaItems.length > 0
                ? storyMediaItems.map(m => ({
                  uri: m.uri,
                  type: m.type as 'image' | 'video',
                  duration: m.duration ?? undefined,
                }))
                : undefined
            }
          />
        </View>
      );
    }

    return null;
  };

  // For stories, show full content below the card
  const renderStoryFullContent = () => {
    if (entry.type !== 'story') return null;
    const fullContent = entry.storyContent || entry.content || '';
    const pages = fullContent.split('\n\n---\n\n').filter(Boolean);
    if (pages.length === 0) return null;

    return (
      <View style={styles.storyFullContent}>
        <Text style={styles.storyFullLabel}>Full Story</Text>
        {pages.map((page, i) => (
          <View key={i} style={styles.storyPageCard}>
            {pages.length > 1 && (
              <Text style={styles.storyPageNumber}>Page {i + 1}</Text>
            )}
            <Text style={styles.storyPageText}>{page}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Shared Memory</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Share info bar */}
        <View style={styles.shareInfoBar}>
          <View style={styles.shareInfoLeft}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{typeLabel}</Text>
            </View>
            <Text style={styles.shareInfoText}>Shared {sharedDate}</Text>
          </View>
          <View style={styles.viewsRow}>
            <EyeIcon size={13 * SCALE} />
            <Text style={styles.shareInfoText}>
              {viewCount} {viewCount === 1 ? 'view' : 'views'}
            </Text>
          </View>
        </View>

        {/* The actual timeline card */}
        <View style={styles.cardContainer}>
          {renderEntryCard()}
        </View>

        {/* Caption (if present and not already shown in card) */}
        {entry.caption && entry.type !== 'audio' && entry.type !== 'photo' && entry.type !== 'video' && (
          <View style={styles.captionCard}>
            <Text style={styles.captionText}>{entry.caption}</Text>
          </View>
        )}

        {/* Full story content (below the preview card) */}
        {renderStoryFullContent()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============== STYLES ==============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40 * SCALE,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32 * SCALE,
    gap: 12 * SCALE,
  },
  loadingText: {
    fontSize: 14 * SCALE,
    color: COLORS.textLight,
    marginTop: 8 * SCALE,
  },

  // Error state
  errorIconCircle: {
    width: 64 * SCALE,
    height: 64 * SCALE,
    borderRadius: 32 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8 * SCALE,
  },
  errorTitle: {
    fontSize: 20 * SCALE,
    fontWeight: '700',
    color: COLORS.text,
  },
  errorSubtitle: {
    fontSize: 14 * SCALE,
    color: '#777',
    textAlign: 'center',
    lineHeight: 21 * SCALE,
  },
  errorButton: {
    marginTop: 12 * SCALE,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28 * SCALE,
    paddingVertical: 12 * SCALE,
    borderRadius: 25 * SCALE,
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 15 * SCALE,
    fontWeight: '600',
  },

  // Content
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
  },

  // Share info bar
  shareInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12 * SCALE,
    paddingHorizontal: 14 * SCALE,
    paddingVertical: 10 * SCALE,
    marginBottom: 16 * SCALE,
  },
  shareInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
  },
  shareInfoText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#888',
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * SCALE,
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
    color: COLORS.primary,
  },

  // Card container
  cardContainer: {
    alignItems: 'center',
    marginBottom: 16 * SCALE,
  },

  // Caption
  captionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    marginBottom: 16 * SCALE,
    borderLeftWidth: 3 * SCALE,
    borderLeftColor: 'rgba(129, 1, 0, 0.3)',
  },
  captionText: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 22 * SCALE,
    fontStyle: 'italic',
  },

  // Story full content
  storyFullContent: {
    marginBottom: 16 * SCALE,
  },
  storyFullLabel: {
    fontSize: 16 * SCALE,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12 * SCALE,
  },
  storyPageCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16 * SCALE,
    padding: 20 * SCALE,
    marginBottom: 12 * SCALE,
    borderLeftWidth: 4 * SCALE,
    borderLeftColor: COLORS.primary,
  },
  storyPageNumber: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8 * SCALE,
  },
  storyPageText: {
    fontSize: 16 * SCALE,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 26 * SCALE,
  },

  bottomPadding: {
    height: 40 * SCALE,
  },
});
