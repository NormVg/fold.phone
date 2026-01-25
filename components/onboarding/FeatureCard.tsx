import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingColors.cardLight,
    borderRadius: 25 * SCALE,
    width: 167 * SCALE,
    height: 220 * SCALE,
    paddingHorizontal: 20 * SCALE,
    paddingTop: 24 * SCALE,
    paddingBottom: 24 * SCALE,
  },
  iconCircle: {
    width: 50 * SCALE,
    height: 50 * SCALE,
    borderRadius: 25 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24 * SCALE,
  },
  title: {
    fontSize: 20 * SCALE,
    fontWeight: '700',
    color: OnboardingColors.textDark,
    marginBottom: 8 * SCALE,
  },
  description: {
    fontSize: 14 * SCALE,
    color: OnboardingColors.textMuted,
    lineHeight: 20 * SCALE,
  },
});
