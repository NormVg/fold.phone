import { AuthButton, AuthInput, GoogleSignInButton, OrDivider } from '@/components/auth';
import { AtIcon, LockIcon } from '@/components/icons';
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

export default function AuthScreen() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEnterFold = async () => {
    Keyboard.dismiss();

    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login Failed', error.message || 'Invalid credentials');
      } else {
        console.log('Login successful:', data?.user);
        // Refresh auth context to update state
        await refreshAuth();
        router.replace('/(tabs)' as any);
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
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

  const handleCreateAccount = () => {
    router.replace('/signup' as any);
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
            <GoogleSignInButton 
              onPress={handleGoogleSignIn} 
              disabled={isGoogleLoading || isLoading}
            />

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
