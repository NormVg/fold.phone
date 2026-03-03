import { TimelineColors } from '@/constants/theme';
import {
  getConnectMemories,
  type ConnectActiveConnection,
  type ConnectMemoryItem,
} from '@/lib/api';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PhotoCard } from '@/components/timeline/PhotoCard';
import { StoryCard } from '@/components/timeline/StoryCard';
import { TextCard } from '@/components/timeline/TextCard';
import { VideoCard } from '@/components/timeline/VideoCard';
import { VoiceCard } from '@/components/timeline/VoiceCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const TEAL = '#1A7A7A';
const CRIMSON = '#810100';

const LINE_WIDTH = 5 * SCALE;
// Crimson line on left (same position as normal timeline), teal line mirrored on right
const LINE_CRIMSON_LEFT = 63 * SCALE;
const LINE_TEAL_RIGHT = 63 * SCALE;

const BORDER_WIDTH = 2.5 * SCALE;
const BORDER_RADIUS = 22 * SCALE;

// ============== TYPES ==============

interface ConnectTimelineProps {
  connection: ConnectActiveConnection;
  onSharePress?: (entryId: string) => void;
}

// ============== DATE HELPERS ==============

function formatDateMarker(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function getDateKey(dateStr: string): string {
  return new Date(dateStr).toDateString();
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============== DATE SEPARATOR ==============

function DateSeparator({ label }: { label: string }) {
  return (
    <View style={separatorStyles.container}>
      <View style={[separatorStyles.line, { backgroundColor: `${CRIMSON}20` }]} />
      <View style={separatorStyles.pillContainer}>
        <Text style={separatorStyles.label}>{label}</Text>
      </View>
      <View style={[separatorStyles.line, { backgroundColor: `${TEAL}20` }]} />
    </View>
  );
}

const separatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20 * SCALE,
    paddingHorizontal: 16 * SCALE,
  },
  line: {
    flex: 1,
    height: 1,
  },
  pillContainer: {
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    paddingHorizontal: 14 * SCALE,
    paddingVertical: 6 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  label: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
});

// ============== EMPTY STATE ==============

function ConnectTimelineEmpty({ partnerName }: { partnerName?: string }) {
  return (
    <View style={emptyStyles.container}>
      {/* Two faint vertical lines in bg */}
      <View style={[emptyStyles.faintLine, { left: LINE_CRIMSON_LEFT, backgroundColor: CRIMSON }]} />
      <View style={[emptyStyles.faintLine, { right: LINE_TEAL_RIGHT, backgroundColor: TEAL }]} />

      <View style={emptyStyles.content}>
        <View style={emptyStyles.iconRow}>
          <View style={[emptyStyles.dot, { backgroundColor: CRIMSON }]} />
          <View style={emptyStyles.dashedLine} />
          <View style={[emptyStyles.dot, { backgroundColor: TEAL }]} />
        </View>
        <Text style={emptyStyles.title}>No shared memories yet</Text>
        <Text style={emptyStyles.subtitle}>
          Share a memory from your timeline to start{'\n'}
          building moments with {partnerName || 'your partner'}
        </Text>
      </View>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  faintLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: LINE_WIDTH,
    borderRadius: LINE_WIDTH / 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40 * SCALE,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20 * SCALE,
    gap: 6 * SCALE,
  },
  dot: {
    width: 12 * SCALE,
    height: 12 * SCALE,
    borderRadius: 6 * SCALE,
  },
  dashedLine: {
    width: 40 * SCALE,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(24,23,23,0.2)',
  },
  title: {
    fontSize: 18 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 8 * SCALE,
  },
  subtitle: {
    fontSize: 14 * SCALE,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20 * SCALE,
  },
});

// ============== MEMORY CARD WRAPPER ==============

function MemoryCardWrapper({
  item,
  partnerName,
  playingId,
  playbackProgress,
  onPlayPress,
  onSharePress,
}: {
  item: ConnectMemoryItem;
  partnerName: string;
  playingId: string | null;
  playbackProgress: number;
  onPlayPress: (memoryId: string, mediaUri: string) => void;
  onSharePress?: (entryId: string) => void;
}) {
  const isMine = item.side === 'mine';
  const entry = item.entry;
  const borderColor = isMine ? CRIMSON : TEAL;
  const ownerLabel = isMine ? 'You' : partnerName;
  const time = formatTime(entry.createdAt);

  // Build the card based on entry type
  const handleShare = onSharePress ? () => onSharePress(entry.id) : undefined;

  const renderCard = () => {
    switch (entry.type) {
      case 'text':
        return (
          <TextCard
            content={entry.content || ''}
            time={time}
            mood={entry.mood || 'Normal'}
            onSharePress={handleShare}
          />
        );

      case 'audio': {
        const audioMedia = entry.media?.[0];
        const isThisPlaying = playingId === item.id;
        return (
          <VoiceCard
            title={entry.title || 'Voice Note'}
            time={time}
            duration={formatDuration(audioMedia?.duration)}
            mood={entry.mood || 'Normal'}
            isPlaying={isThisPlaying}
            progress={isThisPlaying ? playbackProgress : 0}
            onPlayPress={() => {
              if (audioMedia?.uri) {
                onPlayPress(item.id, audioMedia.uri);
              }
            }}
            onSharePress={handleShare}
          />
        );
      }

      case 'photo': {
        const imageUris = entry.media
          ?.filter((m) => m.type === 'image')
          .map((m) => m.uri);
        return (
          <PhotoCard
            title={entry.caption || entry.title || 'Photo'}
            time={time}
            imageUri={imageUris?.[0]}
            imageUris={imageUris}
            mood={entry.mood || 'Normal'}
            onSharePress={handleShare}
          />
        );
      }

      case 'video': {
        const videoMedia = entry.media?.[0];
        return (
          <VideoCard
            title={entry.caption || entry.title || 'Video'}
            time={time}
            duration={formatDuration(videoMedia?.duration)}
            thumbnailUri={videoMedia?.thumbnailUri || undefined}
            videoUri={videoMedia?.uri || undefined}
            mood={entry.mood || 'Normal'}
            onSharePress={handleShare}
          />
        );
      }

      case 'story':
        return (
          <StoryCard
            id={entry.id}
            title={entry.title || 'Story'}
            content={entry.storyContent || entry.content || ''}
            time={time}
            mood={entry.mood || 'Normal'}
            pageCount={entry.pageCount || undefined}
            storyMedia={entry.media?.map((m) => ({
              uri: m.uri,
              type: m.type as 'image' | 'video',
              duration: m.duration || undefined,
            }))}
            onSharePress={handleShare}
          />
        );

      default:
        // Fallback: render as text card
        return (
          <TextCard
            content={entry.content || entry.caption || 'Shared memory'}
            time={time}
            mood={entry.mood || 'Normal'}
            onSharePress={handleShare}
          />
        );
    }
  };

  return (
    <View style={cardWrapperStyles.container}>
      {/* Owner label */}
      <Text
        style={[
          cardWrapperStyles.ownerLabel,
          { color: borderColor },
          isMine ? cardWrapperStyles.ownerLabelMine : cardWrapperStyles.ownerLabelTheirs,
        ]}
      >
        {ownerLabel}
      </Text>

      {/* Card with full colored border */}
      <View
        style={[
          cardWrapperStyles.borderFrame,
          { borderColor },
        ]}
      >
        {renderCard()}
      </View>
    </View>
  );
}

const CARD_WIDTH = 340 * SCALE;
// Distance from screen edge to card edge = (SCREEN_WIDTH - CARD_WIDTH) / 2
const CARD_HORIZONTAL_MARGIN = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const cardWrapperStyles = StyleSheet.create({
  container: {
    marginBottom: 16 * SCALE,
    alignItems: 'center',
  },
  ownerLabel: {
    fontSize: 11 * SCALE,
    fontWeight: '700',
    marginBottom: 4 * SCALE,
    letterSpacing: 0.3,
    width: CARD_WIDTH,
  },
  ownerLabelMine: {
    textAlign: 'left',
    paddingLeft: LINE_CRIMSON_LEFT + LINE_WIDTH - CARD_HORIZONTAL_MARGIN + 4 * SCALE,
  },
  ownerLabelTheirs: {
    textAlign: 'right',
    paddingRight: LINE_TEAL_RIGHT + LINE_WIDTH - CARD_HORIZONTAL_MARGIN + 4 * SCALE,
  },
  borderFrame: {
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
});

// ============== MAIN COMPONENT ==============

type ListItem =
  | { type: 'date'; key: string; label: string }
  | { type: 'memory'; key: string; item: ConnectMemoryItem };

export function ConnectTimeline({ connection, onSharePress }: ConnectTimelineProps) {
  const [memories, setMemories] = useState<ConnectMemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Audio playback state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const partnerName = connection.partner?.name || 'Partner';

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePlayPress = useCallback(async (memoryId: string, mediaUri: string) => {
    try {
      // If already playing this one, stop it
      if (playingId === memoryId) {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setPlayingId(null);
        setPlaybackProgress(0);
        return;
      }

      // Stop any currently playing audio
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Load and play the new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: mediaUri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.durationMillis && status.positionMillis) {
              setPlaybackProgress(status.positionMillis / status.durationMillis);
            }
            if (status.didJustFinish) {
              setPlayingId(null);
              setPlaybackProgress(0);
              soundRef.current = null;
            }
          }
        }
      );

      soundRef.current = sound;
      setPlayingId(memoryId);
      setPlaybackProgress(0);
    } catch (err) {
      console.error('Audio playback error:', err);
      setPlayingId(null);
      setPlaybackProgress(0);
    }
  }, [playingId]);

  const fetchMemories = useCallback(async (cursor?: string) => {
    const result = await getConnectMemories(cursor);
    if (result.data) {
      if (cursor) {
        setMemories((prev) => [...prev, ...result.data!.memories]);
      } else {
        setMemories(result.data.memories);
      }
      setNextCursor(result.data.nextCursor);
    }
    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMemories();
  }, [fetchMemories]);

  const onEndReached = useCallback(() => {
    if (nextCursor && !loadingMore) {
      setLoadingMore(true);
      fetchMemories(nextCursor);
    }
  }, [nextCursor, loadingMore, fetchMemories]);

  // Build list with date separators
  const listData: ListItem[] = [];
  let lastDate = '';
  for (const mem of memories) {
    const dateKey = getDateKey(mem.sharedAt);
    if (dateKey !== lastDate) {
      listData.push({ type: 'date', key: `date-${dateKey}`, label: formatDateMarker(mem.sharedAt) });
      lastDate = dateKey;
    }
    listData.push({ type: 'memory', key: mem.id, item: mem });
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'date') {
      return <DateSeparator label={item.label} />;
    }
    return (
      <MemoryCardWrapper
        item={item.item}
        partnerName={partnerName}
        playingId={playingId}
        playbackProgress={playbackProgress}
        onPlayPress={handlePlayPress}
        onSharePress={onSharePress}
      />
    );
  };

  if (loading) {
    return (
      <View style={timelineStyles.loadingContainer}>
        <ActivityIndicator size="small" color={TimelineColors.primary} />
      </View>
    );
  }

  if (memories.length === 0) {
    return <ConnectTimelineEmpty partnerName={connection.partner?.name} />;
  }

  return (
    <View style={timelineStyles.wrapper}>
      {/* Two vertical background lines — crimson left, teal right */}
      <View
        style={[
          timelineStyles.verticalLine,
          {
            left: LINE_CRIMSON_LEFT,
            backgroundColor: CRIMSON,
          },
        ]}
      />
      <View
        style={[
          timelineStyles.verticalLine,
          {
            right: LINE_TEAL_RIGHT,
            backgroundColor: TEAL,
          },
        ]}
      />

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={timelineStyles.list}
        contentContainerStyle={timelineStyles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={TimelineColors.primary}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={TimelineColors.primary}
              style={{ padding: 16 * SCALE }}
            />
          ) : null
        }
      />
    </View>
  );
}

const timelineStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: LINE_WIDTH,
    borderRadius: LINE_WIDTH / 2,
    zIndex: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    zIndex: 2,
  },
  listContent: {
    paddingTop: 16 * SCALE,
    paddingBottom: 100 * SCALE,
    alignItems: 'center',
  },
});
