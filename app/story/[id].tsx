import { TimelineColors } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Back icon
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

// Book/Story icon
function StoryIcon({ size = 20 }: { size?: number }) {
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

// Share icon
function ShareIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.3423 7.10213L9.51421 11.9303C9.44668 11.9979 9.36062 12.0439 9.26692 12.0626C9.17321 12.0812 9.07607 12.0717 8.9878 12.0351C8.89953 11.9985 8.8241 11.9366 8.77105 11.8571C8.71801 11.7776 8.68973 11.6842 8.68981 11.5887V9.18848C5.24373 9.38402 2.88097 11.6188 2.21771 12.3268C2.11356 12.438 1.97698 12.5135 1.82741 12.5426C1.67784 12.5717 1.52291 12.5529 1.38465 12.4889C1.24639 12.4248 1.13185 12.3188 1.05734 12.1859C0.982829 12.053 0.952138 11.9 0.969635 11.7486C1.19354 9.80165 2.25995 7.92894 3.97273 6.47568C5.39521 5.26865 7.12429 4.50278 8.68981 4.3688V1.93241C8.68973 1.83686 8.71801 1.74344 8.77105 1.66398C8.8241 1.58451 8.89953 1.52257 8.9878 1.48599C9.07607 1.44942 9.17321 1.43986 9.26692 1.45852C9.36062 1.47718 9.44668 1.52322 9.51421 1.59082L14.3423 6.41895C14.3872 6.46379 14.4228 6.51704 14.4471 6.57565C14.4714 6.63426 14.4839 6.69709 14.4839 6.76054C14.4839 6.82399 14.4714 6.88681 14.4471 6.94543C14.4228 7.00404 14.3872 7.05729 14.3423 7.10213Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Sad face icon
function SadIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.72626 1.44922C6.48478 1.44922 5.27118 1.81736 4.23892 2.50709C3.20667 3.19682 2.40213 4.17716 1.92703 5.32414C1.45194 6.47112 1.32763 7.73322 1.56983 8.95085C1.81203 10.1685 2.40986 11.2869 3.28772 12.1648C4.16558 13.0427 5.28405 13.6405 6.50167 13.8827C7.7193 14.1249 8.9814 14.0006 10.1284 13.5255C11.2754 13.0504 12.2557 12.2458 12.9454 11.2136C13.6352 10.1813 14.0033 8.96774 14.0033 7.72626C14.0015 6.06202 13.3397 4.46645 12.1629 3.28966C10.9861 2.11287 9.3905 1.45098 7.72626 1.44922ZM5.55344 5.79486C5.69669 5.79486 5.83672 5.83734 5.95582 5.91692C6.07493 5.99651 6.16776 6.10962 6.22258 6.24197C6.2774 6.37431 6.29174 6.51994 6.2638 6.66043C6.23585 6.80093 6.16687 6.92998 6.06558 7.03127C5.96429 7.13257 5.83523 7.20155 5.69474 7.22949C5.55424 7.25744 5.40862 7.2431 5.27627 7.18828C5.14393 7.13346 5.03081 7.04063 4.95123 6.92152C4.87164 6.80241 4.82917 6.66238 4.82917 6.51914C4.82917 6.32705 4.90547 6.14282 5.0413 6.007C5.17713 5.87117 5.36135 5.79486 5.55344 5.79486ZM10.3819 11.041C10.2711 11.1049 10.1395 11.1223 10.0159 11.0892C9.89236 11.0562 9.78695 10.9755 9.72284 10.8648C9.27198 10.0856 8.5634 9.65766 7.72626 9.65766C6.88912 9.65766 6.18054 10.0862 5.72968 10.8648C5.69949 10.9225 5.65795 10.9735 5.60754 11.0147C5.55714 11.0559 5.49891 11.0866 5.43637 11.1047C5.37382 11.1228 5.30826 11.1281 5.24361 11.1203C5.17897 11.1124 5.11658 11.0916 5.0602 11.059C5.00382 11.0264 4.95461 10.9828 4.91554 10.9307C4.87647 10.8786 4.84834 10.8191 4.83285 10.7558C4.81736 10.6926 4.81482 10.6269 4.82539 10.5626C4.83596 10.4983 4.85941 10.4369 4.89435 10.3819C5.51542 9.30819 6.54751 8.69196 7.72626 8.69196C8.90502 8.69196 9.93711 9.30759 10.5582 10.3819C10.6221 10.4927 10.6394 10.6244 10.6064 10.7479C10.5733 10.8715 10.4926 10.9769 10.3819 11.041ZM9.89908 7.24341C9.75583 7.24341 9.6158 7.20093 9.4967 7.12135C9.37759 7.04176 9.28476 6.92865 9.22994 6.7963C9.17512 6.66396 9.16078 6.51833 9.18873 6.37784C9.21667 6.23734 9.28565 6.10829 9.38694 6.007C9.48824 5.9057 9.61729 5.83672 9.75778 5.80878C9.89828 5.78083 10.0439 5.79518 10.1762 5.84999C10.3086 5.90481 10.4217 5.99764 10.5013 6.11675C10.5809 6.23586 10.6234 6.37589 10.6234 6.51914C10.6234 6.71122 10.5443 6.89545 10.4085 7.03127C10.2727 7.1671 10.0884 7.24341 9.89636 7.24341H9.89908Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Happy/Satisfied face icon
function HappyIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.72626 1.44922C6.48478 1.44922 5.27118 1.81736 4.23892 2.50709C3.20667 3.19682 2.40213 4.17716 1.92703 5.32414C1.45194 6.47112 1.32763 7.73322 1.56983 8.95085C1.81203 10.1685 2.40986 11.2869 3.28772 12.1648C4.16558 13.0427 5.28405 13.6405 6.50167 13.8827C7.7193 14.1249 8.9814 14.0006 10.1284 13.5255C11.2754 13.0504 12.2557 12.2458 12.9454 11.2136C13.6352 10.1813 14.0033 8.96774 14.0033 7.72626C14.0015 6.06202 13.3397 4.46645 12.1629 3.28966C10.9861 2.11287 9.3905 1.45098 7.72626 1.44922ZM5.55344 5.79486C5.69669 5.79486 5.83672 5.83734 5.95582 5.91692C6.07493 5.99651 6.16776 6.10962 6.22258 6.24197C6.2774 6.37431 6.29174 6.51994 6.2638 6.66043C6.23585 6.80093 6.16687 6.92998 6.06558 7.03127C5.96429 7.13257 5.83523 7.20155 5.69474 7.22949C5.55424 7.25744 5.40862 7.2431 5.27627 7.18828C5.14393 7.13346 5.03081 7.04063 4.95123 6.92152C4.87164 6.80241 4.82917 6.66238 4.82917 6.51914C4.82917 6.32705 4.90547 6.14282 5.0413 6.007C5.17713 5.87117 5.36135 5.79486 5.55344 5.79486ZM10.3819 11.041C10.2711 11.1049 10.1395 11.1223 10.0159 11.0892C9.89236 11.0562 9.78695 10.9755 9.72284 10.8648C9.27198 10.0856 8.5634 9.65766 7.72626 9.65766C6.88912 9.65766 6.18054 10.0862 5.72968 10.8648C5.69949 10.9225 5.65795 10.9735 5.60754 11.0147C5.55714 11.0559 5.49891 11.0866 5.43637 11.1047C5.37382 11.1228 5.30826 11.1281 5.24361 11.1203C5.17897 11.1124 5.11658 11.0916 5.0602 11.059C5.00382 11.0264 4.95461 10.9828 4.91554 10.9307C4.87647 10.8786 4.84834 10.8191 4.83285 10.7558C4.81736 10.6926 4.81482 10.6269 4.82539 10.5626C4.83596 10.4983 4.85941 10.4369 4.89435 10.3819C5.51542 9.30819 6.54751 8.69196 7.72626 8.69196C8.90502 8.69196 9.93711 9.30759 10.5582 10.3819C10.6221 10.4927 10.6394 10.6244 10.6064 10.7479C10.5733 10.8715 10.4926 10.9769 10.3819 11.041ZM9.89908 7.24341C9.75583 7.24341 9.6158 7.20093 9.4967 7.12135C9.37759 7.04176 9.28476 6.92865 9.22994 6.7963C9.17512 6.66396 9.16078 6.51833 9.18873 6.37784C9.21667 6.23734 9.28565 6.10829 9.38694 6.007C9.48824 5.9057 9.61729 5.83672 9.75778 5.80878C9.89828 5.78083 10.0439 5.79518 10.1762 5.84999C10.3086 5.90481 10.4217 5.99764 10.5013 6.11675C10.5809 6.23586 10.6234 6.37589 10.6234 6.51914C10.6234 6.71122 10.5443 6.89545 10.4085 7.03127C10.2727 7.1671 10.0884 7.24341 9.89636 7.24341H9.89908Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Calculate read time from content
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default function StoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    content: string;
    time: string;
    mood: string;
  }>();

  const { title, content, time, mood } = params;
  const MoodIcon = mood === 'SAD' ? SadIcon : HappyIcon;
  const readTime = calculateReadTime(content || '');

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    console.log('Share story');
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
            <StoryIcon size={18 * SCALE} />
          </View>
          <Text style={styles.topBarTitle}>Story</Text>
        </View>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <ShareIcon size={20 * SCALE} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Story header */}
        <View style={styles.headerSection}>
          <Text style={styles.storyTitle}>{title}</Text>
          
          {/* Meta info */}
          <View style={styles.metaRow}>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.readTimeBadge}>
              <Text style={styles.readTimeText}>{readTime}</Text>
            </View>
            <View style={styles.moodBadge}>
              <MoodIcon size={14 * SCALE} />
              <Text style={styles.moodText}>{mood}</Text>
            </View>
          </View>
        </View>

        {/* Story content */}
        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{content}</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  shareButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 20 * SCALE,
  },
  headerSection: {
    marginBottom: 20 * SCALE,
  },
  storyTitle: {
    fontSize: 28 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 16 * SCALE,
    lineHeight: 36 * SCALE,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
    flexWrap: 'wrap',
  },
  timeBadge: {
    backgroundColor: '#FDFBF7',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
  },
  timeText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  readTimeBadge: {
    backgroundColor: '#FDFBF7',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
  },
  readTimeText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
    gap: 6 * SCALE,
  },
  moodText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: '#181717',
  },
  contentCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 20 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  contentText: {
    fontSize: 16 * SCALE,
    fontWeight: '400',
    color: '#181717',
    lineHeight: 26 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
