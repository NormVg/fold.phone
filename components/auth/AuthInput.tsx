import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

interface AuthInputProps {
  placeholder: string;
  icon: React.ReactNode;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onFocus?: () => void;
}

export function AuthInput({
  placeholder,
  icon,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onFocus,
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={onFocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: OnboardingColors.cardBackground,
    borderRadius: 15 * SCALE,
    height: 60 * SCALE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 8 * SCALE,
  },
  iconContainer: {
    marginRight: 15 * SCALE,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: 'black',
  },
});
