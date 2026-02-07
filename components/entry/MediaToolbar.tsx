import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
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

// Mic icon - Exact path from design, centered in 37x37 viewBox
function MicIcon({ size = ICON_SIZE }: IconProps) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Path
        d="M7.14781 11.4353V5.71781C7.14781 4.58053 7.5996 3.48983 8.40378 2.68565C9.20795 1.88147 10.2987 1.42969 11.4359 1.42969C12.5732 1.42969 13.6639 1.88147 14.4681 2.68565C15.2723 3.48983 15.7241 4.58053 15.7241 5.71781V11.4353C15.7241 12.5726 15.2723 13.6633 14.4681 14.4675C13.6639 15.2717 12.5732 15.7234 11.4359 15.7234C10.2987 15.7234 9.20795 15.2717 8.40378 14.4675C7.5996 13.6633 7.14781 12.5726 7.14781 11.4353ZM18.5828 11.4353C18.5828 11.2458 18.5075 11.064 18.3735 10.93C18.2395 10.7959 18.0577 10.7206 17.8681 10.7206C17.6786 10.7206 17.4968 10.7959 17.3628 10.93C17.2287 11.064 17.1534 11.2458 17.1534 11.4353C17.1534 12.9517 16.5511 14.406 15.4788 15.4782C14.4066 16.5504 12.9523 17.1528 11.4359 17.1528C9.91956 17.1528 8.46529 16.5504 7.39305 15.4782C6.32082 14.406 5.71844 12.9517 5.71844 11.4353C5.71844 11.2458 5.64314 11.064 5.50911 10.93C5.37508 10.7959 5.1933 10.7206 5.00375 10.7206C4.8142 10.7206 4.63242 10.7959 4.49839 10.93C4.36436 11.064 4.28906 11.2458 4.28906 11.4353C4.29124 13.2064 4.95008 14.9138 6.13818 16.2273C7.32627 17.5409 8.95923 18.3672 10.7213 18.5465V21.4409C10.7213 21.6305 10.7965 21.8123 10.9306 21.9463C11.0646 22.0803 11.2464 22.1556 11.4359 22.1556C11.6255 22.1556 11.8073 22.0803 11.9413 21.9463C12.0753 21.8123 12.1506 21.6305 12.1506 21.4409V18.5465C13.9127 18.3672 15.5456 17.5409 16.7337 16.2273C17.9218 14.9138 18.5806 13.2064 18.5828 11.4353Z"
        fill={COLORS.primary}
        transform="translate(7, 7)"
      />
    </Svg>
  );
}

// Journal/Book icon - Exact path from design, centered in 37x37 viewBox
function JournalIcon({ size = ICON_SIZE }: IconProps) {
  return (
    <Svg width={size * SCALE} height={size * SCALE} viewBox="0 0 37 37" fill="none">
      <Circle cx="18.5" cy="18.5" r="18.5" fill={COLORS.primary} fillOpacity="0.2" />
      <Path
        d="M19.2973 2.85922V17.153C19.2973 17.3425 19.222 17.5243 19.088 17.6583C18.954 17.7924 18.7722 17.8677 18.5827 17.8677H6.43297C6.05387 17.8677 5.69031 18.0183 5.42225 18.2863C5.15419 18.5544 5.00359 18.9179 5.00359 19.297H17.1533C17.3428 19.297 17.5246 19.3723 17.6586 19.5064C17.7927 19.6404 17.868 19.8222 17.868 20.0117C17.868 20.2013 17.7927 20.383 17.6586 20.5171C17.5246 20.6511 17.3428 20.7264 17.1533 20.7264H4.28891C4.09936 20.7264 3.91758 20.6511 3.78355 20.5171C3.64952 20.383 3.57422 20.2013 3.57422 20.0117V5.00328C3.57422 4.24509 3.87541 3.51796 4.41153 2.98184C4.94765 2.44572 5.67478 2.14453 6.43297 2.14453H18.5827C18.7722 2.14453 18.954 2.21983 19.088 2.35386C19.222 2.48789 19.2973 2.66967 19.2973 2.85922Z"
        fill={COLORS.primary}
        transform="translate(7, 7)"
      />
    </Svg>
  );
}

// Location icon - from new-memory.tsx, centered in 37x37 viewBox
function AddLocationIcon({ size = ICON_SIZE }: IconProps) {
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

// Media button wrapper
function MediaButton({ onPress, children }: { onPress?: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      {children}
    </Pressable>
  );
}

export interface MediaToolbarProps {
  onPhotoPress?: () => void;
  onVideoPress?: () => void;
  onMicPress?: () => void;
  onJournalPress?: () => void;
  onLocationPress?: () => void;
}

export function MediaToolbar({
  onPhotoPress,
  onVideoPress,
  onMicPress,
  onJournalPress,
  onLocationPress,
}: MediaToolbarProps) {
  return (
    <View style={styles.container}>
      {/* Left group - 4 icons */}
      <View style={styles.leftGroup}>
        <MediaButton onPress={onPhotoPress}>
          <PhotoIcon />
        </MediaButton>
        <MediaButton onPress={onVideoPress}>
          <VideoIcon />
        </MediaButton>
        <MediaButton onPress={onMicPress}>
          <MicIcon />
        </MediaButton>
        <MediaButton onPress={onJournalPress}>
          <JournalIcon />
        </MediaButton>
      </View>

      {/* Right - Location icon */}
      <MediaButton onPress={onLocationPress}>
        <AddLocationIcon />
      </MediaButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16 * SCALE,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 * SCALE,
  },
});

export default MediaToolbar;
