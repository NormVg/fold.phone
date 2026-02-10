import { MediaToolbar } from '@/components/entry';
import { MoodPicker, type MoodType } from '@/components/mood';
import { validateMediaSize } from '@/lib/media';
import { useTimeline } from '@/lib/timeline-context';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

// Location icon
function LocationIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={COLORS.primary}
      />
    </Svg>
  );
}

export default function EntryTextScreen() {
  const router = useRouter();
  const { addEntry, isSaving } = useTimeline();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [textContent, setTextContent] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<{ uri: string; type: 'image' | 'video'; duration?: number }[]>([]);

  const handleClose = () => {
    router.back();
  };

  // Photo picker - only images allowed if images exist (exclusive with videos)
  const handlePhotoPress = async () => {
    // Check if videos are already attached
    const hasVideos = attachedMedia.some(m => m.type === 'video');
    if (hasVideos) {
      Alert.alert(
        'Media Type Conflict',
        'You already have a video attached. Remove it first to add photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      // Validate file sizes
      const validPhotos: { uri: string; type: 'image' }[] = [];
      const oversized: string[] = [];

      for (const asset of result.assets) {
        const err = await validateMediaSize(asset.uri, 'image', asset.fileSize);
        if (err) {
          oversized.push(err);
        } else {
          validPhotos.push({ uri: asset.uri, type: 'image' as const });
        }
      }

      if (oversized.length > 0) {
        Alert.alert('File Too Large', oversized[0]);
      }

      if (validPhotos.length > 0) {
        setAttachedMedia(prev => [...prev, ...validPhotos]);
      }
    }
  };

  // Video picker - only one video allowed (exclusive with photos)
  const handleVideoPress = async () => {
    // Check if photos are already attached
    const hasPhotos = attachedMedia.some(m => m.type === 'image');
    if (hasPhotos) {
      Alert.alert(
        'Media Type Conflict',
        'You already have photos attached. Remove them first to add a video.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if a video is already attached (only one video allowed)
    const hasVideo = attachedMedia.some(m => m.type === 'video');
    if (hasVideo) {
      Alert.alert(
        'Video Limit',
        'Only one video can be attached at a time. Remove the current video first.',
        [{ text: 'OK' }]
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access to add videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60, // 1 minute max
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Validate file size
      const sizeError = await validateMediaSize(asset.uri, 'video', asset.fileSize);
      if (sizeError) {
        Alert.alert('File Too Large', sizeError);
        return;
      }

      // expo-image-picker provides duration in milliseconds
      const durationInSeconds = asset.duration ? Math.round(asset.duration / 1000) : 0;
      setAttachedMedia([{ uri: asset.uri, type: 'video', duration: durationInSeconds }]);
    }
  };

  // Mic press - navigate to audio entry
  const handleMicPress = () => {
    router.push('/entry-audio');
  };

  // Journal press - navigate to story entry page
  const handleJournalPress = () => {
    router.push('/entry-story');
  };

  // Remove attached media
  const handleRemoveMedia = (index: number) => {
    setAttachedMedia(prev => prev.filter((_, i) => i !== index));
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
    if (isSaving) return; // debounce
    // Require mood selection
    if (!selectedMood) {
      Alert.alert('Choose a mood', 'Please select how you\'re feeling before folding.');
      return;
    }

    // Require either text content OR attached media
    if (!textContent.trim() && attachedMedia.length === 0) {
      Alert.alert('Add something', 'Please write something or add media before folding.');
      return;
    }

    try {
      // If we have attached media, handle appropriately
      if (attachedMedia.length > 0) {
        // Separate images and videos
        const images = attachedMedia.filter(m => m.type === 'image');
        const videos = attachedMedia.filter(m => m.type === 'video');

        // Save all images as a single photo entry with media array
        if (images.length > 0) {
          await addEntry({
            type: 'photo',
            mood: selectedMood,
            caption: textContent.trim() || undefined,
            media: images.map(img => ({ uri: img.uri, type: 'image' as const })),
            location: location || undefined,
          });
        }

        // Save each video as separate entry
        for (const video of videos) {
          // Generate a real thumbnail from the video
          let thumbnail: string | undefined;
          try {
            const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(video.uri, { time: 500 });
            thumbnail = thumbUri;
          } catch (e) {
            console.warn('Failed to generate video thumbnail:', e);
          }

          await addEntry({
            type: 'video',
            mood: selectedMood,
            caption: textContent.trim() || undefined,
            media: [{ uri: video.uri, type: 'video' as const, thumbnailUri: thumbnail, duration: video.duration || 0 }],
            location: location || undefined,
          });
        }
      } else {
        // No media, just text entry
        await addEntry({
          type: 'text',
          mood: selectedMood,
          content: textContent.trim(),
          location: location || undefined,
          media: [],
        });
      }

      console.log('Folding memory:', { textContent, selectedMood, location, mediaCount: attachedMedia.length });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (err) {
      console.error('Failed to fold:', err);
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    }
  };

  const handleStoryMode = () => {
    router.replace('/entry-story');
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
            <Text style={styles.textCardLabel}>
              {attachedMedia.length > 0 ? 'Add a caption...' : 'How are you feeling right now?'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={attachedMedia.length > 0 ? 'Write a caption' : 'Write it down'}
              placeholderTextColor={COLORS.textLight}
              value={textContent}
              onChangeText={setTextContent}
              multiline
              textAlignVertical="top"
            />

            {/* Attached Media Preview - above toolbar */}
            {attachedMedia.length > 0 && (
              <View style={styles.mediaPreviewContainer}>
                {attachedMedia.map((media, index) => (
                  <View key={index} style={styles.mediaPreviewItem}>
                    <ExpoImage source={{ uri: media.uri }} style={styles.mediaPreviewImage} />
                    {media.type === 'video' && (
                      <View style={styles.videoIndicator}>
                        <Text style={styles.videoIndicatorText}>▶</Text>
                      </View>
                    )}
                    <Pressable
                      style={styles.mediaRemoveButton}
                      onPress={() => handleRemoveMedia(index)}
                    >
                      <Text style={styles.mediaRemoveText}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Media Toolbar - at bottom of text card */}
            <MediaToolbar
              onPhotoPress={handlePhotoPress}
              onVideoPress={handleVideoPress}
              onMicPress={handleMicPress}
              onJournalPress={handleJournalPress}
              onLocationPress={handleAddLocation}
              location={location}
              onClearLocation={() => setLocation(null)}
            />
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
            { opacity: (pressed || isSaving) ? 0.7 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
          onPress={handleFoldIt}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.foldButtonText}>Fold it</Text>
          )}
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
  // Location tag
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 16 * SCALE,
    gap: 6 * SCALE,
    marginTop: 16 * SCALE,
    alignSelf: 'flex-start',
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
  // Media preview
  mediaPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12 * SCALE,
    marginTop: 12 * SCALE,
    paddingTop: 8 * SCALE,
    paddingRight: 8 * SCALE,
  },
  mediaPreviewItem: {
    position: 'relative',
    width: 64 * SCALE,
    height: 64 * SCALE,
  },
  mediaPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8 * SCALE,
    overflow: 'hidden',
  },
  videoIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8 * SCALE,
  },
  videoIndicatorText: {
    color: COLORS.white,
    fontSize: 16 * SCALE,
  },
  mediaRemoveButton: {
    position: 'absolute',
    top: -4 * SCALE,
    right: -4 * SCALE,
    width: 20 * SCALE,
    height: 20 * SCALE,
    borderRadius: 10 * SCALE,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaRemoveText: {
    color: COLORS.white,
    fontSize: 14 * SCALE,
    fontWeight: '600',
    lineHeight: 16 * SCALE,
  },
});
