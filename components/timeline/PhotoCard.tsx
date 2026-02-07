import React, { useState } from 'react';
import { Dimensions, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

// Sad face icon
function SadIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.72626 1.44922C6.48478 1.44922 5.27118 1.81736 4.23892 2.50709C3.20667 3.19682 2.40213 4.17716 1.92703 5.32414C1.45194 6.47112 1.32763 7.73322 1.56983 8.95085C1.81203 10.1685 2.40986 11.2869 3.28772 12.1648C4.16558 13.0427 5.28405 13.6405 6.50167 13.8827C7.7193 14.1249 8.9814 14.0006 10.1284 13.5255C11.2754 13.0504 12.2557 12.2458 12.9454 11.2136C13.6352 10.1813 14.0033 8.96774 14.0033 7.72626C14.0015 6.06202 13.3397 4.46645 12.1629 3.28966C10.9861 2.11287 9.3905 1.45098 7.72626 1.44922ZM5.55344 5.79486C5.69669 5.79486 5.83672 5.83734 5.95582 5.91692C6.07493 5.99651 6.16776 6.10962 6.22258 6.24197C6.2774 6.37431 6.29174 6.51994 6.2638 6.66043C6.23585 6.80093 6.16687 6.92998 6.06558 7.03127C5.96429 7.13257 5.83523 7.20155 5.69474 7.22949C5.55424 7.25744 5.40862 7.2431 5.27627 7.18828C5.14393 7.13346 5.03081 7.04063 4.95123 6.92152C4.87164 6.80241 4.82917 6.66238 4.82917 6.51914C4.82917 6.32705 4.90547 6.14282 5.0413 6.007C5.17713 5.87117 5.36135 5.79486 5.55344 5.79486ZM10.3819 11.041C10.2711 11.1049 10.1395 11.1223 10.0159 11.0892C9.89236 11.0562 9.78695 10.9755 9.72284 10.8648C9.27198 10.0856 8.5634 9.65766 7.72626 9.65766C6.88912 9.65766 6.18054 10.0862 5.72968 10.8648C5.69949 10.9225 5.65795 10.9735 5.60754 11.0147C5.55714 11.0559 5.49891 11.0866 5.43637 11.1047C5.37382 11.1228 5.30826 11.1281 5.24361 11.1203C5.17897 11.1124 5.11658 11.0916 5.0602 11.059C5.00382 11.0264 4.95461 10.9828 4.91554 10.9307C4.87647 10.8786 4.84834 10.8191 4.83285 10.7558C4.81736 10.6926 4.81482 10.6269 4.82539 10.5626C4.83596 10.4983 4.85941 10.4369 4.89435 10.3819C5.51542 9.30819 6.54751 8.69196 7.72626 8.69196C8.90502 8.69196 9.93711 9.30759 10.5582 10.3819C10.6221 10.4927 10.6394 10.6244 10.6064 10.7479C10.5733 10.8715 10.4926 10.9769 10.3819 11.041ZM9.89908 7.24341C9.75583 7.24341 9.6158 7.20093 9.4967 7.12135C9.37759 7.04176 9.28476 6.92865 9.22994 6.7963C9.17512 6.66396 9.16078 6.51833 9.18873 6.37784C9.21667 6.23734 9.28565 6.10829 9.38694 6.007C9.48824 5.9057 9.61729 5.83672 9.75778 5.80878C9.89828 5.78083 10.0439 5.79518 10.1762 5.84999C10.3086 5.90481 10.4217 5.99764 10.5013 6.11675C10.5809 6.23586 10.6234 6.37589 10.6234 6.51914C10.6234 6.71123 10.5471 6.89545 10.4112 7.03127C10.2754 7.1671 10.0912 7.24341 9.89908 7.24341Z"
        fill="#810100"
      />
    </Svg>
  );
}

// Happy/Satisfied face icon
function HappyIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.72626 1.44922C6.48478 1.44922 5.27118 1.81736 4.23892 2.50709C3.20667 3.19682 2.40213 4.17716 1.92703 5.32414C1.45194 6.47112 1.32763 7.73322 1.56983 8.95085C1.81203 10.1685 2.40986 11.2869 3.28772 12.1648C4.16558 13.0427 5.28405 13.6405 6.50167 13.8827C7.7193 14.1249 8.9814 14.0006 10.1284 13.5255C11.2754 13.0504 12.2557 12.2458 12.9454 11.2136C13.6352 10.1813 14.0033 8.96774 14.0033 7.72626C14.0015 6.06202 13.3397 4.46645 12.1629 3.28966C10.9861 2.11287 9.3905 1.45098 7.72626 1.44922ZM5.55344 5.79486C5.69669 5.79486 5.83672 5.83734 5.95582 5.91692C6.07493 5.99651 6.16776 6.10962 6.22258 6.24197C6.2774 6.37431 6.29174 6.51994 6.2638 6.66043C6.23585 6.80093 6.16687 6.92998 6.06558 7.03127C5.96429 7.13257 5.83523 7.20155 5.69474 7.22949C5.55424 7.25744 5.40862 7.2431 5.27627 7.18828C5.14393 7.13346 5.03081 7.04063 4.95123 6.92152C4.87164 6.80241 4.82917 6.66238 4.82917 6.51914C4.82917 6.32705 4.90547 6.14282 5.0413 6.007C5.17713 5.87117 5.36135 5.79486 5.55344 5.79486ZM10.3819 11.041C10.2711 11.1049 10.1395 11.1223 10.0159 11.0892C9.89236 11.0562 9.78695 10.9755 9.72284 10.8648C9.27198 10.0856 8.5634 9.65766 7.72626 9.65766C6.88912 9.65766 6.18054 10.0862 5.72968 10.8648C5.69949 10.9225 5.65795 10.9735 5.60754 11.0147C5.55714 11.0559 5.49891 11.0866 5.43637 11.1047C5.37382 11.1228 5.30826 11.1281 5.24361 11.1203C5.17897 11.1124 5.11658 11.0916 5.0602 11.059C5.00382 11.0264 4.95461 10.9828 4.91554 10.9307C4.87647 10.8786 4.84834 10.8191 4.83285 10.7558C4.81736 10.6926 4.81482 10.6269 4.82539 10.5626C4.83596 10.4983 4.85941 10.4369 4.89435 10.3819C5.51542 9.30819 6.54751 8.69196 7.72626 8.69196C8.90502 8.69196 9.93711 9.30759 10.5582 10.3819C10.6221 10.4927 10.6394 10.6244 10.6064 10.7479C10.5733 10.8715 10.4926 10.9769 10.3819 11.041ZM9.89908 7.24341C9.75583 7.24341 9.6158 7.20093 9.4967 7.12135C9.37759 7.04176 9.28476 6.92865 9.22994 6.7963C9.17512 6.66396 9.16078 6.51833 9.18873 6.37784C9.21667 6.23734 9.28565 6.10829 9.38694 6.007C9.48824 5.9057 9.61729 5.83672 9.75778 5.80878C9.89828 5.78083 10.0439 5.79518 10.1762 5.84999C10.3086 5.90481 10.4217 5.99764 10.5013 6.11675C10.5809 6.23586 10.6234 6.37589 10.6234 6.51914C10.6234 6.71123 10.5471 6.89545 10.4112 7.03127C10.2754 7.1671 10.0912 7.24341 9.89908 7.24341Z"
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
  const [activeIndex, setActiveIndex] = useState(0);
  const MoodIcon = mood === 'SAD' ? SadIcon : HappyIcon;

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

  const handleFullscreenScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const screenWidth = Dimensions.get('window').width;
    const index = Math.round(offsetX / screenWidth);
    setActiveIndex(index);
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

      {/* Fullscreen Modal Gallery */}
      <Modal
        visible={isFullscreen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseFullscreen}
      >
        <View style={styles.modalContainer}>
          {/* Close button */}
          <Pressable style={styles.closeButton} onPress={handleCloseFullscreen}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>

          {/* Swipeable images */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleFullscreenScroll}
            scrollEventThrottle={16}
            style={styles.fullscreenScrollView}
          >
            {allImages.map((uri, index) => (
              <View key={index} style={styles.fullscreenImageContainer}>
                <Image
                  source={{ uri }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* Dot indicators */}
          {allImages.length > 1 && (
            <View style={styles.fullscreenDotsContainer}>
              {allImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.fullscreenDot,
                    index === activeIndex && styles.fullscreenActiveDot
                  ]}
                />
              ))}
            </View>
          )}

          {/* Counter */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{activeIndex + 1} / {allImages.length}</Text>
          </View>
        </View>
      </Modal>
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
