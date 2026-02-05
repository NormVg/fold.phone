import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import * as Application from 'expo-application';
import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
// @ts-ignore
import config from '../fold.config.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

export default function AboutScreen() {
  const router = useRouter();
  
  const appVersion = Application.nativeApplicationVersion || config.app.version;
  const buildNumber = Application.nativeBuildVersion || '1';

  const handleBack = () => {
    router.back();
  };

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  // Build links from config
  const links = config.aboutLinks.map((link: { label: string; key: string }) => ({
    label: link.label,
    url: config.links[link.key as keyof typeof config.links],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo & Name */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>{config.app.name}</Text>
          <Text style={styles.tagline}>{config.app.tagline}</Text>
          <Text style={styles.version}>Version {appVersion} ({buildNumber})</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            {config.app.description}
          </Text>
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          <View style={styles.card}>
            {links.map((link, index) => (
              <React.Fragment key={link.label}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.linkRow,
                    pressed && styles.linkRowPressed,
                  ]}
                  onPress={() => handleLink(link.url)}
                >
                  <Text style={styles.linkLabel}>{link.label}</Text>
                  <ExternalLinkIcon size={16 * SCALE} />
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Credits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credits</Text>
          <View style={styles.card}>
            <View style={styles.creditRow}>
              <Text style={styles.creditLabel}>Built with</Text>
              <Text style={styles.creditValue}>{config.credits.builtWith}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.creditRow}>
              <Text style={styles.creditLabel}>Made by</Text>
              <Text style={styles.creditValue}>{config.credits.madeBy}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <HeartIcon size={16 * SCALE} />
          <Text style={styles.footerText}>{config.credits.footerMessage}</Text>
        </View>

        <Text style={styles.copyright}>
          {'\u00A9'} {new Date().getFullYear()} {config.app.copyright}. All rights reserved.
        </Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
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

function ExternalLinkIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12 9V13C12 13.552 11.552 14 11 14H3C2.448 14 2 13.552 2 13V5C2 4.448 2.448 4 3 4H7"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 2H14V6"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2L7 9"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function HeartIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 14L2.5 8.5C1.5 7.5 1.5 5.5 2.5 4.5C3.5 3.5 5.5 3.5 6.5 4.5L8 6L9.5 4.5C10.5 3.5 12.5 3.5 13.5 4.5C14.5 5.5 14.5 7.5 13.5 8.5L8 14Z"
        fill={TimelineColors.primary}
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 20 * SCALE,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24 * SCALE,
  },
  logoContainer: {
    width: 80 * SCALE,
    height: 80 * SCALE,
    borderRadius: 24 * SCALE,
    backgroundColor: '#FDFBF7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16 * SCALE,
    overflow: 'hidden',
  },
  logo: {
    width: 60 * SCALE,
    height: 60 * SCALE,
    borderRadius: 18 * SCALE,
  },
  appName: {
    fontSize: 28 * SCALE,
    fontFamily: 'SignPainter',
    color: TimelineColors.textDark,
    marginBottom: 4 * SCALE,
  },
  tagline: {
    fontSize: 15 * SCALE,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 8 * SCALE,
  },
  version: {
    fontSize: 13 * SCALE,
    color: 'rgba(0,0,0,0.4)',
  },
  descriptionCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    marginBottom: 24 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 22 * SCALE,
    textAlign: 'center',
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
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
  },
  linkRowPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  linkLabel: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
  },
  creditLabel: {
    fontSize: 15 * SCALE,
    color: 'rgba(0,0,0,0.5)',
  },
  creditValue: {
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 16 * SCALE,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8 * SCALE,
    marginTop: 16 * SCALE,
  },
  footerText: {
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.5)',
  },
  copyright: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.3)',
    textAlign: 'center',
    marginTop: 12 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
