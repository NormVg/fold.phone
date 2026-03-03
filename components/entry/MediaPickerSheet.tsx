import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

const PRIMARY = '#810100';
const CARD_BG = '#FDFBF7';
const TEXT_DARK = '#181717';

// Camera icon
function CameraIcon({ size = 22, color = PRIMARY }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Video camera icon
function VideoCameraIcon({ size = 22, color = PRIMARY }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 7l-7 5 7 5V7z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="1"
        y="5"
        width="15"
        height="14"
        rx="2"
        ry="2"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Gallery / image icon
function GalleryIcon({ size = 22, color = PRIMARY }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 15l-5-5L5 21"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Chevron right
function ChevronRight() {
  return (
    <Svg width={20 * SCALE} height={20 * SCALE} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke="#999" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export interface MediaPickerSheetProps {
  visible: boolean;
  onDismiss: () => void;
  /** 'photo' shows camera + library for images; 'video' shows camera + library for video */
  mediaType: 'photo' | 'video';
  onCamera: () => void;
  onLibrary: () => void;
}

export function MediaPickerSheet({
  visible,
  onDismiss,
  mediaType,
  onCamera,
  onLibrary,
}: MediaPickerSheetProps) {
  if (!visible) return null;

  const isPhoto = mediaType === 'photo';

  const cameraLabel = isPhoto ? 'Take Photo' : 'Record Video';
  const cameraSub = isPhoto ? 'Open camera to capture a photo' : 'Open camera to record a video';
  const libraryLabel = 'Choose from Library';
  const librarySub = isPhoto
    ? 'Select photos from your photo library'
    : 'Select a video from your photo library';

  const CameraIconComponent = isPhoto ? CameraIcon : VideoCameraIcon;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable style={s.backdrop} onPress={onDismiss}>
        <Pressable style={s.card} onPress={(e) => e.stopPropagation()}>
          {/* Handle bar */}
          <View style={s.handleBar} />

          <Text style={s.title}>{isPhoto ? 'Add Photo' : 'Add Video'}</Text>

          {/* Camera option */}
          <Pressable
            style={({ pressed }) => [s.option, pressed && s.optionPressed]}
            onPress={() => { onDismiss(); onCamera(); }}
          >
            <View style={s.iconCircle}>
              <CameraIconComponent size={20 * SCALE} color={PRIMARY} />
            </View>
            <View style={s.optionText}>
              <Text style={s.optionTitle}>{cameraLabel}</Text>
              <Text style={s.optionSub}>{cameraSub}</Text>
            </View>
            <ChevronRight />
          </Pressable>

          {/* Divider */}
          <View style={s.divider} />

          {/* Library option */}
          <Pressable
            style={({ pressed }) => [s.option, pressed && s.optionPressed]}
            onPress={() => { onDismiss(); onLibrary(); }}
          >
            <View style={s.iconCircle}>
              <GalleryIcon size={20 * SCALE} color={PRIMARY} />
            </View>
            <View style={s.optionText}>
              <Text style={s.optionTitle}>{libraryLabel}</Text>
              <Text style={s.optionSub}>{librarySub}</Text>
            </View>
            <ChevronRight />
          </Pressable>

          {/* Cancel */}
          <Pressable style={s.cancelButton} onPress={onDismiss}>
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24 * SCALE,
    borderTopRightRadius: 24 * SCALE,
    paddingHorizontal: 20 * SCALE,
    paddingTop: 12 * SCALE,
    paddingBottom: 34 * SCALE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  handleBar: {
    width: 36 * SCALE,
    height: 4 * SCALE,
    borderRadius: 2 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignSelf: 'center',
    marginBottom: 16 * SCALE,
  },
  title: {
    fontSize: 18 * SCALE,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 18 * SCALE,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14 * SCALE,
    gap: 14 * SCALE,
  },
  optionPressed: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 44 * SCALE,
    height: 44 * SCALE,
    borderRadius: 22 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  optionSub: {
    fontSize: 13 * SCALE,
    color: '#8A8780',
    marginTop: 2 * SCALE,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 58 * SCALE,
  },
  cancelButton: {
    marginTop: 18 * SCALE,
    paddingVertical: 14 * SCALE,
    borderRadius: 14 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: '#8A8780',
  },
});
