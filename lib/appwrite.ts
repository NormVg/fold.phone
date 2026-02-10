/**
 * Direct Appwrite upload from the React Native app.
 * Fetches storage config from the backend on first use,
 * then uploads via the official react-native-appwrite SDK.
 */
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
 */
export async function uploadToAppwrite(localUri: string): Promise<string> {
  const { storage, bucketId } = await getStorage();
  const filename = localUri.split('/').pop() || 'file';
  const mimeType = guessMimeType(localUri);

  // The react-native-appwrite SDK accepts a file object for React Native
  const file = {
    uri: localUri,
    name: filename,
    type: mimeType,
    size: 0, // SDK handles this
  };

  const result = await storage.createFile(
    bucketId,
    ID.unique(),
    file as any,
  );

  // Build the public view URL
  const viewUrl = `${cachedConfig!.endpoint}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${cachedConfig!.projectId}`;

  console.log('[Appwrite] File uploaded:', result.$id, viewUrl);
  return viewUrl;
}

/** Clear cached config (e.g. on logout) */
export function clearStorageConfig() {
  cachedConfig = null;
  appwriteClient = null;
  appwriteStorage = null;
}
