import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

type ThemeOption = 'light' | 'dark' | 'system';

export default function AppearanceScreen() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('light');

  const handleBack = () => {
    router.back();
  };

  const themes: { id: ThemeOption; label: string; description: string }[] = [
    { id: 'light', label: 'Light', description: 'Always use light mode' },
    { id: 'dark', label: 'Dark', description: 'Always use dark mode' },
    { id: 'system', label: 'System', description: 'Match device settings' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Appearance</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.card}>
            {themes.map((theme, index) => (
              <React.Fragment key={theme.id}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.themeRow,
                    pressed && styles.themeRowPressed,
                  ]}
                  onPress={() => setSelectedTheme(theme.id)}
                >
                  <View style={styles.rowLeft}>
                    {theme.id === 'light' && <SunIcon size={20 * SCALE} />}
                    {theme.id === 'dark' && <MoonIcon size={20 * SCALE} />}
                    {theme.id === 'system' && <DeviceIcon size={20 * SCALE} />}
                    <View style={styles.rowTextContainer}>
                      <Text style={styles.rowLabel}>{theme.label}</Text>
                      <Text style={styles.rowDescription}>{theme.description}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radioOuter,
                    selectedTheme === theme.id && styles.radioOuterSelected,
                  ]}>
                    {selectedTheme === theme.id && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewDot} />
              <View style={styles.previewDot} />
              <View style={styles.previewDot} />
            </View>
            <View style={styles.previewContent}>
              <View style={styles.previewLine} />
              <View style={[styles.previewLine, { width: '70%' }]} />
              <View style={[styles.previewLine, { width: '50%' }]} />
            </View>
            <Text style={styles.previewLabel}>
              {selectedTheme === 'system' ? 'Follows system' : `${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme`}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon size={20 * SCALE} />
          <Text style={styles.infoText}>
            Dark mode is coming soon! Currently, Fold uses the beautiful cream theme you see now.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Icons
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

function SunIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="4" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M10 2V4" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M10 16V18" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M2 10H4" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16 10H18" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4.22 4.22L5.64 5.64" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M14.36 14.36L15.78 15.78" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4.22 15.78L5.64 14.36" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M14.36 5.64L15.78 4.22" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function MoonIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M17 10.5C17 14.642 13.642 18 9.5 18C5.858 18 2.833 15.375 2.125 11.917C2.042 11.5 2.458 11.125 2.875 11.208C3.292 11.292 3.792 11.333 4.25 11.333C8.25 11.333 11.5 8.083 11.5 4.083C11.5 3.625 11.458 3.125 11.375 2.708C11.292 2.292 11.667 1.875 12.083 1.958C15.542 2.667 18 5.692 18 9.333C18 9.75 17.958 10.125 17.917 10.5"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DeviceIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="4" y="2" width="12" height="16" rx="2" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M9 16H11" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M10 9V14" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="10" cy="6" r="1" fill={TimelineColors.primary} />
    </Svg>
  );
}

const styles = StyleSheet.create({
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
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  placeholder: {
    width: 40 * SCALE,
  },
  content: {
    flex: 1,
    paddingHorizontal: 17 * SCALE,
    paddingTop: 10 * SCALE,
  },
  section: {
    marginBottom: 24 * SCALE,
  },
  sectionTitle: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 8 * SCALE,
    marginLeft: 4 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
  },
  themeRowPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
    flex: 1,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  rowDescription: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2 * SCALE,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 48 * SCALE,
  },
  radioOuter: {
    width: 22 * SCALE,
    height: 22 * SCALE,
    borderRadius: 11 * SCALE,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: TimelineColors.primary,
  },
  radioInner: {
    width: 12 * SCALE,
    height: 12 * SCALE,
    borderRadius: 6 * SCALE,
    backgroundColor: TimelineColors.primary,
  },
  previewCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    gap: 6 * SCALE,
    marginBottom: 12 * SCALE,
  },
  previewDot: {
    width: 10 * SCALE,
    height: 10 * SCALE,
    borderRadius: 5 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  previewContent: {
    gap: 8 * SCALE,
    marginBottom: 12 * SCALE,
  },
  previewLine: {
    height: 8 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4 * SCALE,
    width: '100%',
  },
  previewLabel: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.05)',
    borderRadius: 12 * SCALE,
    padding: 16 * SCALE,
    marginTop: 8 * SCALE,
  },
  infoText: {
    flex: 1,
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20 * SCALE,
  },
});
