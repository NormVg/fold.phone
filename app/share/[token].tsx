import { TimelineColors } from '@/constants/theme';
import { getPublicShare, type PublicShareEntry } from '@/lib/api';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        width: 40 * SCALE,
        height: 40 * SCALE,
        borderRadius: 20 * SCALE,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      })}
      hitSlop={12}
    >
      <Svg width={22 * SCALE} height={22 * SCALE} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 18L9 12L15 6"
          stroke={TimelineColors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

function ShareViewIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

const ENTRY_TYPE_LABELS: Record<string, string> = {
  text: 'Text Entry',
  audio: 'Voice Note',
  photo: 'Photo',
  video: 'Video',
  story: 'Story',
};

const MOOD_EMOJI: Record<string, string> = {
  'V. Happy': ':D',
  'Happy': ':)',
  'Normal': ':|',
  'Sad': ':(',
  'V. Sad': ":'(",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShareViewerScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [shareData, setShareData] = useState<PublicShareEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShare = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPublicShare(token);
      if (result.error) {
        setError(result.error);
      } else {
        setShareData(result.data);
      }
    } catch (e) {
      setError('Failed to load shared memory');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchShare();
  }, [fetchShare]);

  const entry = shareData?.entry;

  // Format date
  const formattedDate = entry
    ? new Date(entry.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const formattedTime = entry
    ? new Date(entry.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  // ── Loading state ──
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />
        <View style={styles.header}>
          <CloseButton onPress={() => router.back()} />
          <View style={styles.headerCenter}>
            <View style={styles.iconCircle}>
              <ShareViewIcon size={16 * SCALE} />
            </View>
            <Text style={styles.headerTitle}>Shared Memory</Text>
          </View>
          <View style={{ width: 40 * SCALE }} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={TimelineColors.primary} />
          <Text style={styles.loadingText}>Loading shared memory...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error state ──
  if (error || !entry) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />
        <View style={styles.header}>
          <CloseButton onPress={() => router.back()} />
          <View style={styles.headerCenter}>
            <View style={styles.iconCircle}>
              <ShareViewIcon size={16 * SCALE} />
            </View>
            <Text style={styles.headerTitle}>Shared Memory</Text>
          </View>
          <View style={{ width: 40 * SCALE }} />
        </View>
        <View style={styles.centerContent}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconCircle}>
              <Svg width={24 * SCALE} height={24 * SCALE} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  stroke={TimelineColors.primary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.errorTitle}>
              {error === 'This share has expired'
                ? 'Link Expired'
                : error === 'This share is currently unavailable'
                ? 'Temporarily Unavailable'
                : 'Not Found'}
            </Text>
            <Text style={styles.errorSubtitle}>
              {error || 'This shared memory could not be found'}
            </Text>
            <View style={styles.accentStrip} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Success: render shared entry ──
  const typeLabel = ENTRY_TYPE_LABELS[entry.type] || 'Entry';
  const imageMedia = entry.media?.filter((m) => m.type === 'image') || [];
  const storyPages = entry.storyContent
    ? entry.storyContent.split('\n\n---\n\n').filter(Boolean)
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Header */}
      <View style={styles.header}>
        <CloseButton onPress={() => router.back()} />
        <View style={styles.headerCenter}>
          <View style={styles.iconCircle}>
            <ShareViewIcon size={16 * SCALE} />
          </View>
          <Text style={styles.headerTitle}>Shared Memory</Text>
        </View>
        <View style={{ width: 40 * SCALE }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type + date badge row */}
        <View style={styles.badgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{typeLabel}</Text>
          </View>
          <View style={styles.viewsBadge}>
            <Text style={styles.viewsBadgeText}>
              {shareData?.viewCount || 0} {(shareData?.viewCount || 0) === 1 ? 'view' : 'views'}
            </Text>
          </View>
        </View>

        {/* Title (for stories) */}
        {entry.title && (
          <Text style={styles.entryTitle}>{entry.title}</Text>
        )}

        {/* Date + time */}
        <View style={styles.metaRow}>
          <Text style={styles.metaDate}>{formattedDate}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaTime}>{formattedTime}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {entry.mood && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {MOOD_EMOJI[entry.mood] || ''} {entry.mood}
              </Text>
            </View>
          )}
          {entry.type === 'story' && storyPages.length > 1 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{storyPages.length} pages</Text>
            </View>
          )}
        </View>

        {/* Caption */}
        {entry.caption && entry.type !== 'text' && (
          <Text style={styles.caption}>{entry.caption}</Text>
        )}

        {/* Photo gallery */}
        {imageMedia.length > 0 && (
          <View style={styles.mediaSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaScroll}
            >
              {imageMedia.map((media, index) => (
                <View key={media.id || index} style={styles.mediaItem}>
                  <ExpoImage
                    source={{ uri: media.uri }}
                    style={styles.mediaImage}
                    contentFit="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Text content */}
        {entry.type === 'text' && entry.content && (
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{entry.content}</Text>
          </View>
        )}

        {/* Story content */}
        {entry.type === 'story' && storyPages.length > 0 && (
          <View>
            {storyPages.map((page, index) => (
              <View key={index} style={styles.pageWrapper}>
                {storyPages.length > 1 && (
                  <View style={styles.pageLabelRow}>
                    <Text style={styles.pageLabel}>Page {index + 1}</Text>
                  </View>
                )}
                <View style={styles.contentCard}>
                  <Text style={styles.contentText}>{page}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Audio placeholder */}
        {entry.type === 'audio' && (
          <View style={styles.contentCard}>
            <View style={styles.audioPlaceholder}>
              <Svg width={24 * SCALE} height={24 * SCALE} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
                  stroke={TimelineColors.primary}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.audioText}>Voice Note</Text>
              <Text style={styles.audioSubtext}>
                Open in Fold to listen
              </Text>
            </View>
          </View>
        )}

        {/* Video placeholder */}
        {entry.type === 'video' && entry.media?.find((m) => m.type === 'video') && (
          <View style={styles.contentCard}>
            {entry.media.find((m) => m.type === 'video')?.thumbnailUri ? (
              <ExpoImage
                source={{ uri: entry.media.find((m) => m.type === 'video')!.thumbnailUri! }}
                style={styles.videoThumbnail}
                contentFit="cover"
              />
            ) : (
              <View style={styles.audioPlaceholder}>
                <Text style={styles.audioText}>Video</Text>
                <Text style={styles.audioSubtext}>Open in Fold to watch</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer branding */}
        <View style={styles.brandingFooter}>
          <View style={styles.brandingDivider} />
          <Text style={styles.brandingText}>Shared via Fold</Text>
          <Text style={styles.brandingSubtext}>Your private memory vault</Text>
        </View>

        <View style={{ height: 40 * SCALE }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 6 * SCALE,
    paddingBottom: 12 * SCALE,
  },
  headerCenter: {
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
  headerTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 8 * SCALE,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12 * SCALE,
  },
  loadingText: {
    fontSize: 14 * SCALE,
    color: '#8A8780',
    fontWeight: '500',
  },

  // Error
  errorCard: {
    width: 340 * SCALE,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 32 * SCALE,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  errorIconCircle: {
    width: 48 * SCALE,
    height: 48 * SCALE,
    borderRadius: 24 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16 * SCALE,
  },
  errorTitle: {
    fontFamily: 'SignPainter',
    fontSize: 26 * SCALE,
    color: TimelineColors.primary,
    textAlign: 'center',
    marginBottom: 6 * SCALE,
  },
  errorSubtitle: {
    fontSize: 14 * SCALE,
    color: '#8A8780',
    textAlign: 'center',
    lineHeight: 20 * SCALE,
    marginBottom: 18 * SCALE,
  },
  accentStrip: {
    width: 48 * SCALE,
    height: 3 * SCALE,
    borderRadius: 1.5 * SCALE,
    backgroundColor: TimelineColors.primary,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    gap: 8 * SCALE,
    marginBottom: 16 * SCALE,
  },
  typeBadge: {
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 8 * SCALE,
  },
  typeBadgeText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  viewsBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 8 * SCALE,
  },
  viewsBadgeText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#8A8780',
  },

  // Title
  entryTitle: {
    fontSize: 28 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    lineHeight: 36 * SCALE,
    marginBottom: 8 * SCALE,
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 * SCALE,
    marginBottom: 12 * SCALE,
  },
  metaDate: {
    fontSize: 13 * SCALE,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  metaDot: {
    fontSize: 13 * SCALE,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  metaTime: {
    fontSize: 13 * SCALE,
    color: 'rgba(0, 0, 0, 0.5)',
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 * SCALE,
    marginBottom: 20 * SCALE,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderRadius: 8 * SCALE,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 8 * SCALE,
    gap: 6 * SCALE,
  },
  tagText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },

  // Caption
  caption: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
    marginBottom: 16 * SCALE,
  },

  // Media
  mediaSection: {
    marginBottom: 20 * SCALE,
    marginHorizontal: -17 * SCALE,
  },
  mediaScroll: {
    paddingHorizontal: 17 * SCALE,
    gap: 12 * SCALE,
  },
  mediaItem: {
    width: 240 * SCALE,
    height: 180 * SCALE,
    borderRadius: 16 * SCALE,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },

  // Content card
  contentCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 20 * SCALE,
    marginBottom: 16 * SCALE,
    borderLeftWidth: 4 * SCALE,
    borderLeftColor: TimelineColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  contentText: {
    fontSize: 16 * SCALE,
    fontWeight: '400',
    color: TimelineColors.textDark,
    lineHeight: 26 * SCALE,
  },

  // Story pages
  pageWrapper: {
    marginBottom: 16 * SCALE,
  },
  pageLabelRow: {
    marginBottom: 8 * SCALE,
  },
  pageLabel: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },

  // Audio / Video placeholders
  audioPlaceholder: {
    alignItems: 'center',
    paddingVertical: 24 * SCALE,
    gap: 8 * SCALE,
  },
  audioText: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  audioSubtext: {
    fontSize: 13 * SCALE,
    color: '#8A8780',
  },
  videoThumbnail: {
    width: '100%',
    height: 200 * SCALE,
    borderRadius: 12 * SCALE,
  },

  // Branding footer
  brandingFooter: {
    alignItems: 'center',
    paddingTop: 24 * SCALE,
    paddingBottom: 8 * SCALE,
  },
  brandingDivider: {
    width: 48 * SCALE,
    height: 3 * SCALE,
    borderRadius: 1.5 * SCALE,
    backgroundColor: TimelineColors.primary,
    marginBottom: 16 * SCALE,
  },
  brandingText: {
    fontFamily: 'SignPainter',
    fontSize: 22 * SCALE,
    color: TimelineColors.primary,
    marginBottom: 4 * SCALE,
  },
  brandingSubtext: {
    fontSize: 12 * SCALE,
    color: '#8A8780',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
