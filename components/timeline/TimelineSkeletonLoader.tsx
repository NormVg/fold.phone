import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;
const CARD_WIDTH = 340 * SCALE;

function ShimmerBar({
  width,
  height,
  borderRadius,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: borderRadius ?? height / 2,
          backgroundColor: '#D6D3C7',
          opacity,
        },
        style,
      ]}
    />
  );
}

/** Skeleton that mimics a text entry card */
function TextSkeleton() {
  return (
    <View style={styles.card}>
      {/* Time + mood row */}
      <View style={styles.topRow}>
        <ShimmerBar width={60 * SCALE} height={10 * SCALE} />
        <ShimmerBar width={28 * SCALE} height={28 * SCALE} borderRadius={14 * SCALE} />
      </View>
      {/* Text lines */}
      <ShimmerBar width="100%" height={12 * SCALE} style={{ marginTop: 14 * SCALE }} />
      <ShimmerBar width="85%" height={12 * SCALE} style={{ marginTop: 8 * SCALE }} />
      <ShimmerBar width="60%" height={12 * SCALE} style={{ marginTop: 8 * SCALE }} />
    </View>
  );
}

/** Skeleton that mimics a photo entry card */
function PhotoSkeleton() {
  return (
    <View style={[styles.card, { padding: 0, overflow: 'hidden' as const }]}>
      {/* Image placeholder */}
      <ShimmerBar
        width="100%"
        height={200 * SCALE}
        borderRadius={0}
      />
      {/* Caption area */}
      <View style={{ padding: 14 * SCALE }}>
        <View style={styles.topRow}>
          <ShimmerBar width={60 * SCALE} height={10 * SCALE} />
          <ShimmerBar width={28 * SCALE} height={28 * SCALE} borderRadius={14 * SCALE} />
        </View>
        <ShimmerBar width="70%" height={12 * SCALE} style={{ marginTop: 10 * SCALE }} />
      </View>
    </View>
  );
}

/** Skeleton that mimics a voice entry card */
function VoiceSkeleton() {
  return (
    <View style={styles.card}>
      {/* Time + mood row */}
      <View style={styles.topRow}>
        <ShimmerBar width={60 * SCALE} height={10 * SCALE} />
        <ShimmerBar width={28 * SCALE} height={28 * SCALE} borderRadius={14 * SCALE} />
      </View>
      {/* Waveform placeholder */}
      <View style={styles.waveRow}>
        <ShimmerBar width={36 * SCALE} height={36 * SCALE} borderRadius={18 * SCALE} />
        <ShimmerBar width={220 * SCALE} height={24 * SCALE} borderRadius={12 * SCALE} />
      </View>
      <ShimmerBar width={40 * SCALE} height={10 * SCALE} style={{ marginTop: 8 * SCALE }} />
    </View>
  );
}

/**
 * Renders 3 skeleton cards that simulate loading timeline entries.
 * Vary the shapes so it doesn't look robotic.
 */
export function TimelineSkeletonLoader() {
  return (
    <>
      <View style={styles.wrapper}>
        <TextSkeleton />
      </View>
      <View style={styles.wrapper}>
        <PhotoSkeleton />
      </View>
      <View style={styles.wrapper}>
        <VoiceSkeleton />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10 * SCALE,
    marginBottom: 20 * SCALE,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 14 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
    marginTop: 14 * SCALE,
  },
});
