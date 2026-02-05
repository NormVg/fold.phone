import { TimelineColors } from '@/constants/theme';
import { changePassword } from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Svg, { Path, Circle } from 'react-native-svg';
// @ts-ignore
import config from '../fold.config.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const isFormValid = () => {
    return (
      currentPassword.length >= 1 &&
      newPassword.length >= 8 &&
      confirmPassword === newPassword
    );
  };

  const handleSave = async () => {
    // Validate
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setIsSaving(true);

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
      });

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      Alert.alert('Success', 'Your password has been changed successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton} disabled={isSaving}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Change Password</Text>
        <Pressable
          onPress={handleSave}
          style={[styles.saveButton, (!isFormValid() || isSaving) && styles.saveButtonDisabled]}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={TimelineColors.primary} />
          ) : (
            <Text style={[styles.saveText, !isFormValid() && styles.saveTextDisabled]}>Save</Text>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Current Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Current Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="rgba(0,0,0,0.3)"
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSaving}
              />
              <Pressable
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                <EyeIcon size={20 * SCALE} visible={showCurrentPassword} />
              </Pressable>
            </View>
          </View>

          {/* New Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="rgba(0,0,0,0.3)"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSaving}
              />
              <Pressable
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                <EyeIcon size={20 * SCALE} visible={showNewPassword} />
              </Pressable>
            </View>
            <Text style={styles.fieldHint}>Must be at least 8 characters</Text>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Confirm New Password</Text>
            <View style={[
              styles.inputContainer,
              confirmPassword.length > 0 && confirmPassword !== newPassword && styles.inputError,
            ]}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="rgba(0,0,0,0.3)"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSaving}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <EyeIcon size={20 * SCALE} visible={showConfirmPassword} />
              </Pressable>
            </View>
            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
              <Text style={styles.fieldError}>Passwords do not match</Text>
            )}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon size={20 * SCALE} />
          <Text style={styles.infoText}>
            {config.infoMessages.password}
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// Icons
function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon({ size = 20, visible = false }: { size?: number; visible?: boolean }) {
  if (visible) {
    return (
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Path
          d="M10 4C5.5 4 2 10 2 10C2 10 5.5 16 10 16C14.5 16 18 10 18 10C18 10 14.5 4 10 4Z"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="10" cy="10" r="3" stroke="rgba(0,0,0,0.4)" strokeWidth={1.5} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 3L17 17"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M10 4C5.5 4 2 10 2 10C2 10 3.5 12.5 6 14.2"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 5.8C16.5 7.5 18 10 18 10C18 10 14.5 16 10 16C9 16 8 15.8 7.2 15.4"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M10 9V14"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="10" cy="6" r="1" fill={TimelineColors.primary} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  saveButton: {
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 8 * SCALE,
    borderRadius: 8 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  saveText: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  saveTextDisabled: {
    color: 'rgba(0,0,0,0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 20 * SCALE,
  },
  formSection: {
    gap: 20 * SCALE,
  },
  fieldContainer: {
    gap: 8 * SCALE,
  },
  fieldLabel: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
    marginLeft: 4 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: TimelineColors.textDark,
    padding: 0,
  },
  eyeButton: {
    padding: 4 * SCALE,
  },
  fieldHint: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.4)',
    marginLeft: 4 * SCALE,
  },
  fieldError: {
    fontSize: 12 * SCALE,
    color: '#DC2626',
    marginLeft: 4 * SCALE,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.05)',
    borderRadius: 12 * SCALE,
    padding: 16 * SCALE,
    marginTop: 32 * SCALE,
  },
  infoText: {
    flex: 1,
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
