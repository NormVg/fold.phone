import { authClient } from '@/lib/auth-client';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ONBOARDING_KEY = 'fold_onboarding_complete';

interface AuthContextType {
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean | null;
  isLoading: boolean;
  user: any | null;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      // Check onboarding status
      const onboardingComplete = await SecureStore.getItemAsync(ONBOARDING_KEY);
      console.log('[AUTH] Onboarding complete:', onboardingComplete);
      setHasSeenOnboarding(onboardingComplete === 'true');

      // Check session
      const { data } = await authClient.getSession();
      console.log('[AUTH] Session:', data?.user ? 'exists' : 'none');
      setUser(data?.user || null);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setHasSeenOnboarding(false);
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      // Clear onboarding flag
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
      // Update state
      setUser(null);
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  useEffect(() => {
    async function initialize() {
      await refreshAuth();
      setIsLoading(false);
    }
    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        hasSeenOnboarding,
        isLoading,
        user,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
