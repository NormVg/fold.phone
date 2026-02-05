import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth-context';

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

  if (!fontsLoaded || isLoading || hasSeenOnboarding === null) {
    return null;
  }

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="change-password" options={{ headerShown: false }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="appearance" options={{ headerShown: false }} />
          <Stack.Screen name="help" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="stories" options={{ headerShown: false }} />
          <Stack.Screen name="new-memory" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </KeyboardProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
