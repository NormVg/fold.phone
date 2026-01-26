import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * BadgesSection - Shows user's earned badges
 * Based on home:profile:badges.svg (exact measurements)
 * 
 * SVG Analysis:
 * - Card: rect x=4 y=2 width=358 height=160.64 rx=20
 * - Title "YOUR BADGES" at top left
 * - Badge circles: r=38.3189 (diameter ~76.64)
 * - Badge 1 (Early Bird): cx=90.32, #810100
 * - Badge 2 (The Voice): cx=182.96, #181717
 * - Badge 3 (On Fire): cx=276.32, #E84D2B
 * - Labels below each badge
 */

// Card dimensions from SVG
const CARD_WIDTH = 358 * SCALE;
const CARD_RADIUS = 20 * SCALE;

// Badge dimensions from SVG: circle r=38.3189
const BADGE_SIZE = 76.64 * SCALE;

// Calculate equal vertical padding
// Content: title (~14px) + gap (~10px) + badge (76.64px) + gap (~8px) + label (~16px) = ~125px
// For equal padding with card height 160.64: (160.64 - 125) / 2 = ~18px
const VERTICAL_PADDING = 18 * SCALE;
const TITLE_HEIGHT = 14 * SCALE;
const TITLE_TO_BADGES_GAP = 10 * SCALE;
const LABEL_HEIGHT = 16 * SCALE;
const BADGE_TO_LABEL_GAP = 8 * SCALE;

// Recalculate card height for exact equal padding
const CONTENT_HEIGHT = TITLE_HEIGHT + TITLE_TO_BADGES_GAP + BADGE_SIZE + BADGE_TO_LABEL_GAP + LABEL_HEIGHT;
const CARD_HEIGHT = VERTICAL_PADDING + CONTENT_HEIGHT + VERTICAL_PADDING;

// Badge data with image sources
const BADGES = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    image: require('../../assets/images/badges/early-bird.png'),
  },
  {
    id: 'the-voice',
    name: 'The Voice',
    image: require('../../assets/images/badges/the-voice.png'),
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    image: require('../../assets/images/badges/on-fire.png'),
  },
];

interface BadgesSectionProps {
  // Can extend to support dynamic badges in the future
}

export function BadgesSection({}: BadgesSectionProps) {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>YOUR BADGES</Text>
      
      {/* Badges row */}
      <View style={styles.badgesRow}>
        {BADGES.map((badge) => (
          <View key={badge.id} style={styles.badgeWrapper}>
            <Image 
              source={badge.image} 
              style={styles.badgeImage}
              resizeMode="contain"
            />
            <Text style={styles.badgeLabel}>{badge.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#FDFBF7',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 20 * SCALE,
    paddingVertical: VERTICAL_PADDING,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.5,
    height: TITLE_HEIGHT,
    marginBottom: TITLE_TO_BADGES_GAP,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  badgeWrapper: {
    alignItems: 'center',
  },
  badgeImage: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
  },
  badgeLabel: {
    marginTop: BADGE_TO_LABEL_GAP,
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    height: LABEL_HEIGHT,
  },
});
