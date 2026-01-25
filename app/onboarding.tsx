import { CaptureIcon, LockIcon } from '@/components/icons';
import { CTAButton, FeatureCard, SpeakFreelyCard, WelcomeBadge } from '@/components/onboarding';
import { OnboardingColors } from '@/constants/theme';
import React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Design is based on 393px width viewport
const SCALE = SCREEN_WIDTH / 393;

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={OnboardingColors.background} />
      <View style={styles.content}>
        {/* Welcome Badge - centered */}
        <View style={styles.badgeContainer}>
          <WelcomeBadge />
        </View>

        {/* Heading - Unfold (black) / your mind. (red, no italic) */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingBlack}>Unfold</Text>
          <Text style={styles.headingRed}>your mind.</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          The private space for you raw{'\n'}thoughts, memories, and emotions.
        </Text>

        {/* Speak Freely Card */}
        <SpeakFreelyCard />

        {/* Feature Cards Row */}
        <View style={styles.featureCardsContainer}>
          <FeatureCard
            icon={<LockIcon size={24} color={OnboardingColors.primary} />}
            title="Private"
            description={"Encrypted & safe.\nStrictly for your\neyes only."}
          />
          <FeatureCard
            icon={<CaptureIcon size={24} color={OnboardingColors.primary} />}
            title="Capture"
            description={"Photos, text, or\naudio. Whatever\nfits the mood."}
          />
        </View>
      </View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <CTAButton onPress={() => console.log('Start Capturing pressed')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OnboardingColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 21 * SCALE,
    paddingTop: 18 * SCALE,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  headingContainer: {
    marginTop: 27 * SCALE,
    marginBottom: 8 * SCALE,
  },
  headingBlack: {
    fontSize: 48 * SCALE,
    fontWeight: '800',
    color: OnboardingColors.textDark,
    lineHeight: 56 * SCALE,
  },
  headingRed: {
    fontSize: 48 * SCALE,
    fontWeight: '800',
    color: OnboardingColors.primary,
    lineHeight: 56 * SCALE,
  },
  subtitle: {
    fontSize: 15 * SCALE,
    color: OnboardingColors.textDark,
    lineHeight: 22 * SCALE,
    marginBottom: 16 * SCALE,
  },
  featureCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16 * SCALE,
  },
  ctaContainer: {
    paddingHorizontal: 21 * SCALE,
    paddingBottom: 40 * SCALE,
  },
});
