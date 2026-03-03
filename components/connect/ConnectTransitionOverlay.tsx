import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

const COLORS = {
  background: '#EDEADC', // App cream background
  mine: '#810100', // Crimson
  theirs: '#1A7A7A', // Teal
  text: '#181717',
};

export type TransitionMode = 'connect' | 'personal' | null;

interface ConnectTransitionOverlayProps {
  targetMode: TransitionMode;
  onMidpoint: () => void;
  onComplete: () => void;
}

export function ConnectTransitionOverlay({
  targetMode,
  onMidpoint,
  onComplete,
}: ConnectTransitionOverlayProps) {
  // We use a local state for the display text so it doesn't disappear instantly when targetMode resets
  const [displayText, setDisplayText] = useState('');

  const opacity = useSharedValue(0);
  const connectionProgress = useSharedValue(0); // 0 = personal, 1 = connected
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (targetMode === 'connect') {
      setDisplayText('Opening Connect...');
      connectionProgress.value = 0; // ensure start separated
      pulseScale.value = 1;

      // 1. Fade in overlay
      opacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) }, () => {
        // 2. Dots come together
        connectionProgress.value = withSpring(1, { damping: 14, stiffness: 100 }, (finished) => {
          if (finished) {
            // Pulse effect when they collide
            pulseScale.value = withSequence(
              withTiming(1.3, { duration: 150 }),
              withTiming(1, { duration: 150 })
            );

            // 3. Midpoint - tell parent to swap the underlying view
            runOnJS(onMidpoint)();

            // 4. Wait a bit, then fade out
            opacity.value = withDelay(
              400,
              withTiming(0, { duration: 300 }, () => {
                runOnJS(onComplete)();
              })
            );
          }
        });
      });
    } else if (targetMode === 'personal') {
      setDisplayText('Returning to Vault...');
      connectionProgress.value = 1; // ensure start connected
      pulseScale.value = 1;

      // 1. Fade in overlay
      opacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) }, () => {
        // 2. Midpoint - swap the view while covered
        runOnJS(onMidpoint)();

        // 3. Dots separate
        connectionProgress.value = withSpring(0, { damping: 15, stiffness: 100 }, (finished) => {
          if (finished) {
            // 4. Fade out
            opacity.value = withDelay(
              200,
              withTiming(0, { duration: 300 }, () => {
                runOnJS(onComplete)();
              })
            );
          }
        });
      });
    }
  }, [targetMode]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const leftDotStyle = useAnimatedStyle(() => {
    const tx = interpolate(connectionProgress.value, [0, 1], [-80 * SCALE, -15 * SCALE]);
    return {
      transform: [{ translateX: tx }, { scale: pulseScale.value }],
    };
  });

  const rightDotStyle = useAnimatedStyle(() => {
    const tx = interpolate(connectionProgress.value, [0, 1], [80 * SCALE, 15 * SCALE]);
    return {
      transform: [{ translateX: tx }, { scale: pulseScale.value }],
    };
  });

  // Always render to allow reanimated to work, but disable pointer events when transparent
  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents={targetMode !== null ? 'auto' : 'none'}
    >
      <View style={styles.animationContainer}>
        {/* Left Dot (Crimson) */}
        <Animated.View style={[styles.dot, styles.leftDot, leftDotStyle]} />
        {/* Right Dot (Teal) */}
        <Animated.View style={[styles.dot, styles.rightDot, rightDotStyle]} />
      </View>
      <Text style={styles.text}>{displayText}</Text>
    </Animated.View>
  );
}

const DOT_SIZE = 60 * SCALE;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(237, 234, 220, 0.96)', // Semi-transparent cream
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it's on top of everything
    elevation: 99,
  },
  animationContainer: {
    width: 200 * SCALE,
    height: 100 * SCALE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    position: 'absolute',
  },
  leftDot: {
    backgroundColor: COLORS.mine,
    opacity: 0.9,
    zIndex: 2,
  },
  rightDot: {
    backgroundColor: COLORS.theirs,
    opacity: 0.9,
    zIndex: 1,
  },
  text: {
    marginTop: 20 * SCALE,
    fontFamily: 'JockeyOne',
    fontSize: 24 * SCALE,
    color: COLORS.text,
    letterSpacing: 1 * SCALE,
  },
});
