import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * HubPanelCard - Reusable card component for Hub panel grid
 * Based on home:hub:pannel.svg (exact measurements)
 *
 * SVG Analysis:
 * - Card: 171×144, rx=20, fill=#FDFBF7
 * - Icon circle: r=20 (40px diameter), positioned top-right
 * - Icon circle fill: #810100 at 20% opacity
 * - Title: Large bold text at bottom
 * - Subtitle: Small 50% opacity text below title
 */

// Card dimensions from SVG - EXACT measurements
const CARD_WIDTH = 171 * SCALE;
const CARD_HEIGHT = 144 * SCALE;
const CARD_RADIUS = 20 * SCALE;

// Icon circle - EXACT from SVG design
const ICON_CIRCLE_RADIUS = 20 * SCALE; // r="20" from SVG
const ICON_CIRCLE_SIZE = ICON_CIRCLE_RADIUS * 2; // 40px diameter
const ICON_SIZE = 22 * SCALE; // Icons should be ~16px to fit nicely in 40px circle (leaving 12px padding)

// Padding
const HORIZONTAL_PADDING = 15 * SCALE;
const VERTICAL_PADDING = 16 * SCALE;

// Colors - EXACT from SVG
const COLORS = {
  background: '#FDFBF7',
  iconCircle: 'rgba(129, 1, 0, 0.2)', // #810100 at 20% opacity - exact from SVG
  iconColor: '#800000', // Dark red for icons - exact from SVG paths
  title: '#000000',
  subtitle: 'rgba(0, 0, 0, 0.5)',
};

interface HubPanelCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress?: () => void;
}

export function HubPanelCard({ title, subtitle, icon, onPress }: HubPanelCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon circle - top right */}
      <View style={styles.iconCircle}>
        <View style={styles.iconContainer}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                size: ICON_SIZE,
                color: COLORS.iconColor
              } as any)
            : icon
          }
        </View>
      </View>

      {/* Bottom content */}
      <View style={styles.bottomContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Export dimensions for grid layout
export const PANEL_CARD_WIDTH = CARD_WIDTH;
export const PANEL_CARD_HEIGHT = CARD_HEIGHT;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.background,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: VERTICAL_PADDING,
    justifyContent: 'flex-end', // Push content to bottom
    position: 'relative', // Enable absolute positioning for icon
    // Shadow from SVG filter
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_RADIUS,
    backgroundColor: COLORS.iconCircle,
    // Position exactly as in SVG - top right area
    position: 'absolute',
    top: 16 * SCALE, // Approximately 37px from SVG, adjusted for padding
    right: 16 * SCALE, // Positioned in top-right area
    // Ensure perfect centering
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    // Additional container for precise icon centering
    justifyContent: 'center',
    alignItems: 'center',
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  bottomContent: {
    // Text content at bottom
  },
  title: {
    fontFamily: 'JockeyOne',
    fontSize: 36 * SCALE,
    color: COLORS.title,
    lineHeight: 40 * SCALE,
  },
  subtitle: {
    fontSize: 11 * SCALE,
    fontWeight: '400',
    color: COLORS.subtitle,
    letterSpacing: 0.3,
    marginTop: 2 * SCALE,
  },
});
