import { AuthButton, AuthInput, GoogleSignInButton, OrDivider } from '@/components/auth';
import { AtIcon, LockIcon } from '@/components/icons';
import { OnboardingColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEnterFold = () => {
    Keyboard.dismiss();
    console.log('Enter Fold pressed', { email, password });
    router.replace('/(tabs)' as any);
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in pressed');
  };

  const handleCreateAccount = () => {
    console.log('Create account pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={OnboardingColors.background} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={40}
        >
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Fold</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            The private space for you raw{'\n'}thoughts, memories, and emotions.
          </Text>

          {/* E2E Encryption Label */}
          <Text style={styles.encryptionLabel}>
            End - to - End Private
          </Text>

          {/* Input Section */}
          <View style={styles.inputSection}>
            {/* Google Sign-In */}
            <GoogleSignInButton onPress={handleGoogleSignIn} />

            {/* Or Divider */}
            <OrDivider />

            {/* Email Input */}
            <AuthInput
              placeholder="Email or Username"
              icon={<AtIcon size={20 * SCALE} color="#810100" />}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Password Input */}
            <AuthInput
              placeholder="Password"
              icon={<LockIcon size={20 * SCALE} color="#810100" />}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Enter Fold Button */}
            <View style={styles.buttonContainer}>
              <AuthButton title="Enter Fold" onPress={handleEnterFold} />
            </View>

            {/* Bottom Text */}
            <View style={styles.bottomSection}>
              <Text style={styles.bottomText}>
                New here?{' '}
                <Text style={styles.createAccountLink} onPress={handleCreateAccount}>
                  Create Account
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OnboardingColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 17 * SCALE,
    paddingBottom: 40 * SCALE,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40 * SCALE,
  },
  logo: {
    width: 125 * SCALE,
    height: 125 * SCALE,
    borderRadius: 25 * SCALE,
  },
  title: {
    fontSize: 48 * SCALE,
    fontFamily: 'SignPainter',
    textAlign: 'center',
    marginTop: 20 * SCALE,
    color: 'black',
  },
  subtitle: {
    fontSize: 16 * SCALE,
    textAlign: 'center',
    color: 'black',
    marginTop: 8 * SCALE,
    lineHeight: 24 * SCALE,
  },
  encryptionLabel: {
    fontSize: 13 * SCALE,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 25 * SCALE,
    marginBottom: 25 * SCALE,
  },
  inputSection: {
    marginTop: 0,
  },
  buttonContainer: {
    marginTop: 8 * SCALE,
  },
  bottomSection: {
    marginTop: 30 * SCALE,
    paddingBottom: 20 * SCALE,
  },
  bottomText: {
    fontSize: 14 * SCALE,
    textAlign: 'center',
    color: '#181717',
  },
  createAccountLink: {
    color: OnboardingColors.primary,
    fontWeight: '500',
  },
});
