import * as SecureStore from "expo-secure-store";

const API_BASE = "https://backend.fold.taohq.org";
const COOKIE_STORAGE_KEY = "fold_cookie";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  image?: string | null; // Backend returns image, we map to avatar
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get stored cookies for authenticated requests
 * The expoClient stores cookies in SecureStore with this key
 */
async function getCookie(): Promise<string> {
  try {
    const cookieJson = await SecureStore.getItemAsync(COOKIE_STORAGE_KEY);
    if (!cookieJson) return "";

    const parsed = JSON.parse(cookieJson);
    return Object.entries(parsed)
      .filter(([_, value]: [string, any]) => {
        // Filter out expired cookies
        if (value.expires && new Date(value.expires) < new Date()) return false;
        return true;
      })
      .map(([key, value]: [string, any]) => `${key}=${value.value}`)
      .join("; ");
  } catch {
    return "";
  }
}

/**
 * Make an authenticated API request to the backend
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const cookie = await getCookie();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "expo-origin": "fold://",
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: "omit", // We handle cookies manually for React Native
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: json.message || json.error || "Request failed",
      };
    }

    return {
      data: json.data ?? json,
      error: null,
    };
  } catch (error) {
    console.error("API request error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<{
  data: User | null;
  error: string | null;
}> {
  // Add cache-busting to ensure fresh data
  return apiRequest<User>("/api/user/me", {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  });
}

/**
 * Update user profile (name and/or avatar)
 */
export async function updateProfile(data: {
  name?: string;
  avatar?: string | null;
}): Promise<{ data: User | null; error: string | null }> {
  return apiRequest<User>("/api/user/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Upload a file (avatar) to the backend
 */
export async function uploadAvatar(
  uri: string,
  mimeType: string = "image/jpeg"
): Promise<{ data: { url: string; id: string } | null; error: string | null }> {
  try {
    const cookie = await getCookie();

    // Create form data
    const formData = new FormData();
    const filename = uri.split("/").pop() || "avatar.jpg";

    // Backend expects 'avatar' key, not 'file'
    formData.append("avatar", {
      uri,
      name: filename,
      type: mimeType,
    } as any);

    const response = await fetch(`${API_BASE}/api/upload/avatar`, {
      method: "POST",
      headers: {
        "expo-origin": "fold://",
        ...(cookie ? { Cookie: cookie } : {}),
        // Note: Don't set Content-Type for FormData, let fetch set it with boundary
      },
      body: formData,
      credentials: "omit",
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: json.message || json.error || "Upload failed",
      };
    }

    // Backend returns: { data: { id, url, thumbnails: { small, medium, large } } }
    // Use medium thumbnail for avatar, or fall back to main url
    const uploadData = json.data ?? json;
    const avatarUrl = uploadData.thumbnails?.medium || uploadData.url;

    return {
      data: {
        id: uploadData.id,
        url: avatarUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Change password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; error: string | null }> {
  const result = await apiRequest<{ message: string }>(
    "/api/user/change-password",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return {
    success: result.error === null,
    error: result.error,
  };
}

/**
 * Delete account
 */
export async function deleteAccount(): Promise<{
  success: boolean;
  error: string | null;
}> {
  const result = await apiRequest<{ message: string }>("/api/user/me", {
    method: "DELETE",
  });

  return {
    success: result.error === null,
    error: result.error,
  };
}

// =============================================================================
// Timeline API
// =============================================================================

export interface MediaItem {
  id: string;
  uri: string;
  type: "image" | "video" | "audio";
  thumbnailUri?: string | null;
  duration: number | null;
  sortOrder: number;
}

export interface TimelineEntryResponse {
  id: string;
  userId: string;
  type: "text" | "audio" | "photo" | "video" | "story";
  createdAt: string;
  updatedAt: string;
  mood: string | null;
  location: string | null;
  caption: string | null;
  content: string | null;
  title: string | null;
  storyContent: string | null;
  pageCount: number | null;
  media: MediaItem[];
}

export interface CreateEntryPayload {
  type: "text" | "audio" | "photo" | "video" | "story";
  mood?: string | null;
  location?: string | null;
  caption?: string | null;
  content?: string | null;
  title?: string | null;
  storyContent?: string | null;
  pageCount?: number | null;
  media?: { uri: string; type: "image" | "video" | "audio"; thumbnailUri?: string | null; duration?: number | null }[];
}

/**
 * Create a new timeline entry
 */
export async function createTimelineEntry(
  payload: CreateEntryPayload
): Promise<{ data: TimelineEntryResponse | null; error: string | null }> {
  return apiRequest<TimelineEntryResponse>("/api/timeline", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get paginated list of timeline entries
 */
export async function getTimelineEntries(
  limit: number = 20,
  offset: number = 0
): Promise<{ data: TimelineEntryResponse[] | null; error: string | null }> {
  const result = await apiRequest<{
    data: TimelineEntryResponse[];
    pagination: { limit: number; offset: number; count: number };
  }>(`/api/timeline?limit=${limit}&offset=${offset}`);

  if (result.error) return { data: null, error: result.error };

  // apiRequest unwraps .data, but backend returns { success, data, pagination }
  // apiRequest returns json.data ?? json, so result.data is the array OR the full object
  const entries = Array.isArray(result.data)
    ? result.data
    : (result.data as any)?.data ?? [];

  return { data: entries, error: null };
}

/**
 * Get a single timeline entry by ID
 */
export async function getTimelineEntry(
  id: string
): Promise<{ data: TimelineEntryResponse | null; error: string | null }> {
  return apiRequest<TimelineEntryResponse>(`/api/timeline/${id}`);
}

/**
 * Update a timeline entry
 */
export async function updateTimelineEntry(
  id: string,
  data: { mood?: string; location?: string | null; caption?: string | null; content?: string | null }
): Promise<{ data: TimelineEntryResponse | null; error: string | null }> {
  return apiRequest<TimelineEntryResponse>(`/api/timeline/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a timeline entry
 */
export async function deleteTimelineEntry(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const result = await apiRequest<{ message: string }>(`/api/timeline/${id}`, {
    method: "DELETE",
  });
  return {
    success: result.error === null,
    error: result.error,
  };
}

/**
 * Upload a media file (photo, video, audio). Returns the remote URL.
 */
export async function uploadMedia(
  uri: string,
  mimeType: string = "image/jpeg"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const cookie = await getCookie();
    const formData = new FormData();
    const filename = uri.split("/").pop() || "file";

    formData.append("file", {
      uri,
      name: filename,
      type: mimeType,
    } as any);

    // Timeout after 15s to prevent hanging on large files
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      headers: {
        "expo-origin": "fold://",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: formData,
      credentials: "omit",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      return { url: null, error: json.message || json.error || "Upload failed" };
    }

    const uploadData = json.data ?? json;
    return { url: uploadData.url, error: null };
  } catch (error) {
    console.error("Upload media error:", error);
    return {
      url: null,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
