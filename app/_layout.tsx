import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { TimelineProvider } from '@/lib/timeline-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

// Protected route wrapper
// Flow: onboarding (first time) → auth/signup → (tabs)
function useProtectedRoute() {
  const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything while loading or if onboarding status not yet determined
    if (isLoading || hasSeenOnboarding === null) return;

    const currentRoute = segments[0];

    // Wait for router to be ready (segments populated) before making navigation decisions
    if (currentRoute === undefined) return;

    const isOnboarding = currentRoute === 'onboarding';
    const isAuthScreen = currentRoute === 'auth' || currentRoute === 'signup';

    console.log('[NAV] Route check:', { currentRoute, isAuthenticated, hasSeenOnboarding, isOnboarding, isAuthScreen });

    // First time user - show onboarding (don't redirect if already there)
    if (!hasSeenOnboarding) {
      if (!isOnboarding) {
        console.log('[NAV] First time user, redirecting to onboarding');
        router.replace('/onboarding');
      }
      return;
    }

    // Has seen onboarding but not authenticated - go to auth (don't redirect if already on auth screens)
    if (!isAuthenticated && !isAuthScreen && !isOnboarding) {
      console.log('[NAV] Not authenticated, redirecting to auth');
      router.replace('/auth');
      return;
    }

    // Authenticated user on auth/onboarding screens - go to app
    if (isAuthenticated && (isAuthScreen || isOnboarding)) {
      console.log('[NAV] Authenticated, redirecting to tabs');
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, segments, isLoading, hasSeenOnboarding]);
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading, hasSeenOnboarding } = useAuth();

  const [fontsLoaded] = useFonts({
    'SignPainter': require('../assets/fonts/SignPainterHouseScript.ttf'),
    'JockeyOne': require('../assets/fonts/JockeyOne-Regular.ttf'),
  });

  // Protect routes based on auth state
  useProtectedRoute();

  useEffect(() => {
    // Only hide splash when fonts loaded AND we know where to navigate
    if (fontsLoaded && !isLoading && hasSeenOnboarding !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading, hasSeenOnboarding]);

  // Hide Android navigation bar for immersive experience
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  if (!fontsLoaded || isLoading || hasSeenOnboarding === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="change-password" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="appearance" />
            <Stack.Screen name="help" />
            <Stack.Screen name="about" />
            <Stack.Screen name="story/[id]" />
            <Stack.Screen name="stories" />
            <Stack.Screen name="write-story" />
            <Stack.Screen name="entry-audio" options={{ presentation: 'modal' }} />
            <Stack.Screen name="entry-text" options={{ presentation: 'modal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar hidden={true} />
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TimelineProvider>
        <RootLayoutNav />
      </TimelineProvider>
    </AuthProvider>
  );
}
