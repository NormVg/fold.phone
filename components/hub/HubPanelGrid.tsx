import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { HubPanelCard } from './HubPanelCard';
import { BookIcon, FolderIcon, HeartEKGIcon, LinkIcon } from './HubPanelIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

/**
 * HubPanelGrid - 2×2 grid of panel cards
 * Based on home:hub:pannel.svg
 *
 * Layout:
 * - 4 cards in 2×2 grid
 * - Gap between cards: ~16px (derived from SVG: 191-4-171 = 16)
 * - Total width: 4 + 171 + 16 + 171 = 362 ≈ 358
 */

const GAP = 16 * SCALE;

interface HubPanelGridProps {
  onStoriesPress?: () => void;
  onEmotionsPress?: () => void;
  onSharePress?: () => void;
  onMediaPress?: () => void;
}

export function HubPanelGrid({
  onStoriesPress,
  onEmotionsPress,
  onSharePress,
  onMediaPress,
}: HubPanelGridProps) {
  return (
    <View style={styles.container}>
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
});
