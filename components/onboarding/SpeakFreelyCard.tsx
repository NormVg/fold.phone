import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { MicrophoneIcon } from '../icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

export function SpeakFreelyCard() {
  return (
    <View style={styles.container}>
      {/* Mic icon in top right */}
      <View style={styles.micContainer}>
        <MicrophoneIcon size={20} color={OnboardingColors.textLight} />
      </View>

      {/* Content aligned to BOTTOM */}
      <View style={styles.content}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>VOICE FIRST</Text>
        </View>
        <Text style={styles.title}>Speak Freely</Text>
        <Text style={styles.description}>
          Capture the nuance of you voice.{'\n'}We transcribe it for you
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingColors.cardDark,
    borderRadius: 25 * SCALE,
    width: 350 * SCALE,
    height: 220 * SCALE,
    padding: 24 * SCALE,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end', // Content at BOTTOM
  },
  labelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 6 * SCALE,
    alignSelf: 'flex-start',
    marginBottom: 20 * SCALE,
  },
  label: {
    fontSize: 10 * SCALE,
    fontWeight: '600',
    color: OnboardingColors.textLight,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32 * SCALE,
    fontWeight: '700',
    color: OnboardingColors.textLight,
    marginBottom: 12 * SCALE,
  },
  description: {
    fontSize: 15 * SCALE,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 22 * SCALE,
  },
  micContainer: {
    position: 'absolute',
    top: 24 * SCALE,
    right: 24 * SCALE,
    width: 50 * SCALE,
    height: 50 * SCALE,
    borderRadius: 25 * SCALE,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
