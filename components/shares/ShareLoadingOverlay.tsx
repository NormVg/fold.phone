import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

interface ShareLoadingOverlayProps {
  visible: boolean;
}

/**
 * A small floating toast/pill that appears at the bottom of the screen
 * while a share link is being generated. Slides up when visible,
 * slides down when hidden.
 */
export function ShareLoadingOverlay({ visible }: ShareLoadingOverlayProps) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
      pointerEvents="none"
    >
      <View style={styles.pill}>
        <ActivityIndicator size="small" color="#810100" />
        <Text style={styles.text}>Creating share link...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100 * SCALE,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
    backgroundColor: '#FDFBF7',
    paddingHorizontal: 20 * SCALE,
    paddingVertical: 12 * SCALE,
    borderRadius: 24 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  text: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: '#810100',
    letterSpacing: 0.2,
  },
});
