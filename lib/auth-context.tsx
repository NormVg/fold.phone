import { authClient } from '@/lib/auth-client';
import { getProfile } from '@/lib/api';
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
  completeOnboarding: () => Promise<void>;
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

      // Check session first
      const { data: sessionData } = await authClient.getSession();
      console.log('[AUTH] Session:', sessionData?.user ? 'exists' : 'none');
      
      if (sessionData?.user) {
        // Fetch fresh user data from API to get latest profile info
        // This is important because the session may have stale data (like old avatar)
        const { data: profileData, error: profileError } = await getProfile();
        console.log('[AUTH] Profile fetch:', profileData ? 'success' : 'failed', profileError || '');
        
        if (profileData) {
          // Use profile data as source of truth, it's fetched fresh from DB
          const mergedUser = {
            ...sessionData.user,
            ...profileData,
            // Ensure image field is set from fresh profile data
            image: profileData.avatar || profileData.image || null,
            avatar: profileData.avatar || profileData.image || null,
          };
          console.log('[AUTH] User avatar:', mergedUser.image || mergedUser.avatar || 'none');
          setUser(mergedUser);
        } else {
          // Fallback to session data if API fails
          setUser(sessionData.user);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setHasSeenOnboarding(false);
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      // Clear onboarding flag so user sees onboarding again
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
      // Update state immediately
      setUser(null);
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save to SecureStore
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      // Update state immediately so navigation reacts
      setHasSeenOnboarding(true);
      console.log('[AUTH] Onboarding marked complete');
    } catch (error) {
      console.error('Error completing onboarding:', error);
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
        completeOnboarding,
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
