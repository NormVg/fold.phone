import {
  ActivityLevel,
  BadgesSection,
  FoldDataCards,
  FoldGrid,
  FoldScoreCard,
  PrivateBadge,
  ProfileAvatar,
} from '@/components/profile';
import { BottomNavBar } from '@/components/timeline';
import { TimelineColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

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

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user: authUser } = useAuth();

  // Cast auth user to our User type
  const user = authUser as User | null;

  // Format user's display name (e.g., "Vishnu's")
  const getDisplayName = () => {
    if (!user?.name) return "User's";
    const firstName = user.name.split(' ')[0];
    return `${firstName}'s`;
  };

  const handleGridPress = () => {
    router.replace('/hub');
  };

  const handleCapturePress = () => {
    router.push('/entry-text'); // Tap -> text entry
  };

  const handleCaptureLongPress = () => {
    router.push('/entry-audio'); // Long press -> voice recording
  };

  const handleProfilePress = () => {
    router.replace('/');
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleFoldersPress = () => {
    console.log('Folders pressed');
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
          <SettingsIcon size={25 * SCALE} />
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
            imageUri={user?.image || undefined}
            imageSource={!user?.image ? require('@/assets/images/pfp.png') : undefined}
            size={124 * SCALE}
          />
        </View>

        {/* User name - "Vishnu's" */}
        <Text style={styles.userName}>{getDisplayName()}</Text>

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
          <FoldGrid activityData={MOCK_ACTIVITY_DATA} />
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
        onCaptureLongPress={handleCaptureLongPress}
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
 * Settings gear icon with background circle - exact from provided SVG
 * viewBox: 0 0 25 25
 */
function SettingsIcon({ size = 25 }: { size?: number }) {
  const circleSize = size * 1.9; // Background circle is larger than icon
  return (
    <View style={{
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      backgroundColor: 'rgba(129, 1, 0, 0.2)',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
        <Path
          d="M22.5751 12.5158C22.5798 12.347 22.5798 12.1783 22.5751 12.0095L24.3236 9.82513C24.4152 9.71044 24.4787 9.57582 24.5088 9.43211C24.539 9.28841 24.5349 9.13964 24.497 8.99778C24.2099 7.92054 23.7811 6.88613 23.222 5.92161C23.1487 5.79542 23.047 5.68808 22.9249 5.60812C22.8029 5.52817 22.6638 5.47781 22.5189 5.46106L19.7392 5.15169C19.6236 5.02981 19.5064 4.91263 19.3876 4.80013L19.0595 2.01341C19.0426 1.86834 18.9921 1.72923 18.9119 1.60715C18.8318 1.48508 18.7242 1.38342 18.5978 1.31028C17.6333 0.75159 16.5989 0.323621 15.5216 0.0376268C15.3798 -0.000271486 15.231 -0.00432126 15.0873 0.0258038C14.9436 0.0559289 14.809 0.119386 14.6943 0.211064L12.5158 1.95013C12.347 1.95013 12.1783 1.95013 12.0095 1.95013L9.82513 0.205205C9.71044 0.113527 9.57582 0.0500696 9.43211 0.0199445C9.28841 -0.0101805 9.13964 -0.006131 8.99778 0.0317673C7.92054 0.318909 6.88613 0.747646 5.92161 1.30677C5.79542 1.38004 5.68808 1.48176 5.60812 1.60382C5.52817 1.72589 5.47781 1.86494 5.46106 2.00989L5.15169 4.79427C5.02981 4.91067 4.91263 5.02786 4.80013 5.14583L2.01341 5.46575C1.86834 5.48263 1.72923 5.53316 1.60715 5.61333C1.48508 5.69349 1.38342 5.80106 1.31028 5.92747C0.751705 6.89212 0.32337 7.9265 0.0364549 9.00364C-0.00128313 9.14559 -0.00514294 9.29441 0.0251865 9.43812C0.0555159 9.58183 0.119186 9.7164 0.211064 9.83099L1.95013 12.0095C1.95013 12.1783 1.95013 12.347 1.95013 12.5158L0.205205 14.7001C0.113527 14.8148 0.0500696 14.9494 0.0199445 15.0931C-0.0101805 15.2368 -0.006131 15.3856 0.0317673 15.5275C0.318909 16.6047 0.747646 17.6391 1.30677 18.6036C1.38004 18.7298 1.48176 18.8372 1.60382 18.9171C1.72589 18.9971 1.86494 19.0474 2.00989 19.0642L4.78958 19.3736C4.90599 19.4954 5.02317 19.6126 5.14114 19.7251L5.46575 22.5118C5.48263 22.6569 5.53316 22.796 5.61333 22.9181C5.69349 23.0402 5.80106 23.1418 5.92747 23.215C6.89212 23.7736 7.9265 24.2019 9.00364 24.4888C9.14559 24.5265 9.29441 24.5304 9.43812 24.5001C9.58183 24.4697 9.7164 24.4061 9.83099 24.3142L12.0095 22.5751C12.1783 22.5798 12.347 22.5798 12.5158 22.5751L14.7001 24.3236C14.8148 24.4152 14.9494 24.4787 15.0931 24.5088C15.2368 24.539 15.3856 24.5349 15.5275 24.497C16.6049 24.2104 17.6394 23.7816 18.6036 23.222C18.7298 23.1487 18.8372 23.047 18.9171 22.9249C18.9971 22.8029 19.0474 22.6638 19.0642 22.5189L19.3736 19.7392C19.4954 19.6236 19.6126 19.5064 19.7251 19.3876L22.5118 19.0595C22.6569 19.0426 22.796 18.9921 22.9181 18.9119C23.0402 18.8318 23.1418 18.7242 23.215 18.5978C23.7736 17.6331 24.2019 16.5988 24.4888 15.5216C24.5265 15.3797 24.5304 15.2308 24.5001 15.0871C24.4697 14.9434 24.4061 14.8089 24.3142 14.6943L22.5751 12.5158ZM12.2626 16.9501C11.3355 16.9501 10.4292 16.6752 9.65839 16.1601C8.88754 15.6451 8.28673 14.913 7.93194 14.0565C7.57716 13.1999 7.48433 12.2574 7.6652 11.3481C7.84606 10.4389 8.29251 9.60362 8.94806 8.94806C9.60362 8.29251 10.4389 7.84606 11.3481 7.6652C12.2574 7.48433 13.1999 7.57716 14.0565 7.93194C14.913 8.28673 15.6451 8.88754 16.1601 9.65839C16.6752 10.4292 16.9501 11.3355 16.9501 12.2626C16.9501 13.5058 16.4563 14.6981 15.5772 15.5772C14.6981 16.4563 13.5058 16.9501 12.2626 16.9501Z"
          fill="#810100"
        />
      </Svg>
    </View>
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
    height: 120 * SCALE,
  },
});
