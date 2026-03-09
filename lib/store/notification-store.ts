import Constants from "expo-constants";
import { Platform } from "react-native";
import { apiRequest } from "../api";

// =============================================================================
// Expo Go Detection
// =============================================================================

const isExpoGo = Constants.executionEnvironment === "storeClient";

// Only load native push modules outside Expo Go
let Notifications: any = null;
let Device: any = null;

if (!isExpoGo) {
  Notifications = require("expo-notifications");
  Device = require("expo-device");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// =============================================================================
// Push Token Registration
// =============================================================================

/**
 * Register for native push notifications.
 * Called on auth change (login). Follows official Expo pattern.
 */
export async function registerPushToken(): Promise<void> {
  if (isExpoGo) {
    console.log("[Push] Skipping — not supported in Expo Go");
    return;
  }

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#810100",
      });
    }

    if (!Device.isDevice) {
      console.log("[Push] Must use physical device for push notifications");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[Push] Permission not granted");
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      console.error("[Push] Project ID not found");
      return;
    }

    const pushToken = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log("[Push] Token:", pushToken);

    const { error } = await apiRequest("/api/config/push-token", {
      method: "POST",
      body: JSON.stringify({ pushToken }),
    });

    if (error) {
      console.error("[Push] Failed to register token:", error);
    } else {
      console.log("[Push] Token registered with backend");
    }
  } catch (error) {
    console.error("[Push] Registration error:", error);
  }
}
