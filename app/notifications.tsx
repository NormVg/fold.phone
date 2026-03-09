import { TimelineColors } from '@/constants/theme';
import { apiRequest } from '@/lib/api';
import { registerPushToken } from '@/lib/store/notification-store';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
// @ts-ignore
import config from '../fold.config.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Notification type from config
type NotificationType = {
  id: string;
  label: string;
  description: string;
  icon: string;
  defaultEnabled: boolean;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  // Initialize notification states from config defaults
  const notificationTypes: NotificationType[] = config.notifications.types;
  const [notificationStates, setNotificationStates] = useState<Record<string, boolean>>(
    notificationTypes.reduce((acc: Record<string, boolean>, type: NotificationType) => {
      acc[type.id] = type.defaultEnabled;
      return acc;
    }, {})
  );

  // Check actual permission status on mount
  useEffect(() => {
    if (isExpoGo) {
      setPermissionChecked(true);
      return;
    }
    (async () => {
      try {
        const Notifications = require('expo-notifications');
        const { status } = await Notifications.getPermissionsAsync();
        setPushEnabled(status === 'granted');
      } catch {
        // Module not available
      }
      setPermissionChecked(true);
    })();
  }, []);

  const toggleNotification = (id: string, value: boolean) => {
    setNotificationStates(prev => ({ ...prev, [id]: value }));
  };

  // Icon mapping
  const getIcon = (iconName: string, size: number) => {
    switch (iconName) {
      case 'clock': return <ClockIcon size={size} />;
      case 'calendar': return <CalendarIcon size={size} />;
      case 'bell': return <BellIcon size={size} />;
      case 'trophy': return <TrophyIcon size={size} />;
      default: return <BellIcon size={size} />;
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleTogglePush = async (value: boolean) => {
    if (isExpoGo) {
      Alert.alert(
        'Not Available',
        'Push notifications require a development build and are not available in Expo Go.'
      );
      return;
    }

    if (value) {
      try {
        const Notifications = require('expo-notifications');
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus === 'granted') {
          setPushEnabled(true);
          await registerPushToken();
          return;
        }

        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setPushEnabled(true);
          await registerPushToken();
        } else {
          Alert.alert(
            'Permission Denied',
            'To enable notifications, please allow them in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      } catch (error) {
        console.error('[Notifications] Permission error:', error);
      }
    } else {
      Alert.alert(
        'Disable Notifications',
        'To disable push notifications, go to your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <View style={styles.card}>
            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <BellIcon size={20 * SCALE} />
                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowLabel}>Enable Notifications</Text>
                  <Text style={styles.rowDescription}>
                    {isExpoGo ? 'Requires development build' : 'Receive push notifications'}
                  </Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handleTogglePush}
                disabled={!permissionChecked}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: 'rgba(129, 1, 0, 0.3)' }}
                thumbColor={pushEnabled ? TimelineColors.primary : '#f4f3f4'}
                ios_backgroundColor="rgba(0,0,0,0.1)"
              />
            </View>
          </View>
        </View>

        {/* Notification Types Section */}
        <View style={[styles.section, !pushEnabled && styles.sectionDisabled]}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.card}>
            {notificationTypes.map((type: NotificationType, index: number) => (
              <React.Fragment key={type.id}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.settingsRow}>
                  <View style={styles.rowLeft}>
                    {getIcon(type.icon, 20 * SCALE)}
                    <View style={styles.rowTextContainer}>
                      <Text style={[styles.rowLabel, !pushEnabled && styles.textDisabled]}>
                        {type.label}
                      </Text>
                      <Text style={[styles.rowDescription, !pushEnabled && styles.textDisabled]}>
                        {type.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={notificationStates[type.id]}
                    onValueChange={(value) => toggleNotification(type.id, value)}
                    disabled={!pushEnabled}
                    trackColor={{ false: 'rgba(0,0,0,0.1)', true: 'rgba(129, 1, 0, 0.3)' }}
                    thumbColor={notificationStates[type.id] && pushEnabled ? TimelineColors.primary : '#f4f3f4'}
                    ios_backgroundColor="rgba(0,0,0,0.1)"
                  />
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon size={20 * SCALE} />
          <Text style={styles.infoText}>
            {config.infoMessages.notifications}
          </Text>
        </View>

        {/* Test Button — remove for production */}
        <Pressable
          style={[styles.testButton, !pushEnabled && { opacity: 0.4 }]}
          disabled={!pushEnabled}
          onPress={async () => {
            const { error } = await apiRequest('/api/config/test-notification', { method: 'POST' });
            if (error) Alert.alert('Error', error);
            else Alert.alert('Sent', 'Check your notification tray!');
          }}
        >
          <Text style={styles.testButtonText}>Send Test Push Notification</Text>
        </Pressable>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper: get icon for notification type
function getNotificationIcon(type: string) {
  switch (type) {
    case 'connection_request':
    case 'connection_accepted':
    case 'connection_ended':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
            stroke={TimelineColors.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke={TimelineColors.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'memory_shared':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
            stroke={TimelineColors.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    default:
      return <BellIcon size={18} />;
  }
}

// Helper: relative timestamp
function getRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoDate).toLocaleDateString();
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

function ClockIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M10 5V10L13 12"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 6C3 4.895 3.895 4 5 4H15C16.105 4 17 4.895 17 6V16C17 17.105 16.105 18 15 18H5C3.895 18 3 17.105 3 16V6Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
      <Path d="M3 8H17" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M7 2V4" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M13 2V4" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function TrophyIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M6 3H14V8C14 10.209 12.209 12 10 12C7.791 12 6 10.209 6 8V3Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
      <Path d="M10 12V15" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M7 18H13" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path
        d="M6 5H4C3.448 5 3 5.448 3 6V7C3 8.105 3.895 9 5 9H6"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
      <Path
        d="M14 5H16C16.552 5 17 5.448 17 6V7C17 8.105 16.105 9 15 9H14"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M10 9V14" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="10" cy="6" r="1" fill={TimelineColors.primary} />
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
  content: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 10 * SCALE,
  },
  section: {
    marginBottom: 24 * SCALE,
  },
  sectionDisabled: {
    opacity: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * SCALE,
    marginHorizontal: 4 * SCALE,
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
  markAllReadText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: TimelineColors.primary,
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
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
    flex: 1,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  rowDescription: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2 * SCALE,
  },
  textDisabled: {
    color: 'rgba(0,0,0,0.3)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 48 * SCALE,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.05)',
    borderRadius: 12 * SCALE,
    padding: 16 * SCALE,
    marginTop: 8 * SCALE,
  },
  infoText: {
    flex: 1,
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20 * SCALE,
  },
  // Notification center styles
  emptyCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 32 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
    marginTop: 12 * SCALE,
  },
  emptySubtext: {
    fontSize: 13 * SCALE,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 4 * SCALE,
    textAlign: 'center',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
    gap: 12 * SCALE,
  },
  notificationUnread: {
    backgroundColor: 'rgba(129, 1, 0, 0.03)',
  },
  notificationIcon: {
    width: 36 * SCALE,
    height: 36 * SCALE,
    borderRadius: 10 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  notificationTitleUnread: {
    fontWeight: '600',
  },
  notificationBody: {
    fontSize: 13 * SCALE,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2 * SCALE,
    lineHeight: 17 * SCALE,
  },
  notificationTime: {
    fontSize: 11 * SCALE,
    color: 'rgba(0,0,0,0.35)',
    marginTop: 4 * SCALE,
  },
  unreadDot: {
    width: 8 * SCALE,
    height: 8 * SCALE,
    borderRadius: 4 * SCALE,
    backgroundColor: TimelineColors.primary,
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: 14 * SCALE,
    marginTop: 12 * SCALE,
  },
  clearButtonText: {
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.4)',
  },
  testButton: {
    alignItems: 'center',
    paddingVertical: 14 * SCALE,
    paddingHorizontal: 24 * SCALE,
    marginTop: 8 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
    borderRadius: 12 * SCALE,
  },
  testButtonText: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
