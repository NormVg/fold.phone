/**
 * Direct Appwrite upload from the React Native app.
 * Fetches storage config from the backend on first use,
 * then uploads via the official react-native-appwrite SDK.
 */
import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Client, ID, Permission, Role, Storage } from 'react-native-appwrite';
import { apiRequest } from './api';

// Cached SDK instances
let appwriteClient: Client | null = null;
let appwriteStorage: Storage | null = null;
let cachedConfig: { endpoint: string; projectId: string; bucketId: string } | null = null;

/** Fetch Appwrite storage config from our backend and initialize SDK */
async function getStorage(): Promise<{ storage: Storage; bucketId: string }> {
  if (appwriteStorage && cachedConfig) {
    return { storage: appwriteStorage, bucketId: cachedConfig.bucketId };
  }

  const { data, error } = await apiRequest<{
    endpoint: string;
    projectId: string;
    bucketId: string;
  }>('/api/config/storage');

  if (error || !data) {
    throw new Error(error || 'Failed to fetch storage config');
  }

  if (!data.projectId || !data.bucketId) {
    throw new Error(
      `Appwrite config incomplete: projectId=${data.projectId || '(empty)'}, bucketId=${data.bucketId || '(empty)'}`,
    );
  }

  cachedConfig = data;

  appwriteClient = new Client()
    .setEndpoint(data.endpoint)
    .setProject(data.projectId)
    .setPlatform('com.taohq.fold');

  appwriteStorage = new Storage(appwriteClient);

  console.log('[Appwrite] SDK initialized:', data.endpoint, 'project:', data.projectId);
  return { storage: appwriteStorage, bucketId: data.bucketId };
}

/** Guess MIME type from file extension */
function guessMimeType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'heic': return 'image/heic';
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'avi': return 'video/x-msvideo';
    case 'mp3': return 'audio/mpeg';
    case 'm4a': return 'audio/mp4';
    case 'aac': return 'audio/aac';
    case 'wav': return 'audio/wav';
    case 'caf': return 'audio/x-caf';
    default: return 'application/octet-stream';
  }
}

/**
 * Compress an image before upload.
 * Resizes to max 1920px on longest side and compresses to JPEG 0.7.
 * Returns the compressed file URI (or original if compression fails/skips).
 */
async function compressImage(uri: string): Promise<string> {
  // Skip non-image URIs
  const ext = uri.split('.').pop()?.toLowerCase() || '';
  const imageExts = ['jpg', 'jpeg', 'png', 'heic', 'webp'];
  if (!imageExts.includes(ext)) return uri;

  try {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: 1920 } }],
      { compress: 0.7, format: SaveFormat.JPEG },
    );
    console.log('[Appwrite] Compressed image:', uri.split('/').pop(), '→', result.uri.split('/').pop());
    return result.uri;
  } catch (err) {
    console.warn('[Appwrite] Image compression failed, using original:', err);
    return uri;
  }
}

/**
 * Upload a local file directly to Appwrite Storage.
 * Returns the public view URL on success.
 * Compresses images before upload. Includes retry logic for large files.
 */
export async function uploadToAppwrite(localUri: string): Promise<string> {
  const { storage, bucketId } = await getStorage();
  const mimeType = guessMimeType(localUri);

  // Compress images before upload (reduces 3-5 MB → 300-500 KB)
  const isImage = mimeType.startsWith('image/');
  const uploadUri = isImage ? await compressImage(localUri) : localUri;

  const filename = uploadUri.split('/').pop() || 'file';

  // Validate that the file exists before attempting upload
  const info = await FileSystem.getInfoAsync(uploadUri);
  if (!info.exists) {
    throw new Error(`[Appwrite] File does not exist at path: ${uploadUri}`);
  }

  const fileSize = ('size' in info && info.size) ? info.size : 0;
  console.log(
    `[Appwrite] Uploading: ${filename}, size: ${fileSize > 0 ? (fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'unknown'}, type: ${mimeType}`,
  );

  if (fileSize === 0) {
    console.warn('[Appwrite] File size is 0 or unknown — upload may fail for chunked files');
  }

  const file = {
    uri: uploadUri,
    name: filename,
    type: isImage ? 'image/jpeg' : mimeType, // compressed images are always JPEG
    size: fileSize,
  };

  // Retry logic: up to 3 attempts with exponential backoff
  const MAX_RETRIES = 2;
  let lastError: any;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s
        console.log(`[Appwrite] Retry ${attempt}/${MAX_RETRIES} after ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }

      const result = await storage.createFile(
        bucketId,
        ID.unique(),
        file as any,
        // Make uploaded files publicly readable so view URLs work
        [Permission.read(Role.any())],
      );

      const viewUrl = `${cachedConfig!.endpoint}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${cachedConfig!.projectId}`;
      console.log('[Appwrite] Upload success:', result.$id, viewUrl);
      return viewUrl;
    } catch (err: any) {
      lastError = err;
      // Log detailed error info for debugging
      const status = err?.code || err?.status || 'unknown';
      const msg = err?.message || String(err);
      console.error(
        `[Appwrite] Upload attempt ${attempt + 1}/${MAX_RETRIES + 1} FAILED (status ${status}): ${msg}`,
      );
      if (err?.type) {
        console.error(`[Appwrite] Error type: ${err.type}`);
      }
    }
  }

  throw lastError;
}

/** Clear cached config (e.g. on logout) */
export function clearStorageConfig() {
  cachedConfig = null;
  appwriteClient = null;
  appwriteStorage = null;
}
