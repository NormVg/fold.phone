import { GOLDEN_RATIO, TimelineColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

// Base font size for golden ratio calculations
const BASE_FONT_SIZE = 14;
const DATE_FONT_SIZE = Math.round(BASE_FONT_SIZE * GOLDEN_RATIO * GOLDEN_RATIO); // ~37

function ConnectPeopleSmall({ active }: { active: boolean }) {
  const color = active ? '#1A7A7A' : '#810100';
  return (
    <Svg width={20 * SCALE} height={20 * SCALE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface TimelineHeaderProps {
  dayOfWeek: string; // "THURSDAY" - full day name in caps
  date: string; // "Oct 24"
  onProfilePress?: () => void; // Optional callback for profile navigation
  connectMode?: boolean; // Whether connect timeline is active
  onConnectToggle?: () => void; // Toggle connect mode
}

export function TimelineHeader({ dayOfWeek, date, onProfilePress, connectMode, onConnectToggle }: TimelineHeaderProps) {
  const { user } = useAuth();
  
  // Get user's avatar URL (could be 'image' or 'avatar' depending on source)
  const avatarUri = user?.image || user?.avatar;

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.rightSection}>
        {/* Connect toggle button — only rendered when onConnectToggle is provided */}
        {onConnectToggle && (
          <TouchableOpacity
            style={[
              styles.connectButton,
              connectMode && styles.connectButtonActive,
            ]}
            onPress={onConnectToggle}
            activeOpacity={0.7}
          >
            <ConnectPeopleSmall active={!!connectMode} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require('@/assets/images/pfp.png')}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24 * SCALE,
    paddingTop: 10 * SCALE,
  },
  dateContainer: {
    flexDirection: 'column',
  },
  dayOfWeek: {
    fontFamily: 'Inter',
    fontSize: BASE_FONT_SIZE * SCALE,
    fontWeight: '700',
    color: TimelineColors.primary,
    letterSpacing: 1.5,
  },
  date: {
    fontFamily: 'Inter',
    fontSize: DATE_FONT_SIZE * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginTop: 0,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 * SCALE,
  },
  connectButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonActive: {
    backgroundColor: 'rgba(26, 122, 122, 0.15)',
  },
  avatarContainer: {
    width: 49.54 * SCALE,
    height: 49.54 * SCALE,
    borderRadius: 24.77 * SCALE,
    borderWidth: 2,
    borderColor: TimelineColors.avatarStroke,
    overflow: 'hidden',
    backgroundColor: TimelineColors.avatarBackground,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
