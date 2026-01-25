import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GoogleIcon } from '../icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

interface GoogleSignInButtonProps {
  onPress?: () => void;
}

export function GoogleSignInButton({ onPress }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <GoogleIcon size={24 * SCALE} />
      </View>
      <Text style={styles.text}>Sign in with Google</Text>
      {/* Empty view for centering */}
      <View style={styles.spacer} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingColors.cardBackground,
    borderRadius: 15 * SCALE,
    height: 60 * SCALE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  iconContainer: {
    width: 40 * SCALE,
  },
  text: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
  },
  spacer: {
    width: 40 * SCALE,
  },
});
