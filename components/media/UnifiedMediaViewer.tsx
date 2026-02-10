import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCALE = SCREEN_WIDTH / 393;

// Icons logic reused
function VideoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5V19L19 12L8 5Z" fill="white" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

interface CommonMediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  thumbnailUri?: string | null;
}

export function UnifiedMediaViewer({
  isVisible,
  onClose,
  items,
  initialIndex = 0,
}: {
  isVisible: boolean;
  onClose: () => void;
  items: CommonMediaItem[];
  initialIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const videoRefs = useRef<{ [key: number]: Video | null }>({});

  // Reset active index when initialIndex changes or modal opens
  useEffect(() => {
    if (isVisible) {
      setActiveIndex(initialIndex);
    }
  }, [isVisible, initialIndex]);

  // Pause videos when closing
  const handleClose = async () => {
    // Pause all videos
    for (const key in videoRefs.current) {
      const video = videoRefs.current[key];
      if (video) {
        await video.pauseAsync();
      }
    }
    onClose();
  };

  const handleFullscreenScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* Close button */}
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>

        {/* Swipeable List */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleFullscreenScroll}
          scrollEventThrottle={16}
          style={styles.fullscreenScrollView}
          contentOffset={{ x: initialIndex * SCREEN_WIDTH, y: 0 }}
        >
          {items.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.fullscreenItemContainer}>
              {item.type === 'video' ? (
                <View style={styles.videoWrapper}>
                  <Video
                    ref={(ref: Video | null) => {
                      videoRefs.current[index] = ref;
                    }}
                    source={{ uri: item.uri }}
                    style={styles.fullscreenVideo}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={index === activeIndex}
                    isLooping
                  />
                </View>
              ) : (
                <Image
                  source={{ uri: item.uri }}
                  style={styles.fullscreenImage}
                  contentFit="contain" // Ensures we see the whole image
                  transition={200}
                />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>{activeIndex + 1} / {items.length}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.98)', // Slightly darker for immersion
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20, // Higher than video controls
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  fullscreenScrollView: {
    flex: 1,
  },
  fullscreenItemContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, // Full height
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH - 24, // Horizontal padding
    height: SCREEN_HEIGHT - 120,
    borderRadius: 12, // Soften edges
  },
  videoWrapper: {
    width: SCREEN_WIDTH - 24, // Horizontal padding
    height: SCREEN_HEIGHT - 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullscreenVideo: {
    width: '100%', // Match wrapper width
    height: '100%',
  },
  counterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
