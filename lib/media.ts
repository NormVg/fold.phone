import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

// ── Size limits ──────────────────────────────────────────────────────
export const PHOTO_SIZE_LIMIT_MB = 10;
export const VIDEO_SIZE_LIMIT_MB = 25;
export const PHOTO_SIZE_LIMIT_BYTES = PHOTO_SIZE_LIMIT_MB * 1024 * 1024;
export const VIDEO_SIZE_LIMIT_BYTES = VIDEO_SIZE_LIMIT_MB * 1024 * 1024;

/**
 * Validate that a picked media file does not exceed the size limit.
 * @param uri       – local file URI
 * @param mediaType – 'image' or 'video'
 * @returns `null` if OK, or a user-facing error string if too large.
 */
export async function validateMediaSize(
  uri: string,
  mediaType: 'image' | 'video',
): Promise<string | null> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists || !('size' in info) || !info.size) return null; // can't determine, allow

    const sizeMB = info.size / 1024 / 1024;
    const limitMB = mediaType === 'video' ? VIDEO_SIZE_LIMIT_MB : PHOTO_SIZE_LIMIT_MB;

    if (sizeMB > limitMB) {
      return `This ${mediaType === 'video' ? 'video' : 'photo'} is ${sizeMB.toFixed(1)} MB, which exceeds the ${limitMB} MB limit. Please choose a smaller file.`;
    }

    return null;
  } catch {
    return null; // can't determine, allow
  }
}

/**
 * Generate a thumbnail image from a video URI.
 * Returns the local file URI of the generated thumbnail, or null on failure.
 */
export async function generateVideoThumbnail(videoUri: string): Promise<string | null> {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1000, // 1 second into the video
      quality: 0.7,
    });
    return uri;
  } catch (err) {
    console.warn('[Media] Failed to generate thumbnail:', err);
    return null;
  }
}
