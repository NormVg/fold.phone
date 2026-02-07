import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const COLORS = {
  primary: '#810100',
};

const ICON_SIZE = 37;

interface IconProps {
  size?: number;
}

// Photo icon - Exact path from design, centered in 37x37 viewBox
function PhotoIcon({ size = ICON_SIZE }: IconProps) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Path
        d="M19.297 3.57422H3.57391C3.19481 3.57422 2.83125 3.72481 2.56319 3.99287C2.29513 4.26093 2.14453 4.6245 2.14453 5.00359V17.868C2.14453 18.2471 2.29513 18.6106 2.56319 18.8787C2.83125 19.1467 3.19481 19.2973 3.57391 19.2973H19.297C19.6761 19.2973 20.0397 19.1467 20.3078 18.8787C20.5758 18.6106 20.7264 18.2471 20.7264 17.868V5.00359C20.7264 4.6245 20.5758 4.26093 20.3078 3.99287C20.0397 3.72481 19.6761 3.57422 19.297 3.57422ZM13.9369 7.86234C14.1489 7.86234 14.3562 7.92522 14.5325 8.04301C14.7088 8.16081 14.8462 8.32824 14.9273 8.52413C15.0084 8.72001 15.0297 8.93556 14.9883 9.14352C14.9469 9.35147 14.8448 9.54249 14.6949 9.69242C14.545 9.84234 14.354 9.94444 14.146 9.98581C13.9381 10.0272 13.7225 10.0059 13.5266 9.9248C13.3307 9.84366 13.1633 9.70626 13.0455 9.52996C12.9277 9.35367 12.8648 9.1464 12.8648 8.93438C12.8648 8.65005 12.9778 8.37738 13.1788 8.17633C13.3799 7.97529 13.6526 7.86234 13.9369 7.86234ZM19.297 17.868H3.57391V14.3562L7.71373 10.2155C7.78011 10.149 7.85893 10.0963 7.94569 10.0603C8.03245 10.0244 8.12545 10.0058 8.21937 10.0058C8.3133 10.0058 8.4063 10.0244 8.49306 10.0603C8.57982 10.0963 8.65864 10.149 8.72502 10.2155L14.7409 16.2295C14.875 16.3637 15.0569 16.439 15.2465 16.439C15.4362 16.439 15.6181 16.3637 15.7522 16.2295C15.8863 16.0954 15.9616 15.9136 15.9616 15.7239C15.9616 15.5343 15.8863 15.3524 15.7522 15.2183L14.1745 13.6415L15.4556 12.3595C15.5896 12.2256 15.7713 12.1504 15.9608 12.1504C16.1502 12.1504 16.332 12.2256 16.466 12.3595L19.297 15.1941V17.868Z"
        fill={COLORS.primary}
        transform="translate(7, 7)"
      />
    </Svg>
  );
}

// Video icon - Exact path from design, centered in 37x37 viewBox
function VideoIcon({ size = ICON_SIZE }: IconProps) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Path
        d="M17.1528 6.43328V16.4389C17.1528 16.818 17.0022 17.1816 16.7342 17.4496C16.4661 17.7177 16.1025 17.8683 15.7234 17.8683H2.85906C2.47997 17.8683 2.1164 17.7177 1.84834 17.4496C1.58028 17.1816 1.42969 16.818 1.42969 16.4389V6.43328C1.42969 6.05419 1.58028 5.69062 1.84834 5.42256C2.1164 5.1545 2.47997 5.00391 2.85906 5.00391H15.7234C16.1025 5.00391 16.4661 5.1545 16.7342 5.42256C17.0022 5.69062 17.1528 6.05419 17.1528 6.43328ZM22.3343 6.45562C22.2335 6.43094 22.1286 6.4279 22.0265 6.44668C21.9244 6.46547 21.8274 6.50566 21.742 6.56461L18.7412 8.56484C18.6923 8.5975 18.6521 8.64174 18.6244 8.69364C18.5966 8.74553 18.5821 8.80348 18.5822 8.86233V14.0099C18.5821 14.0687 18.5966 14.1267 18.6244 14.1786C18.6521 14.2304 18.6923 14.2747 18.7412 14.3074L21.759 16.3192C21.8719 16.3945 22.004 16.4362 22.1398 16.4392C22.2755 16.4422 22.4093 16.4064 22.5255 16.3362C22.633 16.2678 22.7211 16.1731 22.7815 16.0609C22.8419 15.9488 22.8725 15.823 22.8703 15.6956V7.14797C22.8704 6.98946 22.8178 6.83543 22.7207 6.7101C22.6237 6.58476 22.4878 6.49524 22.3343 6.45562Z"
        fill={COLORS.primary}
        transform="translate(7, 7)"
      />
    </Svg>
  );
}

// Location/Pin icon
function LocationIcon({ size = ICON_SIZE }: IconProps) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Path
        d="M11.4356 1.42969C8.13401 1.42969 5 4.56369 5 7.86531C5 13.1153 11.4356 19.5509 11.4356 19.5509C11.4356 19.5509 17.8713 13.1153 17.8713 7.86531C17.8713 4.56369 14.7372 1.42969 11.4356 1.42969ZM11.4356 10.7241C10.8686 10.7241 10.3147 10.556 9.8455 10.2411C9.37627 9.92617 9.01299 9.47861 8.80092 8.95543C8.58886 8.43225 8.53758 7.85721 8.65352 7.30306C8.76945 6.74892 9.04746 6.24073 9.44852 5.83967C9.84958 5.43861 10.3578 5.1606 10.9119 5.04466C11.4661 4.92873 12.0411 4.98001 12.5643 5.19207C13.0875 5.40414 13.535 5.76742 13.8499 6.23665C14.1649 6.70587 14.3329 7.25974 14.3329 7.82672C14.3329 8.59498 14.0276 9.33172 13.4227 9.93679C12.8178 10.5419 12.0809 10.8471 11.3127 10.8471L11.4356 10.7241Z"
        fill={COLORS.primary}
        transform="translate(7, 7)"
      />
    </Svg>
  );
}

// Small white location icon for tag
function LocationTagIcon({ size = 12 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        fill="white"
      />
    </Svg>
  );
}

// Simple pressable wrapper for media buttons
function MediaButton({
  children,
  onPress
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      {children}
    </Pressable>
  );
}

// Animated Location Tag component
function AnimatedLocationTag({
  location,
  onClear
}: {
  location: string;
  onClear: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in when mounted
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.locationTag,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <LocationTagIcon size={12} />
      <Text style={styles.locationTagText} numberOfLines={1}>
        {location.length > 15 ? location.substring(0, 15) + '...' : location}
      </Text>
      <Pressable onPress={onClear} style={styles.locationTagClose}>
        <Text style={styles.locationTagCloseText}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

export interface StoryMediaToolbarProps {
  onPhotoPress?: () => void;
  onVideoPress?: () => void;
  onLocationPress?: () => void;
  location?: string | null;
  onClearLocation?: () => void;
}

export function StoryMediaToolbar({
  onPhotoPress,
  onVideoPress,
  onLocationPress,
  location,
  onClearLocation,
}: StoryMediaToolbarProps) {
  return (
    <View style={styles.container}>
      <MediaButton onPress={onPhotoPress}>
        <PhotoIcon />
      </MediaButton>
      <MediaButton onPress={onVideoPress}>
        <VideoIcon />
      </MediaButton>

      {/* Show animated location tag if location is set, otherwise show location icon */}
      {location ? (
        <AnimatedLocationTag
          location={location}
          onClear={onClearLocation || (() => { })}
        />
      ) : (
        <MediaButton onPress={onLocationPress}>
          <LocationIcon />
        </MediaButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10 * SCALE,
    paddingVertical: 6 * SCALE,
    borderRadius: 16 * SCALE,
    gap: 4 * SCALE,
    height: ICON_SIZE * SCALE,
  },
  locationTagText: {
    color: '#FFFFFF',
    fontSize: 11 * SCALE,
    fontWeight: '500',
    maxWidth: 80 * SCALE,
  },
  locationTagClose: {
    marginLeft: 2 * SCALE,
    padding: 2 * SCALE,
  },
  locationTagCloseText: {
    color: '#FFFFFF',
    fontSize: 14 * SCALE,
    fontWeight: '600',
    lineHeight: 14 * SCALE,
  },
});

export default StoryMediaToolbar;
