/**
 * Fold App Configuration
 *
 * Centralized configuration for all app content, links, and settings.
 * Edit this file to customize the app's text, URLs, and features.
 */

module.exports = {
  // =============================================================================
  // App Info
  // =============================================================================
  app: {
    name: 'Fold',
    tagline: 'Capture moments. Fold memories.',
    description: 'Fold is your personal voice journal. Capture your thoughts, emotions, and daily experiences through audio recordings. Watch your memories unfold over time and discover patterns in your journey.',
    version: '1.0.0',
    copyright: 'TheAlphaOnes',
  },

  // =============================================================================
  // Links & URLs
  // =============================================================================
  links: {
    website: 'https://fold.taohq.org',
    privacyPolicy: 'https://fold.taohq.org/privacy',
    termsOfService: 'https://fold.taohq.org/terms',
    supportEmail: 'thealphaones.work@gmail.com',
  },

  // =============================================================================
  // Credits
  // =============================================================================
  credits: {
    builtWith: 'React Native & Expo',
    madeBy: 'TheAlphaOnes',
    footerMessage: 'Made with love for mindful journaling',
  },

  // =============================================================================
  // About Page Links
  // =============================================================================
  aboutLinks: [
    { label: 'Privacy Policy', key: 'privacyPolicy' },
    { label: 'Terms of Service', key: 'termsOfService' },
    { label: 'Visit Website', key: 'website' },
  ],

  // =============================================================================
  // FAQ Items
  // =============================================================================
  faq: [
    {
      question: 'How do I create a new memory?',
      answer: 'Tap the capture button (microphone icon) at the bottom of any screen. You can record voice memos, add emotions, and save your thoughts instantly.',
    },
    {
      question: 'Are my recordings stored securely?',
      answer: 'Yes! All your voice recordings and data are encrypted and stored securely. Only you have access to your memories.',
    },
    {
      question: 'Can I export my memories?',
      answer: "Export functionality is coming soon. You'll be able to export your memories as audio files or transcribed text.",
    },
    {
      question: 'What is the Fold Score?',
      answer: 'Your Fold Score reflects your journaling consistency and engagement. The more regularly you capture memories, the higher your score grows.',
    },
    {
      question: 'How do streaks work?',
      answer: 'Streaks count consecutive days of capturing at least one memory. Keep your streak alive by recording something every day!',
    },
    {
      question: 'Can I use Fold offline?',
      answer: "Yes! You can record memories offline. They'll sync automatically when you're back online.",
    },
  ],

  // =============================================================================
  // Quick Tips (Help Screen)
  // =============================================================================
  tips: [
    {
      icon: 'mic',
      text: 'Long-press the capture button for quick recording',
    },
    {
      icon: 'calendar',
      text: 'Swipe on the calendar to navigate between months',
    },
    {
      icon: 'sparkle',
      text: 'Add emotions to your memories for better insights',
    },
  ],

  // =============================================================================
  // Notification Settings
  // =============================================================================
  notifications: {
    types: [
      {
        id: 'dailyReminder',
        label: 'Daily Reminder',
        description: 'Reminder to capture your daily thoughts',
        icon: 'clock',
        defaultEnabled: true,
      },
      {
        id: 'weeklyDigest',
        label: 'Weekly Digest',
        description: 'Summary of your weekly memories',
        icon: 'calendar',
        defaultEnabled: true,
      },
      {
        id: 'achievements',
        label: 'Achievements',
        description: 'Celebrate milestones and badges',
        icon: 'trophy',
        defaultEnabled: true,
      },
    ],
  },

  // =============================================================================
  // Appearance Settings
  // =============================================================================
  appearance: {
    themes: [
      { id: 'light', label: 'Light', description: 'Always use light mode' },
      { id: 'dark', label: 'Dark', description: 'Always use dark mode' },
      { id: 'system', label: 'System', description: 'Match device settings' },
    ],
    defaultTheme: 'light',
    darkModeAvailable: false, // Set to true when dark mode is implemented
    darkModeMessage: 'Dark mode is coming soon! Currently, Fold uses the beautiful cream theme you see now.',
  },

  // =============================================================================
  // Info Cards / Messages
  // =============================================================================
  infoMessages: {
    profile: 'Your profile information is stored securely and only visible to you.',
    password: "Choose a strong password that you haven't used before. A good password should include a mix of letters, numbers, and symbols.",
    notifications: 'Notification preferences are stored locally on this device. You can change system notification permissions in your device settings.',
  },

  // =============================================================================
  // Feature Flags
  // =============================================================================
  features: {
    googleSignIn: true,
    appleSignIn: false,
    exportMemories: false,
    shareMemories: false,
    offlineMode: true,
  },
};
