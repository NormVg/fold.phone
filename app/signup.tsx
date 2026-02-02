import { AuthButton, AuthInput, GoogleSignInButton, OrDivider } from '@/components/auth';
import { AtIcon, LockIcon, UserIcon } from '@/components/icons';
import { OnboardingColors } from '@/constants/theme';
import { authClient } from '@/lib/auth-client';
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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    Keyboard.dismiss();

    // Basic validation
    if (!name.trim()) {
      console.log('Name is required');
      return;
    }
    if (!email.trim()) {
      console.log('Email is required');
      return;
    }
    if (!password) {
      console.log('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/(tabs)',
      });

      if (error) {
        console.error('Signup error:', error.message);
        // Handle error (e.g., show to user)
      } else {
        console.log('Signup successful:', data);
        router.replace('/(tabs)' as any);
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/(tabs)',
      });
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  const handleLogin = () => {
    router.replace('/auth');
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
          <Text style={styles.title}>Join Fold</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Create your private space for raw{'\n'}thoughts, memories, and emotions.
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

            {/* Name Input */}
            <AuthInput
              placeholder="Full Name"
              icon={<UserIcon size={20 * SCALE} color="#810100" />}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            {/* Email Input */}
            <AuthInput
              placeholder="Email"
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

            {/* Confirm Password Input */}
            <AuthInput
              placeholder="Confirm Password"
              icon={<LockIcon size={20 * SCALE} color="#810100" />}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Create Account Button */}
            <View style={styles.buttonContainer}>
              <AuthButton title="Create Account" onPress={handleCreateAccount} />
            </View>

            {/* Bottom Text */}
            <View style={styles.bottomSection}>
              <Text style={styles.bottomText}>
                Already have an account?{' '}
                <Text style={styles.loginLink} onPress={handleLogin}>
                  Login
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
    marginTop: 30 * SCALE,
  },
  logo: {
    width: 100 * SCALE,
    height: 100 * SCALE,
    borderRadius: 20 * SCALE,
  },
  title: {
    fontSize: 48 * SCALE,
    fontFamily: 'SignPainter',
    textAlign: 'center',
    marginTop: 15 * SCALE,
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
    marginTop: 20 * SCALE,
    marginBottom: 20 * SCALE,
  },
  inputSection: {
    marginTop: 0,
  },
  buttonContainer: {
    marginTop: 8 * SCALE,
  },
  bottomSection: {
    marginTop: 25 * SCALE,
    paddingBottom: 20 * SCALE,
  },
  bottomText: {
    fontSize: 14 * SCALE,
    textAlign: 'center',
    color: '#181717',
  },
  loginLink: {
    color: OnboardingColors.primary,
    fontWeight: '500',
  },
});
