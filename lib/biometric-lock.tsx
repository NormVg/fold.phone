import { TimelineColors } from '@/constants/theme';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const STORE_KEY = 'fold_biometric_lock_enabled';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BiometricLockContextValue {
  /** Whether biometric lock is enabled by the user */
  isEnabled: boolean;
  /** Whether the app is currently locked */
  isLocked: boolean;
  /** Whether the device supports biometrics */
  isAvailable: boolean;
  /** The type of biometric available (e.g. "Fingerprint", "Face ID") */
  biometricType: string | null;
  /** Enable biometric lock — prompts biometric first to confirm */
  enable: () => Promise<boolean>;
  /** Disable biometric lock — prompts biometric first to confirm */
  disable: () => Promise<boolean>;
  /** Trigger authentication to unlock */
  authenticate: () => Promise<boolean>;
}

const BiometricLockContext = createContext<BiometricLockContextValue>({
  isEnabled: false,
  isLocked: false,
  isAvailable: false,
  biometricType: null,
  enable: async () => false,
  disable: async () => false,
  authenticate: async () => false,
});

export const useBiometricLock = () => useContext(BiometricLockContext);

// ─── Helper: get human-readable biometric type ──────────────────────────────

async function getBiometricType(): Promise<string | null> {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  // Prefer fingerprint on Android — many Android devices report both face and
  // fingerprint, but fingerprint is typically the primary biometric.
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return 'Fingerprint';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'Face ID';
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return 'Iris';
  }
  return null;
}

// ─── Lock Screen Overlay ────────────────────────────────────────────────────

function FingerprintIcon({ size = 64 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/images/fingerprint-pattern-1.png')}
      style={{
        width: size,
        height: size,
        tintColor: TimelineColors.primary,
      }}
      resizeMode="contain"
    />
  );
}

function LockScreen({ onUnlock, biometricType }: { onUnlock: () => void; biometricType: string | null }) {
  return (
    <View style={lockStyles.container}>
      <View style={lockStyles.content}>
        <Text style={lockStyles.logo}>Fold</Text>
        <Text style={lockStyles.tagline}>YOUR PRIVATE MEMORY VAULT</Text>

        <View style={lockStyles.divider} />

        <Pressable style={lockStyles.iconCircle} onPress={onUnlock}>
          <FingerprintIcon size={64 * SCALE} />
        </Pressable>

        <Text style={lockStyles.prompt}>
          Tap to unlock with {biometricType ?? 'Biometrics'}
        </Text>

        <Pressable style={lockStyles.unlockButton} onPress={onUnlock}>
          <Text style={lockStyles.unlockButtonText}>Unlock</Text>
        </Pressable>
      </View>
    </View>
  );
}

const lockStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TimelineColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40 * SCALE,
  },
  logo: {
    fontFamily: 'JockeyOne',
    fontSize: 42 * SCALE,
    color: TimelineColors.primary,
    letterSpacing: 2,
    marginBottom: 6 * SCALE,
  },
  tagline: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.35)',
    letterSpacing: 1.5,
    marginBottom: 40 * SCALE,
  },
  divider: {
    width: 48 * SCALE,
    height: 3,
    backgroundColor: TimelineColors.primary,
    borderRadius: 2,
    marginBottom: 40 * SCALE,
  },
  iconCircle: {
    width: 120 * SCALE,
    height: 120 * SCALE,
    borderRadius: 60 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24 * SCALE,
  },
  prompt: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 32 * SCALE,
  },
  unlockButton: {
    backgroundColor: TimelineColors.primary,
    paddingHorizontal: 40 * SCALE,
    paddingVertical: 14 * SCALE,
    borderRadius: 14 * SCALE,
  },
  unlockButtonText: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: '#FDFBF7',
  },
});

// ─── Provider ───────────────────────────────────────────────────────────────

interface BiometricLockProviderProps {
  children: React.ReactNode;
  /** Only show lock when user is authenticated */
  isAuthenticated: boolean;
}

export function BiometricLockProvider({ children, isAuthenticated }: BiometricLockProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const authenticatingRef = useRef(false);
  const coldStartHandled = useRef(false);

  // ── Initialize: check hardware + load saved preference ──
  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const available = hasHardware && isEnrolled;
      setIsAvailable(available);

      if (available) {
        const type = await getBiometricType();
        setBiometricType(type);
      }

      const stored = await SecureStore.getItemAsync(STORE_KEY);
      const enabled = stored === 'true' && available;
      setIsEnabled(enabled);

      setReady(true);
    })();
  }, []);

  // ── Cold start lock: wait for auth to be ready ──
  useEffect(() => {
    if (ready && isEnabled && isAuthenticated && !coldStartHandled.current) {
      coldStartHandled.current = true;
      setIsLocked(true);
    }
  }, [ready, isEnabled, isAuthenticated]);

  // ── AppState: lock when going to background ──
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (
        isEnabled &&
        isAuthenticated &&
        appState.current.match(/active/) &&
        nextState.match(/inactive|background/)
      ) {
        setIsLocked(true);
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [isEnabled, isAuthenticated]);

  // ── Authenticate ──
  const authenticate = useCallback(async (): Promise<boolean> => {
    if (authenticatingRef.current) return false;
    authenticatingRef.current = true;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Fold',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLocked(false);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      authenticatingRef.current = false;
    }
  }, []);

  // ── Auto-prompt on lock ──
  useEffect(() => {
    if (isLocked && isAuthenticated && ready) {
      // Small delay so the lock screen renders first
      const timer = setTimeout(() => {
        authenticate();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLocked, isAuthenticated, ready, authenticate]);

  // ── Enable biometric lock ──
  const enable = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) return false;

    // Verify identity before enabling
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirm to enable biometric lock',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    if (result.success) {
      await SecureStore.setItemAsync(STORE_KEY, 'true');
      setIsEnabled(true);
      return true;
    }
    return false;
  }, [isAvailable]);

  // ── Disable biometric lock ──
  const disable = useCallback(async (): Promise<boolean> => {
    // Verify identity before disabling
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirm to disable biometric lock',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    if (result.success) {
      await SecureStore.setItemAsync(STORE_KEY, 'false');
      setIsEnabled(false);
      setIsLocked(false);
      return true;
    }
    return false;
  }, []);

  const contextValue: BiometricLockContextValue = {
    isEnabled,
    isLocked,
    isAvailable,
    biometricType,
    enable,
    disable,
    authenticate,
  };

  // Don't render lock screen until we've loaded preferences
  if (!ready) {
    return (
      <BiometricLockContext.Provider value={contextValue}>
        {children}
      </BiometricLockContext.Provider>
    );
  }

  return (
    <BiometricLockContext.Provider value={contextValue}>
      {children}
      {isLocked && isAuthenticated && (
        <LockScreen onUnlock={authenticate} biometricType={biometricType} />
      )}
    </BiometricLockContext.Provider>
  );
}
