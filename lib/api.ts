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
  return apiRequest<User>("/api/user/me");
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
