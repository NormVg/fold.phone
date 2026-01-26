import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TimelineColors } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393; // Design is based on 393px width

interface PrivateBadgeProps {
  text?: string;
}

/**
 * "PRIVATE MEMORY VAULT" badge pill - EXACT from home:profile.svg
 * From SVG:
 * - rect x="108" y="267" width="177" height="25" rx="12.5" fill="#810100" fill-opacity="0.2"
 * - rect x="108.5" y="267.5" width="176" height="24" rx="12" stroke="#810100" stroke-opacity="0.25"
 */
export function PrivateBadge({ 
  text = 'PRIVATE MEMORY VAULT',
}: PrivateBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 177 * SCALE,
    height: 25 * SCALE,
    borderRadius: 12.5 * SCALE, // rx="12.5"
    backgroundColor: 'rgba(129, 1, 0, 0.2)', // fill="#810100" fill-opacity="0.2"
    borderWidth: 1,
    borderColor: 'rgba(129, 1, 0, 0.25)', // stroke="#810100" stroke-opacity="0.25"
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: TimelineColors.primary, // #810100
    textTransform: 'uppercase',
  },
});
