import { MoodPicker, type MoodType } from '@/components/mood';
import { useTimeline } from '@/lib/timeline-context';
import { Audio } from 'expo-av';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
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
  buttonBorder: 'rgba(0, 0, 0, 0.25)',
};

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

// Reset/Undo icon - exact path from design
function ResetIcon({ size = 60 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 60 60" fill="none">
      <Circle cx="30" cy="30" r="30" fill={COLORS.white} />
      <Circle cx="30" cy="30" r="29.5" stroke={COLORS.buttonBorder} />
      <Path
        d="M2.86523 11.4572C2.86523 13.1569 3.36926 14.8185 4.31358 16.2318C5.25789 17.645 6.60008 18.7465 8.17042 19.397C9.74076 20.0474 11.4687 20.2176 13.1358 19.886C14.8028 19.5544 16.3341 18.7359 17.536 17.5341C18.7379 16.3322 19.5564 14.8009 19.888 13.1338C20.2196 11.4668 20.0494 9.7388 19.3989 8.16846C18.7485 6.59813 17.647 5.25594 16.2337 4.31162C14.8204 3.36731 13.1589 2.86328 11.4592 2.86328C9.05665 2.87232 6.75062 3.80978 5.02327 5.47966L2.86523 7.63769"
        stroke={COLORS.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(18.5, 18.5)"
      />
      <Path
        d="M2.86523 2.86328V7.63769H7.63965"
        stroke={COLORS.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(18.5, 18.5)"
      />
    </Svg>
  );
}

// Checkmark icon - exact path from design
function CheckIcon({ size = 60 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 60 60" fill="none">
      <Circle cx="30" cy="30" r="30" fill={COLORS.white} />
      <Circle cx="30" cy="30" r="29.5" stroke={COLORS.buttonBorder} />
      <Path
        d="M19.1003 5.73047L8.59531 16.2355L3.82031 11.4605"
        stroke={COLORS.text}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(18.5, 18.5)"
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

// Location icon for caption - pin marker
function LocationIcon({ size = 37 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Path
        d="M18.5 10C15.19 10 12.5 12.69 12.5 16C12.5 20.5 18.5 27 18.5 27C18.5 27 24.5 20.5 24.5 16C24.5 12.69 21.81 10 18.5 10ZM18.5 18.5C17.12 18.5 16 17.38 16 16C16 14.62 17.12 13.5 18.5 13.5C19.88 13.5 21 14.62 21 16C21 17.38 19.88 18.5 18.5 18.5Z"
        fill={COLORS.primary}
      />
    </Svg>
  );
}

// Audio waveform bars - responds to real microphone metering
function AudioWaveform({ isRecording, meterLevel }: { isRecording: boolean; meterLevel: number }) {
  const NUM_BARS = 10;
  const animatedHeights = useRef(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(20))
  ).current;
  const lastMeterRef = useRef(meterLevel);

  useEffect(() => {
    lastMeterRef.current = meterLevel;

    if (!isRecording) {
      // Reset to static heights when not recording
      animatedHeights.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: 20 + (i % 3) * 5,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    // Convert decibel level (-160 to 0 dB) to visual height (20-80)
    // Typical voice is around -30 to -10 dB
    const normalizedLevel = Math.max(0, Math.min(1, (meterLevel + 60) / 60));
    const baseHeight = 20 + normalizedLevel * 60;

    // Animate each bar with variation for wave effect
    animatedHeights.forEach((anim, index) => {
      const variation = Math.sin(Date.now() / 100 + index) * 10;
      const barHeight = Math.max(15, Math.min(80, baseHeight + variation * normalizedLevel));

      Animated.timing(anim, {
        toValue: barHeight,
        duration: 80,
        useNativeDriver: false,
      }).start();
    });
  }, [isRecording, meterLevel]);

  return (
    <View style={styles.waveformContainer}>
      {animatedHeights.map((animHeight, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveformBar,
            { height: Animated.multiply(animHeight, SCALE) },
          ]}
        />
      ))}
    </View>
  );
}

export default function NewMemoryScreen() {
  const router = useRouter();
  const { addEntry } = useTimeline();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [meterLevel, setMeterLevel] = useState(-60);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [caption, setCaption] = useState('');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meteringRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request permissions and start recording on mount
  useEffect(() => {
    const setupRecording = async () => {
      try {
        // Request permissions
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant microphone permission to record audio.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }
        setPermissionGranted(true);

        // Set audio mode for recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // Start recording automatically
        await startRecording();
      } catch (err) {
        console.error('Failed to setup recording:', err);
        Alert.alert('Error', 'Failed to start recording. Please try again.');
      }
    };

    setupRecording();

    // Cleanup on unmount
    return () => {
      stopAllTimers();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => { });
      }
    };
  }, []);

  const stopAllTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (meteringRef.current) {
      clearInterval(meteringRef.current);
      meteringRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start metering - poll every 100ms
      meteringRef.current = setInterval(async () => {
        if (recordingRef.current) {
          try {
            const status = await recordingRef.current.getStatusAsync();
            if (status.isRecording && status.metering !== undefined) {
              setMeterLevel(status.metering);
            }
          } catch (err) {
            // Ignore errors during polling
          }
        }
      }, 100);

    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const pauseRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.pauseAsync();
        setIsPaused(true);
        setIsRecording(false);
        stopAllTimers();
      } catch (err) {
        console.error('Failed to pause recording:', err);
      }
    }
  };

  const resumeRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.startAsync();
        setIsPaused(false);
        setIsRecording(true);

        // Restart timers
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        meteringRef.current = setInterval(async () => {
          if (recordingRef.current) {
            try {
              const status = await recordingRef.current.getStatusAsync();
              if (status.isRecording && status.metering !== undefined) {
                setMeterLevel(status.metering);
              }
            } catch (err) { }
          }
        }, 100);
      } catch (err) {
        console.error('Failed to resume recording:', err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = async () => {
    stopAllTimers();
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (err) { }
    }
    router.back();
  };

  const handleReset = async () => {
    stopAllTimers();
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (err) { }
    }
    recordingRef.current = null;
    setRecordingTime(0);
    setMeterLevel(-60);
    setRecordingUri(null);
    await startRecording();
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      await pauseRecording();
    } else if (isPaused) {
      await resumeRecording();
    } else {
      await startRecording();
    }
  };

  const handleConfirm = async () => {
    stopAllTimers();
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        setRecordingUri(uri);
        setIsRecording(false);
        setIsPaused(false);
        console.log('Recording saved to:', uri);
      } catch (err) {
        console.error('Failed to stop recording:', err);
      }
    }
  };

  const handleAddLocation = async () => {
    if (isLoadingLocation) return;

    setIsLoadingLocation(true);
    try {
      // Request permissions
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant location permission to add your location.'
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current position
      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const addresses = await ExpoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        // Format location name (city, region or full address)
        const locationName = addr.city || addr.subregion || addr.region ||
          `${addr.street || ''} ${addr.name || ''}`.trim() ||
          `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
        setLocation(locationName);
        console.log('Location set:', locationName);
      }
    } catch (err) {
      console.error('Failed to get location:', err);
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleFoldIt = async () => {
    // Require mood selection
    if (!selectedMood) {
      Alert.alert('Choose a mood', 'Please select how you\'re feeling before folding.');
      return;
    }

    // If still recording, stop and save first
    let finalUri = recordingUri;

    if (recordingRef.current && (isRecording || isPaused)) {
      try {
        stopAllTimers();
        await recordingRef.current.stopAndUnloadAsync();
        finalUri = recordingRef.current.getURI();
        setRecordingUri(finalUri);
        setIsRecording(false);
        setIsPaused(false);
        console.log('Recording auto-saved to:', finalUri);
      } catch (err) {
        console.error('Failed to stop recording:', err);
      }
    }

    // Add entry to timeline with the final URI
    addEntry({
      type: 'audio',
      mood: selectedMood,
      caption: caption || 'Voice memo',
      audioUri: finalUri || undefined,
      audioDuration: recordingTime,
      location: location || undefined,
    });

    console.log('Folding memory:', { recordingUri: finalUri, recordingTime, selectedMood, caption });
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
          {/* Tagline - "Unfold your mind." */}
          <Text style={styles.tagline}>Unfold your mind.</Text>

          {/* Recording Card - rect x=17 y=173 w=358 h=400 rx=25 */}
          <View style={styles.recordingCard}>
            {/* Timer - large centered text */}
            <Text style={styles.timer}>{formatTime(recordingTime)}</Text>

            {/* Waveform */}
            <AudioWaveform isRecording={isRecording} meterLevel={meterLevel} />

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

          {/* Mood Section */}
          <MoodPicker
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
            style={styles.moodSection}
          />

          {/* Caption Section */}
          <View style={styles.captionSection}>
            <Text style={styles.captionLabel}>Caption this?</Text>
            <View style={styles.captionInputContainer}>
              <TextInput
                style={styles.captionInput}
                placeholder="thinking...."
                placeholderTextColor={COLORS.textLight}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
              <Pressable
                style={({ pressed }) => [
                  styles.captionAddButton,
                  {
                    opacity: pressed || isLoadingLocation ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  }
                ]}
                onPress={handleAddLocation}
                disabled={isLoadingLocation}
              >
                <LocationIcon size={37} />
              </Pressable>
            </View>

            {/* Location tag */}
            {location && (
              <View style={styles.locationTag}>
                <LocationIcon size={14} />
                <Text style={styles.locationTagText}>{location}</Text>
                <Pressable onPress={() => setLocation(null)} style={styles.locationTagClose}>
                  <Text style={styles.locationTagCloseText}>×</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fold It Button - rect x=21 y=909 w=350 h=50 rx=25 */}
        <View style={styles.footer}>
          <Pressable style={styles.foldButton} onPress={handleFoldIt}>
            <Text style={styles.foldButtonText}>Fold it</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    gap: 30 * SCALE, // Space between buttons
  },
  controlButton: {
    width: 60 * SCALE,
    height: 60 * SCALE,
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
  // Mood section - additional margin for positioning
  moodSection: {
    marginTop: 16 * SCALE,
  },
  // Caption section - matches rect x=17 y=741 w=358 h=136 rx=25
  captionSection: {
    width: 358 * SCALE,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25 * SCALE,
    paddingHorizontal: 16 * SCALE,
    paddingTop: 14 * SCALE,
    paddingBottom: 16 * SCALE,
    marginTop: 16 * SCALE,
    alignSelf: 'center',
  },
  captionLabel: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4 * SCALE,
  },
  captionInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  captionInput: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: COLORS.text,
    minHeight: 60 * SCALE,
    textAlignVertical: 'top',
  },
  captionAddButton: {
    marginLeft: 8 * SCALE,
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
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 16 * SCALE,
    marginTop: 10 * SCALE,
    alignSelf: 'flex-start',
    gap: 6 * SCALE,
  },
  locationTagText: {
    color: COLORS.white,
    fontSize: 12 * SCALE,
    fontWeight: '500',
  },
  locationTagClose: {
    marginLeft: 4 * SCALE,
    padding: 2 * SCALE,
  },
  locationTagCloseText: {
    color: COLORS.white,
    fontSize: 16 * SCALE,
    fontWeight: '600',
    lineHeight: 16 * SCALE,
  },
});
