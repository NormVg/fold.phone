import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowIcon } from '../icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

interface CTAButtonProps {
  onPress?: () => void;
}

export function CTAButton({ onPress }: CTAButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.text}>Start Capturing</Text>
      <View style={styles.arrowContainer}>
        <ArrowIcon size={19 * SCALE} color={OnboardingColors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingColors.primary,
    borderRadius: 25 * SCALE,
    height: 50 * SCALE, // Exact from design: h=50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20 * SCALE,
  },
  text: {
    fontSize: 28 * SCALE,
    color: OnboardingColors.textLight,
    fontFamily: 'SignPainter', // Use the custom SignPainter font
  },
  arrowContainer: {
    position: 'absolute',
    right: 5 * SCALE,
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
    backgroundColor: OnboardingColors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
