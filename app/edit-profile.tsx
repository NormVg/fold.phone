import { TimelineColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';
import { updateProfile, uploadAvatar } from '@/lib/api';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = SCREEN_WIDTH / 393;

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  avatar?: string | null;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user: authUser, refreshAuth } = useAuth();
  const user = authUser as User | null;

  const [name, setName] = useState(user?.name || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.image || user?.avatar || null);
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatarUri(user.image || user.avatar || null);
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handlePickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to change your avatar.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take a new photo.');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handlePickImage },
        ...(avatarUri || newAvatarUri ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => {
          setNewAvatarUri(null);
          setAvatarUri(null);
        }}] : []),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setIsSaving(true);

    try {
      let avatarUrl: string | null | undefined = undefined;

      // If there's a new avatar to upload
      if (newAvatarUri) {
        setIsUploadingAvatar(true);
        const uploadResult = await uploadAvatar(newAvatarUri);
        setIsUploadingAvatar(false);

        if (uploadResult.error) {
          Alert.alert('Upload Failed', uploadResult.error);
          setIsSaving(false);
          return;
        }

        avatarUrl = uploadResult.data?.url || null;
      } else if (avatarUri === null && user?.image) {
        // User removed their avatar
        avatarUrl = null;
      }

      // Update profile
      const updateData: { name?: string; avatar?: string | null } = {};
      
      if (name.trim() !== user?.name) {
        updateData.name = name.trim();
      }
      
      if (avatarUrl !== undefined) {
        updateData.avatar = avatarUrl;
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        const result = await updateProfile(updateData);

        if (result.error) {
          Alert.alert('Update Failed', result.error);
          setIsSaving(false);
          return;
        }
      }

      // Refresh auth context to get updated user data
      await refreshAuth();

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatarUri = newAvatarUri || avatarUri;
  const hasChanges = name.trim() !== (user?.name || '') || newAvatarUri !== null || (avatarUri === null && user?.image);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={TimelineColors.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} style={styles.backButton} disabled={isSaving}>
          <BackIcon size={24 * SCALE} />
        </Pressable>
        <Text style={styles.topBarTitle}>Edit Profile</Text>
        <Pressable 
          onPress={handleSave} 
          style={[styles.saveButton, (!hasChanges || isSaving) && styles.saveButtonDisabled]}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={TimelineColors.primary} />
          ) : (
            <Text style={[styles.saveText, !hasChanges && styles.saveTextDisabled]}>Save</Text>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable onPress={showImageOptions} style={styles.avatarContainer} disabled={isSaving}>
            {displayAvatarUri ? (
              <Image source={{ uri: displayAvatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <UserIcon size={48 * SCALE} color="rgba(0,0,0,0.3)" />
              </View>
            )}
            <View style={styles.editAvatarBadge}>
              <CameraIcon size={16 * SCALE} />
            </View>
            {isUploadingAvatar && (
              <View style={styles.avatarLoadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </Pressable>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(0,0,0,0.3)"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isSaving}
              />
            </View>
          </View>

          {/* Email Field (read-only) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={user?.email || ''}
                editable={false}
              />
              <LockIcon size={16 * SCALE} color="rgba(0,0,0,0.3)" />
            </View>
            <Text style={styles.fieldHint}>Email cannot be changed</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <InfoIcon size={20 * SCALE} />
          <Text style={styles.infoText}>
            Your profile information is stored securely and only visible to you.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// Icons
function BackIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={TimelineColors.primary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UserIcon({ size = 48, color = TimelineColors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="16" r="10" stroke={color} strokeWidth={2} />
      <Path
        d="M6 44C6 34.059 14.059 26 24 26C33.941 26 42 34.059 42 44"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CameraIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 5C2 4.448 2.448 4 3 4H4.5L5.5 2.5H10.5L11.5 4H13C13.552 4 14 4.448 14 5V12C14 12.552 13.552 13 13 13H3C2.448 13 2 12.552 2 12V5Z"
        stroke="#fff"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="8.5" r="2.5" stroke="#fff" strokeWidth={1.2} />
    </Svg>
  );
}

function LockIcon({ size = 16, color = TimelineColors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4 7V5C4 2.791 5.791 1 8 1C10.209 1 12 2.791 12 5V7"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M3 7H13C13.552 7 14 7.448 14 8V14C14 14.552 13.552 15 13 15H3C2.448 15 2 14.552 2 14V8C2 7.448 2.448 7 3 7Z"
        stroke={color}
        strokeWidth={1.2}
      />
    </Svg>
  );
}

function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={TimelineColors.primary} strokeWidth={1.5} />
      <Path
        d="M10 9V14"
        stroke={TimelineColors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="10" cy="6" r="1" fill={TimelineColors.primary} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TimelineColors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17 * SCALE,
    paddingTop: 5 * SCALE,
    height: 55 * SCALE,
  },
  backButton: {
    width: 40 * SCALE,
    height: 40 * SCALE,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontSize: 18 * SCALE,
    fontWeight: '600',
    color: TimelineColors.textDark,
  },
  saveButton: {
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 8 * SCALE,
    borderRadius: 8 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.1)',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  saveText: {
    fontSize: 15 * SCALE,
    fontWeight: '600',
    color: TimelineColors.primary,
  },
  saveTextDisabled: {
    color: 'rgba(0,0,0,0.3)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17 * SCALE,
    paddingTop: 20 * SCALE,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32 * SCALE,
  },
  avatarContainer: {
    position: 'relative',
    width: 120 * SCALE,
    height: 120 * SCALE,
    borderRadius: 60 * SCALE,
    overflow: 'visible',
  },
  avatar: {
    width: 120 * SCALE,
    height: 120 * SCALE,
    borderRadius: 60 * SCALE,
    borderWidth: 3,
    borderColor: TimelineColors.primary,
  },
  avatarPlaceholder: {
    width: 120 * SCALE,
    height: 120 * SCALE,
    borderRadius: 60 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 4 * SCALE,
    right: 4 * SCALE,
    width: 32 * SCALE,
    height: 32 * SCALE,
    borderRadius: 16 * SCALE,
    backgroundColor: TimelineColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TimelineColors.background,
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60 * SCALE,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 12 * SCALE,
    fontSize: 14 * SCALE,
    color: TimelineColors.primary,
    fontWeight: '500',
  },
  formSection: {
    gap: 20 * SCALE,
  },
  fieldContainer: {
    gap: 8 * SCALE,
  },
  fieldLabel: {
    fontSize: 13 * SCALE,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
    marginLeft: 4 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF7',
    borderRadius: 12 * SCALE,
    paddingHorizontal: 16 * SCALE,
    paddingVertical: 14 * SCALE,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  inputDisabled: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  input: {
    flex: 1,
    fontSize: 16 * SCALE,
    color: TimelineColors.textDark,
    padding: 0,
  },
  inputTextDisabled: {
    color: 'rgba(0,0,0,0.4)',
  },
  fieldHint: {
    fontSize: 12 * SCALE,
    color: 'rgba(0,0,0,0.4)',
    marginLeft: 4 * SCALE,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12 * SCALE,
    backgroundColor: 'rgba(129, 1, 0, 0.05)',
    borderRadius: 12 * SCALE,
    padding: 16 * SCALE,
    marginTop: 32 * SCALE,
  },
  infoText: {
    flex: 1,
    fontSize: 14 * SCALE,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20 * SCALE,
  },
  bottomPadding: {
    height: 40 * SCALE,
  },
});
