import { useTimeline } from '@/lib/timeline-context';
import { ResizeMode, Video } from 'expo-av';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const COLORS = {
  background: '#EDEADC',
  cardBackground: '#FDFBF7',
  primary: '#810100',
  text: '#181717',
  textLight: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
};

// Close X button
function CloseButton({ size = 48.54, onPress }: { size?: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 49 49" fill="none">
        <Circle cx="24.27" cy="24.27" r="24.27" fill={COLORS.primary} fillOpacity="0.2" />
        <Path
          d="M24 11.8125C21.5895 11.8125 19.2332 12.5273 17.229 13.8665C15.2248 15.2056 13.6627 17.1091 12.7402 19.336C11.8178 21.563 11.5764 24.0135 12.0467 26.3777C12.5169 28.7418 13.6777 30.9134 15.3821 32.6179C17.0866 34.3223 19.2582 35.4831 21.6223 35.9533C23.9865 36.4236 26.437 36.1822 28.664 35.2598C30.8909 34.3373 32.7944 32.7752 34.1335 30.771C35.4727 28.7668 36.1875 26.4105 36.1875 24C36.1841 20.7687 34.899 17.6708 32.6141 15.3859C30.3292 13.101 27.2313 11.8159 24 11.8125ZM28.4133 27.0867C28.5004 27.1738 28.5695 27.2772 28.6166 27.391C28.6638 27.5048 28.688 27.6268 28.688 27.75C28.688 27.8732 28.6638 27.9952 28.6166 28.109C28.5695 28.2228 28.5004 28.3262 28.4133 28.4133C28.3262 28.5004 28.2228 28.5695 28.109 28.6166C27.9952 28.6638 27.8732 28.688 27.75 28.688C27.6268 28.688 27.5048 28.6638 27.391 28.6166C27.2772 28.5695 27.1738 28.5004 27.0867 28.4133L24 25.3254L20.9133 28.4133C20.8262 28.5004 20.7228 28.5695 20.609 28.6166C20.4952 28.6638 20.3732 28.688 20.25 28.688C20.1268 28.688 20.0048 28.6638 19.891 28.6166C19.7772 28.5695 19.6738 28.5004 19.5867 28.4133C19.4996 28.3262 19.4305 28.2228 19.3834 28.109C19.3362 27.9952 19.312 27.8732 19.312 27.75C19.312 27.6268 19.3362 27.5048 19.3834 27.391C19.4305 27.2772 19.4996 27.1738 19.5867 27.0867L22.6746 24L19.5867 20.9133C19.4108 20.7374 19.312 20.4988 19.312 20.25C19.312 20.0012 19.4108 19.7626 19.5867 19.5867C19.7626 19.4108 20.0012 19.312 20.25 19.312C20.4988 19.312 20.7374 19.4108 20.9133 19.5867L24 22.6746L27.0867 19.5867C27.1738 19.4996 27.2772 19.4305 27.391 19.3834C27.5048 19.3362 27.6268 19.312 27.75 19.312C27.8732 19.312 27.9952 19.3362 28.109 19.3834C28.2228 19.4305 28.3262 19.4996 28.4133 19.5867C28.5004 19.6738 28.5695 19.7772 28.6166 19.891C28.6638 20.0048 28.688 20.1268 28.688 20.25C28.688 20.3732 28.6638 20.4952 28.6166 20.609C28.5695 20.7228 28.5004 20.8262 28.4133 20.9133L25.3254 24L28.4133 27.0867Z"
          fill={COLORS.primary}
        />
      </Svg>
    </Pressable>
  );
}

// Book/Story icon
function StoryIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 3C2 2.44772 2.44772 2 3 2H6C7.10457 2 8 2.89543 8 4V14C8 13.4477 7.55228 13 7 13H3C2.44772 13 2 12.5523 2 12V3Z"
        stroke={COLORS.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 3C14 2.44772 13.5523 2 13 2H10C8.89543 2 8 2.89543 8 4V14C8 13.4477 8.44772 13 9 13H13C13.5523 13 14 12.5523 14 12V3Z"
        stroke={COLORS.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Location icon
function LocationIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={COLORS.primary}
      />
    </Svg>
  );
}

// Share icon
function ShareIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.3423 7.10213L9.51421 11.9303C9.44668 11.9979 9.36062 12.0439 9.26692 12.0626C9.17321 12.0812 9.07607 12.0717 8.9878 12.0351C8.89953 11.9985 8.8241 11.9366 8.77105 11.8571C8.71801 11.7776 8.68973 11.6842 8.68981 11.5887V9.18848C5.24373 9.38402 2.88097 11.6188 2.21771 12.3268C2.11356 12.438 1.97698 12.5135 1.82741 12.5426C1.67784 12.5717 1.52291 12.5529 1.38465 12.4889C1.24639 12.4248 1.13185 12.3188 1.05734 12.1859C0.982829 12.053 0.952138 11.9 0.969635 11.7486C1.19354 9.80165 2.25995 7.92894 3.97273 6.47568C5.39521 5.26865 7.12429 4.50278 8.68981 4.3688V1.93241C8.68973 1.83686 8.71801 1.74344 8.77105 1.66398C8.8241 1.58451 8.89953 1.52257 8.9878 1.48599C9.07607 1.44942 9.17321 1.43986 9.26692 1.45852C9.36062 1.47718 9.44668 1.52322 9.51421 1.59082L14.3423 6.41895C14.3872 6.46379 14.4228 6.51704 14.4471 6.57565C14.4714 6.63426 14.4839 6.69709 14.4839 6.76054C14.4839 6.82399 14.4714 6.88681 14.4471 6.94543C14.4228 7.00404 14.3872 7.05729 14.3423 7.10213Z"
        fill={COLORS.primary}
      />
    </Svg>
  );
}

// Chevron icons
function ChevronLeft({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRight({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Mood icons
function HappyIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={COLORS.primary} strokeWidth={2} />
      <Path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="9" cy="9" r="1" fill={COLORS.primary} />
      <Circle cx="15" cy="9" r="1" fill={COLORS.primary} />
    </Svg>
  );
}

function SadIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={COLORS.primary} strokeWidth={2} />
      <Path d="M8 16s1.5-2 4-2 4 2 4 2" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="9" cy="9" r="1" fill={COLORS.primary} />
      <Circle cx="15" cy="9" r="1" fill={COLORS.primary} />
    </Svg>
  );
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default function StoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries } = useTimeline();
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const pagerRef = useRef<FlatList>(null);
  const fullscreenScrollRef = useRef<ScrollView>(null);

  // Find the entry
  const entry = entries.find(e => e.id === id);

  const openFullscreen = (index: number) => {
    setActiveMediaIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleFullscreenScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveMediaIndex(index);
  };

  if (!entry) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Story not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Parse pages from content
  const storyContent = entry.storyContent || entry.content || '';
  const pages = storyContent.split('\n\n---\n\n').filter(Boolean);
  const totalPages = pages.length || 1;
  const readTime = calculateReadTime(storyContent);
  const MoodIcon = entry.mood?.toLowerCase() === 'sad' ? SadIcon : HappyIcon;

  // Format date
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const goToPage = (index: number) => {
    if (index >= 0 && index < totalPages) {
      setCurrentPage(index);
      pagerRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const handleShare = () => {
    console.log('Share story');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <CloseButton size={42} onPress={() => router.back()} />
        <View style={styles.headerCenter}>
          <View style={styles.iconCircle}>
            <StoryIcon size={16 * SCALE} />
          </View>
          <Text style={styles.headerTitle}>Story</Text>
        </View>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <ShareIcon size={20 * SCALE} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Story Title */}
        <Text style={styles.storyTitle}>{entry.title || 'Untitled Story'}</Text>

        {/* Meta info */}
        <View style={styles.metaRow}>
          <Text style={styles.metaDate}>{formattedDate}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaTime}>{formattedTime}</Text>
        </View>

        {/* Tags row */}
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{readTime}</Text>
          </View>
          {totalPages > 1 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{totalPages} pages</Text>
            </View>
          )}
          {entry.mood && (
            <View style={styles.tag}>
              <MoodIcon size={14 * SCALE} />
              <Text style={styles.tagText}>{entry.mood}</Text>
            </View>
          )}
          {entry.location && (
            <View style={styles.tag}>
              <LocationIcon size={12 * SCALE} />
              <Text style={styles.tagText}>{entry.location}</Text>
            </View>
          )}
        </View>

        {/* Media Gallery */}
        {entry.storyMedia && entry.storyMedia.length > 0 && (
          <View style={styles.mediaSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaScroll}>
              {entry.storyMedia.map((media, index) => (
                <Pressable key={index} style={styles.mediaItem} onPress={() => openFullscreen(index)}>
                  <ExpoImage source={{ uri: media.uri }} style={styles.mediaImage} contentFit="cover" />
                  {media.type === 'video' && (
                    <View style={styles.videoOverlay}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Page Content */}
        <View style={styles.contentSection}>
          {totalPages > 1 ? (
            <>
              {/* All pages stacked vertically */}
              {pages.map((pageContent, index) => (
                <View key={index} style={styles.pageWrapper}>
                  <View style={styles.pageLabelRow}>
                    <Text style={styles.pageLabel}>Page {index + 1}</Text>
                  </View>
                  <View style={styles.pageCard}>
                    <Text style={styles.pageContent}>{pageContent}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.pageCard}>
              <Text style={styles.pageContent}>{storyContent}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fullscreen Media Modal */}
      {entry.storyMedia && entry.storyMedia.length > 0 && (
        <Modal
          visible={isFullscreen}
          transparent={true}
          animationType="fade"
          onRequestClose={closeFullscreen}
        >
          <View style={styles.modalContainer}>
            {/* Close button */}
            <Pressable style={styles.modalCloseButton} onPress={closeFullscreen}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>

            {/* Swipeable media */}
            <ScrollView
              ref={fullscreenScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleFullscreenScroll}
              scrollEventThrottle={16}
              contentOffset={{ x: activeMediaIndex * SCREEN_WIDTH, y: 0 }}
              style={styles.fullscreenScrollView}
            >
              {entry.storyMedia.map((media, index) => (
                <View key={index} style={styles.fullscreenMediaContainer}>
                  {media.type === 'video' ? (
                    <Video
                      source={{ uri: media.uri }}
                      style={styles.fullscreenMedia}
                      resizeMode={ResizeMode.CONTAIN}
                      shouldPlay={isFullscreen && index === activeMediaIndex}
                      isLooping
                      useNativeControls
                    />
                  ) : (
                    <ExpoImage
                      source={{ uri: media.uri }}
                      style={styles.fullscreenMedia}
                      contentFit="contain"
                    />
                  )}
                </View>
              ))}
            </ScrollView>

            {/* Dot indicators */}
            {entry.storyMedia.length > 1 && (
              <View style={styles.dotsContainer}>
                {entry.storyMedia.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activeMediaIndex && styles.activeDot
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Counter */}
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>{activeMediaIndex + 1} / {entry.storyMedia.length}</Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 8 * SCALE,
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
    color: COLORS.text,
  },
  shareButton: {
    width: 42 * SCALE,
    height: 42 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
  },
  storyTitle: {
    fontSize: 28 * SCALE,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 36 * SCALE,
    marginBottom: 8 * SCALE,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 * SCALE,
    marginBottom: 16 * SCALE,
  },
  metaDate: {
    fontSize: 13 * SCALE,
    color: COLORS.textLight,
  },
  metaDot: {
    fontSize: 13 * SCALE,
    color: COLORS.textLight,
  },
  metaTime: {
    fontSize: 13 * SCALE,
    color: COLORS.textLight,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 * SCALE,
    marginBottom: 20 * SCALE,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8 * SCALE,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 8 * SCALE,
    gap: 6 * SCALE,
  },
  tagText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: COLORS.text,
  },
  mediaSection: {
    marginBottom: 20 * SCALE,
    marginHorizontal: -17 * SCALE,
  },
  mediaScroll: {
    paddingHorizontal: 17 * SCALE,
    gap: 12 * SCALE,
  },
  mediaItem: {
    width: 200 * SCALE,
    height: 150 * SCALE,
    borderRadius: 12 * SCALE,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: COLORS.white,
    fontSize: 32 * SCALE,
  },
  contentSection: {
    flex: 1,
  },
  pageNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16 * SCALE,
    marginBottom: 16 * SCALE,
  },
  pageNavBtn: {
    width: 36 * SCALE,
    height: 36 * SCALE,
    borderRadius: 18 * SCALE,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNavBtnDisabled: {
    opacity: 0.4,
  },
  pageIndicator: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
  },
  pageWrapper: {
    marginBottom: 24 * SCALE,
  },
  pageLabelRow: {
    marginBottom: 8 * SCALE,
  },
  pageLabel: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: COLORS.primary,
  },
  pageContainer: {
    width: SCREEN_WIDTH - 34 * SCALE,
  },
  pageCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16 * SCALE,
    padding: 20 * SCALE,
    borderLeftWidth: 4 * SCALE,
    borderLeftColor: COLORS.primary,
    minHeight: 500 * SCALE,
  },
  pageContent: {
    fontSize: 16 * SCALE,
    fontWeight: '400',
    color: COLORS.text,
    lineHeight: 26 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16 * SCALE,
  },
  errorText: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
  },
  backLink: {
    paddingVertical: 12 * SCALE,
    paddingHorizontal: 24 * SCALE,
    backgroundColor: COLORS.primary,
    borderRadius: 25 * SCALE,
  },
  backLinkText: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Fullscreen Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50 * SCALE,
    right: 20 * SCALE,
    zIndex: 10,
    width: 44 * SCALE,
    height: 44 * SCALE,
    borderRadius: 22 * SCALE,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: COLORS.white,
    fontSize: 20 * SCALE,
    fontWeight: '600',
  },
  fullscreenScrollView: {
    flex: 1,
  },
  fullscreenMediaContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenMedia: {
    width: SCREEN_WIDTH,
    height: '80%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 100 * SCALE,
    flexDirection: 'row',
    gap: 8 * SCALE,
  },
  dot: {
    width: 8 * SCALE,
    height: 8 * SCALE,
    borderRadius: 4 * SCALE,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: COLORS.white,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 60 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 8 * SCALE,
    borderRadius: 8 * SCALE,
  },
  counterText: {
    color: COLORS.white,
    fontSize: 14 * SCALE,
    fontWeight: '600',
  },
});
