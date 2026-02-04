import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Hide the default tab bar since we use custom BottomNavBar
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timeline',
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: 'Hub',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          // Hide from tab navigation (not used)
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          // Hide from tab bar, accessed via profile
          href: null,
        }}
      />
    </Tabs>
  );
}
