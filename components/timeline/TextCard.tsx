import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { MoodType } from '../mood/MoodPicker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions
const CARD_WIDTH = 340 * SCALE;

interface TextCardProps {
  content: string; // The text content (like a tweet)
  time?: string; // e.g., "03:34 PM"
  mood?: string; // e.g., "SAD", "HAPPY", "V. Sad", "Normal", etc.
  location?: string; // e.g., "Mumbai"
  onPress?: () => void;
  onSharePress?: () => void;
  onLocationPress?: () => void;
  onMoodPress?: () => void;
}

// Text/Note icon
function TextIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M13 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 5H11"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M5 8H11"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M5 11H9"
        stroke="#810100"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Small inline mood icons for timeline cards (all 5 moods)
function VSadSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#DCBCBC"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 11c.7-.8 1.5-1 2.5-1s1.8.2 2.5 1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M4.5 7v3M11.5 7v3" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
      <Path d="M4.5 5.5l1.5.5M11.5 5.5l-1.5.5" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

function SadSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#E5D4D4"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 11c.7-.8 1.5-1 2.5-1s1.8.2 2.5 1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

function NormalSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#E5E3D4"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 10h5" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

function HappySmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#D4E5D5"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5.5 9.5c.7.8 1.5 1 2.5 1s1.8-.2 2.5-1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

function VHappySmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#BCDCBE"
        stroke="#181717"
        strokeWidth={0.8}
      />
      <Path d="M5 9c0 0 1 2.5 3 2.5s3-2.5 3-2.5" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M4.5 6c.5-.5 1.5-.5 2 0" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
      <Path d="M9.5 6c.5-.5 1.5-.5 2 0" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

// Location icon
function LocationIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.48281 10.5621C7.55578 10.6038 7.63836 10.6257 7.72241 10.6257C7.80645 10.6257 7.88904 10.6038 7.962 10.5621C8.10987 10.477 11.5831 8.44978 11.5831 4.83171C11.5528 3.82824 11.1329 2.87601 10.4125 2.1768C9.69212 1.47759 8.7278 1.08633 7.72387 1.08594C6.71995 1.08555 5.75531 1.47605 5.03438 2.1747C4.31344 2.87335 3.89284 3.82525 3.86172 4.82869C3.86172 8.44978 7.33676 10.474 7.48281 10.5621ZM7.72422 3.38025C8.01069 3.38025 8.29073 3.4652 8.52893 3.62436C8.76712 3.78351 8.95277 4.00973 9.0624 4.27439C9.17203 4.53906 9.20071 4.83029 9.14482 5.11126C9.08894 5.39223 8.95099 5.65032 8.74842 5.85289C8.54585 6.05546 8.28776 6.19341 8.0068 6.24929C7.72583 6.30518 7.43459 6.2765 7.16993 6.16687C6.90526 6.05724 6.67904 5.87159 6.51989 5.6334C6.36073 5.3952 6.27578 5.11516 6.27578 4.82869C6.27578 4.44454 6.42838 4.07612 6.70002 3.80449C6.97165 3.53285 7.34007 3.38025 7.72422 3.38025ZM14.4836 11.1052C14.4836 12.987 11.0007 14.0021 7.72422 14.0021C4.44773 14.0021 0.964844 12.987 0.964844 11.1052C0.964844 10.2247 1.76269 9.44498 3.21173 8.91026C3.33056 8.87101 3.46 8.87942 3.57274 8.93374C3.68549 8.98806 3.77274 9.08403 3.8161 9.20143C3.85945 9.31883 3.85553 9.44848 3.80516 9.56304C3.75479 9.6776 3.6619 9.76813 3.54608 9.81554C2.54968 10.1843 1.93047 10.678 1.93047 11.1052C1.93047 11.9115 4.13451 13.0365 7.72422 13.0365C11.3139 13.0365 13.518 11.9115 13.518 11.1052C13.518 10.678 12.8988 10.1843 11.9024 9.81614C11.7865 9.76873 11.6936 9.67821 11.6433 9.56364C11.5929 9.44908 11.589 9.31943 11.6323 9.20203C11.6757 9.08464 11.7629 8.98866 11.8757 8.93435C11.9884 8.88003 12.1179 8.87161 12.2367 8.91087C13.6857 9.44498 14.4836 10.2247 14.4836 11.1052Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Share/forward icon
function ShareIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.3423 7.10213L9.51421 11.9303C9.44668 11.9979 9.36062 12.0439 9.26692 12.0626C9.17321 12.0812 9.07607 12.0717 8.9878 12.0351C8.89953 11.9985 8.8241 11.9366 8.77105 11.8571C8.71801 11.7776 8.68973 11.6842 8.68981 11.5887V9.18848C5.24373 9.38402 2.88097 11.6188 2.21771 12.3268C2.11356 12.438 1.97698 12.5135 1.82741 12.5426C1.67784 12.5717 1.52291 12.5529 1.38465 12.4889C1.24639 12.4248 1.13185 12.3188 1.05734 12.1859C0.982829 12.053 0.952138 11.9 0.969635 11.7486C1.19354 9.80165 2.25995 7.92894 3.97273 6.47568C5.39521 5.26865 7.12429 4.50278 8.68981 4.3688V1.93241C8.68973 1.83686 8.71801 1.74344 8.77105 1.66398C8.8241 1.58451 8.89953 1.52257 8.9878 1.48599C9.07607 1.44942 9.17321 1.43986 9.26692 1.45852C9.36062 1.47718 9.44668 1.52322 9.51421 1.59082L14.3423 6.41895C14.3872 6.46379 14.4228 6.51704 14.4471 6.57565C14.4714 6.63426 14.4839 6.69709 14.4839 6.76054C14.4839 6.82399 14.4714 6.88681 14.4471 6.94543C14.4228 7.00404 14.3872 7.05729 14.3423 7.10213Z"
        fill="#810100"
      />
    </Svg>
  );
}

export function TextCard({
  content,
  time = '03:34 PM',
  mood = 'Normal',
  location,
  onPress,
  onSharePress,
  onLocationPress,
  onMoodPress,
}: TextCardProps) {
  // Map mood types to small inline icons
  const MOOD_ICONS: Record<MoodType, React.FC<{ size?: number }>> = {
    'V. Sad': VSadSmallIcon,
    'Sad': SadSmallIcon,
    'Normal': NormalSmallIcon,
    'Happy': HappySmallIcon,
    'V. Happy': VHappySmallIcon,
  };

  // Get the appropriate mood icon, fallback to NormalSmallIcon if mood not found
  const MoodIcon = MOOD_ICONS[mood as MoodType] || NormalSmallIcon;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Top section: Text icon + Time */}
      <View style={styles.topSection}>
        <View style={styles.iconCircle}>
          <TextIcon size={16 * SCALE} />
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>

      {/* Middle section: Text content */}
      <View style={styles.contentContainer}>
        <Text style={styles.contentText} numberOfLines={6}>
          {content}
        </Text>
      </View>

      {/* Bottom section: Action buttons */}
      <View style={styles.bottomSection}>
        {/* Mood button */}
        <Pressable style={styles.actionButton} onPress={onMoodPress}>
          <MoodIcon size={16 * SCALE} />
          <Text style={styles.actionText}>{mood}</Text>
        </Pressable>

        {/* Location button - only show if location is set */}
        {location && (
          <Pressable style={styles.actionButton} onPress={onLocationPress}>
            <LocationIcon size={16 * SCALE} />
            <Text style={styles.actionText}>{location}</Text>
          </Pressable>
        )}

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Share button */}
        <Pressable style={styles.shareButton} onPress={onSharePress}>
          <ShareIcon size={16 * SCALE} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 14 * SCALE,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12 * SCALE,
  },
  iconCircle: {
    width: 28 * SCALE,
    height: 28 * SCALE,
    borderRadius: 14 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBadge: {
    backgroundColor: '#EDEADC',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 5 * SCALE,
  },
  timeText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  contentContainer: {
    backgroundColor: '#EDEADC',
    borderRadius: 12 * SCALE,
    padding: 14 * SCALE,
    marginBottom: 12 * SCALE,
  },
  contentText: {
    fontSize: 15 * SCALE,
    fontWeight: '400',
    color: '#181717',
    lineHeight: 22 * SCALE,
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEADC',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
    gap: 6 * SCALE,
  },
  shareButton: {
    backgroundColor: '#EDEADC',
    borderRadius: 6 * SCALE,
    padding: 8 * SCALE,
  },
  actionText: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: '#181717',
  },
});

export default TextCard;
