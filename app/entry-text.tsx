import { MediaToolbar } from '@/components/entry';
import { MoodPicker, type MoodType } from '@/components/mood';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Colors from SVG
const COLORS = {
  background: '#EDEADC',
  cardBackground: 'rgba(0, 0, 0, 0.07)',
  primary: '#810100',
  text: '#181717',
  textLight: 'rgba(0, 0, 0, 0.5)',
  white: '#FDFBF7',
};

// Close X icon in maroon circle - from SVG path (same as new-memory.tsx)
function CloseButton({ size = 48.54, onPress }: { size?: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 49 49" fill="none">
        <Circle cx="24.27" cy="24.27" r="24.27" fill={COLORS.primary} fillOpacity="0.2" />
        <Path
          d="M24 11.8125C21.5895 11.8125 19.2332 12.5273 17.229 13.8665C15.2248 15.2056 13.6627 17.1091 12.7402 19.336C11.8178 21.563 11.5764 24.0135 12.0467 26.3777C12.5169 28.7418 13.6777 30.9134 15.3821 32.6179C17.0866 34.3223 19.2582 35.4831 21.6223 35.9533C23.9865 36.4236 26.437 36.1822 28.664 35.2598C30.8909 34.3373 32.7944 32.7752 34.1335 30.771C35.4727 28.7668 36.1875 26.4105 36.1875 24C36.1841 20.7687 34.899 17.6708 32.6141 15.3859C30.3292 13.101 27.2313 11.8159 24 11.8125ZM28.4133 27.0867C28.5004 27.1738 28.5695 27.2772 28.6166 27.391C28.6638 27.5048 28.688 27.6268 28.688 27.75C28.688 27.8732 28.6638 27.9952 28.6166 28.109C28.5695 28.2228 28.5004 28.3262 28.4133 28.4133C28.3262 28.5004 28.2228 28.5695 28.109 28.6166C27.9952 28.6638 27.8732 28.688 27.75 28.688C27.6268 28.688 27.5048 28.6638 27.391 28.6166C27.2772 28.5695 27.1738 28.5004 27.0867 28.4133L24 25.3254L20.9133 28.4133C20.8262 28.5004 20.7228 28.5695 20.609 28.6166C20.4952 28.6638 20.3732 28.688 20.25 28.688C20.1268 28.688 20.0048 28.6638 19.891 28.6166C19.7772 28.5695 19.6738 28.5004 19.5867 28.4133C19.4996 28.3262 19.4305 28.2228 19.3834 28.109C19.3362 27.9952 19.312 27.8732 19.312 27.75C19.312 27.6268 19.3362 27.5048 19.3834 27.391C19.4305 27.2772 19.4996 27.1738 19.5867 27.0867L22.6746 24L19.5867 20.9133C19.4108 20.7374 19.312 20.4988 19.312 20.25C19.312 20.0012 19.4108 19.7626 19.5867 19.5867C19.7626 19.4108 20.0012 19.312 20.25 19.312C20.4988 19.312 20.7374 19.4108 20.9133 19.5867L24 22.6746L27.0867 19.5867C27.1738 19.4996 27.2772 19.4305 27.391 19.3834C27.5048 19.3362 27.6268 19.312 27.75 19.312C27.8732 19.312 27.9952 19.3362 28.109 19.3834C28.2228 19.4305 28.3262 19.4996 28.4133 19.5867C28.5004 19.6738 28.5695 19.7772 28.6166 19.891C28.6638 20.0048 28.688 20.1268 28.688 20.25C28.688 20.3732 28.6638 20.4952 28.6166 20.609C28.5695 20.7228 28.5004 20.8262 28.4133 20.9133L25.3254 24L28.4133 27.0867Z"
          fill={COLORS.primary}
        />
      </Svg>
    </Pressable>
  );
}

export default function EntryTextScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [textContent, setTextContent] = useState('');

  const handleClose = () => {
    router.back();
  };

  const handleFoldIt = () => {
    console.log('Folding text memory:', { textContent, selectedMood });
    router.back();
  };

  const handleStoryMode = () => {
    console.log('Navigate to story mode');
    // TODO: Navigate to story mode screen
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header - close at x=33, title centered */}
      <View style={styles.header}>
        <CloseButton size={48.54} onPress={handleClose} />
        <Text style={styles.headerTitle}>New Memory</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Text Input Card - rect x=17 y=130 w=358 h=400 rx=25 */}
          <View style={styles.textCard}>
            <Text style={styles.textCardLabel}>How are you feeling right now?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write it down"
              placeholderTextColor={COLORS.textLight}
              value={textContent}
              onChangeText={setTextContent}
              multiline
              textAlignVertical="top"
            />
            {/* Media Toolbar - inside text card at bottom */}
            <MediaToolbar />
          </View>

          {/* Mood Section - from y=546 */}
          <MoodPicker
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
            style={styles.moodSection}
          />

          {/* Story Mode Link */}
          <Pressable onPress={handleStoryMode} style={styles.storyModeLink}>
            <Text style={styles.storyModeLinkText}>
              Have a Story? <Text style={styles.storyModeLinkBold}>Try Story Mode</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fold It Button - rect x=21 y=776 w=350 h=50 rx=25 */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.foldButton,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleFoldIt}
        >
          <Text style={styles.foldButtonText}>Fold it</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 60 * SCALE,
  },
  headerTitle: {
    fontSize: 20 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 48.54 * SCALE,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingBottom: 20 * SCALE,
  },
  // Text input card - rect x=17 y=130 w=358 h=400 rx=25
  textCard: {
    width: 358 * SCALE,
    height: 400 * SCALE,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25 * SCALE,
    alignSelf: 'center',
    paddingHorizontal: 20 * SCALE,
    paddingTop: 24 * SCALE,
    paddingBottom: 20 * SCALE,
    marginTop: 20 * SCALE,
  },
  textCardLabel: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12 * SCALE,
  },
  textInput: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: COLORS.text,
    lineHeight: 24 * SCALE,
  },
  // Mood section
  moodSection: {
    marginTop: 16 * SCALE,
  },
  // Story mode link - left-aligned as per design
  storyModeLink: {
    alignSelf: 'flex-start',
    marginTop: 32 * SCALE,
    marginBottom: 24 * SCALE,
    paddingVertical: 8 * SCALE,
  },
  storyModeLinkText: {
    fontSize: 18 * SCALE,
    fontWeight: '400',
    color: COLORS.text,
  },
  storyModeLinkBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    paddingHorizontal: 21 * SCALE,
    paddingTop: 12 * SCALE,
    paddingBottom: 32 * SCALE,
  },
  // Fold button - rect x=21 y=776 w=350 h=50 rx=25
  foldButton: {
    width: 350 * SCALE,
    height: 50 * SCALE,
    backgroundColor: COLORS.primary,
    borderRadius: 25 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  foldButtonText: {
    fontSize: 24 * SCALE,
    fontFamily: 'SignPainter',
    color: COLORS.white,
  },
});
