import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions
const CARD_WIDTH = 340 * SCALE;

interface VoiceCardProps {
  title?: string; // e.g., "Rant about math"
  time?: string; // e.g., "03:34 PM"
  duration?: string; // e.g., "03:34"
  mood?: string; // e.g., "SAD", "SAT"
  isPlaying?: boolean; // Whether this card's audio is currently playing
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

// Sad face icon - exact from provided SVG
function SadIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.72626 1.44922C6.48478 1.44922 5.27118 1.81736 4.23892 2.50709C3.20667 3.19682 2.40213 4.17716 1.92703 5.32414C1.45194 6.47112 1.32763 7.73322 1.56983 8.95085C1.81203 10.1685 2.40986 11.2869 3.28772 12.1648C4.16558 13.0427 5.28405 13.6405 6.50167 13.8827C7.7193 14.1249 8.9814 14.0006 10.1284 13.5255C11.2754 13.0504 12.2557 12.2458 12.9454 11.2136C13.6352 10.1813 14.0033 8.96774 14.0033 7.72626C14.0015 6.06202 13.3397 4.46645 12.1629 3.28966C10.9861 2.11287 9.3905 1.45098 7.72626 1.44922ZM5.55344 5.79486C5.69669 5.79486 5.83672 5.83734 5.95582 5.91692C6.07493 5.99651 6.16776 6.10962 6.22258 6.24197C6.2774 6.37431 6.29174 6.51994 6.2638 6.66043C6.23585 6.80093 6.16687 6.92998 6.06558 7.03127C5.96429 7.13257 5.83523 7.20155 5.69474 7.22949C5.55424 7.25744 5.40862 7.2431 5.27627 7.18828C5.14393 7.13346 5.03081 7.04063 4.95123 6.92152C4.87164 6.80241 4.82917 6.66238 4.82917 6.51914C4.82917 6.32705 4.90547 6.14282 5.0413 6.007C5.17713 5.87117 5.36135 5.79486 5.55344 5.79486ZM10.3819 11.041C10.2711 11.1049 10.1395 11.1223 10.0159 11.0892C9.89236 11.0562 9.78695 10.9755 9.72284 10.8648C9.27198 10.0856 8.5634 9.65766 7.72626 9.65766C6.88912 9.65766 6.18054 10.0862 5.72968 10.8648C5.69949 10.9225 5.65795 10.9735 5.60754 11.0147C5.55714 11.0559 5.49891 11.0866 5.43637 11.1047C5.37382 11.1228 5.30826 11.1281 5.24361 11.1203C5.17897 11.1124 5.11658 11.0916 5.0602 11.059C5.00382 11.0264 4.95461 10.9828 4.91554 10.9307C4.87647 10.8786 4.84834 10.8191 4.83285 10.7558C4.81736 10.6926 4.81482 10.6269 4.82539 10.5626C4.83596 10.4983 4.85941 10.4369 4.89435 10.3819C5.51542 9.30819 6.54751 8.69196 7.72626 8.69196C8.90502 8.69196 9.93711 9.30759 10.5582 10.3819C10.6221 10.4927 10.6394 10.6244 10.6064 10.7479C10.5733 10.8715 10.4926 10.9769 10.3819 11.041ZM9.89908 7.24341C9.75583 7.24341 9.6158 7.20093 9.4967 7.12135C9.37759 7.04176 9.28476 6.92865 9.22994 6.7963C9.17512 6.66396 9.16078 6.51833 9.18873 6.37784C9.21667 6.23734 9.28565 6.10829 9.38694 6.007C9.48824 5.9057 9.61729 5.83672 9.75778 5.80878C9.89828 5.78083 10.0439 5.79518 10.1762 5.84999C10.3086 5.90481 10.4217 5.99764 10.5013 6.11675C10.5809 6.23586 10.6234 6.37589 10.6234 6.51914C10.6234 6.71123 10.547 6.89545 10.4112 7.03127C10.2754 7.1671 10.0912 7.24341 9.89908 7.24341Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Happy/Satisfied face icon
function HappyIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.72626 1.44922C6.48478 1.44922 5.27118 1.81736 4.23892 2.50709C3.20667 3.19682 2.40213 4.17716 1.92703 5.32414C1.45194 6.47112 1.32763 7.73322 1.56983 8.95085C1.81203 10.1685 2.40986 11.2869 3.28772 12.1648C4.16558 13.0427 5.28405 13.6405 6.50167 13.8827C7.7193 14.1249 8.9814 14.0006 10.1284 13.5255C11.2754 13.0504 12.2557 12.2458 12.9454 11.2136C13.6352 10.1813 14.0033 8.96774 14.0033 7.72626C14.0015 6.06202 13.3397 4.46645 12.1629 3.28966C10.9861 2.11287 9.3905 1.45098 7.72626 1.44922ZM5.55344 5.79486C5.69669 5.79486 5.83672 5.83734 5.95582 5.91692C6.07493 5.99651 6.16776 6.10962 6.22258 6.24197C6.2774 6.37431 6.29174 6.51994 6.2638 6.66043C6.23585 6.80093 6.16687 6.92998 6.06558 7.03127C5.96429 7.13257 5.83523 7.20155 5.69474 7.22949C5.55424 7.25744 5.40862 7.2431 5.27627 7.18828C5.14393 7.13346 5.03081 7.04063 4.95123 6.92152C4.87164 6.80241 4.82917 6.66238 4.82917 6.51914C4.82917 6.32705 4.90547 6.14282 5.0413 6.007C5.17713 5.87117 5.36135 5.79486 5.55344 5.79486ZM10.3819 4.95902C10.4926 5.02289 10.5733 5.12829 10.6064 5.25181C10.6394 5.37533 10.6221 5.50695 10.5582 5.61776C10.0074 6.6917 8.97525 7.30793 7.79649 7.30793C6.61773 7.30793 5.58564 6.6923 5.03458 5.61776C4.97071 5.50695 4.95337 5.37533 4.98635 5.25181C5.01934 5.12829 5.10007 5.02289 5.21088 4.95902C5.32169 4.89515 5.45332 4.87781 5.57683 4.9108C5.70035 4.94378 5.80576 5.02451 5.86963 5.13532C6.32049 5.91393 7.02907 6.34193 7.86621 6.34193C8.70335 6.34193 9.41193 5.91393 9.86279 5.13532C9.9269 5.02475 10.0323 4.94426 10.1558 4.91143C10.2792 4.8786 10.4107 4.89598 10.5213 4.95962L10.3819 4.95902ZM9.89908 7.24341C9.75583 7.24341 9.6158 7.20093 9.4967 7.12135C9.37759 7.04176 9.28476 6.92865 9.22994 6.7963C9.17512 6.66396 9.16078 6.51833 9.18873 6.37784C9.21667 6.23734 9.28565 6.10829 9.38694 6.007C9.48824 5.9057 9.61729 5.83672 9.75778 5.80878C9.89828 5.78083 10.0439 5.79518 10.1762 5.84999C10.3086 5.90481 10.4217 5.99764 10.5013 6.11675C10.5809 6.23586 10.6234 6.37589 10.6234 6.51914C10.6234 6.71123 10.547 6.89545 10.4112 7.03127C10.2754 7.1671 10.0912 7.24341 9.89908 7.24341Z"
        fill="#810100"
      />
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

// Audio waveform visualization component (with gradient)
function AudioWaveform() {
  // Generate random-ish heights for waveform bars
  const barCount = 32;
  const heights = [4, 8, 12, 18, 14, 8, 16, 22, 12, 6, 14, 20, 10, 16, 24, 18, 8, 12, 20, 14, 10, 18, 24, 16, 8, 14, 10, 18, 22, 12, 8, 6];

  return (
    <Svg width={200 * SCALE} height={28 * SCALE} viewBox="0 0 200 28">
      <Defs>
        <LinearGradient id="waveGradient" x1="0" y1="14" x2="200" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#181717" />
          <Stop offset="0.5" stopColor="#810100" />
          <Stop offset="1" stopColor="#810100" />
        </LinearGradient>
      </Defs>
      {Array.from({ length: barCount }, (_, i) => {
        const x = 2 + i * 6.2;
        const h = heights[i % heights.length];
        const y = (28 - h) / 2;
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width="3"
            height={h}
            rx="1.5"
            fill="url(#waveGradient)"
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
  isPlaying = false,
  onPlayPress,
  onSharePress,
  onLocationPress,
  onMoodPress,
}: VoiceCardProps) {
  const MoodIcon = mood === 'SAD' ? SadIcon : HappyIcon;

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
        <AudioWaveform />
        <Text style={styles.durationText}>{duration}</Text>
      </View>

      {/* Bottom section: Action buttons */}
      <View style={styles.bottomSection}>
        {/* Mood button */}
        <Pressable style={styles.actionButton} onPress={onMoodPress}>
          <MoodIcon size={16 * SCALE} />
          <Text style={styles.actionText}>{mood}</Text>
        </Pressable>

        {/* Location button */}
        <Pressable style={styles.actionButton} onPress={onLocationPress}>
          <LocationIcon size={16 * SCALE} />
          <Text style={styles.actionText}>LOCATION</Text>
        </Pressable>

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
