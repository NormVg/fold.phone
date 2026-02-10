import * as VideoThumbnails from 'expo-video-thumbnails';

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
