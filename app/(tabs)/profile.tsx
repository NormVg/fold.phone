import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TimelineColors } from '@/constants/theme';
import { BottomNavBar } from '@/components/timeline';
import { 
  ProfileAvatar, 
  PrivateBadge, 
  FoldScoreCard, 
  FoldDataCards, 
  FoldGrid, 
  BadgesSection,
  ActivityLevel,
} from '@/components/profile';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Mock activity data for the grid (matches SVG design pattern)
const MOCK_ACTIVITY_DATA: ActivityLevel[][] = [
  [1, 3, 1, 1, 3, 1, 1], // Week 1
  [3, 2, 2, 2, 3, 2, 3], // Week 2
  [1, 2, 1, 2, 1, 1, 1], // Week 3
  [2, 3, 1, 1, 3, 3, 3], // Week 4
  [1, 0, 0, 0, 0, 0, 0], // Week 5 (partial)
];

/**
 * Profile Screen - Exact layout from home:profile.svg
 * 
 * SVG Measurements:
 * - Screen: 393x852
 * - Avatar outer circle: cx=196 cy=158 r=62 (center at 196, 158)
 * - Avatar inner: r=50.5 with image
 * - Name "Vishnu's": at y=240 (text baseline)
 * - Badge: rect x=108 y=267 width=177 height=25 rx=12.5
 * - Bottom nav: rect x=107.5 y=745.5 width=176.98 height=54 rx=27
 * 
 * Components (from individual SVGs):
 * - FoldScore card: at y~305 (after badge at 267+25=292, plus margin)
 * - FoldData cards: at y~480
 * - FoldGrid: at y~640
 * - Badges section: at y~970
 */
export default function ProfileScreen() {
  const router = useRouter();

  const handleGridPress = () => {
    router.replace('/hub');
  };

  const handleCapturePress = () => {
    console.log('Capture pressed');
  };

  const handleProfilePress = () => {
    router.replace('/');
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  const handleFoldersPress = () => {
    console.log('Folders pressed');
  };

  const handleGridNavigation = () => {
    console.log('Navigate to next week');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />
      
      {/* Top bar: folder (left), "Profile" title (center), settings (right) */}
      <View style={styles.topBar}>
        <Pressable onPress={handleFoldersPress} style={styles.topBarButton}>
          <FolderIcon size={48 * SCALE} />
        </Pressable>
        
        <Text style={styles.topBarTitle}>Profile</Text>
        
        <Pressable onPress={handleSettingsPress} style={styles.topBarButton}>
          <SettingsIcon size={48 * SCALE} />
        </Pressable>
      </View>
      
      {/* Scrollable content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar - centered, outer ring + inner image */}
        <View style={styles.avatarSection}>
          <ProfileAvatar 
            imageSource={require('@/assets/images/pfp.png')}
            size={124 * SCALE}
          />
        </View>
        
        {/* User name - "Vishnu's" */}
        <Text style={styles.userName}>Vishnu's</Text>
        
        {/* Private member badge - "PRIVATE MEMORY VAULT" */}
        <View style={styles.badgeSection}>
          <PrivateBadge text="PRIVATE MEMORY VAULT" />
        </View>
        
        {/* Fold Score Card */}
        <View style={styles.cardSection}>
          <FoldScoreCard 
            score={840}
            percentile={10}
            progress={0.75}
          />
        </View>
        
        {/* Fold Data Cards (Streak + Audio) */}
        <View style={styles.cardSection}>
          <FoldDataCards 
            streakDays={8}
            isStreakActive={true}
            audioMinutes={43}
          />
        </View>
        
        {/* Fold Grid (Activity heatmap) */}
        <View style={styles.cardSection}>
          <FoldGrid 
            activityData={MOCK_ACTIVITY_DATA}
            onNextPress={handleGridNavigation}
          />
        </View>
        
        {/* Badges Section */}
        <View style={styles.cardSection}>
          <BadgesSection />
        </View>
        
        {/* Privacy promise */}
        <View style={styles.privacySection}>
          <View style={styles.privacyContent}>
            <ShieldCheckIcon size={14 * SCALE} />
            <Text style={styles.privacyText}>We promise your memories are safe with us</Text>
          </View>
        </View>
        
        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom navigation bar - fixed */}
      <BottomNavBar
        activeTab="profile"
        onGridPress={handleGridPress}
        onCapturePress={handleCapturePress}
        onProfilePress={handleProfilePress}
      />
    </SafeAreaView>
  );
}

/**
 * Folder icon with background circle
 * From SVG: circle cx=41.27 cy=43.27 r=24.27, folder path inside
 */
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

/**
 * Settings gear icon with background circle
 * From SVG: circle cx=351.81 cy=43.27 r=24.27, gear path inside
 */
function SettingsIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="24" fill="rgba(129, 1, 0, 0.2)" />
      <Path
        d="M24 17.5C25.7 17.5 27.3 18.2 28.5 19.4C29.7 20.6 30.4 22.2 30.4 24C30.4 25.8 29.7 27.4 28.5 28.6C27.3 29.8 25.7 30.5 24 30.5C22.3 30.5 20.7 29.8 19.5 28.6C18.3 27.4 17.6 25.8 17.6 24C17.6 22.2 18.3 20.6 19.5 19.4C20.7 18.2 22.3 17.5 24 17.5ZM24 19.5C22.8 19.5 21.7 20 20.9 20.8C20.1 21.6 19.6 22.7 19.6 24C19.6 25.3 20.1 26.4 20.9 27.2C21.7 28 22.8 28.5 24 28.5C25.2 28.5 26.3 28 27.1 27.2C27.9 26.4 28.4 25.3 28.4 24C28.4 22.7 27.9 21.6 27.1 20.8C26.3 20 25.2 19.5 24 19.5Z"
        fill="#810100"
      />
      <Path
        d="M32.2 24L33.5 22.4L32.5 20.7L30.5 21.2L29.5 19.5L30.5 17.5L29 16L27 17L25.3 16L24.8 14H23.2L22.7 16L21 17L19 16L17.5 17.5L18.5 19.5L17.5 21.2L15.5 20.7L14.5 22.4L15.8 24L14.5 25.6L15.5 27.3L17.5 26.8L18.5 28.5L17.5 30.5L19 32L21 31L22.7 32L23.2 34H24.8L25.3 32L27 31L29 32L30.5 30.5L29.5 28.5L30.5 26.8L32.5 27.3L33.5 25.6L32.2 24Z"
        stroke="#810100"
        strokeWidth={1.2}
        fill="none"
      />
    </Svg>
  );
}

/**
 * Shield with checkmark icon
 * From SVG at y=717 for privacy text
 */
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
    backgroundColor: TimelineColors.background, // #EDEADC
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  topBarButton: {
    // Touch target
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
    height: 100 * SCALE,
  },
});
