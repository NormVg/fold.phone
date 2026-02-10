import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

// ── Size limits ──────────────────────────────────────────────────────
export const PHOTO_SIZE_LIMIT_MB = 10;
export const VIDEO_SIZE_LIMIT_MB = 25;
export const PHOTO_SIZE_LIMIT_BYTES = PHOTO_SIZE_LIMIT_MB * 1024 * 1024;
export const VIDEO_SIZE_LIMIT_BYTES = VIDEO_SIZE_LIMIT_MB * 1024 * 1024;

/**
 * Validate that a picked media file does not exceed the size limit.
 * Uses the fileSize directly from ImagePicker asset for instant checking.
 * @param fileSize  – size in bytes (from asset.fileSize)
 * @param uri       – local file URI (fallback for filesystem check)
 * @param mediaType – 'image' or 'video'
 * @returns `null` if OK, or a user-facing error string if too large.
 */
export async function validateMediaSize(
  uri: string,
  mediaType: 'image' | 'video',
  fileSize?: number | null,
): Promise<string | null> {
  let sizeBytes = fileSize || 0;

  // If fileSize not provided by picker, try filesystem
  if (!sizeBytes) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists && 'size' in info && info.size) {
        sizeBytes = info.size;
      }
    } catch {
      // can't determine, allow
    }
  }

  if (!sizeBytes) return null; // can't determine size, allow

  const sizeMB = sizeBytes / 1024 / 1024;
  const limitMB = mediaType === 'video' ? VIDEO_SIZE_LIMIT_MB : PHOTO_SIZE_LIMIT_MB;

  if (sizeMB > limitMB) {
    return `This ${mediaType === 'video' ? 'video' : 'photo'} is ${sizeMB.toFixed(1)} MB which exceeds the ${limitMB} MB limit. Please choose a smaller file.`;
  }

  return null;
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
