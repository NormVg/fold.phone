import { AuthButton, AuthInput, GoogleSignInButton, OrDivider } from '@/components/auth';
import { AtIcon, LockIcon, UserIcon } from '@/components/icons';
import { OnboardingColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'expo-router';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert,
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

// Required for web browser auth session to complete when app reopens
maybeCompleteAuthSession();

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCALE = SCREEN_WIDTH / 393;

export default function SignupScreen() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleCreateAccount = async () => {
    Keyboard.dismiss();

    // Basic validation
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        Alert.alert('Signup Failed', error.message || 'Could not create account');
      } else {
        console.log('Signup successful:', data?.user);
        // Refresh auth context to update state
        await refreshAuth();
        router.replace('/(tabs)' as any);
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // The expoClient plugin automatically handles:
      // 1. Opening the browser via expo-authorization-proxy
      // 2. Managing OAuth state
      // 3. Storing the session cookies
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/', // Relative URL - expoClient converts to fold://
      });

      if (error) {
        console.error('Google sign-in error:', error);
        Alert.alert('Google Sign-In Failed', error.message || 'Could not sign in with Google');
        return;
      }

      // If we get here without error, the plugin handled the OAuth flow
      // Check if we have a session now
      await refreshAuth();
      const { data: sessionData } = await authClient.getSession();
      if (sessionData?.user) {
        console.log('Google login successful:', sessionData.user);
        router.replace('/(tabs)' as any);
      }
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsGoogleLoading(false);
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
            <GoogleSignInButton 
              onPress={handleGoogleSignIn} 
              disabled={isGoogleLoading || isLoading}
            />

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
