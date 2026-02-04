import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "https://backend.fold.taohq.org",
    plugins: [
        expoClient({
            scheme: "fold",
            storagePrefix: "fold",
            cookiePrefix: "better-auth", // Must match backend cookie naming
            storage: SecureStore,
        })
    ]
});
