import {
  AppConfig,
  ProfileStats,
  getAppConfig,
  getProfileStats,
  getUserSettings,
  updateUserSettings,
} from '@/lib/api';
import { create } from 'zustand';
import { useAuthStore } from './auth-store';

interface SettingsState {
  // User preferences (synced to backend)
  autoLocation: boolean;
  isSettingsLoading: boolean;

  // App config (from backend, read-only)
  appConfig: AppConfig | null;

  // Profile stats (from backend, read-only)
  profileStats: ProfileStats | null;
  isStatsLoading: boolean;

  // Actions
  updateAutoLocation: (value: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  /** Called from StoreInitializer when auth state changes */
  loadAll: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  autoLocation: false,
  isSettingsLoading: true,
  appConfig: null,
  profileStats: null,
  isStatsLoading: true,

  loadAll: async () => {
    set({ isSettingsLoading: true, isStatsLoading: true });

    // App config is public — always fetch
    const configResult = await getAppConfig();
    if (configResult.data) {
      set({ appConfig: configResult.data });
    }

    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      set({ isSettingsLoading: false, isStatsLoading: false });
      return;
    }

    // Fetch user settings and profile stats in parallel
    const [settingsResult, statsResult] = await Promise.all([
      getUserSettings(),
      getProfileStats(),
    ]);

    if (settingsResult.data) {
      set({ autoLocation: settingsResult.data.autoLocation });
    }
    set({ isSettingsLoading: false });

    if (statsResult.data) {
      set({ profileStats: statsResult.data });
    }
    set({ isStatsLoading: false });
  },

  updateAutoLocation: async (value: boolean) => {
    const prev = get().autoLocation;
    // Optimistic update
    set({ autoLocation: value });
    const result = await updateUserSettings({ autoLocation: value });
    if (result.error) {
      // Revert on failure
      set({ autoLocation: prev });
      console.error('Failed to update autoLocation setting:', result.error);
    }
  },

  refresh: async () => {
    await get().loadAll();
  },
}));

// Compatibility shim — keeps existing consumers working without any import changes
export function useSettings() {
  return useSettingsStore();
}
