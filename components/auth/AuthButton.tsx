import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

interface AuthButtonProps {
  title: string;
  onPress?: () => void;
}

export function AuthButton({ title, onPress }: AuthButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingColors.primary,
    borderRadius: 15 * SCALE,
    height: 60 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18 * SCALE,
    color: 'white',
    fontWeight: '500',
  },
});
