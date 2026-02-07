import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import type { MoodType } from '../mood/MoodPicker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions
const CARD_WIDTH = 340 * SCALE;

interface VoiceCardProps {
  title?: string; // e.g., "Rant about math"
  time?: string; // e.g., "03:34 PM"
  duration?: string; // e.g., "03:34"
  mood?: string; // e.g., "SAD", "SAT"
  location?: string; // e.g., "Mumbai", "New Delhi"
  isPlaying?: boolean; // Whether this card's audio is currently playing
  progress?: number; // Playback progress 0-1
  onPlayPress?: () => void;
  onSharePress?: () => void;
  onLocationPress?: () => void;
  onMoodPress?: () => void;
}

// Mic icon - exact from provided SVG
function MicIcon({ size = 16 }: { size?: number }) {
  const scale = size / 16;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4.82797 7.72505V3.86207C4.82797 3.09368 5.13321 2.35676 5.67655 1.81342C6.21989 1.27009 6.95681 0.964844 7.7252 0.964844C8.4936 0.964844 9.23052 1.27009 9.77386 1.81342C10.3172 2.35676 10.6224 3.09368 10.6224 3.86207V7.72505C10.6224 8.49344 10.3172 9.23036 9.77386 9.7737C9.23052 10.317 8.4936 10.6223 7.7252 10.6223C6.95681 10.6223 6.21989 10.317 5.67655 9.7737C5.13321 9.23036 4.82797 8.49344 4.82797 7.72505ZM12.5539 7.72505C12.5539 7.59698 12.503 7.47416 12.4125 7.38361C12.3219 7.29305 12.1991 7.24218 12.071 7.24218C11.943 7.24218 11.8202 7.29305 11.7296 7.38361C11.6391 7.47416 11.5882 7.59698 11.5882 7.72505C11.5882 8.74957 11.1812 9.73214 10.4567 10.4566C9.73229 11.181 8.74973 11.588 7.7252 11.588C6.70068 11.588 5.71812 11.181 4.99367 10.4566C4.26922 9.73214 3.86223 8.74957 3.86223 7.72505C3.86223 7.59698 3.81135 7.47416 3.7208 7.38361C3.63024 7.29305 3.50742 7.24218 3.37936 7.24218C3.25129 7.24218 3.12847 7.29305 3.03791 7.38361C2.94736 7.47416 2.89648 7.59698 2.89648 7.72505C2.89795 8.92169 3.34309 10.0753 4.14582 10.9627C4.94855 11.8502 6.05184 12.4085 7.24233 12.5296V14.4853C7.24233 14.6133 7.29321 14.7361 7.38376 14.8267C7.47432 14.9173 7.59714 14.9681 7.7252 14.9681C7.85327 14.9681 7.97609 14.9173 8.06665 14.8267C8.1572 14.7361 8.20808 14.6133 8.20808 14.4853V12.5296C9.39857 12.4085 10.5019 11.8502 11.3046 10.9627C12.1073 10.0753 12.5525 8.92169 12.5539 7.72505Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Play button icon (smaller, for inside waveform)
function PlayIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Circle cx="18" cy="18" r="17" fill="#181717" stroke="#181717" strokeWidth="1" />
      <Path
        d="M14 12L26 18L14 24V12Z"
        fill="#FDFBF7"
      />
    </Svg>
  );
}

// Pause button icon
function PauseIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Circle cx="18" cy="18" r="17" fill="#810100" stroke="#810100" strokeWidth="1" />
      <Rect x="12" y="10" width="4" height="16" rx="1" fill="#FDFBF7" />
      <Rect x="20" y="10" width="4" height="16" rx="1" fill="#FDFBF7" />
    </Svg>
  );
}

// Small inline mood icons for timeline cards (all 5 moods)
function VSadSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Circle face */}
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#DCBCBC"
        stroke="#181717"
        strokeWidth={0.8}
      />
      {/* Sad mouth */}
      <Path d="M5.5 11c.7-.8 1.5-1 2.5-1s1.8.2 2.5 1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      {/* Tears */}
      <Path d="M4.5 7v3M11.5 7v3" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
      {/* Eyebrows */}
      <Path d="M4.5 5.5l1.5.5M11.5 5.5l-1.5.5" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

function SadSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Circle face */}
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#E5D4D4"
        stroke="#181717"
        strokeWidth={0.8}
      />
      {/* Sad mouth */}
      <Path d="M5.5 11c.7-.8 1.5-1 2.5-1s1.8.2 2.5 1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      {/* Eyes */}
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

function NormalSmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Circle face */}
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#E5E3D4"
        stroke="#181717"
        strokeWidth={0.8}
      />
      {/* Neutral mouth */}
      <Path d="M5.5 10h5" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      {/* Eyes */}
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

function HappySmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Circle face */}
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#D4E5D5"
        stroke="#181717"
        strokeWidth={0.8}
      />
      {/* Happy mouth */}
      <Path d="M5.5 9.5c.7.8 1.5 1 2.5 1s1.8-.2 2.5-1" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      {/* Eyes */}
      <Circle cx="5.5" cy="6.5" r="0.8" fill="#181717" />
      <Circle cx="10.5" cy="6.5" r="0.8" fill="#181717" />
    </Svg>
  );
}

function VHappySmallIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Circle face */}
      <Path
        d="M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
        fill="#BCDCBE"
        stroke="#181717"
        strokeWidth={0.8}
      />
      {/* Big smile */}
      <Path d="M5 9c0 0 1 2.5 3 2.5s3-2.5 3-2.5" stroke="#181717" strokeWidth={0.8} strokeLinecap="round" />
      {/* Happy eyes (curved) */}
      <Path d="M4.5 6c.5-.5 1.5-.5 2 0" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
      <Path d="M9.5 6c.5-.5 1.5-.5 2 0" stroke="#181717" strokeWidth={0.6} strokeLinecap="round" />
    </Svg>
  );
}

// Location icon - exact from provided SVG
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

// Share/forward icon - exact from provided SVG
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

// Audio waveform visualization component (with progress)
function AudioWaveform({ isPlaying = false, progress = 0 }: { isPlaying?: boolean; progress?: number }) {
  // Generate random-ish heights for waveform bars
  const barCount = 32;
  const heights = [4, 8, 12, 18, 14, 8, 16, 22, 12, 6, 14, 20, 10, 16, 24, 18, 8, 12, 20, 14, 10, 18, 24, 16, 8, 14, 10, 18, 22, 12, 8, 6];
  const progressIndex = Math.floor(progress * barCount);

  return (
    <Svg width={200 * SCALE} height={28 * SCALE} viewBox="0 0 200 28">
      <Defs>
        <LinearGradient id="waveGradient" x1="0" y1="14" x2="200" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#181717" />
          <Stop offset="0.5" stopColor="#810100" />
          <Stop offset="1" stopColor="#810100" />
        </LinearGradient>
        <LinearGradient id="playedGradient" x1="0" y1="14" x2="200" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#810100" />
          <Stop offset="1" stopColor="#810100" />
        </LinearGradient>
        <LinearGradient id="unplayedGradient" x1="0" y1="14" x2="200" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#CCC" />
          <Stop offset="1" stopColor="#AAA" />
        </LinearGradient>
      </Defs>
      {Array.from({ length: barCount }, (_, i) => {
        const x = 2 + i * 6.2;
        const h = heights[i % heights.length];
        const y = (28 - h) / 2;
        // Color bars based on progress when playing
        const isPlayed = isPlaying && i <= progressIndex;
        const fillColor = isPlaying ? (isPlayed ? 'url(#playedGradient)' : 'url(#unplayedGradient)') : 'url(#waveGradient)';
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width="3"
            height={h}
            rx="1.5"
            fill={fillColor}
          />
        );
      })}
    </Svg>
  );
}

export function VoiceCard({
  title = 'Recording',
  time = '03:34 PM',
  duration = '03:34',
  mood = 'SAD',
  location,
  isPlaying = false,
  progress = 0,
  onPlayPress,
  onSharePress,
  onLocationPress,
  onMoodPress,
}: VoiceCardProps) {
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
    <View style={styles.card}>
      {/* Top section: Mic icon + Title + Time */}
      <View style={styles.topSection}>
        <View style={styles.titleRow}>
          <View style={styles.micCircle}>
            <MicIcon size={16 * SCALE} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>

      {/* Middle section: Play button + Waveform + Duration */}
      <View style={styles.waveformContainer}>
        <Pressable onPress={onPlayPress} style={styles.playButton}>
          {isPlaying ? <PauseIcon size={36 * SCALE} /> : <PlayIcon size={36 * SCALE} />}
        </Pressable>
        <AudioWaveform isPlaying={isPlaying} progress={progress} />
        <Text style={styles.durationText}>{duration}</Text>
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
    </View>
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
    marginBottom: 10 * SCALE,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  micCircle: {
    width: 28 * SCALE,
    height: 28 * SCALE,
    borderRadius: 14 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: '#181717',
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
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEADC',
    borderRadius: 24 * SCALE,
    paddingHorizontal: 6 * SCALE,
    paddingVertical: 6 * SCALE,
    marginBottom: 10 * SCALE,
  },
  playButton: {
    marginRight: 8 * SCALE,
  },
  durationText: {
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: '#666',
    marginLeft: 'auto',
    marginRight: 8 * SCALE,
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

export default VoiceCard;
