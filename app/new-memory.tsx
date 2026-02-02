import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';

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
  buttonBorder: 'rgba(0, 0, 0, 0.25)',
  // Mood colors from SVG
  vSad: '#DCBCBC',
  sad: '#E5D4D4',
  normal: '#E5E3D4',
  happy: '#D4E5D5',
  vHappy: '#BCDCBE',
};

// Mood types
type MoodType = 'V. Sad' | 'Sad' | 'Normal' | 'Happy' | 'V. Happy';

// Mood images
const MOOD_IMAGES = {
  'V. Sad': require('@/assets/images/emotion/v-sad.png'),
  'Sad': require('@/assets/images/emotion/sad.png'),
  'Normal': require('@/assets/images/emotion/normal.png'),
  'Happy': require('@/assets/images/emotion/happy.png'),
  'V. Happy': require('@/assets/images/emotion/v-happy.png'),
};

const MOODS: { type: MoodType; bgColor: string }[] = [
  { type: 'V. Sad', bgColor: COLORS.vSad },
  { type: 'Sad', bgColor: COLORS.sad },
  { type: 'Normal', bgColor: COLORS.normal },
  { type: 'Happy', bgColor: COLORS.happy },
  { type: 'V. Happy', bgColor: COLORS.vHappy },
];

// Close X icon in maroon circle - from SVG path
function CloseButton({ size = 48.54, onPress }: { size?: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
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

// Reset/Undo icon - circular arrow from SVG
function ResetIcon({ size = 60 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 60 60" fill="none">
      <Circle cx="30" cy="30" r="30" fill={COLORS.white} />
      <Circle cx="30" cy="30" r="29.5" stroke={COLORS.buttonBorder} />
      <Path
        d="M21.8652 30.457C21.8652 32.157 22.3693 33.818 23.3136 35.232C24.2579 36.645 25.6001 37.747 27.1704 38.397C28.7408 39.047 30.4687 39.218 32.1358 38.886C33.8028 38.554 35.334 37.736 36.536 36.534C37.738 35.332 38.556 33.801 38.888 32.134C39.22 30.467 39.049 28.739 38.399 27.168C37.748 25.598 36.647 24.256 35.234 23.312C33.8204 22.367 32.1589 21.863 30.4592 21.863C28.0566 21.872 25.7506 22.81 24.0233 24.48L21.8652 26.638"
        stroke={COLORS.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.8652 21.863V26.638H26.6396"
        stroke={COLORS.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Checkmark icon from SVG
function CheckIcon({ size = 60 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 60 60" fill="none">
      <Circle cx="30" cy="30" r="30" fill={COLORS.white} />
      <Circle cx="30" cy="30" r="29.5" stroke={COLORS.buttonBorder} />
      <Path
        d="M40.1 24.73L29.595 35.235L24.82 30.46"
        stroke={COLORS.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Record button - donut shape from SVG
function RecordButton({ isRecording, onPress }: { isRecording: boolean; onPress: () => void }) {
  // From SVG: outer circle r=50.5, inner circle r=20.2 (creates donut)
  const outerRadius = 50.5;
  const innerRadius = 20.2;
  const size = 101;
  
  return (
    <Pressable onPress={onPress}>
      <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 101 101" fill="none">
        {/* Donut shape - outer minus inner */}
        <Path
          d={`M${size / 2} ${size}C${size / 2 + outerRadius} ${size} ${size} ${size / 2 + outerRadius} ${size} ${size / 2}C${size} ${size / 2 - outerRadius} ${size / 2 + outerRadius} 0 ${size / 2} 0C${size / 2 - outerRadius} 0 0 ${size / 2 - outerRadius} 0 ${size / 2}C0 ${size / 2 + outerRadius} ${size / 2 - outerRadius} ${size} ${size / 2} ${size}ZM${size / 2 - innerRadius + 0.8} ${size / 2}C${size / 2 - innerRadius + 0.8} ${size / 2 - innerRadius + 8.656} ${size / 2 - 11.156} ${size / 2 - innerRadius + 0.8} ${size / 2} ${size / 2 - innerRadius + 0.8}C${size / 2 + 11.156} ${size / 2 - innerRadius + 0.8} ${size / 2 + innerRadius - 0.8} ${size / 2 - 11.156} ${size / 2 + innerRadius - 0.8} ${size / 2}C${size / 2 + innerRadius - 0.8} ${size / 2 + 11.156} ${size / 2 + 11.156} ${size / 2 + innerRadius - 0.8} ${size / 2} ${size / 2 + innerRadius - 0.8}C${size / 2 - 11.156} ${size / 2 + innerRadius - 0.8} ${size / 2 - innerRadius + 0.8} ${size / 2 + 11.156} ${size / 2 - innerRadius + 0.8} ${size / 2}Z`}
          fill={COLORS.text}
        />
      </Svg>
    </Pressable>
  );
}

// Simplified record button using circles
function RecordButtonSimple({ isRecording, onPress }: { isRecording: boolean; onPress: () => void }) {
  const size = 101;
  return (
    <Pressable onPress={onPress} style={styles.recordButtonContainer}>
      <View style={styles.recordButtonOuter}>
        <View style={[
          styles.recordButtonInner,
          !isRecording && styles.recordButtonPaused
        ]} />
      </View>
    </Pressable>
  );
}

// Plus icon for caption - simple circle with +
function PlusIcon({ size = 37 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Line x1="18.5" y1="11" x2="18.5" y2="26" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" />
      <Line x1="11" y1="18.5" x2="26" y2="18.5" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// Audio waveform bars - exact from SVG design
function AudioWaveform({ isRecording }: { isRecording: boolean }) {
  // Bar positions and heights from SVG (relative to center)
  const barsData = [
    { x: 120, height: 39 },  // 347-308
    { x: 136, height: 48 },  // 342-294... approximated
    { x: 152, height: 82 },
    { x: 168, height: 51 },
    { x: 184, height: 44 },
    { x: 200, height: 57 },
    { x: 216, height: 56 },
    { x: 232, height: 69 },
    { x: 248, height: 57 },
    { x: 264, height: 34 },
  ];
  
  const [bars, setBars] = useState(barsData.map(b => b.height));
  
  useEffect(() => {
    if (!isRecording) return;
    
    const interval = setInterval(() => {
      setBars(barsData.map(b => Math.random() * 50 + 30));
    }, 100);
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  return (
    <View style={styles.waveformContainer}>
      {bars.map((height, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            { height: height * SCALE },
          ]}
        />
      ))}
    </View>
  );
}

export default function NewMemoryScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [caption, setCaption] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    router.back();
  };

  const handleReset = () => {
    setRecordingTime(0);
    setIsRecording(true);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    } else {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handleConfirm = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleFoldIt = () => {
    console.log('Folding memory:', { recordingTime, selectedMood, caption });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header - from SVG: close at x=33, title centered */}
      <View style={styles.header}>
        <CloseButton size={48.54} onPress={handleClose} />
        <Text style={styles.headerTitle}>New Memory</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tagline - "Unfold your mind." */}
        <Text style={styles.tagline}>Unfold your mind.</Text>

        {/* Recording Card - rect x=17 y=173 w=358 h=400 rx=25 */}
        <View style={styles.recordingCard}>
          {/* Timer - large centered text */}
          <Text style={styles.timer}>{formatTime(recordingTime)}</Text>

          {/* Waveform */}
          <AudioWaveform isRecording={isRecording} />

          {/* Controls - Reset, Record, Confirm */}
          <View style={styles.controls}>
            <Pressable onPress={handleReset} style={styles.controlButton}>
              <ResetIcon size={60} />
            </Pressable>

            <RecordButtonSimple isRecording={isRecording} onPress={handleToggleRecording} />

            <Pressable onPress={handleConfirm} style={styles.controlButton}>
              <CheckIcon size={60} />
            </Pressable>
          </View>
        </View>

        {/* Mood Section - rect x=17 y=589 w=358 h=136 rx=25 */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionLabel}>How you feeling right now?</Text>
          <View style={styles.moodOptions}>
            {MOODS.map((mood) => (
              <View key={mood.type} style={styles.moodButtonWrapper}>
                <Pressable
                  style={[
                    styles.moodButton,
                    selectedMood === mood.type && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood.type)}
                >
                  <Image 
                    source={MOOD_IMAGES[mood.type]} 
                    style={styles.moodImage}
                    resizeMode="contain"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Caption Section - rect x=17 y=741 w=358 h=136 rx=25 */}
        <View style={styles.captionSection}>
          <Text style={styles.sectionLabel}>Caption this?</Text>
          <View style={styles.captionInputContainer}>
            <TextInput
              style={styles.captionInput}
              placeholder="thinking...."
              placeholderTextColor={COLORS.textLight}
              value={caption}
              onChangeText={setCaption}
              multiline
            />
            <Pressable style={styles.captionAddButton}>
              <PlusIcon size={37} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Fold It Button - rect x=21 y=909 w=350 h=50 rx=25 */}
      <View style={styles.footer}>
        <Pressable style={styles.foldButton} onPress={handleFoldIt}>
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
  tagline: {
    fontSize: 36 * SCALE,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20 * SCALE,
    marginBottom: 30 * SCALE,
  },
  // Recording card - matches rect x=17 y=173 w=358 h=400 rx=25
  recordingCard: {
    width: 358 * SCALE,
    height: 400 * SCALE,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  timer: {
    fontSize: 80 * SCALE,
    fontFamily: 'JockeyOne',
    color: COLORS.text,
    letterSpacing: -2,
    marginBottom: 10 * SCALE,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8 * SCALE,
    height: 100 * SCALE,
    marginBottom: 20 * SCALE,
    width: '100%',
  },
  waveformBar: {
    width: 8 * SCALE,
    backgroundColor: COLORS.primary,
    borderRadius: 3 * SCALE,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20 * SCALE,
    gap: 50 * SCALE, // Space between buttons
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonOuter: {
    width: 101 * SCALE,
    height: 101 * SCALE,
    borderRadius: 50.5 * SCALE,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonInner: {
    width: 40.4 * SCALE,
    height: 40.4 * SCALE,
    borderRadius: 20.2 * SCALE,
    backgroundColor: COLORS.background,
  },
  recordButtonPaused: {
    borderRadius: 6 * SCALE,
    width: 30 * SCALE,
    height: 30 * SCALE,
  },
  // Mood section - matches rect x=17 y=589 w=358 h=136 rx=25
  moodSection: {
    width: 358 * SCALE,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25 * SCALE,
    paddingHorizontal: 13 * SCALE,
    paddingTop: 16 * SCALE,
    paddingBottom: 16 * SCALE,
    marginTop: 16 * SCALE,
    alignSelf: 'center',
  },
  sectionLabel: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12 * SCALE,
    paddingLeft: 3 * SCALE,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  // Wrapper for button + label
  moodButtonWrapper: {
    alignItems: 'center',
  },
  // Mood button - uses PNG image which includes background
  moodButton: {
    borderRadius: 10 * SCALE,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  moodButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  moodImage: {
    width: 60 * SCALE,
    height: 60 * SCALE,
  },
  moodText: {
    fontSize: 10 * SCALE,
    fontWeight: '400',
    color: COLORS.text,
  },
  // Caption section - matches rect x=17 y=741 w=358 h=136 rx=25
  captionSection: {
    width: 358 * SCALE,
    height: 136 * SCALE,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25 * SCALE,
    padding: 16 * SCALE,
    marginTop: 16 * SCALE,
    alignSelf: 'center',
  },
  captionInputContainer: {
    flex: 1,
    position: 'relative',
  },
  captionInput: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: COLORS.text,
  },
  captionAddButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  footer: {
    paddingHorizontal: 21 * SCALE,
    paddingBottom: 20 * SCALE,
  },
  // Fold button - rect x=21 y=909 w=350 h=50 rx=25
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
