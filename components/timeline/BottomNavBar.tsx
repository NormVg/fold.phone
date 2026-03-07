import { CaptureAddIcon, GridIcon, HomeIcon, ProfileIcon } from '@/components/icons';
import { TimelineColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

export type ActiveTab = 'timeline' | 'hub' | 'profile';

interface BottomNavBarProps {
  activeTab?: ActiveTab;
  onGridPress?: () => void;
  onCapturePress?: () => void;
  onCaptureLongPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
}

export function BottomNavBar({
  activeTab = 'timeline',
  onGridPress,
  onCapturePress,
  onCaptureLongPress,
  onHomePress,
  onProfilePress,
}: BottomNavBarProps) {
  const isHubActive = activeTab === 'hub';
  const isProfileActive = activeTab === 'profile';
  const isTimeline = activeTab === 'timeline';

  // 0 = home icon, 1 = capture icon
  const progress = useSharedValue(isTimeline ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isTimeline ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [isTimeline]);

  const captureStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5, 1], [0.5, 0.7, 1]) },
      { rotate: `${interpolate(progress.value, [0, 1], [-90, 0])}deg` },
    ],
    position: 'absolute' as const,
  }));

  const homeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [1, 0, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5, 1], [1, 0.7, 0.5]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 90])}deg` },
    ],
    position: 'absolute' as const,
  }));

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
          {isHubActive && <View style={styles.hubHighlight} />}
          <GridIcon
            size={22 * SCALE}
            color={TimelineColors.primary}
          />
        </Pressable>

        {/* Center button: crossfade between Entry and Home */}
        <View style={styles.centerSlot}>
          {/* Home icon layer */}
          <Animated.View style={homeStyle}>
            <Pressable
              onPress={onHomePress}
              accessibilityLabel="Home"
              accessibilityRole="button"
              style={styles.centerHitArea}
            >
              <HomeIcon
                size={24 * SCALE}
                color={TimelineColors.primary}
              />
            </Pressable>
          </Animated.View>

          {/* Capture icon layer */}
          <Animated.View style={captureStyle}>
            <Pressable
              onPress={onCapturePress}
              onLongPress={onCaptureLongPress}
              delayLongPress={300}
              accessibilityLabel="Capture"
              accessibilityRole="button"
              style={styles.centerHitArea}
            >
              <CaptureAddIcon
                size={38 * SCALE}
                color={TimelineColors.primary}
                backgroundColor={TimelineColors.captureButtonBackground}
              />
            </Pressable>
          </Animated.View>
        </View>

        {/* Profile button */}
        <Pressable
          style={styles.navButton}
          onPress={onProfilePress}
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
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
    bottom: 51.5 * SCALE,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
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
  centerSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38 * SCALE,
    height: 38 * SCALE,
  },
  centerHitArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubHighlight: {
    position: 'absolute',
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 5 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
  },
  profileHighlight: {
    position: 'absolute',
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
  },
});
