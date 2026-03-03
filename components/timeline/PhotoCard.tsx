import { UnifiedMediaViewer } from '@/components/media/UnifiedMediaViewer';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getMoodIcon } from './MoodIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

// Card dimensions - matching design (358x358 in SVG, scaled proportionally)
const CARD_WIDTH = 340 * SCALE;
const IMAGE_HEIGHT = 234 * SCALE; // Proportional to 246/358 ratio
const IMAGE_WIDTH = CARD_WIDTH - 28 * SCALE; // Account for card padding (14 * 2)

interface PhotoCardProps {
  title?: string; // e.g., "Hello"
  time?: string; // e.g., "03:34 PM"
  imageUri?: string; // URI for single photo
  imageUris?: string[]; // URIs for multiple photos (slideshow)
  mood?: string; // e.g., "SAD", "SAT"
  location?: string;
  onImagePress?: () => void;
  onSharePress?: () => void;
  onLocationPress?: () => void;
  onMoodPress?: () => void;
}

// Photo icon - from provided SVG (properly centered)
function PhotoIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 13 11" fill="none">
      <Path
        d="M11.5875 0H1.5875C1.32228 0 1.06793 0.105357 0.880393 0.292893C0.692857 0.48043 0.5875 0.734784 0.5875 1V9.5C0.5875 9.76522 0.692857 10.0196 0.880393 10.2071C1.06793 10.3946 1.32228 10.5 1.5875 10.5H11.5875C11.8527 10.5 12.1071 10.3946 12.2946 10.2071C12.4821 10.0196 12.5875 9.76522 12.5875 9.5V1C12.5875 0.734784 12.4821 0.48043 12.2946 0.292893C12.1071 0.105357 11.8527 0 11.5875 0ZM8.5875 3C8.73478 3 8.87867 3.04373 9.00109 3.12573C9.12351 3.20774 9.21872 3.32408 9.27489 3.45956C9.33106 3.59504 9.34572 3.74361 9.31702 3.88707C9.28832 4.03053 9.21749 4.16228 9.11361 4.26615C9.00974 4.37003 8.87799 4.44086 8.73453 4.46955C8.59107 4.49825 8.4425 4.48359 8.30702 4.42742C8.17154 4.37125 8.0552 4.27604 7.97319 4.15362C7.89119 4.0312 7.84745 3.88731 7.84745 3.74003C7.84745 3.54114 7.92647 3.35038 8.06134 3.21551C8.19621 3.08064 8.38697 3.00162 8.58586 3.00162L8.5875 3ZM11.5875 9.5H1.5875V7L4.5875 4L8.9375 8.35C9.03056 8.44306 9.15692 8.49534 9.28866 8.49534C9.4204 8.49534 9.54676 8.44306 9.63982 8.35C9.73289 8.25694 9.78516 8.13058 9.78516 7.99884C9.78516 7.8671 9.73289 7.74074 9.63982 7.64768L8.5875 6.59536L9.5875 5.59536L11.5875 7.59536V9.5Z"
        fill="#810100"
      />
    </Svg>
  );
}
// Location icon
function LocationIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.48281 10.5621C7.55578 10.6038 7.63836 10.6257 7.72241 10.6257C7.80645 10.6257 7.88904 10.6038 7.962 10.5621C8.10987 10.477 11.5831 8.44978 11.5831 4.83171C11.5528 3.82824 11.1329 2.87601 10.4125 2.1768C9.69212 1.47759 8.7278 1.08633 7.72387 1.08594C6.71995 1.08555 5.75531 1.47605 5.03438 2.1747C4.31344 2.87335 3.89284 3.82525 3.86172 4.82869C3.86172 8.44978 7.33676 10.474 7.48281 10.5621ZM7.72422 3.38025C8.01069 3.38025 8.29073 3.4652 8.52893 3.62436C8.76712 3.78351 8.95277 4.00973 9.0624 4.27439C9.17203 4.53906 9.20071 4.83029 9.14482 5.11126C9.08894 5.39223 8.95099 5.65032 8.74842 5.85289C8.54585 6.05546 8.28776 6.19341 8.0068 6.24929C7.72583 6.30518 7.43459 6.2765 7.16993 6.16687C6.90526 6.05724 6.67904 5.87159 6.51989 5.6334C6.36073 5.3952 6.27578 5.11516 6.27578 4.82869C6.27578 4.44454 6.42838 4.07612 6.70002 3.80449C6.97165 3.53285 7.34007 3.38025 7.72422 3.38025ZM14.4836 11.1052C14.4836 12.987 11.0007 14.0021 7.72422 14.0021C4.44773 14.0021 0.964844 12.987 0.964844 11.1052C0.964844 10.2247 1.76269 9.44498 3.21173 8.91026C3.33056 8.87101 3.46 8.87942 3.57274 8.93374C3.68549 8.98806 3.77274 9.08403 3.8161 9.20143C3.85945 9.31883 3.85553 9.44848 3.80516 9.56304C3.75479 9.6776 3.6619 9.76813 3.54608 9.81554C2.54968 10.1843 1.93047 10.678 1.93047 11.1052C1.93047 11.9115 4.13451 13.0365 7.72422 13.0365C11.3139 13.0365 13.518 11.9115 13.518 11.1052C13.518 10.678 12.8988 10.1843 11.9024 9.81614C11.7865 9.76873 11.6936 9.67821 11.6433 9.56364C11.5929 9.44908 11.589 9.31943 11.6323 9.20203C11.6757 9.08464 11.7629 8.98866 11.8757 8.93435C11.9884 8.88003 12.1179 8.87161 12.2367 8.91087C13.6857 9.44498 14.4836 10.2247 14.4836 11.1052Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Share/forward icon
function ShareIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.3423 7.10213L9.51421 11.9303C9.44668 11.9979 9.36062 12.0439 9.26692 12.0626C9.17321 12.0812 9.07607 12.0717 8.9878 12.0351C8.89953 11.9985 8.8241 11.9366 8.77105 11.8571C8.71801 11.7776 8.68973 11.6842 8.68981 11.5887V9.18848C5.24373 9.38402 2.88097 11.6188 2.21771 12.3268C2.11356 12.438 1.97698 12.5135 1.82741 12.5426C1.67784 12.5717 1.52291 12.5529 1.38465 12.4889C1.24639 12.4248 1.13185 12.3188 1.05734 12.1859C0.982829 12.053 0.952138 11.9 0.969635 11.7486C1.19354 9.80165 2.25995 7.92894 3.97273 6.47568C5.39521 5.26865 7.12429 4.50278 8.68981 4.3688V1.93241C8.68973 1.83686 8.71801 1.74344 8.77105 1.66398C8.8241 1.58451 8.89953 1.52257 8.9878 1.48599C9.07607 1.44942 9.17321 1.43986 9.26692 1.45852C9.36062 1.47718 9.44668 1.52322 9.51421 1.59082L14.3423 6.41895C14.3872 6.46379 14.4228 6.51704 14.4471 6.57565C14.4714 6.63426 14.4839 6.69709 14.4839 6.76054C14.4839 6.82399 14.4714 6.88681 14.4471 6.94543C14.4228 7.00404 14.3872 7.05729 14.3423 7.10213Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Fullscreen Photo Viewer Component


export function PhotoCard({
  title = 'Photo',
  time = '03:34 PM',
  imageUri,
  imageUris,
  mood = 'SAD',
  location,
  onImagePress,
  onSharePress,
  onLocationPress,
  onMoodPress,
}: PhotoCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Keeping for internal logic if needed, though Viewer handles it
  const MoodIcon = getMoodIcon(mood);

  // Combine single imageUri and imageUris array
  const allImages = imageUris && imageUris.length > 0
    ? imageUris
    : (imageUri ? [imageUri] : []);

  const handleOpenFullscreen = () => {
    setActiveIndex(0);
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <View style={styles.card}>
        {/* Top section: Photo icon + Title + Time */}
        <View style={styles.topSection}>
          <View style={styles.titleRow}>
            <View style={styles.iconCircle}>
              <PhotoIcon size={16 * SCALE} />
            </View>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>

        {/* Middle section: Photo with count badge if multiple */}
        <Pressable onPress={handleOpenFullscreen} style={styles.imageContainer}>
          {allImages.length > 0 ? (
            <>
              <Image
                source={{ uri: allImages[0] }}
                style={styles.image}
                resizeMode="cover"
              />
              {/* Badge showing count if multiple images */}
              {allImages.length > 1 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>+{allImages.length - 1}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <PhotoIcon size={48 * SCALE} />
            </View>
          )}
        </Pressable>

        {/* Bottom section: Action buttons */}
        <View style={styles.bottomSection}>
          {/* Mood button */}
          <Pressable style={styles.actionButton} onPress={onMoodPress}>
            <MoodIcon size={16 * SCALE} />
            <Text style={styles.actionText}>{mood}</Text>
          </Pressable>

          {/* Location button - only show if location is set */}
          {location && (
            <Pressable style={styles.actionButton} onPress={onLocationPress}>
              <LocationIcon size={16 * SCALE} />
              <Text style={styles.actionText}>{location}</Text>
            </Pressable>
          )}

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Share button */}
          <Pressable style={styles.shareButton} onPress={onSharePress}>
            <ShareIcon size={16 * SCALE} />
          </Pressable>
        </View>
      </View>

      {/* Reusable Fullscreen Viewer */}
      {/* Reusable Unified Viewer */}
      <UnifiedMediaViewer
        isVisible={isFullscreen}
        onClose={handleCloseFullscreen}
        items={allImages.map((uri, index) => ({
          id: `photo-${index}-${uri}`,
          uri,
          type: 'image',
        }))}
        initialIndex={0}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FDFBF7',
    borderRadius: 20 * SCALE,
    paddingTop: 14 * SCALE,
    paddingBottom: 14 * SCALE,
    paddingHorizontal: 14 * SCALE,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10 * SCALE,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  iconCircle: {
    width: 28 * SCALE,
    height: 28 * SCALE,
    borderRadius: 14 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: '#181717',
  },
  timeBadge: {
    backgroundColor: '#EDEADC',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 5 * SCALE,
  },
  timeText: {
    fontSize: 12 * SCALE,
    fontWeight: '500',
    color: '#666',
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 15 * SCALE,
    overflow: 'hidden',
    marginBottom: 10 * SCALE,
    alignSelf: 'center',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 15 * SCALE,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EDEADC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEADC',
    borderRadius: 6 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
    gap: 6 * SCALE,
  },
  shareButton: {
    backgroundColor: '#EDEADC',
    borderRadius: 6 * SCALE,
    padding: 8 * SCALE,
  },
  actionText: {
    fontSize: 11 * SCALE,
    fontWeight: '600',
    color: '#181717',
  },
  // Count badge for multiple images
  countBadge: {
    position: 'absolute',
    top: 10 * SCALE,
    right: 10 * SCALE,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12 * SCALE,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 4 * SCALE,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12 * SCALE,
    fontWeight: '600',
  },
  // Fullscreen modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
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
  fullscreenImageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  fullscreenDotsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  fullscreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  fullscreenActiveDot: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PhotoCard;
