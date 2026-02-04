import { TimelineColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await signOut();
              // The auth context will update hasSeenOnboarding to false
              // and the route protection will redirect to onboarding
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<UserIcon size={20 * SCALE} />}
              label="Edit Profile"
              onPress={() => console.log('Edit Profile')}
            />
            <Divider />
            <SettingsRow
              icon={<LockIcon size={20 * SCALE} />}
              label="Change Password"
              onPress={() => console.log('Change Password')}
            />
            <Divider />
            <SettingsRow
              icon={<ShieldIcon size={20 * SCALE} />}
              label="Privacy"
              onPress={() => console.log('Privacy')}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<BellIcon size={20 * SCALE} />}
              label="Notifications"
              onPress={() => console.log('Notifications')}
            />
            <Divider />
            <SettingsRow
              icon={<PaletteIcon size={20 * SCALE} />}
              label="Appearance"
              onPress={() => console.log('Appearance')}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<HelpIcon size={20 * SCALE} />}
              label="Help & FAQ"
              onPress={() => console.log('Help')}
            />
            <Divider />
            <SettingsRow
              icon={<InfoIcon size={20 * SCALE} />}
              label="About"
              onPress={() => console.log('About')}
            />
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <LogoutIcon size={20 * SCALE} />
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </Text>
        </Pressable>

        {/* App Version */}
        <Text style={styles.versionText}>Fold v1.0.0</Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Settings row component
function SettingsRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingsRow,
        pressed && styles.settingsRowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <ChevronRightIcon size={16 * SCALE} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// Icons
function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 12L10 8L6 4"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UserIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="6" r="4" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M3 18C3 14.134 6.134 11 10 11C13.866 11 17 14.134 17 18"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function LockIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5 9V7C5 4.239 7.239 2 10 2C12.761 2 15 4.239 15 7V9"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M4 9H16C16.552 9 17 9.448 17 10V17C17 17.552 16.552 18 16 18H4C3.448 18 3 17.552 3 17V10C3 9.448 3.448 9 4 9Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function ShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2L3 5V9.5C3 13.64 5.95 17.52 10 18.5C14.05 17.52 17 13.64 17 9.5V5L10 2Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2C7.239 2 5 4.239 5 7V10L3 13H17L15 10V7C15 4.239 12.761 2 10 2Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M8 16C8 17.105 8.895 18 10 18C11.105 18 12 17.105 12 16"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PaletteIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Circle cx="7" cy="8" r="1.5" fill={TimelineColors.primary} />
      <Circle cx="13" cy="8" r="1.5" fill={TimelineColors.primary} />
      <Circle cx="10" cy="13" r="1.5" fill={TimelineColors.primary} />
    </Svg>
  );
}

function HelpIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M7.5 7.5C7.5 6.119 8.619 5 10 5C11.381 5 12.5 6.119 12.5 7.5C12.5 8.881 11.381 10 10 10V11.5"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="10" cy="14" r="1" fill={TimelineColors.primary} />
    </Svg>
  );
}

function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M10 9V14"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="10" cy="6" r="1" fill={TimelineColors.primary} />
    </Svg>
  );
}

function LogoutIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M7 3H4C3.448 3 3 3.448 3 4V16C3 16.552 3.448 17 4 17H7"
        stroke="#DC2626"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M10 10H17M17 10L14 7M17 10L14 13"
        stroke="#DC2626"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  placeholder: {
    width: 40 * SCALE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 10 * SCALE,
  },
  section: {
    marginBottom: 24 * SCALE,
  },
  sectionTitle: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 8 * SCALE,
    marginLeft: 4 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
  },
  settingsRowPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
  },
  rowLabel: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 48 * SCALE,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10 * SCALE,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingVertical: 14 * SCALE,
    borderRadius: 16 * SCALE,
    marginTop: 8 * SCALE,
  },
  logoutButtonPressed: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
  },
  logoutText: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: '#DC2626',
  },
  versionText: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.3)',
    textAlign: 'center',
    marginTop: 24 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
