# Fold

Fold is a mobile application built with React Native and Expo, featuring a beautiful, dynamic timeline for capturing and sharing memories (photos, videos, audio, text). It is powered by a high-performance backend using Hono, Drizzle ORM, and Neon Serverless Postgres.

## Tech Stack

### Frontend (App)
* **Framework:** [Expo](https://expo.dev/) / React Native
* **Routing:** Expo Router (File-based routing)
* **State Management:** Zustand
* **Styling:** StyleSheet & [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for fluid, 60fps animations
* **Gestures:** [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
* **Media:** Expo Camera, Expo Image Picker, Expo Audio
* **Notifications:** Expo Push Notifications
* **Language:** TypeScript

### Backend (API)
* **Framework:** [Hono](https://hono.dev/) (Edge-ready, blazing fast web framework)
* **Runtime:** Node.js (deployment-ready for Vercel/Cloudflare)
* **Database:** [Neon](https://neon.tech/) (Serverless Postgres)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Authentication:** [Better Auth](https://better-auth.com/)
* **Storage:** AWS S3 (via `@aws-sdk/client-s3`)
* **Language:** TypeScript

---

## Project Structure

This repository is organized into two main parts: the frontend mobile app and the backend API.

```text
├── app/                  # Frontend: Expo Router screens and layouts
├── components/           # Frontend: Reusable UI components
├── constants/            # Frontend: Theme, colors, config
├── lib/                  # Frontend: API client, Zustand stores, utilities
├── assets/               # Frontend: Fonts, images, splash screens
├── fold.config.js        # Global app configuration
│
└── fold.backend/         # Backend: Hono API Server
    ├── src/
    │   ├── db/           # Drizzle schema and connection instances
    │   ├── lib/          # Auth config, S3 clients, middleware
    │   └── routes/       # API endpoints (auth, timeline, profile, connects)
    ├── drizzle/          # Database migrations
    └── drizzle.config.ts # Drizzle configuration
```

---

## Local Development Setup

### Prerequisites
* Node.js (v18+)
* npm or pnpm
* EAS CLI (`npm install -g eas-cli`)
* A [Neon](https://neon.tech/) Postgres database URL
* AWS S3 credentials (or compatible object storage like R2/Spaces)
* Better Auth JWT secrets

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd fold.backend
```

Install dependencies:
```bash
npm install
```

Set up your environment variables. Create a `.env` file in `fold.backend/` based on `.env.example`:
```env
# Database
DATABASE_URL="postgres://user:password@ep-cool-resonance-123.neon.tech/fold"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# S3 Storage (For Photos/Videos/Audio)
S3_BUCKET_NAME="your-bucket-name"
S3_REGION="us-east-1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
```

Push the database schema to Neon:
```bash
npm run db:push
```

Start the local API development server:
```bash
npm run dev
```
The backend will run on `http://localhost:3000`.

### 2. Frontend (App) Setup

Open a new terminal and navigate to the root directory:
```bash
cd fold   # (or wherever your root app folder is)
```

Install dependencies:
```bash
npm install
```

Set up your environment variables. Create a `.env` file in the root directory:
```env
# Point this to your local backend IP or production URL
# Note: For physical devices testing locally, use your machine's local IP (e.g., 192.168.1.X) instead of localhost
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

Start the Expo development server:
```bash
npx expo start
```

### 3. Running on a Device / Emulator

1. **Expo Go:** You can scan the QR code from the terminal to open the app in Expo Go. Note that push notifications will not work in Expo Go.
2. **Development Build (Recommended):** For full functionality including native push notifications and custom fonts:
   ```bash
   eas build --profile development --platform android # or ios
   ```

---

## Features

* **Timeline:** An immersive, horizontally or vertically scrolling feed of your personal memories.
* **Rich Media:** Add photos, videos, audio notes, and text entries.
* **Connections:** Connect with partners or friends via invite codes or direct requests to share memories.
* **Profiles & Streaks:** Track activity levels, earn badges (Early Bird, On Fire, Centurion), and maintain memory creation streaks.
* **Shared Memories:** Selectively share specific timeline entries with your active connections.
* **Push Notifications:** Powered by Expo Push to keep users engaged with connection requests and shared memories.

---

## Deployment

### Backend
The backend is built with Hono, making it versatile for edge or serverless deployment.
To deploy to Vercel:
```bash
cd fold.backend
npm install -g vercel
vercel
```

### Frontend
Deploying the app uses EAS (Expo Application Services):
```bash
eas build --platform all
eas submit --platform all
```
