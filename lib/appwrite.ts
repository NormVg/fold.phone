/**
 * Direct Appwrite upload from the React Native app.
 * Fetches storage config from the backend on first use,
 * then uploads via the official react-native-appwrite SDK.
 */
import * as FileSystem from 'expo-file-system';
import { Client, ID, Storage } from 'react-native-appwrite';
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

  cachedConfig = data;

  appwriteClient = new Client()
    .setEndpoint(data.endpoint)
    .setProject(data.projectId)
    .setPlatform('com.taohq.fold');

  appwriteStorage = new Storage(appwriteClient);

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
 * Upload a local file directly to Appwrite Storage.
 * Returns the public view URL on success.
 * Includes retry logic for large files (videos/audio).
 */
export async function uploadToAppwrite(localUri: string): Promise<string> {
  const { storage, bucketId } = await getStorage();
  const filename = localUri.split('/').pop() || 'file';
  const mimeType = guessMimeType(localUri);

  // Get actual file size
  let fileSize = 0;
  try {
    const info = await FileSystem.getInfoAsync(localUri);
    if (info.exists && 'size' in info) {
      fileSize = info.size || 0;
      console.log(`[Appwrite] File: ${filename}, size: ${(fileSize / 1024 / 1024).toFixed(2)} MB, type: ${mimeType}`);
    }
  } catch (e) {
    console.warn('[Appwrite] Could not get file size:', e);
  }

  const file = {
    uri: localUri,
    name: filename,
    type: mimeType,
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
      );

      const viewUrl = `${cachedConfig!.endpoint}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${cachedConfig!.projectId}`;
      console.log('[Appwrite] File uploaded:', result.$id, viewUrl);
      return viewUrl;
    } catch (err) {
      lastError = err;
      console.warn(`[Appwrite] Upload attempt ${attempt + 1} failed:`, err);
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
