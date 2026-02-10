/**
 * Direct Appwrite upload from the React Native app.
 * Fetches storage config from the backend, then uploads directly
 * to Appwrite REST API — bypasses Vercel's 4.5MB body limit.
 */
import { apiRequest } from './api';

// Cached config so we don't fetch on every upload
let cachedConfig: { endpoint: string; projectId: string; bucketId: string } | null = null;

/** Fetch Appwrite storage config from our backend */
async function getStorageConfig() {
  if (cachedConfig) return cachedConfig;

  const { data, error } = await apiRequest<{
    endpoint: string;
    projectId: string;
    bucketId: string;
  }>('/api/config/storage');

  if (error || !data) {
    throw new Error(error || 'Failed to fetch storage config');
  }

  cachedConfig = data;
  return cachedConfig;
}

/** Generate a unique ID (same format as Appwrite ID.unique()) */
function generateUniqueId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
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
  const config = await getStorageConfig();
  const fileId = generateUniqueId();
  const filename = localUri.split('/').pop() || 'file';
  const mimeType = guessMimeType(localUri);

  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append('file', {
    uri: localUri,
    name: filename,
    type: mimeType,
  } as any);

  const url = `${config.endpoint}/storage/buckets/${config.bucketId}/files`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': config.projectId,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[Appwrite] Upload failed:', response.status, errorBody);
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = await response.json();

  // Return the public view URL
  return `${config.endpoint}/storage/buckets/${config.bucketId}/files/${result.$id}/view?project=${config.projectId}`;
}

/** Clear cached config (e.g. on logout) */
export function clearStorageConfig() {
  cachedConfig = null;
}
