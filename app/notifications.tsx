import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
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
import Svg, { Path, Circle } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Check if we're running in Expo Go (notifications not fully supported)
const isExpoGo = Constants.appOwnership === 'expo';

// Lazy import notifications to avoid crash in Expo Go
let Notifications: typeof import('expo-notifications') | null = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
  } catch {
    // expo-notifications not available
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(!isExpoGo);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if (!Notifications) {
      setIsSupported(false);
      return;
    }
    
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      setPushEnabled(status === 'granted');
    } catch (error) {
      console.log('Notifications not supported:', error);
      setIsSupported(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleTogglePush = async (value: boolean) => {
    if (!Notifications) {
      Alert.alert(
        'Not Supported',
        'Push notifications require a development build. They are not available in Expo Go.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (value) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setPushEnabled(true);
          setPermissionStatus(status);
        } else if (status === 'denied') {
          Alert.alert(
            'Notifications Disabled',
            'To enable notifications, please go to your device settings and allow notifications for Fold.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      } catch (error) {
        console.log('Error requesting permissions:', error);
      }
    } else {
      setPushEnabled(false);
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
        {/* Expo Go Warning */}
        {!isSupported && (
          <View style={styles.warningCard}>
            <WarningIcon size={20 * SCALE} />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Limited in Expo Go</Text>
              <Text style={styles.warningText}>
                Push notifications require a development build. Your preferences will be saved for when you install the full app.
              </Text>
            </View>
          </View>
        )}

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
                    {!isSupported 
                      ? 'Requires development build'
                      : permissionStatus === 'denied' 
                        ? 'Blocked in device settings' 
                        : 'Receive push notifications'}
                  </Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handleTogglePush}
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
            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <ClockIcon size={20 * SCALE} />
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.rowLabel, !pushEnabled && styles.textDisabled]}>
                    Daily Reminder
                  </Text>
                  <Text style={[styles.rowDescription, !pushEnabled && styles.textDisabled]}>
                    Reminder to capture your daily thoughts
                  </Text>
                </View>
              </View>
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                disabled={!pushEnabled}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: 'rgba(129, 1, 0, 0.3)' }}
                thumbColor={dailyReminder && pushEnabled ? TimelineColors.primary : '#f4f3f4'}
                ios_backgroundColor="rgba(0,0,0,0.1)"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <CalendarIcon size={20 * SCALE} />
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.rowLabel, !pushEnabled && styles.textDisabled]}>
                    Weekly Digest
                  </Text>
                  <Text style={[styles.rowDescription, !pushEnabled && styles.textDisabled]}>
                    Summary of your weekly memories
                  </Text>
                </View>
              </View>
              <Switch
                value={weeklyDigest}
                onValueChange={setWeeklyDigest}
                disabled={!pushEnabled}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: 'rgba(129, 1, 0, 0.3)' }}
                thumbColor={weeklyDigest && pushEnabled ? TimelineColors.primary : '#f4f3f4'}
                ios_backgroundColor="rgba(0,0,0,0.1)"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <TrophyIcon size={20 * SCALE} />
                <View style={styles.rowTextContainer}>
                  <Text style={[styles.rowLabel, !pushEnabled && styles.textDisabled]}>
                    Achievements
                  </Text>
                  <Text style={[styles.rowDescription, !pushEnabled && styles.textDisabled]}>
                    Celebrate milestones and badges
                  </Text>
                </View>
              </View>
              <Switch
                value={achievements}
                onValueChange={setAchievements}
                disabled={!pushEnabled}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: 'rgba(129, 1, 0, 0.3)' }}
                thumbColor={achievements && pushEnabled ? TimelineColors.primary : '#f4f3f4'}
                ios_backgroundColor="rgba(0,0,0,0.1)"
              />
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon size={20 * SCALE} />
          <Text style={styles.infoText}>
            Notification preferences are stored locally on this device. You can change system notification permissions in your device settings.
          </Text>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
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

function WarningIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2L18 17H2L10 2Z"
        stroke="#B45309"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path d="M10 8V11" stroke="#B45309" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="10" cy="14" r="1" fill="#B45309" />
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
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12 * SCALE,
    backgroundColor: 'rgba(180, 83, 9, 0.1)',
    borderRadius: 12 * SCALE,
    padding: 16 * SCALE,
    marginBottom: 24 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(180, 83, 9, 0.2)',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14 * SCALE,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4 * SCALE,
  },
  warningText: {
    fontSize: 13 * SCALE,
    color: '#B45309',
    lineHeight: 18 * SCALE,
  },
  section: {
    marginBottom: 24 * SCALE,
  },
  sectionDisabled: {
    opacity: 0.5,
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
  bottomPadding: {
    height: 40 * SCALE,
  },
});
