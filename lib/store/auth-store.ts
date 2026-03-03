import { authClient } from '@/lib/auth-client';
import { getProfile } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const ONBOARDING_KEY = 'fold_onboarding_complete';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean | null;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<any>) => void;
  completeOnboarding: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hasSeenOnboarding: null,
  isLoading: true,

  refreshAuth: async () => {
    try {
      const onboardingComplete = await SecureStore.getItemAsync(ONBOARDING_KEY);
      console.log('[AUTH] Onboarding complete:', onboardingComplete);
      set({ hasSeenOnboarding: onboardingComplete === 'true' });

      const { data: sessionData } = await authClient.getSession();
      console.log('[AUTH] Session:', sessionData?.user ? 'exists' : 'none');

      if (sessionData?.user) {
        const { data: profileData, error: profileError } = await getProfile();
        console.log('[AUTH] Profile fetch:', profileData ? 'success' : 'failed', profileError || '');

        if (profileData) {
          const mergedUser = {
            ...sessionData.user,
            ...profileData,
            image: profileData.avatar || profileData.image || null,
            avatar: profileData.avatar || profileData.image || null,
          };
          console.log('[AUTH] User avatar:', mergedUser.image || mergedUser.avatar || 'none');
          set({ user: mergedUser, isAuthenticated: true });
        } else {
          set({ user: sessionData.user, isAuthenticated: true });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      set({ hasSeenOnboarding: false, user: null, isAuthenticated: false });
    }
  },

  initialize: async () => {
    await get().refreshAuth();
    set({ isLoading: false });
  },

  signOut: async () => {
    try {
      await authClient.signOut();
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
      set({ user: null, isAuthenticated: false, hasSeenOnboarding: false });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  completeOnboarding: async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      set({ hasSeenOnboarding: true });
      console.log('[AUTH] Onboarding marked complete');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  updateUser: (userData: Partial<any>) => {
    const prev = get().user;
    if (!prev) return;
    const updated = {
      ...prev,
      ...userData,
      image: userData.avatar || userData.image || prev.image,
      avatar: userData.avatar || userData.image || prev.avatar,
    };
    console.log('[AUTH] User updated directly:', updated.image || updated.avatar);
    set({ user: updated });
  },
}));

// Compatibility shim — keeps existing consumers working without any import changes
export function useAuth() {
  return useAuthStore();
}
