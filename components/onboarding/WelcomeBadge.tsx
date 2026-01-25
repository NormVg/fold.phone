import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SparkleIcon } from '../icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

export function WelcomeBadge() {
  return (
    <View style={styles.container}>
      <SparkleIcon size={14 * SCALE} color={OnboardingColors.primary} />
      <Text style={styles.text}>WELCOME TO FOLD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 23, 23, 0.1)',
    borderRadius: 15 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(24, 23, 23, 0.15)',
    paddingHorizontal: 14 * SCALE,
    paddingVertical: 8 * SCALE,
    gap: 6 * SCALE,
    alignSelf: 'flex-start', // Badge itself is left-aligned within centered container
  },
  text: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: OnboardingColors.textMuted,
    letterSpacing: 0.5,
  },
});
