import { TimelineColors } from '@/constants/theme';
import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

interface ShareSheetProps {
  visible: boolean;
  onDismiss: () => void;
  onShareLink: () => void;
  onShareConnect: () => void;
  onRemoveFromConnect?: () => void;
  isSharedToConnect?: boolean;
}

function LinkIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="#810100"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ConnectIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke="#1A7A7A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#1A7A7A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="#1A7A7A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RemoveIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke="#D32F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#D32F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 8l-4 4m0-4l4 4"
        stroke="#D32F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ShareSheet({ visible, onDismiss, onShareLink, onShareConnect, onRemoveFromConnect, isSharedToConnect }: ShareSheetProps) {
  if (!visible) return null;

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

          <Text style={s.title}>Share this memory</Text>

          {/* Share Link option */}
          <Pressable
            style={({ pressed }) => [s.option, pressed && s.optionPressed]}
            onPress={onShareLink}
          >
            <View style={s.iconCircleCrimson}>
              <LinkIcon size={20 * SCALE} />
            </View>
            <View style={s.optionText}>
              <Text style={s.optionTitle}>Share Link</Text>
              <Text style={s.optionSub}>Create a shareable link to this memory</Text>
            </View>
            <Svg width={20 * SCALE} height={20 * SCALE} viewBox="0 0 24 24" fill="none">
              <Path d="M9 18l6-6-6-6" stroke="#999" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>

          {/* Divider */}
          <View style={s.divider} />

          {isSharedToConnect ? (
            /* Remove from Connect option */
            <Pressable
              style={({ pressed }) => [s.option, pressed && s.optionPressed]}
              onPress={onRemoveFromConnect}
            >
              <View style={s.iconCircleRed}>
                <RemoveIcon size={20 * SCALE} />
              </View>
              <View style={s.optionText}>
                <Text style={[s.optionTitle, { color: '#D32F2F' }]}>Remove from Connect</Text>
                <Text style={s.optionSub}>Remove from your shared timeline</Text>
              </View>
              <Svg width={20 * SCALE} height={20 * SCALE} viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke="#999" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
          ) : (
            /* Share to Connect option */
            <Pressable
              style={({ pressed }) => [s.option, pressed && s.optionPressed]}
              onPress={onShareConnect}
            >
              <View style={s.iconCircleTeal}>
                <ConnectIcon size={20 * SCALE} />
              </View>
              <View style={s.optionText}>
                <Text style={s.optionTitle}>Share to Connect</Text>
                <Text style={s.optionSub}>Send to your shared timeline</Text>
              </View>
              <Svg width={20 * SCALE} height={20 * SCALE} viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke="#999" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
          )}

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
    backgroundColor: '#FDFBF7',
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
    color: TimelineColors.textDark,
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
  iconCircleCrimson: {
    width: 44 * SCALE,
    height: 44 * SCALE,
    borderRadius: 22 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleTeal: {
    width: 44 * SCALE,
    height: 44 * SCALE,
    borderRadius: 22 * SCALE,
    backgroundColor: 'rgba(26, 122, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleRed: {
    width: 44 * SCALE,
    height: 44 * SCALE,
    borderRadius: 22 * SCALE,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
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
