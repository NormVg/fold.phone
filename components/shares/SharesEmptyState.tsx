import { TimelineColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SCALE } from './constants';

function LinkOffIcon({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="rgba(129, 1, 0, 0.3)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="rgba(129, 1, 0, 0.3)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function SharesEmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <LinkOffIcon size={40 * SCALE} />
      </View>
      <Text style={styles.title}>No Shared Memories</Text>
      <Text style={styles.subtitle}>
        When you share an entry from your timeline, it will appear here. You can manage, pause, or delete your shares anytime.
      </Text>
      <View style={styles.hintCard}>
        <Text style={styles.hintText}>
          Tap the share button on any entry card to create your first share link.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40 * SCALE,
    paddingHorizontal: 20 * SCALE,
  },
  iconCircle: {
    width: 80 * SCALE,
    height: 80 * SCALE,
    borderRadius: 40 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20 * SCALE,
  },
  title: {
    fontSize: 20 * SCALE,
    fontWeight: '700',
    color: TimelineColors.textDark,
    marginBottom: 10 * SCALE,
  },
  subtitle: {
    fontSize: 14 * SCALE,
    fontWeight: '400',
    color: '#777',
    textAlign: 'center',
    lineHeight: 21 * SCALE,
    marginBottom: 24 * SCALE,
  },
  hintCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  hintText: {
    fontSize: 13 * SCALE,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    lineHeight: 20 * SCALE,
  },
});
