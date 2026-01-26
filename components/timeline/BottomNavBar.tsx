import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { TimelineColors } from '@/constants/theme';
import { GridIcon, CaptureAddIcon, ProfileIcon } from '@/components/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

export type ActiveTab = 'timeline' | 'hub' | 'profile';

interface BottomNavBarProps {
  activeTab?: ActiveTab;
  onGridPress?: () => void;
  onCapturePress?: () => void;
  onProfilePress?: () => void;
}

export function BottomNavBar({
  activeTab = 'timeline',
  onGridPress,
  onCapturePress,
  onProfilePress,
}: BottomNavBarProps) {
  const isHubActive = activeTab === 'hub';
  const isProfileActive = activeTab === 'profile';

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* Grid/Hub button */}
        <Pressable 
          style={styles.navButton}
          onPress={onGridPress}
          accessibilityLabel="Hub"
          accessibilityRole="button"
        >
          {/* Highlight background for hub - rounded rect 32x32, rx=5 */}
          {isHubActive && <View style={styles.hubHighlight} />}
          <GridIcon 
            size={22 * SCALE} 
            color={TimelineColors.primary} 
          />
        </Pressable>

        {/* Capture/Add button (center) */}
        <Pressable 
          style={styles.captureButton}
          onPress={onCapturePress}
          accessibilityLabel="Capture"
          accessibilityRole="button"
        >
          <CaptureAddIcon 
            size={38 * SCALE} 
            color={TimelineColors.primary}
            backgroundColor={TimelineColors.captureButtonBackground}
          />
        </Pressable>

        {/* Profile button */}
        <Pressable 
          style={styles.navButton}
          onPress={onProfilePress}
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
          {/* Highlight background for profile - circle 32x32, rx=16 */}
          {isProfileActive && <View style={styles.profileHighlight} />}
          <ProfileIcon 
            size={26 * SCALE} 
            color={TimelineColors.primary} 
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 51.5 * SCALE, // From SVG: 852 - 746.5 - 54 = 51.5
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navBar: {
    width: 177 * SCALE,
    height: 54 * SCALE,
    borderRadius: 27 * SCALE,
    backgroundColor: TimelineColors.navBarBackground,
    borderWidth: 1,
    borderColor: TimelineColors.navBarStroke,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32 * SCALE,
    height: 32 * SCALE,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Hub highlight: rounded rect 32x32, rx=5, #810100 at 10% opacity
  hubHighlight: {
    position: 'absolute',
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 5 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)', // #810100 at 10% opacity
  },
  // Profile highlight: circle 32x32, rx=16, #810100 at 10% opacity
  profileHighlight: {
    position: 'absolute',
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)', // #810100 at 10% opacity
  },
});
