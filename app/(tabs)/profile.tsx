import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TimelineColors } from '@/constants/theme';
import { BottomNavBar } from '@/components/timeline';
import { ProfileAvatar, PrivateBadge } from '@/components/profile';
import { SettingsIcon, ShieldIcon, FolderIcon } from '@/components/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

/**
 * Profile Screen - EXACT layout from home:profile.svg
 * 
 * Layout (Y positions from SVG):
 * - Top bar icons: y ~43 (circle centers)
 * - Avatar center: y = 158
 * - Name "Vishnu's": y ~240
 * - Badge: y = 267
 * - Privacy text: y ~727
 * - Nav bar: y = 745.5
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
    // On profile, pressing profile goes back to timeline
    router.replace('/');
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  const handleFoldersPress = () => {
    console.log('Folders pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />
      
      {/* Top bar with folder (left) and settings (right) icons */}
      {/* From SVG: folder at x~41, settings at x~352, both y~43 */}
      <View style={styles.topBar}>
        <Pressable onPress={handleFoldersPress} style={styles.topBarButton}>
          <FolderIcon 
            size={24 * SCALE} 
            color={TimelineColors.primary} 
            showBackground 
            backgroundColor="rgba(129, 1, 0, 0.2)"
          />
        </Pressable>
        
        <Pressable onPress={handleSettingsPress} style={styles.topBarButton}>
          <SettingsIcon 
            size={24 * SCALE} 
            color={TimelineColors.primary} 
            showBackground 
            backgroundColor="rgba(129, 1, 0, 0.2)"
          />
        </Pressable>
      </View>
      
      {/* Profile content - centered */}
      <View style={styles.content}>
        {/* Large profile avatar - SVG: centered at y=158 */}
        <View style={styles.avatarWrapper}>
          <ProfileAvatar 
            imageSource={require('@/assets/images/pfp.png')}
          />
        </View>
        
        {/* User name - SVG: "Vishnu's" at y~240 */}
        <Text style={styles.userName}>Vishnu's</Text>
        
        {/* Private member badge - SVG: y=267, centered */}
        <View style={styles.badgeWrapper}>
          <PrivateBadge text="PRIVATE MEMORY VAULT" />
        </View>
      </View>
      
      {/* Privacy promise section - SVG: y~727 */}
      <View style={styles.privacySection}>
        <View style={styles.privacyContent}>
          <ShieldIcon size={12 * SCALE} color="rgba(0, 0, 0, 0.25)" />
          <Text style={styles.privacyText}>We promise your memories are safe with us</Text>
        </View>
      </View>

      {/* Bottom navigation bar - SVG: y=745.5 */}
      {/* Profile icon should be highlighted */}
      <BottomNavBar
        activeTab="profile"
        onGridPress={handleGridPress}
        onCapturePress={handleCapturePress}
        onProfilePress={handleProfilePress}
      />
    </SafeAreaView>
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
    paddingHorizontal: 17 * SCALE, // ~41 - 24 (half icon size) = 17 from edge
    paddingTop: 10 * SCALE,
    height: 60 * SCALE,
  },
  topBarButton: {
    // Touch target
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: 40 * SCALE, // Position avatar
  },
  userName: {
    marginTop: 20 * SCALE,
    fontSize: 28 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark, // #181717
    letterSpacing: 0.3,
  },
  badgeWrapper: {
    marginTop: 12 * SCALE,
  },
  privacySection: {
    position: 'absolute',
    bottom: 125 * SCALE, // Above nav bar (745.5 - 727 ≈ 18.5 above nav, but nav is 54 tall at 51.5 from bottom)
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 * SCALE,
  },
  privacyText: {
    fontSize: 12 * SCALE,
    color: 'rgba(0, 0, 0, 0.25)', // Same as icon
    fontWeight: '400',
  },
});
