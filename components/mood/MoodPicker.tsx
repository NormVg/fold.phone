import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated } from 'react-native';
import {
  VSadMoodIcon,
  SadMoodIcon,
  NormalMoodIcon,
  HappyMoodIcon,
  VHappyMoodIcon,
} from '../icons/MoodIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Mood types
export type MoodType = 'V. Sad' | 'Sad' | 'Normal' | 'Happy' | 'V. Happy';

const MOODS: MoodType[] = ['V. Sad', 'Sad', 'Normal', 'Happy', 'V. Happy'];

// Map mood types to icon components
const MOOD_ICONS: Record<MoodType, React.FC<{ size?: number }>> = {
  'V. Sad': VSadMoodIcon,
  'Sad': SadMoodIcon,
  'Normal': NormalMoodIcon,
  'Happy': HappyMoodIcon,
  'V. Happy': VHappyMoodIcon,
};

interface MoodPickerProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
  label?: string;
  style?: object;
}

export function MoodPicker({
  selectedMood,
  onMoodSelect,
  label = 'How you feeling right now?',
  style,
}: MoodPickerProps) {
  const iconSize = 60 * SCALE;
  const borderRadius = (10 / 64) * iconSize;

  return (
    <View style={[styles.card, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.moodRow}>
        {MOODS.map((mood) => {
          const MoodIcon = MOOD_ICONS[mood];
          const isSelected = selectedMood === mood;

          return (
            <Pressable
              key={mood}
              onPress={() => onMoodSelect(mood)}
              accessibilityLabel={`Select ${mood} mood`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.iconWrapper,
                {
                  borderRadius: borderRadius + 2,
                  borderColor: isSelected ? '#810100' : '#181717',
                  borderWidth: isSelected ? 2 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <MoodIcon size={iconSize} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 358 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 25 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingTop: 16 * SCALE,
    paddingBottom: 20 * SCALE,
    alignSelf: 'center',
  },
  label: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: '#181717',
    marginBottom: 12 * SCALE,
    paddingLeft: 6 * SCALE,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2 * SCALE,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default MoodPicker;
