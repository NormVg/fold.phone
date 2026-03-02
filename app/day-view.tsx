import { PhotoCard, StoryCard, TextCard, VideoCard, VoiceCard } from '@/components/timeline';
import { ShareLoadingOverlay } from '@/components/shares';
import { TimelineColors } from '@/constants/theme';
import { getTimelineEntriesByDate, type TimelineEntryResponse } from '@/lib/api';
import { useShareEntry } from '@/lib/use-share-entry';
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
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default function DayViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date: string }>();
  const dateStr = params.date; // YYYY-MM-DD

  const [entries, setEntries] = useState<TimelineEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Audio playback state
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Parse the date for display
  const dateParts = dateStr ? dateStr.split('-').map(Number) : [0, 0, 0];
  const [year, month, day] = dateParts;
  const dateObj = dateStr ? new Date(year, month - 1, day) : new Date();
  const dayOfWeek = DAYS_OF_WEEK[dateObj.getDay()];
  const displayDate = dateStr
    ? `${MONTHS[month - 1]} ${day}${getOrdinalSuffix(day)}, ${year}`
    : '';

  // Check if the date is today
  const today = new Date();
  const isToday =
    year === today.getFullYear() &&
    month === today.getMonth() + 1 &&
    day === today.getDate();

  const fetchEntries = useCallback(async () => {
    if (!dateStr) return;
    setIsLoading(true);
    try {
      const { data, error } = await getTimelineEntriesByDate(dateStr);
      if (error) {
        console.error('[DayView] Fetch error:', error);
        return;
      }
      setEntries(data || []);
    } catch (err) {
      console.error('[DayView] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().then(() => soundRef.current?.unloadAsync());
      }
    };
  }, []);

  const playAudio = async (uri: string | undefined, entryId: string) => {
    if (!uri) return;

    try {
      if (playingEntryId === entryId && soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if ('isPlaying' in status && status.isPlaying) {
          await soundRef.current.pauseAsync();
          setPlayingEntryId(null);
          return;
        } else {
          await soundRef.current.playAsync();
          setPlayingEntryId(entryId);
          return;
        }
      }

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingEntryId(null);
        setPlaybackProgress(0);
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 100 }
      );
      soundRef.current = sound;
      setPlayingEntryId(entryId);
      setPlaybackProgress(0);

      sound.setOnPlaybackStatusUpdate((status) => {
        if ('isLoaded' in status && status.isLoaded) {
          if (status.durationMillis && status.positionMillis) {
            setPlaybackProgress(status.positionMillis / status.durationMillis);
          }
          if (status.didJustFinish) {
            sound.unloadAsync();
            soundRef.current = null;
            setPlayingEntryId(null);
            setPlaybackProgress(0);
          }
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingEntryId(null);
      setPlaybackProgress(0);
    }
  };

  const { shareEntry, sharingEntryId } = useShareEntry();
  const handleSharePress = (entryId?: string) => shareEntry(entryId);
  const handleLocationPress = () => {};
  const handleMoodPress = () => {};

  const renderEntryCard = (entry: TimelineEntryResponse) => {
    const time = new Date(entry.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const mood = entry.mood || 'Normal';

    if (entry.type === 'audio') {
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
      const audioMedia = entry.media?.find((m) => m.type === 'audio');
      return (
        <VoiceCard
          title={entry.caption || 'Voice memo'}
          time={time}
          duration={formatDuration(audioMedia?.duration || 0)}
          mood={mood}
          location={entry.location ?? undefined}
          isPlaying={playingEntryId === entry.id}
          progress={playingEntryId === entry.id ? playbackProgress : 0}
          onPlayPress={() => playAudio(audioMedia?.uri, entry.id)}
          onSharePress={() => handleSharePress(entry.id)}
          onLocationPress={handleLocationPress}
          onMoodPress={handleMoodPress}
        />
      );
    }

    if (entry.type === 'text') {
      return (
        <TextCard
          content={entry.content || ''}
          time={time}
          mood={mood}
          location={entry.location ?? undefined}
          onSharePress={() => handleSharePress(entry.id)}
          onLocationPress={handleLocationPress}
          onMoodPress={handleMoodPress}
        />
      );
    }

    if (entry.type === 'photo') {
      const photoUris = (entry.media || []).filter((m) => m.type === 'image').map((m) => m.uri);
      return (
        <PhotoCard
          title={entry.caption || 'Photo'}
          time={time}
          imageUri={photoUris[0]}
          imageUris={photoUris.length > 1 ? photoUris : undefined}
          mood={mood}
          location={entry.location ?? undefined}
          onSharePress={() => handleSharePress(entry.id)}
          onLocationPress={handleLocationPress}
          onMoodPress={handleMoodPress}
        />
      );
    }

    if (entry.type === 'video') {
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
      const videoMedia = entry.media?.find((m) => m.type === 'video');
      return (
        <VideoCard
          title={entry.caption || 'Video'}
          time={time}
          duration={formatDuration(videoMedia?.duration || 0)}
          thumbnailUri={videoMedia?.thumbnailUri ?? undefined}
          videoUri={videoMedia?.uri}
          mood={mood}
          location={entry.location ?? undefined}
          onSharePress={() => handleSharePress(entry.id)}
          onLocationPress={handleLocationPress}
          onMoodPress={handleMoodPress}
        />
      );
    }

    if (entry.type === 'story') {
      const fullContent = entry.storyContent || entry.content || '';
      const firstPageContent = fullContent.split('\n\n---\n\n')[0];
      const storyMediaItems = (entry.media || []).filter((m) => m.type === 'image' || m.type === 'video');
      return (
        <StoryCard
          id={entry.id}
          title={entry.title || 'Untitled Story'}
          content={firstPageContent}
          time={time}
          mood={mood}
          location={entry.location ?? undefined}
          pageCount={entry.pageCount ?? undefined}
          storyMedia={
            storyMediaItems.length > 0
              ? storyMediaItems.map((m) => ({
                  uri: m.uri,
                  type: m.type as 'image' | 'video',
                  duration: m.duration ?? undefined,
                }))
              : undefined
          }
          onSharePress={() => handleSharePress(entry.id)}
          onLocationPress={handleLocationPress}
          onMoodPress={handleMoodPress}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Svg width={22 * SCALE} height={22 * SCALE} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke={TimelineColors.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerDayOfWeek}>{dayOfWeek.toUpperCase()}</Text>
          <Text style={styles.headerDate}>{displayDate}</Text>
        </View>
        {/* Spacer to balance the back button */}
        <View style={styles.backButton} />
      </View>

      {/* Timeline content */}
      <View style={styles.timelineWrapper}>
        <View style={styles.timelineLine} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Entry count badge */}
          {!isLoading && entries.length > 0 && (
            <View style={styles.countBadgeRow}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </Text>
              </View>
            </View>
          )}

          {/* Entry cards */}
          {entries.map((entry) => (
            <View key={entry.id} style={styles.cardWrapper}>
              {renderEntryCard(entry)}
            </View>
          ))}

          {/* Loading */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={TimelineColors.primary} />
              <Text style={styles.loadingText}>Loading entries...</Text>
            </View>
          )}

          {/* Empty state */}
          {!isLoading && entries.length === 0 && (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Svg width={24 * SCALE} height={24 * SCALE} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke={TimelineColors.primary}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.emptyTitle}>Nothing on this day</Text>
              <Text style={styles.emptySubtitle}>
                {isToday
                  ? 'Start capturing memories by tapping the center button'
                  : 'No memories were captured on this date'}
              </Text>
              <View style={styles.emptyAccentStrip} />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Share loading overlay */}
      <ShareLoadingOverlay visible={!!sharingEntryId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 6 * SCALE,
    paddingBottom: 12 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerDayOfWeek: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerDate: {
    fontSize: 17 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  // Timeline
  timelineWrapper: {
    flex: 1,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 63 * SCALE,
    top: 10 * SCALE,
    bottom: 0,
    width: 5 * SCALE,
    backgroundColor: '#810100',
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 60 * SCALE,
    alignItems: 'center',
  },
  cardWrapper: {
    marginTop: 10 * SCALE,
    marginBottom: 20 * SCALE,
  },
  // Count badge
  countBadgeRow: {
    alignItems: 'center',
    marginTop: 12 * SCALE,
    marginBottom: 4 * SCALE,
  },
  countBadge: {
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    paddingHorizontal: 14 * SCALE,
    paddingVertical: 5 * SCALE,
    borderRadius: 12 * SCALE,
  },
  countBadgeText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
    letterSpacing: 0.3,
  },
  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#8A8780',
    fontSize: 13,
    marginTop: 8,
  },
  // Empty state
  emptyCard: {
    alignSelf: 'center',
    width: 340 * SCALE,
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 28 * SCALE,
    alignItems: 'center' as const,
    marginTop: 40 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  emptyIconCircle: {
    width: 48 * SCALE,
    height: 48 * SCALE,
    borderRadius: 24 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.12)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 16 * SCALE,
  },
  emptyTitle: {
    fontFamily: 'SignPainter',
    fontSize: 26 * SCALE,
    color: TimelineColors.primary,
    textAlign: 'center' as const,
    marginBottom: 6 * SCALE,
  },
  emptySubtitle: {
    fontSize: 14 * SCALE,
    fontWeight: '400' as const,
    color: '#8A8780',
    textAlign: 'center' as const,
    lineHeight: 20 * SCALE,
    marginBottom: 18 * SCALE,
  },
  emptyAccentStrip: {
    width: 60 * SCALE,
    height: 3 * SCALE,
    borderRadius: 1.5 * SCALE,
    backgroundColor: TimelineColors.primary,
  },
});
