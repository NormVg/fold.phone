import { StoryMediaToolbar } from '@/components/entry';
import { MoodPicker, type MoodType } from '@/components/mood/MoodPicker';
import { validateMediaSize } from '@/lib/media';
import { useTimeline } from '@/lib/timeline-context';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoLocation from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Character limit per page
const CHAR_LIMIT = 750;

// Colors matching app aesthetic
const COLORS = {
  background: '#EDEADC',
  cardBackground: '#E5E1D3',
  primary: '#810100',
  text: '#181717',
  textLight: 'rgba(0, 0, 0, 0.4)',
  white: '#FDFBF7',
  warning: '#F59E0B',
  danger: '#EF4444',
};

// Back arrow icon
// Close X icon in maroon circle - from entry-text.tsx
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

// Chevron icons for page navigation
function ChevronLeft({ size = 20, color = COLORS.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight({ size = 20, color = COLORS.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Photo icon (for media button)
function PhotoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z"
        stroke={COLORS.primary}
        strokeWidth={2}
      />
      <Path
        d="M4 16L8 12L11 15L15 10L20 16"
        stroke={COLORS.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10Z"
        fill={COLORS.primary}
      />
    </Svg>
  );
}

// Mic icon
function MicIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
        stroke={COLORS.primary}
        strokeWidth={2}
      />
      <Path
        d="M19 10V12C19 15.866 15.866 19 12 19M12 19C8.13401 19 5 15.866 5 12V10M12 19V23M8 23H16"
        stroke={COLORS.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Video icon
function VideoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6C3 4.89543 3.89543 4 5 4H15C16.1046 4 17 4.89543 17 6V18C17 19.1046 16.1046 20 15 20H5C3.89543 20 3 19.1046 3 18V6Z"
        stroke={COLORS.primary}
        strokeWidth={2}
      />
      <Path
        d="M17 9L21 6V18L17 15"
        stroke={COLORS.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Location icon
function LocationIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        stroke={COLORS.primary}
        strokeWidth={2}
      />
      <Path
        d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
        stroke={COLORS.primary}
        strokeWidth={2}
      />
    </Svg>
  );
}

// Location tag icon (white for tag background)
function LocationTagIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        fill="white"
      />
      <Path
        d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
        fill={COLORS.primary}
      />
    </Svg>
  );
}

// Trash icon for delete page
function TrashIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6H5H21M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6"
        stroke={COLORS.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Page icon for Add Page button
function PageIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={COLORS.textLight}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2V8H20"
        stroke={COLORS.textLight}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18V12M9 15H15"
        stroke={COLORS.textLight}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Play icon for video thumbnail
function PlayIcon({ size = 32 }: { size?: number }) {
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <Path d="M8 5V19L19 12L8 5Z" fill="white" />
      </Svg>
    </View>
  );
}

// Close icon for removing media
function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface StoryPage {
  id: string;
  content: string;
  media: { uri: string; type: 'image' | 'video'; duration?: number }[];
}

export default function EntryStoryScreen() {
  const router = useRouter();
  const { addEntry, isSaving } = useTimeline();
  const [storyTitle, setStoryTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [pages, setPages] = useState<StoryPage[]>([{ id: '1', content: '', media: [] }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentPage = pages[currentPageIndex];

  // Get today's date
  const today = new Date();
  const dayName = 'TODAY';
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleClose = () => {
    if (storyTitle.trim() || pages.some(p => p.content.trim() || p.media.length > 0)) {
      Alert.alert(
        'Discard Story?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Keep Writing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleAddPage = () => {
    const newPage: StoryPage = {
      id: Date.now().toString(),
      content: '',
      media: [],
    };
    const newPages = [...pages, newPage];
    setPages(newPages);

    // Animate and scroll to new page
    setTimeout(() => {
      setCurrentPageIndex(newPages.length - 1);
      flatListRef.current?.scrollToIndex({ index: newPages.length - 1, animated: true });
    }, 100);
  };

  const handleDeletePage = () => {
    if (pages.length === 1) {
      Alert.alert('Cannot Delete', 'You need at least one page in your story.');
      return;
    }

    Alert.alert(
      'Delete Page?',
      `Are you sure you want to delete page ${currentPageIndex + 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newPages = pages.filter((_, i) => i !== currentPageIndex);
            setPages(newPages);

            // Adjust current page index
            const newIndex = Math.min(currentPageIndex, newPages.length - 1);
            setCurrentPageIndex(newIndex);

            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
            }, 100);
          },
        },
      ]
    );
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      const newIndex = currentPageIndex - 1;
      setCurrentPageIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      const newIndex = currentPageIndex + 1;
      setCurrentPageIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handlePageChange = (text: string) => {
    if (text.length > CHAR_LIMIT) return;
    const newPages = [...pages];
    newPages[currentPageIndex].content = text;
    setPages(newPages);
  };

  const handlePhotoPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      // Validate file sizes
      const validMedia: { uri: string; type: 'image' | 'video'; duration?: number }[] = [];
      const oversized: string[] = [];

      for (const asset of result.assets) {
        const mediaType = asset.type === 'video' ? 'video' : 'image';
        const err = await validateMediaSize(asset.uri, mediaType as 'image' | 'video', asset.fileSize);
        if (err) {
          oversized.push(err);
        } else {
          validMedia.push({
            uri: asset.uri,
            type: (asset.type === 'video' ? 'video' : 'image') as 'image' | 'video',
            duration: asset.duration ? Math.round(asset.duration / 1000) : undefined,
          });
        }
      }

      if (oversized.length > 0) {
        Alert.alert('File Too Large', oversized[0]);
      }

      if (validMedia.length > 0) {
        const newPages = [...pages];
        newPages[currentPageIndex].media = [...newPages[currentPageIndex].media, ...validMedia];
        setPages(newPages);
      }
    }
  };

  const handleMicPress = () => {
    router.push('/entry-audio');
  };

  const handleVideoPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      // Validate file sizes
      const validMedia: { uri: string; type: 'video'; duration?: number }[] = [];
      const oversized: string[] = [];

      for (const asset of result.assets) {
        const err = await validateMediaSize(asset.uri, 'video', asset.fileSize);
        if (err) {
          oversized.push(err);
        } else {
          validMedia.push({
            uri: asset.uri,
            type: 'video' as const,
            duration: asset.duration ? Math.round(asset.duration / 1000) : undefined,
          });
        }
      }

      if (oversized.length > 0) {
        Alert.alert('File Too Large', oversized[0]);
      }

      if (validMedia.length > 0) {
        const newPages = [...pages];
        newPages[currentPageIndex].media = [...newPages[currentPageIndex].media, ...validMedia];
        setPages(newPages);
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
      }
    } catch (err) {
      console.error('Location error:', err);
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Journal press - not needed in story page since we're already here
  const handleJournalPress = () => {
    // Already on story page, do nothing
  };

  const handleRemoveMedia = (mediaIndex: number) => {
    const newPages = [...pages];
    newPages[currentPageIndex].media = newPages[currentPageIndex].media.filter((_, i) => i !== mediaIndex);
    setPages(newPages);
  };

  const handleFoldStory = async () => {
    if (isSaving) return; // debounce
    if (!storyTitle.trim()) {
      Alert.alert('Add a title', 'Please give your story a title.');
      return;
    }

    if (!selectedMood) {
      Alert.alert('Select a mood', 'Please select a mood for your story.');
      return;
    }

    const hasContent = pages.some(page => page.content.trim().length > 0 || page.media.length > 0);
    if (!hasContent) {
      Alert.alert('Write something', 'Please write at least one page of your story.');
      return;
    }

    // Check if any page exceeds the character limit
    const exceededPage = pages.find(page => page.content.length > CHAR_LIMIT);
    if (exceededPage) {
      Alert.alert('Too long', `One of your pages exceeds the ${CHAR_LIMIT} character limit. Please shorten it.`);
      return;
    }

    // Combine all pages
    const storyContent = pages.map(page => page.content.trim()).filter(Boolean).join('\n\n---\n\n');

    // Collect all media from all pages
    const allMedia = pages.flatMap(page => page.media);

    try {
      await addEntry({
        type: 'story',
        mood: selectedMood,
        location: location || undefined,
        title: storyTitle.trim(),
        storyContent: storyContent,
        pageCount: pages.length,
        media: allMedia.length > 0 ? allMedia.map(m => ({
          uri: m.uri,
          type: m.type as 'image' | 'video',
          duration: m.duration,
        })) : [],
      });

      // Navigate to timeline
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (err) {
      console.error('Failed to fold story:', err);
      Alert.alert('Error', 'Failed to save your story. Please try again.');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = SCREEN_WIDTH - 48 * SCALE + 8 * SCALE;
    const index = Math.round(offsetX / pageWidth);
    if (index !== currentPageIndex && index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
    }
  };

  const charCount = currentPage.content.length;
  const charPercentage = charCount / CHAR_LIMIT;
  const counterColor = charPercentage > 0.9 ? COLORS.danger : charPercentage > 0.75 ? COLORS.warning : COLORS.textLight;

  const renderPage = ({ item, index }: { item: StoryPage; index: number }) => (
    <View style={styles.pageWrapper}>
      <View style={styles.contentCard}>
        {/* Text Input Area - Scrollable */}
        <ScrollView
          style={styles.contentScrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.contentInput}
            placeholder={`Start writing to unfold your thoughts...\nWhat made today memorable?`}
            placeholderTextColor={COLORS.textLight}
            value={item.content}
            onChangeText={(text) => {
              const newPages = [...pages];
              newPages[index].content = text;
              setPages(newPages);
            }}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </ScrollView>

        {/* Media Thumbnails */}
        {item.media.length > 0 && (
          <View style={styles.mediaRow}>
            {item.media.map((media, mediaIndex) => (
              <View key={mediaIndex} style={styles.mediaThumbnailContainer}>
                <ExpoImage
                  source={{ uri: media.uri }}
                  style={styles.mediaThumbnail}
                  contentFit="cover"
                />
                {media.type === 'video' && (
                  <View style={styles.videoOverlay}>
                    <PlayIcon size={28} />
                    {media.duration && (
                      <Text style={styles.durationText}>{formatDuration(media.duration)}</Text>
                    )}
                  </View>
                )}
                <Pressable
                  style={styles.removeMediaButton}
                  onPress={() => {
                    const newPages = [...pages];
                    newPages[index].media = newPages[index].media.filter((_, i) => i !== mediaIndex);
                    setPages(newPages);
                  }}
                >
                  <Text style={styles.removeMediaText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Row: Media Toolbar + Counter */}
        <View style={styles.cardBottomRow}>
          <StoryMediaToolbar
            onPhotoPress={handlePhotoPress}
            onVideoPress={handleVideoPress}
            onLocationPress={handleAddLocation}
            location={location}
            onClearLocation={() => setLocation(null)}
          />
          <Text style={[styles.charCounter, { color: counterColor }]}>
            {item.content.length}/{CHAR_LIMIT}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header - Fixed at top */}
      <View style={styles.header}>
        <CloseButton size={48.54} onPress={handleClose} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerDay}>{dayName}</Text>
          <Text style={styles.headerDate}>{dateStr}</Text>
        </View>
        <View style={styles.pageNavigation}>
          <Pressable
            onPress={handlePrevPage}
            style={[styles.navButton, currentPageIndex === 0 && styles.navButtonDisabled]}
            disabled={currentPageIndex === 0}
          >
            <ChevronLeft size={18} color={currentPageIndex === 0 ? COLORS.textLight : COLORS.primary} />
          </Pressable>
          <Text style={styles.pageCounter}>{currentPageIndex + 1}/{pages.length}</Text>
          <Pressable
            onPress={handleNextPage}
            style={[styles.navButton, currentPageIndex === pages.length - 1 && styles.navButtonDisabled]}
            disabled={currentPageIndex === pages.length - 1}
          >
            <ChevronRight size={18} color={currentPageIndex === pages.length - 1 ? COLORS.textLight : COLORS.primary} />
          </Pressable>
        </View>
      </View>

      {/* Scrollable Content - Keyboard Aware */}
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Story Title */}
        <View style={styles.titleSection}>
          <TextInput
            style={styles.titleInput}
            placeholder="Give your story a title..."
            placeholderTextColor={COLORS.textLight}
            value={storyTitle}
            onChangeText={setStoryTitle}
            maxLength={100}
          />
        </View>

        {/* Pages Carousel */}
        <Animated.View style={[styles.pagesContainer, { opacity: fadeAnim }]}>
          <FlatList
            ref={flatListRef}
            data={pages}
            renderItem={renderPage}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            snapToInterval={SCREEN_WIDTH - 48 * SCALE + 8 * SCALE}
            decelerationRate="fast"
            contentContainerStyle={styles.pagesContent}
            scrollEventThrottle={16}
          />
        </Animated.View>

        {/* Page Dots */}
        {pages.length > 1 && (
          <View style={styles.dotsContainer}>
            {pages.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setCurrentPageIndex(index);
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }}
              >
                <View
                  style={[
                    styles.dot,
                    index === currentPageIndex && styles.activeDot,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        )}

        {/* Add Page + Delete Page Row */}
        <View style={styles.pageActionsRow}>
          <Pressable style={styles.addPageButton} onPress={handleAddPage}>
            <PageIcon size={20} />
            <Text style={styles.addPageText}>ADD PAGE</Text>
          </Pressable>

          {pages.length > 1 && (
            <Pressable style={styles.deletePageButton} onPress={handleDeletePage}>
              <TrashIcon size={18} />
            </Pressable>
          )}
        </View>

        {/* Mood Picker */}
        <View style={styles.moodSection}>
          <MoodPicker
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* Fold Story Button - Fixed at bottom */}
      <View style={styles.bottomSection}>
        <Pressable
          style={({ pressed }) => [
            styles.foldButton,
            (pressed || isSaving) && styles.foldButtonPressed,
          ]}
          onPress={handleFoldStory}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.foldButtonText}>Fold Story</Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20 * SCALE,
  },
  bottomSection: {
    paddingHorizontal: 21 * SCALE,
    paddingTop: 12 * SCALE,
    paddingBottom: 32 * SCALE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 12 * SCALE,
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerDay: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  headerDate: {
    fontSize: 16 * SCALE,
    fontWeight: '700',
    color: COLORS.text,
  },
  pageNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  pageCounter: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 35,
    textAlign: 'center',
  },
  titleSection: {
    paddingHorizontal: 20 * SCALE,
  },
  titleInput: {
    fontSize: 24 * SCALE,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16 * SCALE,
  },
  pagesContainer: {
    flex: 1,
    minHeight: 350 * SCALE,
  },
  pagesContent: {
    paddingHorizontal: 20 * SCALE,
  },
  pageWrapper: {
    width: SCREEN_WIDTH - 48 * SCALE,
    marginHorizontal: 4 * SCALE,
    paddingVertical: 8 * SCALE,
  },
  contentCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16 * SCALE,
    padding: 16 * SCALE,
    borderLeftWidth: 4 * SCALE,
    borderLeftColor: COLORS.primary,
    minHeight: 500 * SCALE,
  },
  contentScrollView: {
    flex: 1,
    minHeight: 150 * SCALE,
  },
  contentInput: {
    fontSize: 16 * SCALE,
    lineHeight: 24 * SCALE,
    color: COLORS.text,
    minHeight: 150 * SCALE,
  },
  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 * SCALE,
    marginTop: 12 * SCALE,
  },
  mediaThumbnailContainer: {
    position: 'relative',
    borderRadius: 8 * SCALE,
    overflow: 'visible',
  },
  mediaThumbnail: {
    width: 70 * SCALE,
    height: 70 * SCALE,
    borderRadius: 8 * SCALE,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  durationText: {
    color: 'white',
    fontSize: 11 * SCALE,
    fontWeight: '600',
    marginTop: 4,
  },
  removeMediaButton: {
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
  removeMediaText: {
    color: '#FFFFFF',
    fontSize: 14 * SCALE,
    fontWeight: '600',
    lineHeight: 16 * SCALE,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12 * SCALE,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 8 * SCALE,
  },
  mediaButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    borderRadius: 20 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  charCounter: {
    fontSize: 14 * SCALE,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8 * SCALE,
    paddingVertical: 12 * SCALE,
  },
  dot: {
    width: 8 * SCALE,
    height: 8 * SCALE,
    borderRadius: 4 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.25)',
  },
  activeDot: {
    width: 20 * SCALE,
    backgroundColor: COLORS.primary,
  },
  bottomActions: {
    paddingHorizontal: 20 * SCALE,
    paddingBottom: 20 * SCALE,
    gap: 12 * SCALE,
  },
  moodSection: {
    paddingHorizontal: 20 * SCALE,
    marginTop: 16 * SCALE,
    marginBottom: 8 * SCALE,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 16 * SCALE,
    gap: 6 * SCALE,
    marginTop: 8 * SCALE,
    marginHorizontal: 20 * SCALE,
    alignSelf: 'flex-start',
  },
  locationTagText: {
    color: '#FFFFFF',
    fontSize: 12 * SCALE,
    fontWeight: '500',
  },
  locationTagClose: {
    marginLeft: 4 * SCALE,
    padding: 2 * SCALE,
  },
  locationTagCloseText: {
    color: '#FFFFFF',
    fontSize: 16 * SCALE,
    fontWeight: '600',
    lineHeight: 16 * SCALE,
  },
  pageActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 * SCALE,
    paddingHorizontal: 20 * SCALE,
    marginTop: 8 * SCALE,
  },
  addPageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8 * SCALE,
    paddingVertical: 14 * SCALE,
    borderRadius: 12 * SCALE,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.textLight,
  },
  addPageText: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: COLORS.textLight,
    letterSpacing: 1,
  },
  deletePageButton: {
    width: 48 * SCALE,
    height: 48 * SCALE,
    borderRadius: 12 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foldButton: {
    width: 350 * SCALE,
    height: 50 * SCALE,
    backgroundColor: COLORS.primary,
    borderRadius: 25 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  foldButtonPressed: {
    opacity: 0.8,
  },
  foldButtonText: {
    fontSize: 24 * SCALE,
    fontFamily: 'SignPainter',
    color: COLORS.white,
  },
});
