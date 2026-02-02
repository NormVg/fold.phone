import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions - EXACT from SVG
const CARD_WIDTH = 171 * SCALE;
const CARD_HEIGHT = 144 * SCALE;
const CARD_RADIUS = 20 * SCALE;
const GAP = 16 * SCALE;

// Icon circle - EXACT from SVG
const ICON_CIRCLE_RADIUS = 20 * SCALE; // r="20" from SVG
const ICON_CIRCLE_SIZE = ICON_CIRCLE_RADIUS * 2; // 40px diameter

// Badge dimensions - EXACT from SVG
const BADGE_WIDTH = 48 * SCALE;
const BADGE_HEIGHT = 19 * SCALE;
const BADGE_RADIUS = 9.5 * SCALE;

// Padding - EXACT from SVG positioning
const HORIZONTAL_PADDING = 15 * SCALE;
const VERTICAL_PADDING = 16 * SCALE;

// Colors - EXACT from SVG
const COLORS = {
  cardBackground: '#FDFBF7',
  iconCircle: 'rgba(129, 1, 0, 0.2)', // fill-opacity="0.2" from SVG
  iconColor: '#810100',
  badgeBackground: 'rgba(129, 1, 0, 0.2)', // fill-opacity="0.2" from SVG
  badgeBorder: 'rgba(129, 1, 0, 0.25)', // stroke-opacity="0.25" from SVG
  badgeText: '#810100',
  valueText: '#000',
  labelText: 'rgba(0, 0, 0, 0.5)',
};

interface FoldDataCardsProps {
  streakDays?: number;
  isStreakActive?: boolean;
  audioMinutes?: number;
}

export function FoldDataCards({
  streakDays = 8,
  isStreakActive = true,
  audioMinutes = 43,
}: FoldDataCardsProps) {
  return (
    <View style={styles.container}>
      {/* Streak Card */}
      <View style={styles.card}>
        {/* ACTIVE badge - top left, absolute positioning */}
        {isStreakActive && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ACTIVE</Text>
          </View>
        )}

        {/* Icon circle - top right, absolute positioning */}
        <View style={styles.iconCircle}>
          <FireIcon />
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <Text style={styles.value}>{streakDays}Days</Text>
          <Text style={styles.label}>FOLD STREAK</Text>
        </View>
      </View>

      {/* Audio Card */}
      <View style={styles.card}>
        {/* Icon circle - top right, absolute positioning */}
        <View style={styles.iconCircle}>
          <VoiceIcon />
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <Text style={styles.value}>{audioMinutes}m</Text>
          <Text style={styles.label}>AUDIO LOGGED</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Fire icon - Exact from provided SVG
 * Original viewBox: 0 0 25 25
 */
function FireIcon() {
  const size = 25 * SCALE;
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
      <Path
        d="M17.7577 14.8086C17.5573 15.9275 17.019 16.9581 16.2152 17.7618C15.4114 18.5654 14.3806 19.1035 13.2617 19.3036C13.2192 19.3104 13.1763 19.314 13.1333 19.3142C12.9395 19.3142 12.7528 19.2413 12.6103 19.1101C12.4677 18.9788 12.3797 18.7988 12.3636 18.6057C12.3476 18.4126 12.4047 18.2205 12.5237 18.0675C12.6426 17.9145 12.8147 17.8119 13.0058 17.7798C14.6059 17.5104 15.9635 16.1528 16.2349 14.5498C16.2692 14.3478 16.3824 14.1676 16.5495 14.049C16.7167 13.9304 16.9241 13.883 17.1261 13.9173C17.3282 13.9517 17.5084 14.0648 17.627 14.232C17.7456 14.3991 17.7929 14.6065 17.7586 14.8086H17.7577ZM20.8583 13.9067C20.8583 16.1604 19.963 18.3218 18.3694 19.9154C16.7758 21.5089 14.6145 22.4042 12.3608 22.4042C10.1071 22.4042 7.94573 21.5089 6.35214 19.9154C4.75855 18.3218 3.86328 16.1604 3.86328 13.9067C3.86328 11.2107 4.92547 8.45383 7.01701 5.71339C7.08322 5.62662 7.16706 5.55486 7.26301 5.50284C7.35897 5.45082 7.46486 5.41973 7.5737 5.41161C7.68254 5.40349 7.79187 5.41853 7.89448 5.45573C7.99709 5.49293 8.09065 5.55146 8.169 5.62745L10.4981 7.88798L12.6225 2.05464C12.6649 1.93829 12.7347 1.83386 12.826 1.75014C12.9172 1.66641 13.0273 1.60586 13.1468 1.57358C13.2664 1.5413 13.392 1.53824 13.513 1.56465C13.6339 1.59107 13.7468 1.64619 13.842 1.72536C15.9539 3.47797 20.8583 8.16608 20.8583 13.9067ZM19.3133 13.9067C19.3133 9.45615 15.8573 5.61007 13.6924 3.63923L11.5419 9.5363C11.4978 9.65742 11.4241 9.76557 11.3274 9.85089C11.2308 9.93621 11.1143 9.99599 10.9887 10.0248C10.863 10.0536 10.7322 10.0505 10.608 10.0158C10.4839 9.98104 10.3704 9.9158 10.2779 9.82599L7.73157 7.35592C6.18947 9.58168 5.40828 11.7823 5.40828 13.9067C5.40828 15.7506 6.14077 17.519 7.44462 18.8229C8.74847 20.1267 10.5169 20.8592 12.3608 20.8592C14.2047 20.8592 15.9731 20.1267 17.2769 18.8229C18.5808 17.519 19.3133 15.7506 19.3133 13.9067Z"
        fill="#810100"
      />
    </Svg>
  );
}

/**
 * Voice/Audio icon - Exact from provided SVG
 * Original viewBox: 0 0 20 23
 */
function VoiceIcon() {
  const size = 20 * SCALE;
  return (
    <Svg width={size} height={size * (23/20)} viewBox="0 0 20 23" fill="none">
      <Path
        d="M10.469 0.747801V3.7389C10.469 3.9372 10.39 4.1274 10.25 4.2677C10.11 4.4079 9.92001 4.4867 9.72101 4.4867C9.52301 4.4867 9.33299 4.4079 9.19199 4.2677C9.05199 4.1274 8.97299 3.9372 8.97299 3.7389V0.747801C8.97299 0.549501 9.05199 0.3592 9.19199 0.219C9.33299 0.0787999 9.52301 0 9.72101 0C9.92001 0 10.11 0.0787999 10.25 0.219C10.39 0.3592 10.469 0.549501 10.469 0.747801ZM14.208 4.4867C14.01 4.4867 13.819 4.5655 13.679 4.7057C13.539 4.8459 13.46 5.0361 13.46 5.2345V8.2256C13.46 8.4239 13.539 8.6141 13.679 8.7543C13.819 8.8946 14.01 8.9734 14.208 8.9734C14.406 8.9734 14.596 8.8946 14.737 8.7543C14.877 8.6141 14.956 8.4239 14.956 8.2256V5.2345C14.956 5.0361 14.877 4.8459 14.737 4.7057C14.596 4.5655 14.406 4.4867 14.208 4.4867ZM9.72101 17.9467C9.52301 17.9467 9.33299 18.0255 9.19199 18.1657C9.05199 18.306 8.97299 18.4962 8.97299 18.6945V21.6856C8.97299 21.8839 9.05199 22.0741 9.19199 22.2144C9.33299 22.3546 9.52301 22.4334 9.72101 22.4334C9.92001 22.4334 10.11 22.3546 10.25 22.2144C10.39 22.0741 10.469 21.8839 10.469 21.6856V18.6945C10.469 18.4962 10.39 18.306 10.25 18.1657C10.11 18.0255 9.92001 17.9467 9.72101 17.9467ZM9.72101 6.73C9.52301 6.73 9.33299 6.8088 9.19199 6.949C9.05199 7.0893 8.97299 7.2795 8.97299 7.4778V14.9556C8.97299 15.1539 9.05199 15.3441 9.19199 15.4844C9.33299 15.6246 9.52301 15.7034 9.72101 15.7034C9.92001 15.7034 10.11 15.6246 10.25 15.4844C10.39 15.3441 10.469 15.1539 10.469 14.9556V7.4778C10.469 7.2795 10.39 7.0893 10.25 6.949C10.11 6.8088 9.92001 6.73 9.72101 6.73ZM5.23499 4.4867C5.03599 4.4867 4.84599 4.5655 4.70599 4.7057C4.56599 4.8459 4.487 5.0361 4.487 5.2345V10.4689C4.487 10.6672 4.56599 10.8574 4.70599 10.9977C4.84599 11.1379 5.03599 11.2167 5.23499 11.2167C5.43299 11.2167 5.623 11.1379 5.763 10.9977C5.904 10.8574 5.98199 10.6672 5.98199 10.4689V5.2345C5.98199 5.0361 5.904 4.8459 5.763 4.7057C5.623 4.5655 5.43299 4.4867 5.23499 4.4867ZM14.208 11.2167C14.01 11.2167 13.819 11.2955 13.679 11.4357C13.539 11.576 13.46 11.7662 13.46 11.9645V17.1989C13.46 17.3973 13.539 17.5875 13.679 17.7277C13.819 17.8679 14.01 17.9467 14.208 17.9467C14.406 17.9467 14.596 17.8679 14.737 17.7277C14.877 17.5875 14.956 17.3973 14.956 17.1989V11.9645C14.956 11.7662 14.877 11.576 14.737 11.4357C14.596 11.2955 14.406 11.2167 14.208 11.2167ZM0.747986 8.9734C0.549986 8.9734 0.358994 9.0521 0.218994 9.1924C0.0789941 9.3326 0 9.5228 0 9.7211V12.7123C0 12.9106 0.0789941 13.1008 0.218994 13.241C0.358994 13.3813 0.549986 13.46 0.747986 13.46C0.945986 13.46 1.13601 13.3813 1.27701 13.241C1.41701 13.1008 1.496 12.9106 1.496 12.7123V9.7211C1.496 9.5228 1.41701 9.3326 1.27701 9.1924C1.13601 9.0521 0.945986 8.9734 0.747986 8.9734ZM5.23499 13.46C5.03599 13.46 4.84599 13.5388 4.70599 13.6791C4.56599 13.8193 4.487 14.0095 4.487 14.2078V17.1989C4.487 17.3973 4.56599 17.5875 4.70599 17.7277C4.84599 17.8679 5.03599 17.9467 5.23499 17.9467C5.43299 17.9467 5.623 17.8679 5.763 17.7277C5.904 17.5875 5.98199 17.3973 5.98199 17.1989V14.2078C5.98199 14.0095 5.904 13.8193 5.763 13.6791C5.623 13.5388 5.43299 13.46 5.23499 13.46ZM18.695 8.9734C18.496 8.9734 18.306 9.0521 18.166 9.1924C18.026 9.3326 17.947 9.5228 17.947 9.7211V12.7123C17.947 12.9106 18.026 13.1008 18.166 13.241C18.306 13.3813 18.496 13.46 18.695 13.46C18.893 13.46 19.083 13.3813 19.223 13.241C19.364 13.1008 19.442 12.9106 19.442 12.7123V9.7211C19.442 9.5228 19.364 9.3326 19.223 9.1924C19.083 9.0521 18.893 8.9734 18.695 8.9734Z"
        fill="#810100"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.cardBackground,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: VERTICAL_PADDING,
    position: 'relative', // Enable absolute positioning for badge and icon
    justifyContent: 'flex-end', // Push content to bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: 27 * SCALE, // y=29 from SVG, adjusted for card position
    left: 15 * SCALE, // x=19 from SVG, adjusted for card position
    width: BADGE_WIDTH,
    height: BADGE_HEIGHT,
    backgroundColor: COLORS.badgeBackground,
    borderRadius: BADGE_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.badgeBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10 * SCALE,
    fontWeight: '600',
    color: COLORS.badgeText,
  },
  iconCircle: {
    position: 'absolute',
    top: 19 * SCALE, // cy=39 from SVG, adjusted for card position (39-20=19)
    right: 14 * SCALE, // Positioned in top-right area
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_RADIUS,
    backgroundColor: COLORS.iconCircle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    // Bottom section with value and label
  },
  value: {
    fontFamily: 'JockeyOne',
    fontSize: 48 * SCALE,
    color: COLORS.valueText,
    lineHeight: 52 * SCALE,
  },
  label: {
    fontSize: 11 * SCALE,
    fontWeight: '500',
    color: COLORS.labelText,
    letterSpacing: 0.5,
    marginTop: 2 * SCALE,
  },
});
