
Skip to content

    better-auth
    better-auth

Repository navigation

    Code
    Issues316 (316)
    Pull requests350 (350)
    Agents
    Discussions
    Actions
    Projects
    Security10 (10)
    Insights

Expo Android + Better Auth: 403 MISSING_OR_NULL_ORIGIN on sign-up/sign-in
#5750
@nicholsss nicholsss
on Nov 4, 2025 · 2 comments · 10 replies
Return to top
nicholsss
on Nov 4, 2025

Hello! Im having issues with better auth and expo integration. I keep getting 403 MISSING_OR_NULL_ORIGINwhen i try to signIn or signUp.

Im using android simulator on MacOs.

here is my server/lib/auth.ts:

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { expo } from "@better-auth/expo";
export const auth = betterAuth({

    plugins: [expo()],
        database: drizzleAdapter(db, {
        provider: "pg",
    }),

  trustedOrigins: [
    "myapp://",
    "http://10.0.2.2:8787",
    "http://localhost:8787"
  ],
  emailAndPassword: {
    enabled: true,
  },
});

Here is my server/.env:

...
BETTER_AUTH_URL=http://10.0.2.2:8787
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

Here is my client/auth-client.ts:

import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'
import * as SecureStore from 'expo-secure-store'

import { API_BASE_URL } from '@/src/api/config'

export const authClient = createAuthClient({
  baseURL: "http://10.0.2.2:8787",
  plugins: [
    expoClient({
      scheme: 'client',
      storagePrefix: 'client',
      storage: SecureStore,
    }),
  ],
})

client/config.ts:

import { Platform } from "react-native";

const normalizeBaseUrl = (url: string) => url.trim().replace(/\/+$/, '');

const fallbackBaseUrl = Platform.select({
  android: "http://10.0.2.2:8787",  // your local Hono port
  ios: "http://localhost:8787",
  default: "http://localhost:8787",
})!;

const envBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  fallbackBaseUrl;
export const API_BASE_URL = normalizeBaseUrl(envBaseUrl);
console.log("API_BASE_URL:", API_BASE_URL);

When i try to signIn or signUp my server hits me with this error:

[auth] → GET /api/auth/get-session (expo-origin: myapp://)
[auth] ← GET /api/auth/get-session 200 (28ms)
[auth] → POST /api/auth/sign-in/email (expo-origin: myapp://)
[auth] ← POST /api/auth/sign-in/email 403 (36ms)

here is my client error:

 API_BASE_URL:TESTI http://10.0.2.2:8787
 LOG  [auth] session update null
 LOG  [auth] attempting sign-in {"email": "root@root"} {"password": "rootroot"}
 LOG  [auth] sign-in result {"data": null, "error": {"code": "MISSING_OR_NULL_ORIGIN", "message": "Missing or null Origin", "status": 403, "statusText": ""}}
 ERROR  [auth] sign-in ERROR {"code": "MISSING_OR_NULL_ORIGIN", "message": "Missing or null Origin", "status": 403, "statusText": ""}

Code: index.tsx
  125 |       console.log('[auth] sign-in result', result)
  126 |       if (result.error) {
> 127 |         console.error('[auth] sign-in ERROR', result.error)
      |                      ^
  128 |         setAuthMessage(result.error.message ?? 'Sign-in failed')
  129 |         return
  130 |       }
Call Stack
  handleSignIn (src/app/(tabs)/index.tsx:127:22)

{
"expo": {
  "name": "client",
  "slug": "client",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "client",
}
}

So could someone with experience help me out. I been struggling to implement the better auth to my expo app.

I did:

```dev@MacBookAir client % npx expo prebuild```
and
```dev@MacBookAir client % npx expo start --dev-client```

Then i chose development build and android.

Replies: 2 comments · 10 replies

dosubot[bot]
bot
on Nov 4, 2025

Hi @nicholsss! I'm Dosu and I’m helping the better-auth team.

Your 403 MISSING_OR_NULL_ORIGIN error is caused by a mismatch between the scheme your Expo client is using and what your Better Auth server expects for origin validation. The Expo client sends an expo-origin header (and now, thanks to a recent Better Auth update, this is used to populate the Origin header if it's missing), and the server checks if this value matches any entry in your trustedOrigins array. If they don't match exactly, you get a 403 error (source, source).

In your setup, your Expo client is configured with scheme: 'client' (so it sends expo-origin: client://), but your server's trustedOrigins includes "myapp://", not "client://". To fix this, make sure the scheme in all three places matches:

    In expoClient({ scheme: 'client', ... }) on the client
    In app.json: "scheme": "client"
    In your server's trustedOrigins: add "client://"

So, update your server config to:

trustedOrigins: [
  "client://",
  "http://10.0.2.2:8787",
  "http://localhost:8787"
],

If you want to quickly unblock yourself in development, you can also add advanced: { disableOriginCheck: true } to your betterAuth config, but only do this in dev since it disables CSRF protection (source).

If you still have issues, log the Origin and expo-origin headers on the server to see what values are actually being sent and matched.

Let me know if this resolves it!

To reply, just mention @dosu.

How did I do? Good | Irrelevant | Incorrect | Verbose | Hallucination | Report 🐛 | Other  Chat with Dosu Join Discord Share on X
6 replies
@dosubot
dosubot[bot]
bot
on Nov 4, 2025

Your Expo client is sending the correct expo-origin header, but the Better Auth server expects either a valid Origin header or will map expo-origin to Origin only if your plugin/config is set up for it. Recent Better Auth versions (v1.3.31+) now automatically map expo-origin to Origin unless you explicitly disable it with disableOriginOverride (source).

To fix your 403 error, make sure you are using the latest versions of both better-auth and @better-auth/expo. Your server config should look like this:

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  plugins: [
    expo() // No need for extra options unless you want to disable the override
  ],
  database: drizzleAdapter(db, { provider: "pg" }),
  trustedOrigins: [
    "myapp://",
    "http://10.0.2.2:8787",
    "http://localhost:8787"
  ],
  emailAndPassword: { enabled: true },
  debug: true,
  allowDangerousConnections: process.env.NODE_ENV !== 'production',
});

If you are still seeing the error, check your installed package versions and upgrade both better-auth and @better-auth/expo to the latest release. If you need to quickly unblock in dev, you can add advanced: { disableOriginCheck: true } to your config, but this disables CSRF protection and should only be used temporarily (source).

Let me know if updating resolves it!

To reply, just mention @dosu.

How did I do? Good | Irrelevant | Incorrect | Verbose | Hallucination | Report 🐛 | Other  Chat with Dosu Join Discord Share on X
@nicholsss
nicholsss
on Nov 4, 2025
Author

@dosu I added and it started to work.

      ...
        advanced: {
        disableOriginCheck: true,
      },

Is this valid option even in production, as react native expo app does not send origin, but ExpoOrigin.
@dosubot
dosubot[bot]
bot
on Nov 4, 2025

No, using advanced: { disableOriginCheck: true } is not safe or recommended in production. This option disables CSRF protection and exposes your app to security risks, so it should only be used in isolated development environments reference reference.

For production, Better Auth (v1.3.31+) now automatically maps expo-origin to Origin unless you explicitly disable it with disableOriginOverride. This means you can keep CSRF protection enabled, and as long as your trustedOrigins includes your app scheme (like "myapp://"), Expo/React Native clients will work securely reference reference.

So: remove disableOriginCheck, make sure you're on the latest better-auth and @better-auth/expo, and keep your trustedOrigins up to date with your app's scheme. This is the secure and recommended setup for production.

To reply, just mention @dosu.

How did I do? Good | Irrelevant | Incorrect | Verbose | Hallucination | Report 🐛 | Other  Chat with Dosu Join Discord Share on X
@rickafds
rickafds
on Nov 5, 2025

I have the same problem with version Better Auth (v1.3.34)
@tormgibbs
tormgibbs
on Nov 20, 2025

#5750 (comment)
tormgibbs
on Nov 20, 2025

I had this issue too...after some research. this fixed the issue for me. btw im using hono as my backend

app.use(async (c, next) => {
	const ExpoOrigin = c.req.header('expo-origin')
	if (ExpoOrigin) {
		c.req.raw.headers.set('origin', ExpoOrigin)
	}
	await next()
})

4 replies
@k-yang
k-yang
on Dec 5, 2025

I initially did this but Hono wouldn't let me modify the incoming request's headers. It threw a TypeError Can't modify immutable headers. I had to clone the incoming request, make a new headers object, and set that on the context. I restricted it to the /api/auth routes just for BetterAuth.

app.use("/api/auth/*", async (c, next) => {
  const ExpoOrigin = c.req.header("expo-origin");
  if (ExpoOrigin) {
    const originalRequest = c.req.raw;

    // Create new headers
    const newHeaders = new Headers(originalRequest.headers);
    newHeaders.set("origin", ExpoOrigin);

    // Create a new Request with updated headers
    const newRequest = new Request(originalRequest, {
      headers: newHeaders,
    });

    // Replace the request in context
    c.req.raw = newRequest;
  }
  await next();
});

With this middleware, you don't even need to set expo({ disableOriginOverride: true }) in your auth.ts plugins config (as per #5568).
@Hilmarch27
Hilmarch27
on Dec 10, 2025

thanks this works fine
@periakteon
periakteon
on Dec 15, 2025

Just ran into this same issue and wanted to share what I found.

The problem with the middleware approach is that in Hono, c.req is a HonoRequest wrapper object, and it's read-only. When you do:

c.req.raw = newRequest;

This assignment doesn't actually persist through the middleware chain. The HonoRequest class caches various properties internally, and simply swapping out the raw property doesn't update those caches or propagate to downstream handlers.

I also tried creating a new HonoRequest instance to replace c.req, but HonoRequest is exported as a type-only from Hono, so you can't instantiate it directly.

The solution is to handle the header substitution at the point where you actually consume the request - in the auth route handler itself:

function withExpoOrigin(request: Request): Request {
  const expoOrigin = request.headers.get("expo-origin");
  if (!expoOrigin) {
    return request;
  }

  const newHeaders = new Headers(request.headers);
  newHeaders.set("origin", expoOrigin);

  return new Request(request, { headers: newHeaders });
}

// In your auth route:
authRoutes.on(["POST", "GET"], "/auth/*", (c) => auth.handler(withExpoOrigin(c.req.raw)));

This way the modified request with the corrected origin header is passed directly to Better Auth's handler, which is where it actually needs to be.
@ansh
ansh
on Dec 17, 2025

I had to do this too. This is crazy that we have to do this. What the hell.
Suggest an answer
Comment

Add your answer here...
Remember, contributions to this repository should follow its contributing guidelines, security policy, and code of conduct.
Category
🙏
Q&A
Labels
None yet
7 participants
@nicholsss
@k-yang
@ansh
@rickafds
@tormgibbs
@Hilmarch27
@periakteon
Notifications

You’re not receiving notifications from this thread.

Footer
© 2026 GitHub, Inc.
Footer navigation

    Terms
    Privacy
    Security
    Status
    Community
    Docs
    Contact

