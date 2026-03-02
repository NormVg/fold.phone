import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TimelineColors } from '@/constants/theme';
import { PERIODS, SCALE, type PeriodKey } from './constants';

interface DurationPickerProps {
  selected: PeriodKey;
  onSelect: (key: PeriodKey) => void;
}

export function DurationPicker({ selected, onSelect }: DurationPickerProps) {
  return (
    <View style={styles.periodRow}>
      {PERIODS.map(({ key, label }) => {
        const isActive = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            style={[styles.periodPill, isActive && styles.periodPillActive]}
          >
            <Text
              style={[styles.periodPillText, isActive && styles.periodPillTextActive]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: 'row',
    gap: 8 * SCALE,
    marginBottom: 16 * SCALE,
  },
  periodPill: {
    flex: 1,
    paddingVertical: 9 * SCALE,
    borderRadius: 12 * SCALE,
    backgroundColor: '#FDFBF7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  periodPillActive: {
    backgroundColor: TimelineColors.primary,
    borderColor: TimelineColors.primary,
  },
  periodPillText: {
    fontSize: 12 * SCALE,
    fontWeight: '600',
    color: '#666',
  },
  periodPillTextActive: {
    color: '#FDFBF7',
  },
});
