import { ActivityLevel, HubCalendar, HubPanelGrid } from '@/components/hub';
import {
  BadgesSection,
  FoldDataCards,
  FoldGrid,
  FoldScoreCard,
  PrivateBadge,
  ActivityLevel as ProfileActivityLevel,
  ProfileAvatar,
} from '@/components/profile';
import { BottomNavBar, PhotoCard, StoryCard, TextCard, TimelineHeader, VideoCard, VoiceCard } from '@/components/timeline';
import { TimelineColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { useTimeline } from '@/lib/timeline-context';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Page indices: Hub = 0, Timeline = 1, Profile = 2
const PAGE_HUB = 0;
const PAGE_TIMELINE = 1;
const PAGE_PROFILE = 2;

// Mock activity data for profile grid
const MOCK_ACTIVITY_DATA: ProfileActivityLevel[][] = [
  [1, 3, 1, 1, 3, 1, 1],
  [3, 2, 2, 2, 3, 2, 3],
  [1, 2, 1, 2, 1, 1, 1],
  [2, 3, 1, 1, 3, 3, 3],
  [1, 0, 0, 0, 0, 0, 0],
];

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function MainScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(PAGE_TIMELINE); // Start on Timeline (center)
  const { user: authUser } = useAuth();
  const user = authUser as User | null;
  const { entries } = useTimeline();

  // Horizontal pager state (custom gesture pager)
  const translateX = useSharedValue(-SCREEN_WIDTH * PAGE_TIMELINE);
  const panStartX = useSharedValue(translateX.value);

  // Date info for headers
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayOfWeek = days[now.getDay()];
  const date = `${months[now.getMonth()]} ${now.getDate()}`;

  // Hub calendar state
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());

  const activityData = useMemo(() => {
    const data = new Map<number, ActivityLevel>();
    data.set(4, 3);
    data.set(6, 2);
    data.set(9, 2);
    data.set(15, 1);
    data.set(16, 2);
    data.set(17, 3);
    return data;
  }, []);

  const navigateToPage = useCallback((page: number) => {
    const clamped = Math.max(PAGE_HUB, Math.min(PAGE_PROFILE, page));
    translateX.value = withTiming(-SCREEN_WIDTH * clamped, { duration: 240 });
    setCurrentPage(clamped);
  }, [translateX]);

  // Get active tab based on current page
  const getActiveTab = () => {
    switch (currentPage) {
      case PAGE_HUB: return 'hub';
      case PAGE_PROFILE: return 'profile';
      default: return 'timeline';
    }
  };

  // Bottom nav handlers
  const handleGridPress = () => navigateToPage(PAGE_HUB);
  const handleCapturePress = () => router.push('/entry-text'); // Tap -> text entry
  const handleCaptureLongPress = () => router.push('/entry-audio'); // Long press -> voice recording
  const handleCaptureDoubleTap = () => router.push('/entry-story'); // Double tap -> story mode
  const handleProfilePress = () => navigateToPage(PAGE_PROFILE);

  // Hub handlers
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Profile handlers
  const getDisplayName = () => {
    if (!user?.name) return "User's";
    const firstName = user.name.split(' ')[0];
    return `${firstName}'s`;
  };

  const handleSettingsPress = () => router.push('/settings');
  const handleFoldersPress = () => console.log('Folders pressed');

  // Timeline handlers
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0); // 0 to 1

  const playAudio = async (uri: string | undefined, entryId: string) => {
    if (!uri) {
      console.log('No audio URI to play');
      return;
    }

    try {
      // If same entry is playing, toggle pause/resume
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

      // Stop and unload any currently playing sound
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingEntryId(null);
        setPlaybackProgress(0);
      }

      // Create and play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 100 }
      );
      soundRef.current = sound;
      setPlayingEntryId(entryId);
      setPlaybackProgress(0);

      // Track playback progress
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('isLoaded' in status && status.isLoaded) {
          if (status.durationMillis && status.positionMillis) {
            const progress = status.positionMillis / status.durationMillis;
            setPlaybackProgress(progress);
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

  const handlePlayPress = () => console.log('Play pressed');
  const handleSharePress = () => console.log('Share pressed');
  const handleLocationPress = () => console.log('Location pressed');
  const handleMoodPress = () => console.log('Mood pressed');
  const handleImagePress = () => console.log('Image pressed');

  const pagerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const pagerGesture = useMemo(() => {
    const minSwipeDistance = Math.max(70, SCREEN_WIDTH * 0.18);
    const minFlingVelocity = 800;

    return Gesture.Pan()
      .activeOffsetX([-25, 25])
      .failOffsetY([-12, 12])
      .onBegin(() => {
        panStartX.value = translateX.value;
      })
      .onUpdate((e) => {
        const raw = panStartX.value + e.translationX;
        const min = -SCREEN_WIDTH * PAGE_PROFILE;
        const max = -SCREEN_WIDTH * PAGE_HUB;
        translateX.value = Math.max(min, Math.min(max, raw));
      })
      .onEnd((e) => {
        const pageFloat = -translateX.value / SCREEN_WIDTH;
        let nextPage = Math.round(pageFloat);

        if (Math.abs(e.translationX) < minSwipeDistance && Math.abs(e.velocityX) < minFlingVelocity) {
          nextPage = currentPage;
        } else {
          if (e.translationX < 0 || e.velocityX < -minFlingVelocity) nextPage = Math.ceil(pageFloat);
          if (e.translationX > 0 || e.velocityX > minFlingVelocity) nextPage = Math.floor(pageFloat);
        }

        nextPage = Math.max(PAGE_HUB, Math.min(PAGE_PROFILE, nextPage));
        translateX.value = withTiming(-SCREEN_WIDTH * nextPage, { duration: 240 });
        runOnJS(setCurrentPage)(nextPage);
      });
  }, [currentPage, panStartX, translateX]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      <GestureDetector gesture={pagerGesture}>
        <View style={styles.pager}>
          <Animated.View style={[styles.pagerTrack, pagerAnimatedStyle]}>
            {/* Page 0: Hub */}
            <View key="hub" style={styles.page}>
              <TimelineHeader
                dayOfWeek={dayOfWeek}
                date={date}
                onProfilePress={handleProfilePress}
              />
              <ScrollView
                style={styles.pageContent}
                contentContainerStyle={styles.hubScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <HubCalendar
                  year={calendarYear}
                  month={calendarMonth}
                  activityData={activityData}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onDayPress={(day) => console.log('Day pressed:', day)}
                />
                <HubPanelGrid
                  onStoriesPress={() => router.push('/stories')}
                  onEmotionsPress={() => console.log('Emotions pressed')}
                  onSharePress={() => console.log('Share pressed')}
                  onMediaPress={() => console.log('Media pressed')}
                />
              </ScrollView>
            </View>

            {/* Page 1: Timeline (default) */}
            <View key="timeline" style={styles.page}>
              <TimelineHeader
                dayOfWeek={dayOfWeek}
                date={date}
                onProfilePress={handleProfilePress}
              />
              <View style={styles.timelineWrapper}>
                <View style={styles.timelineLine} />
                <ScrollView
                  style={styles.pageContent}
                  contentContainerStyle={styles.timelineScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Dynamic entries from context */}
                  {entries.map((entry) => {
                    const time = new Date(entry.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });
                    // Pass mood directly - VoiceCard supports all 5 mood types
                    const mood = entry.mood || 'Normal';

                    if (entry.type === 'audio') {
                      const formatDuration = (seconds: number) => {
                        const mins = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                      };
                      return (
                        <View key={entry.id} style={styles.cardWrapper}>
                          <VoiceCard
                            title={entry.caption || 'Voice memo'}
                            time={time}
                            duration={formatDuration(entry.audioDuration || 0)}
                            mood={mood}
                            location={entry.location}
                            isPlaying={playingEntryId === entry.id}
                            progress={playingEntryId === entry.id ? playbackProgress : 0}
                            onPlayPress={() => playAudio(entry.audioUri, entry.id)}
                            onSharePress={handleSharePress}
                            onLocationPress={handleLocationPress}
                            onMoodPress={handleMoodPress}
                          />
                        </View>
                      );
                    }

                    if (entry.type === 'text') {
                      return (
                        <View key={entry.id} style={styles.cardWrapper}>
                          <TextCard
                            content={entry.content || ''}
                            time={time}
                            mood={mood}
                            location={entry.location}
                            onSharePress={handleSharePress}
                            onLocationPress={handleLocationPress}
                            onMoodPress={handleMoodPress}
                          />
                        </View>
                      );
                    }

                    if (entry.type === 'photo') {
                      return (
                        <View key={entry.id} style={styles.cardWrapper}>
                          <PhotoCard
                            title={entry.caption || 'Photo'}
                            time={time}
                            imageUri={entry.photoUri}
                            imageUris={entry.photoUris}
                            mood={mood}
                            location={entry.location}
                            onSharePress={handleSharePress}
                            onLocationPress={handleLocationPress}
                            onMoodPress={handleMoodPress}
                          />
                        </View>
                      );
                    }

                    if (entry.type === 'video') {
                      const formatDuration = (seconds: number) => {
                        const mins = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                      };
                      return (
                        <View key={entry.id} style={styles.cardWrapper}>
                          <VideoCard
                            title={entry.caption || 'Video'}
                            time={time}
                            duration={formatDuration(entry.videoDuration || 0)}
                            thumbnailUri={entry.thumbnailUri}
                            videoUri={entry.videoUri}
                            mood={mood}
                            location={entry.location}
                            onSharePress={handleSharePress}
                            onLocationPress={handleLocationPress}
                            onMoodPress={handleMoodPress}
                          />
                        </View>
                      );
                    }

                    if (entry.type === 'story') {
                      const fullContent = entry.storyContent || entry.content || '';
                      const firstPageContent = fullContent.split('\n\n---\n\n')[0];
                      return (
                        <View key={entry.id} style={styles.cardWrapper}>
                          <StoryCard
                            id={entry.id}
                            title={entry.title || 'Untitled Story'}
                            content={firstPageContent}
                            time={time}
                            mood={mood}
                            location={entry.location}
                            pageCount={entry.pageCount}
                            storyMedia={entry.storyMedia}
                            onSharePress={handleSharePress}
                            onLocationPress={handleLocationPress}
                            onMoodPress={handleMoodPress}
                          />
                        </View>
                      );
                    }

                    return null;
                  })}

                  {/* Empty state card */}
                  {entries.length === 0 && (
                    <View style={styles.cardWrapper}>
                      <View style={styles.emptyStateCard}>
                        <View style={styles.emptyTopSection}>
                          <View style={styles.emptyIconCircle}>
                            <Svg width={16 * SCALE} height={16 * SCALE} viewBox="0 0 24 24" fill="none">
                              <Path
                                d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM17 3l4 4"
                                stroke={TimelineColors.primary}
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </Svg>
                          </View>
                          <View style={styles.emptyBadge}>
                            <Text style={styles.emptyBadgeText}>Start here</Text>
                          </View>
                        </View>
                        <Text style={styles.emptyContent}>Capture your first memory by tapping below</Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Page 2: Profile */}
            <View key="profile" style={styles.page}>
              <View style={styles.profileTopBar}>
                <Pressable onPress={handleFoldersPress} style={styles.topBarButton}>
                  <FolderIcon size={48 * SCALE} />
                </Pressable>
                <Text style={styles.topBarTitle}>Profile</Text>
                <Pressable onPress={handleSettingsPress} style={styles.topBarButton}>
                  <SettingsIcon size={25 * SCALE} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.pageContent}
                contentContainerStyle={styles.profileScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.avatarSection}>
                  <ProfileAvatar
                    imageUri={user?.image || undefined}
                    imageSource={!user?.image ? require('@/assets/images/pfp.png') : undefined}
                    size={124 * SCALE}
                  />
                </View>

                <Text style={styles.userName}>{getDisplayName()}</Text>

                <View style={styles.badgeSection}>
                  <PrivateBadge text="PRIVATE MEMORY VAULT" />
                </View>

                <View style={styles.cardSection}>
                  <FoldScoreCard score={840} percentile={10} progress={0.75} />
                </View>

                <View style={styles.cardSection}>
                  <FoldDataCards streakDays={8} isStreakActive={true} audioMinutes={43} />
                </View>

                <View style={styles.cardSection}>
                  <FoldGrid activityData={MOCK_ACTIVITY_DATA} />
                </View>

                <View style={styles.cardSection}>
                  <BadgesSection />
                </View>

                <View style={styles.privacySection}>
                  <View style={styles.privacyContent}>
                    <ShieldCheckIcon size={14 * SCALE} />
                    <Text style={styles.privacyText}>We promise your memories are safe with us</Text>
                  </View>
                </View>

                <View style={styles.bottomPadding} />
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Bottom navigation bar - synced with pager */}
      <BottomNavBar
        activeTab={getActiveTab()}
        onGridPress={handleGridPress}
        onCapturePress={handleCapturePress}
        onCaptureLongPress={handleCaptureLongPress}
        onProfilePress={handleProfilePress}
      />
    </SafeAreaView>
  );
}

// Icon components for Profile page
function FolderIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="rgba(129, 1, 0, 0.2)" />
      <Path
        d="M32 18H24.5L22 15.5C21.9 15.4 21.7 15.3 21.5 15.3H17C16.5 15.3 16 15.5 15.6 15.9C15.2 16.3 15 16.8 15 17.3V30.7C15 31.1 15.2 31.5 15.5 31.8C15.8 32.1 16.2 32.3 16.6 32.3H31.4C31.8 32.3 32.2 32.1 32.5 31.8C32.8 31.5 33 31.1 33 30.7V19C33 18.5 32.8 18 32.4 17.6C32 17.2 31.5 17 31 17H32ZM17 17.3H21.5L23 18.8H17V17.3Z"
        fill="#810100"
      />
    </Svg>
  );
}

function SettingsIcon({ size = 25 }: { size?: number }) {
  const circleSize = size * 1.9;
  return (
    <View style={{
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      backgroundColor: 'rgba(129, 1, 0, 0.2)',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
        <Path
          d="M25.3134 15.254C25.3181 15.0853 25.3181 14.9165 25.3134 14.7478L27.0618 12.5634C27.1535 12.4487 27.217 12.3141 27.2471 12.1704C27.2772 12.0267 27.2732 11.8779 27.2353 11.7361C26.9481 10.6588 26.5194 9.62441 25.9603 8.65989C25.887 8.5337 25.7853 8.42636 25.6632 8.34641C25.5412 8.26645 25.4021 8.2161 25.2572 8.19935L22.4775 7.88997C22.3618 7.7681 22.2447 7.65091 22.1259 7.53841L21.7978 4.75169C21.7809 4.60663 21.7304 4.46751 21.6502 4.34544C21.57 4.22336 21.4625 4.1217 21.3361 4.04856C20.3716 3.48987 19.3372 3.0619 18.2599 2.77591C18.118 2.73801 17.9693 2.73396 17.8256 2.76409C17.6819 2.79421 17.5472 2.85767 17.4325 2.94935L15.254 4.68841C15.0853 4.68841 14.9165 4.68841 14.7478 4.68841L12.5634 2.94349C12.4487 2.85181 12.3141 2.78835 12.1704 2.75823C12.0267 2.7281 11.8779 2.73215 11.7361 2.77005C10.6588 3.05719 9.62441 3.48593 8.65989 4.04505C8.5337 4.11832 8.42636 4.22004 8.34641 4.34211C8.26645 4.46417 8.2161 4.60322 8.19935 4.74817L7.88997 7.53255C7.7681 7.64895 7.65091 7.76614 7.53841 7.88411L4.75169 8.20403C4.60663 8.22091 4.46751 8.27144 4.34544 8.35161C4.22336 8.43177 4.1217 8.53934 4.04856 8.66575C3.48999 9.6304 3.06165 10.6648 2.77474 11.7419C2.737 11.8839 2.73314 12.0327 2.76347 12.1764C2.7938 12.3201 2.85747 12.4547 2.94935 12.5693L4.68841 14.7478C4.68841 14.9165 4.68841 15.0853 4.68841 15.254L2.94349 17.4384C2.85181 17.5531 2.78835 17.6877 2.75823 17.8314C2.7281 17.9751 2.73215 18.1239 2.77005 18.2658C3.05719 19.343 3.48593 20.3774 4.04505 21.3419C4.11832 21.4681 4.22004 21.5755 4.34211 21.6554C4.46417 21.7354 4.60322 21.7857 4.74817 21.8025L7.52786 22.1118C7.64427 22.2337 7.76146 22.3509 7.87942 22.4634L8.20403 25.2501C8.22091 25.3952 8.27144 25.5343 8.35161 25.6564C8.43177 25.7785 8.53934 25.8801 8.66575 25.9533C9.6304 26.5118 10.6648 26.9402 11.7419 27.2271C11.8839 27.2648 12.0327 27.2687 12.1764 27.2383C12.3201 27.208 12.4547 27.1444 12.5693 27.0525L14.7478 25.3134C14.9165 25.3181 15.0853 25.3181 15.254 25.3134L17.4384 27.0618C17.5531 27.1535 17.6877 27.217 17.8314 27.2471C17.9751 27.2772 18.1239 27.2732 18.2658 27.2353C19.3432 26.9487 20.3776 26.5199 21.3419 25.9603C21.4681 25.887 21.5755 25.7853 21.6554 25.6632C21.7354 25.5412 21.7857 25.4021 21.8025 25.2572L22.1118 22.4775C22.2337 22.3618 22.3509 22.2447 22.4634 22.1259L25.2501 21.7978C25.3952 21.7809 25.5343 21.7304 25.6564 21.6502C25.7785 21.57 25.8801 21.4625 25.9533 21.3361C26.5118 20.3714 26.9402 19.337 27.2271 18.2599C27.2648 18.118 27.2687 17.9691 27.2383 17.8254C27.208 17.6817 27.1444 17.5471 27.0525 17.4325L25.3134 15.254ZM15.0009 19.6884C14.0738 19.6884 13.1675 19.4135 12.3967 18.8984C11.6258 18.3834 11.025 17.6513 10.6702 16.7947C10.3154 15.9382 10.2226 14.9957 10.4035 14.0864C10.5843 13.1771 11.0308 12.3419 11.6863 11.6863C12.3419 11.0308 13.1771 10.5843 14.0864 10.4035C14.9957 10.2226 15.9382 10.3154 16.7947 10.6702C17.6513 11.025 18.3834 11.6258 18.8984 12.3967C19.4135 13.1675 19.6884 14.0738 19.6884 15.0009C19.6884 16.2441 19.1945 17.4364 18.3155 18.3155C17.4364 19.1945 16.2441 19.6884 15.0009 19.6884Z"
          fill="#810100"
        />
      </Svg>
    </View>
  );
}

function ShieldCheckIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M11.5 2.5H2.5C2.2 2.5 2 2.7 2 3V6C2 9.2 3.5 11.1 4.8 12.2C6 13.2 7 13.5 7 13.5C7 13.5 8 13.2 9.2 12.2C10.5 11.1 12 9.2 12 6V3C12 2.7 11.8 2.5 11.5 2.5ZM11 6C11 8.4 9.8 10.1 8.6 11.1C8 11.6 7.4 12 7 12.2C6.6 12 6 11.6 5.4 11.1C4.2 10.1 3 8.4 3 6V3.5H11V6Z"
        fill="rgba(0, 0, 0, 0.25)"
      />
      <Path
        d="M5 6.5L6.5 8L9 5.5"
        stroke="rgba(0, 0, 0, 0.25)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  pager: {
    flex: 1,
  },
  pagerTrack: {
    flex: 1,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 3,
  },
  page: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  pageContent: {
    flex: 1,
  },
  // Hub styles
  hubScrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
    paddingBottom: 140 * SCALE,
    alignItems: 'center',
    gap: 16 * SCALE,
  },
  // Timeline styles
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
  timelineScrollContent: {
    paddingTop: 0,
    paddingBottom: 120 * SCALE,
    alignItems: 'center',
  },
  cardWrapper: {
    marginTop: 10 * SCALE,
    marginBottom: 20 * SCALE,
  },
  // Profile styles
  profileTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  topBarButton: {},
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  profileScrollContent: {
    alignItems: 'center',
  },
  avatarSection: {
    marginTop: 10 * SCALE,
  },
  userName: {
    marginTop: 14 * SCALE,
    fontSize: 28 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
    letterSpacing: 0.3,
  },
  badgeSection: {
    marginTop: 10 * SCALE,
  },
  cardSection: {
    marginTop: 16 * SCALE,
  },
  privacySection: {
    marginTop: 24 * SCALE,
    alignItems: 'center',
  },
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 * SCALE,
  },
  privacyText: {
    fontSize: 12 * SCALE,
    color: 'rgba(0, 0, 0, 0.25)',
    fontWeight: '400',
  },
  bottomPadding: {
    height: 120 * SCALE,
  },
  // Empty state styles
  emptyStateCard: {
    width: 340 * SCALE,
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 14 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12 * SCALE,
  },
  emptyIconCircle: {
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10 * SCALE,
  },
  emptyBadge: {
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 4 * SCALE,
    borderRadius: 8 * SCALE,
  },
  emptyBadgeText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  emptyContent: {
    fontSize: 15 * SCALE,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    lineHeight: 22 * SCALE,
  },
});
