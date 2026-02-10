import { TimelineColors } from '@/constants/theme';
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import {
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

function BookIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 3C2 2.44772 2.44772 2 3 2H6C7.10457 2 8 2.89543 8 4V14C8 13.4477 7.55228 13 7 13H3C2.44772 13 2 12.5523 2 12V3Z"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 3C14 2.44772 13.5523 2 13 2H10C8.89543 2 8 2.89543 8 4V14C8 13.4477 8.44772 13 9 13H13C13.5523 13 14 12.5523 14 12V3Z"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PenIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20H21"
        stroke="#FDFBF7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.5 3.50023C16.8978 3.1024 17.4374 2.87891 18 2.87891C18.2786 2.87891 18.5544 2.93378 18.8118 3.04038C19.0692 3.14699 19.303 3.30324 19.5 3.50023C19.697 3.69721 19.8532 3.93106 19.9598 4.18843C20.0665 4.4458 20.1213 4.72165 20.1213 5.00023C20.1213 5.2788 20.0665 5.55465 19.9598 5.81202C19.8532 6.06939 19.697 6.30324 19.5 6.50023L7 19.0002L3 20.0002L4 16.0002L16.5 3.50023Z"
        stroke="#FDFBF7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TrendUpIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6H23V12"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#666" strokeWidth={2} />
      <Path
        d="M12 6V12L16 14"
        stroke="#666"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CalendarIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
        stroke="#666"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M16 2V6" stroke="#666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 2V6" stroke="#666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 10H21" stroke="#666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HappyIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth={2} />
      <Path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#4CAF50" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 9H9.01" stroke="#4CAF50" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 9H15.01" stroke="#4CAF50" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SadIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#F44336" strokeWidth={2} />
      <Path d="M16 16C16 16 14.5 14 12 14C9.5 14 8 16 8 16" stroke="#F44336" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 9H9.01" stroke="#F44336" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 9H15.01" stroke="#F44336" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ============== TYPES ==============

import { useTimeline, type TimelineEntry } from '@/lib/timeline-context';

/*
  Helper to estimate word count from content
*/
function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

// Helper to normalize mood check
function isHappyMood(mood: string | null | undefined): boolean {
  if (!mood) return false;
  const m = mood.toLowerCase();
  return m.includes('happy') || m === 'normal'; // Count normal as positive/neutral
}

function isSadMood(mood: string | null | undefined): boolean {
  if (!mood) return false;
  const m = mood.toLowerCase();
  return m.includes('sad');
}


// ============== COMPONENTS ==============

function InsightsCard({ stories }: { stories: TimelineEntry[] }) {
  const totalStories = stories.length;

  const totalWords = stories.reduce((acc, s) => {
    const content = s.storyContent || s.content || '';
    return acc + getWordCount(content);
  }, 0);

  const happyStories = stories.filter(s => isHappyMood(s.mood)).length;
  const avgWordsPerStory = totalStories > 0 ? Math.round(totalWords / totalStories) : 0;
  const happyPercentage = totalStories > 0 ? Math.round((happyStories / totalStories) * 100) : 0;

  return (
    <View style={styles.insightsCard}>
      <View style={styles.insightsHeader}>
        <View style={styles.insightsIconCircle}>
          <TrendUpIcon size={18 * SCALE} />
        </View>
        <Text style={styles.insightsTitle}>Your Story Insights</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalStories}</Text>
          <Text style={styles.statLabel}>Total Stories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalWords.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Words Written</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{avgWordsPerStory}</Text>
          <Text style={styles.statLabel}>Avg. Words</Text>
        </View>
      </View>

      <View style={styles.moodInsight}>
        <HappyIcon size={16 * SCALE} />
        <Text style={styles.moodInsightText}>
          {happyPercentage}% of your stories have a positive mood
        </Text>
      </View>
    </View>
  );
}

function StoryListItem({ story, onPress }: { story: TimelineEntry; onPress: () => void }) {
  const isHappy = isHappyMood(story.mood);
  const isSad = isSadMood(story.mood);
  const MoodIcon = isHappy ? HappyIcon : isSad ? SadIcon : HappyIcon; // Default to Happy if unknown

  const content = story.storyContent || story.content || '';
  const wordCount = getWordCount(content);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Format date
  const dateObj = new Date(story.createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Pressable style={styles.storyItem} onPress={onPress}>
      <View style={styles.storyItemHeader}>
        <Text style={styles.storyItemTitle} numberOfLines={1}>{story.title || 'Untitled Story'}</Text>
        <MoodIcon size={18 * SCALE} />
      </View>

      <Text style={styles.storyItemPreview} numberOfLines={2}>
        {content}
      </Text>

      <View style={styles.storyItemMeta}>
        <View style={styles.storyMetaItem}>
          <CalendarIcon size={12 * SCALE} />
          <Text style={styles.storyMetaText}>{formattedDate}</Text>
        </View>
        <View style={styles.storyMetaItem}>
          <ClockIcon size={12 * SCALE} />
          <Text style={styles.storyMetaText}>{readTime} min read</Text>
        </View>
      </View>
    </Pressable>
  );
}

// ============== MAIN COMPONENT ==============

export default function StoriesScreen() {
  const router = useRouter();
  const { entries } = useTimeline();

  // Filter for story types only
  const stories = React.useMemo(() => {
    return entries.filter(e => e.type === 'story');
  }, [entries]);

  const handleBack = () => {
    router.back();
  };

  const handleWriteStory = () => {
    router.push('/entry-story' as Href);
  };

  const handleStoryPress = (story: TimelineEntry) => {
    router.push({
      pathname: '/story/[id]',
      params: { id: story.id },
    });
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
            <BookIcon size={18 * SCALE} />
          </View>
          <Text style={styles.topBarTitle}>Stories</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Insights Section */}
        <InsightsCard stories={stories} />

        {/* Stories List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>All Stories</Text>
          <Text style={styles.listHeaderCount}>{stories.length} stories</Text>
        </View>

        {/* Stories List */}
        <View style={styles.storiesList}>
          {stories.map((story) => (
            <StoryListItem
              key={story.id}
              story={story}
              onPress={() => handleStoryPress(story)}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Write Button */}
      <Pressable style={styles.writeButton} onPress={handleWriteStory}>
        <PenIcon size={22 * SCALE} />
        <Text style={styles.writeButtonText}>Write a Story</Text>
      </Pressable>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 16 * SCALE,
  },
  // Insights Card
  insightsCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    padding: 20 * SCALE,
    marginBottom: 24 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
    marginBottom: 20 * SCALE,
  },
  insightsIconCircle: {
    width: 36 * SCALE,
    height: 36 * SCALE,
    borderRadius: 18 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16 * SCALE,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24 * SCALE,
    fontWeight: '700',
    color: TimelineColors.primary,
    marginBottom: 4 * SCALE,
  },
  statLabel: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  moodInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 10 * SCALE,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 10 * SCALE,
  },
  moodInsightText: {
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  // List Header
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
  // Stories List
  storiesList: {
    gap: 12 * SCALE,
  },
  storyItem: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  storyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * SCALE,
  },
  storyItemTitle: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
    flex: 1,
    marginRight: 10 * SCALE,
  },
  storyItemPreview: {
    fontSize: 14 * SCALE,
    fontWeight: '400',
    color: '#666',
    lineHeight: 20 * SCALE,
    marginBottom: 12 * SCALE,
  },
  storyItemMeta: {
    flexDirection: 'row',
    gap: 16 * SCALE,
  },
  storyMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 * SCALE,
  },
  storyMetaText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#888',
  },
  bottomPadding: {
    height: 100 * SCALE,
  },
  // Write Button
  writeButton: {
    position: 'absolute',
    bottom: 30 * SCALE,
    left: 17 * SCALE,
    right: 17 * SCALE,
    backgroundColor: TimelineColors.primary,
    borderRadius: 16 * SCALE,
    paddingVertical: 16 * SCALE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10 * SCALE,
    shadowColor: '#810100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  writeButtonText: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: '#FDFBF7',
  },
});
