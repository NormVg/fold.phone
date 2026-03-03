import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HubPanelCard } from './HubPanelCard';
import { BookIcon, ConnectPeopleIcon, FolderIcon, HeartEKGIcon, LinkIcon } from './HubPanelIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * HubPanelGrid - Featured Connect card + 2×2 grid of panel cards
 * Based on home:hub:pannel.svg
 *
 * Layout:
 * - Full-width Connect card at top
 * - 4 cards in 2×2 grid below
 * - Gap between cards: ~16px (derived from SVG: 191-4-171 = 16)
 * - Total width: 4 + 171 + 16 + 171 = 362 ≈ 358
 */

const GAP = 16 * SCALE;
const CARD_WIDTH = 171 * SCALE;
const FULL_WIDTH = CARD_WIDTH * 2 + GAP; // same total width as 2 cards + gap

interface HubPanelGridProps {
  onStoriesPress?: () => void;
  onEmotionsPress?: () => void;
  onSharePress?: () => void;
  onMediaPress?: () => void;
  onConnectPress?: () => void;
}

export function HubPanelGrid({
  onStoriesPress,
  onEmotionsPress,
  onSharePress,
  onMediaPress,
  onConnectPress,
}: HubPanelGridProps) {
  return (
    <View style={styles.container}>
      {/* Featured Connect card - full width */}
      <TouchableOpacity
        style={styles.connectCard}
        onPress={onConnectPress}
        activeOpacity={0.8}
      >
        <View style={styles.connectLeft}>
          <Text style={styles.connectTitle}>Connect</Text>
          <Text style={styles.connectSubtitle}>SHARED MEMORIES</Text>
        </View>
        <View style={styles.connectIconCircle}>
          <ConnectPeopleIcon size={22 * SCALE} color="#800000" />
        </View>
      </TouchableOpacity>

      {/* Top row */}
      <View style={styles.row}>
        <HubPanelCard
          title="Stories"
          subtitle="FULL ARCHIVE"
          icon={<BookIcon />}
          onPress={onStoriesPress}
        />
        <HubPanelCard
          title="Emotions"
          subtitle="GRAPH & INSIGHTS"
          icon={<HeartEKGIcon />}
          onPress={onEmotionsPress}
        />
      </View>

      {/* Bottom row */}
      <View style={styles.row}>
        <HubPanelCard
          title="Share"
          subtitle="POST ACCESS LINKS"
          icon={<LinkIcon />}
          onPress={onSharePress}
        />
        <HubPanelCard
          title="Media"
          subtitle="FULL ARCHIVE"
          icon={<FolderIcon />}
          onPress={onMediaPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  connectCard: {
    width: FULL_WIDTH,
    height: 80 * SCALE,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    paddingHorizontal: 20 * SCALE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  connectLeft: {
    flex: 1,
  },
  connectTitle: {
    fontFamily: 'JockeyOne',
    fontSize: 30 * SCALE,
    color: '#000000',
    lineHeight: 34 * SCALE,
  },
  connectSubtitle: {
    fontSize: 11 * SCALE,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.5)',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  connectIconCircle: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
