import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function WriteStoryScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canSave = useMemo(() => {
    return title.trim().length > 0 && content.trim().length > 0;
  }, [title, content]);

  const handleBack = () => router.back();

  const handleSave = () => {
    // Placeholder: wire to storage/API later.
    console.log('Save story:', { title: title.trim(), content: content.trim() });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Back">
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Write a Story</Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Save"
        >
          <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Give it a name"
              placeholderTextColor="rgba(0,0,0,0.35)"
              style={styles.titleInput}
              autoCapitalize="sentences"
              returnKeyType="next"
            />

            <View style={styles.divider} />

            <Text style={styles.label}>Story</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Start writing..."
              placeholderTextColor="rgba(0,0,0,0.35)"
              style={styles.contentInput}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
            />
          </View>

          <Text style={styles.helperText}>Saved stories will show up in Stories.</Text>
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 44 * SCALE,
    height: 44 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  saveButton: {
    paddingHorizontal: 14 * SCALE,
    height: 36 * SCALE,
    borderRadius: 12 * SCALE,
    backgroundColor: TimelineColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(129, 1, 0, 0.25)',
  },
  saveButtonText: {
    fontSize: 14 * SCALE,
    fontWeight: '700',
    color: '#FDFBF7',
    letterSpacing: 0.3,
  },
  saveButtonTextDisabled: {
    color: 'rgba(253, 251, 247, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 14 * SCALE,
  },
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 18 * SCALE,
    padding: 16 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 12 * SCALE,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.55)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  titleInput: {
    marginTop: 10 * SCALE,
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
    paddingVertical: 8 * SCALE,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 12 * SCALE,
  },
  contentInput: {
    marginTop: 10 * SCALE,
    minHeight: 320 * SCALE,
    fontSize: 15 * SCALE,
    fontWeight: '400',
    color: '#333',
    lineHeight: 22 * SCALE,
    paddingVertical: 8 * SCALE,
  },
  helperText: {
    marginTop: 12 * SCALE,
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 4 * SCALE,
  },
  bottomPadding: {
    height: 80 * SCALE,
  },
});
