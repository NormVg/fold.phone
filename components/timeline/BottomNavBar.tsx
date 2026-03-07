import { CaptureAddIcon, GridIcon, HomeIcon, ProfileIcon } from '@/components/icons';
import { TimelineColors } from '@/constants/theme';
import { useNotificationStore } from '@/lib/store/notification-store';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

const DRAG_THRESHOLD = 40; // px to trigger action
const MAX_DRAG = 100; // visual clamp

export type ActiveTab = 'timeline' | 'hub' | 'profile';

interface BottomNavBarProps {
  activeTab?: ActiveTab;
  onGridPress?: () => void;
  onCapturePress?: () => void;
  onCaptureLongPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
  onCaptureDragUp?: () => void;
  onCaptureDragDown?: () => void;
}

export function BottomNavBar({
  activeTab = 'timeline',
  onGridPress,
  onCapturePress,
  onCaptureLongPress,
  onHomePress,
  onProfilePress,
  onCaptureDragUp,
  onCaptureDragDown,
}: BottomNavBarProps) {
  const isHubActive = activeTab === 'hub';
  const isProfileActive = activeTab === 'profile';
  const isTimeline = activeTab === 'timeline';
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  // 0 = home icon, 1 = capture icon
  const progress = useSharedValue(isTimeline ? 1 : 0);

  // Drag state
  const dragY = useSharedValue(0);
  const isDragging = useSharedValue(false);

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

  // ── Drag visual feedback ──────────────────────────────────────────

  // Floating hint label that appears above (drag up → photo) or below (drag down → video)
  const hintUpStyle = useAnimatedStyle(() => {
    const show = isDragging.value && dragY.value < -15;
    const normalizedDrag = Math.min(Math.abs(dragY.value), MAX_DRAG) / MAX_DRAG;
    return {
      opacity: show ? interpolate(normalizedDrag, [0, 0.3, 1], [0, 0.6, 1]) : 0,
      transform: [
        { translateY: show ? interpolate(normalizedDrag, [0, 1], [-20, -55]) : -20 },
        { scale: show ? interpolate(normalizedDrag, [0, 0.3, 1], [0.6, 0.8, 1]) : 0.6 },
      ],
    };
  });

  const hintDownStyle = useAnimatedStyle(() => {
    const show = isDragging.value && dragY.value > 15;
    const normalizedDrag = Math.min(Math.abs(dragY.value), MAX_DRAG) / MAX_DRAG;
    return {
      opacity: show ? interpolate(normalizedDrag, [0, 0.3, 1], [0, 0.6, 1]) : 0,
      transform: [
        { translateY: show ? interpolate(normalizedDrag, [0, 1], [20, 55]) : 20 },
        { scale: show ? interpolate(normalizedDrag, [0, 0.3, 1], [0.6, 0.8, 1]) : 0.6 },
      ],
    };
  });

  // Button scale feedback during drag
  const buttonDragStyle = useAnimatedStyle(() => {
    if (!isDragging.value) return { transform: [{ scale: 1 }] };
    const normalizedDrag = Math.min(Math.abs(dragY.value), MAX_DRAG) / MAX_DRAG;
    return {
      transform: [{ scale: interpolate(normalizedDrag, [0, 0.5, 1], [1, 1.15, 1.25]) }],
    };
  });

  // ── Gesture callbacks (must run on JS thread) ─────────────────────

  const fireHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const fireDragUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onCaptureDragUp?.();
  };

  const fireDragDown = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onCaptureDragDown?.();
  };

  const fireTap = () => {
    onCapturePress?.();
  };

  const fireLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCaptureLongPress?.();
  };

  const fireHomeTap = () => {
    onHomePress?.();
  };

  // ── Gesture composition ───────────────────────────────────────────

  // Pan gesture for drag up/down
  const panGesture = Gesture.Pan()
    .activeOffsetY([-15, 15]) // start only after 15px vertical movement
    .failOffsetX([-20, 20])   // fail if horizontal movement > 20px
    .onStart(() => {
      isDragging.value = true;
      dragY.value = 0;
    })
    .onUpdate((e) => {
      dragY.value = e.translationY;
      // Haptic tick when crossing threshold
      if (Math.abs(e.translationY) > DRAG_THRESHOLD && Math.abs(e.translationY) < DRAG_THRESHOLD + 5) {
        runOnJS(fireHaptic)();
      }
    })
    .onEnd((e) => {
      isDragging.value = false;
      dragY.value = withSpring(0, { damping: 15, stiffness: 200 });

      if (e.translationY < -DRAG_THRESHOLD) {
        runOnJS(fireDragUp)();
      } else if (e.translationY > DRAG_THRESHOLD) {
        runOnJS(fireDragDown)();
      }
    })
    .onFinalize(() => {
      isDragging.value = false;
      dragY.value = withSpring(0, { damping: 15, stiffness: 200 });
    });

  // Tap gesture
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      if (isTimeline) {
        runOnJS(fireTap)();
      } else {
        runOnJS(fireHomeTap)();
      }
    });

  // Long press gesture
  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      if (isTimeline) {
        runOnJS(fireLongPress)();
      }
    });

  // Compose: Pan wins over Tap/LongPress if drag detected, otherwise Tap or LongPress
  const composedGesture = Gesture.Race(
    panGesture,
    Gesture.Exclusive(longPressGesture, tapGesture),
  );

  return (
    <View style={styles.container}>
      {/* Floating hint labels - rendered OUTSIDE the navBar for proper positioning */}
      <Animated.View style={[styles.hintLabel, styles.hintUp, hintUpStyle]} pointerEvents="none">
        <Text style={styles.hintText}>📷 Photo</Text>
      </Animated.View>
      <Animated.View style={[styles.hintLabel, styles.hintDown, hintDownStyle]} pointerEvents="none">
        <Text style={styles.hintText}>🎥 Video</Text>
      </Animated.View>

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
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Center button: gesture-enabled crossfade between Entry and Home */}
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.centerSlot, buttonDragStyle]}>
            {/* Home icon layer */}
            <Animated.View style={homeStyle}>
              <View
                style={styles.centerHitArea}
                accessibilityLabel="Home"
                accessibilityRole="button"
              >
                <HomeIcon
                  size={24 * SCALE}
                  color={TimelineColors.primary}
                />
              </View>
            </Animated.View>

            {/* Capture icon layer */}
            <Animated.View style={captureStyle}>
              <View
                style={styles.centerHitArea}
                accessibilityLabel="Capture"
                accessibilityRole="button"
              >
                <CaptureAddIcon
                  size={38 * SCALE}
                  color={TimelineColors.primary}
                  backgroundColor={TimelineColors.captureButtonBackground}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>

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
    width: 44 * SCALE,
    height: 44 * SCALE,
  },
  centerHitArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44 * SCALE,
    height: 44 * SCALE,
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
  // Floating hint labels
  hintLabel: {
    position: 'absolute',
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.9)',
    zIndex: 200,
  },
  hintUp: {
    bottom: 60 * SCALE, // above the nav bar
  },
  hintDown: {
    top: 60 * SCALE, // below the nav bar (inside container, relative to bar)
  },
  hintText: {
    color: '#FDFBF7',
    fontSize: 13 * SCALE,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  notifBadge: {
    position: 'absolute',
    top: -2 * SCALE,
    right: -4 * SCALE,
    minWidth: 16 * SCALE,
    height: 16 * SCALE,
    borderRadius: 8 * SCALE,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3 * SCALE,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9 * SCALE,
    fontWeight: '700',
  },
});
