import { TimelineColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do I create a new memory?',
    answer: 'Tap the capture button (microphone icon) at the bottom of any screen. You can record voice memos, add emotions, and save your thoughts instantly.',
  },
  {
    question: 'Are my recordings stored securely?',
    answer: 'Yes! All your voice recordings and data are encrypted and stored securely. Only you have access to your memories.',
  },
  {
    question: 'Can I export my memories?',
    answer: 'Export functionality is coming soon. You\'ll be able to export your memories as audio files or transcribed text.',
  },
  {
    question: 'What is the Fold Score?',
    answer: 'Your Fold Score reflects your journaling consistency and engagement. The more regularly you capture memories, the higher your score grows.',
  },
  {
    question: 'How do streaks work?',
    answer: 'Streaks count consecutive days of capturing at least one memory. Keep your streak alive by recording something every day!',
  },
  {
    question: 'Can I use Fold offline?',
    answer: 'Yes! You can record memories offline. They\'ll sync automatically when you\'re back online.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleBack = () => {
    router.back();
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@fold.taohq.org?subject=Fold App Support');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Help & FAQ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            {faqData.map((faq, index) => (
              <React.Fragment key={index}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  style={styles.faqRow}
                  onPress={() => toggleExpand(index)}
                >
                  <View style={styles.faqHeader}>
                    <QuestionIcon size={20 * SCALE} />
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <ChevronIcon size={16 * SCALE} expanded={expandedIndex === index} />
                  </View>
                  {expandedIndex === index && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need More Help?</Text>
          <Pressable
            style={({ pressed }) => [
              styles.contactCard,
              pressed && styles.contactCardPressed,
            ]}
            onPress={handleContactSupport}
          >
            <View style={styles.contactLeft}>
              <MailIcon size={24 * SCALE} />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactTitle}>Contact Support</Text>
                <Text style={styles.contactSubtitle}>We typically respond within 24 hours</Text>
              </View>
            </View>
            <ChevronRightIcon size={16 * SCALE} />
          </Pressable>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipsCard}>
            <TipRow icon={<MicIcon size={18 * SCALE} />} text="Long-press the capture button for quick recording" />
            <TipRow icon={<CalendarIcon size={18 * SCALE} />} text="Swipe on the calendar to navigate between months" />
            <TipRow icon={<SparkleIcon size={18 * SCALE} />} text="Add emotions to your memories for better insights" />
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TipRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.tipRow}>
      <View style={styles.tipIcon}>{icon}</View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
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

function QuestionIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M7.5 7.5C7.5 6.119 8.619 5 10 5C11.381 5 12.5 6.119 12.5 7.5C12.5 8.881 11.381 10 10 10V11.5"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="10" cy="14" r="1" fill={TimelineColors.primary} />
    </Svg>
  );
}

function ChevronIcon({ size = 16, expanded = false }: { size?: number; expanded?: boolean }) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none"
      style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
    >
      <Path
        d="M4 6L8 10L12 6"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 12L10 8L6 4"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MailIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6C3 4.895 3.895 4 5 4H19C20.105 4 21 4.895 21 6V18C21 19.105 20.105 20 19 20H5C3.895 20 3 19.105 3 18V6Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
      <Path
        d="M3 7L12 13L21 7"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MicIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M9 1C7.343 1 6 2.343 6 4V9C6 10.657 7.343 12 9 12C10.657 12 12 10.657 12 9V4C12 2.343 10.657 1 9 1Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
      <Path
        d="M3 8V9C3 12.314 5.686 15 9 15C12.314 15 15 12.314 15 9V8"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path d="M9 15V17" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function CalendarIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M2 5C2 3.895 2.895 3 4 3H14C15.105 3 16 3.895 16 5V14C16 15.105 15.105 16 14 16H4C2.895 16 2 15.105 2 14V5Z"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
      />
      <Path d="M2 7H16" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path d="M6 1V3" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 1V3" stroke={TimelineColors.primary} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M9 1L10.5 6.5L16 8L10.5 9.5L9 15L7.5 9.5L2 8L7.5 6.5L9 1Z"
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
  faqRow: {
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15 * SCALE,
    fontWeight: '500',
    color: TimelineColors.textDark,
  },
  faqAnswer: {
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20 * SCALE,
    marginTop: 12 * SCALE,
    marginLeft: 32 * SCALE,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 48 * SCALE,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDFBF7',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactCardPressed: {
    backgroundColor: 'rgba(253, 251, 247, 0.8)',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
  },
  contactTextContainer: {
    gap: 2 * SCALE,
  },
  contactTitle: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  contactSubtitle: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.5)',
  },
  tipsCard: {
    backgroundColor: 'rgba(129, 1, 0, 0.05)',
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    gap: 12 * SCALE,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
  },
  tipIcon: {
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 8 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 18 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
