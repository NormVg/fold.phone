import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    plugins: [expo()],
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "fold://",
        ...(process.env.NODE_ENV === "development" ? [
            "exp://",
            "exp://**",
            "exp://192.168.*.*:*/**",
        ] : [])
    ]
});
