import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:8081",
    plugins: [
        expoClient({
            scheme: "fold",
            storagePrefix: "fold",
            storage: SecureStore,
        })
    ]
});
