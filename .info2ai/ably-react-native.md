# Getting started: Pub/Sub with React Native

This guide will get you started with Ably Pub/Sub in a new React Native application built with Expo.

You'll establish a realtime connection to Ably and learn to publish and subscribe to messages. You'll also implement presence to track other online clients, and learn how to retrieve message history.

![Screenshot of the completed React Native Pub/Sub application showing a web interface with connection status, a message input field, realtime message display, and a presence indicator showing online users. The interface demonstrates the key features you'll build including publishing messages, subscribing to receive messages in realtime, and tracking which clients are currently present in the channel.](https://raw.githubusercontent.com/ably/docs/main/src/images/content/screenshots/getting-started/pub-sub-react-native-getting-started-guide.png)

## Prerequisites

1. [Sign up](https://ably.com/sign-up) for a free Ably account.
2. Create a [new app](https://ably.com/accounts/any/apps/new), and create your first API key in the **API Keys** tab of the dashboard.
3. Your API key will need the `publish`, `subscribe`, `presence` and `history` [capabilities](https://ably.com/docs/auth/capabilities.md).

### Create a React Native project

Create a new React Native project using [Expo](https://expo.dev/) using [Nativewind](https://www.nativewind.dev/) for styling and then navigate to the project folder:

<Code>

#### Shell

```
npx rn-new@latest ably-pubsub-react-native --nativewind
cd ably-pubsub-react-native
```
</Code>

To open your project on the web, you also need to install the following required dependencies:

<Code>

#### Shell

```
npx expo install react-dom react-native-web @expo/metro-runtime
```
</Code>

Replace the contents of `App.tsx` with the following:

<Code>

#### React

```
// App.tsx

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import './global.css';

export default function App() {
  return (
    <View className="mt-8 w-full flex-1 items-center">
      <View className="w-[90%] max-w-[900px] rounded-lg border border-blue-500">
        <View className="w-full rounded-lg bg-gray-100 p-4">
          <Text className="text-center text-lg font-semibold text-blue-500">
            Ably Pub/Sub React Native
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
```
</Code>

### Install Ably Pub/Sub JavaScript SDK

Install the Ably Pub/Sub JavaScript SDK in your React Native project:

<Code>

#### Shell

```
npm install ably
```
</Code>

Create a `.env` file in your project root and add your API key:

<Code>

#### Shell

```
echo "ABLY_API_KEY=your-api-key" > .env
```
</Code>

### Set up AblyProvider

The Ably Pub/Sub SDK provides React hooks and context providers that make it easier to use Pub/Sub features in your React Native components.

The `AblyProvider` component should be used at the top level of your application, typically in `App.tsx`. It provides access to the Ably Realtime client for all child components that use Ably Pub/Sub React hooks.

<Aside data-type='note'>
The `AblyProvider` is required when using the `useAbly()` and `useConnectionStateListener()` hooks, and the `ChannelProvider` exposed by the Ably Pub/Sub SDK.
</Aside>

Replace the contents of your `App.tsx` file with the following code to set up the `AblyProvider`:

<Code>

#### React

```
// App.tsx

import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';

import './global.css';

// Create your Ably Realtime client
const realtimeClient = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
  clientId: 'my-first-client',
});

export default function App() {
  return (
    <AblyProvider client={realtimeClient}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="mt-8 w-full flex-1 items-center">
          <View className="w-[90%] max-w-[900px] rounded-lg border border-blue-500">
            <View className="w-full rounded-lg bg-gray-100 p-4">
              <Text className="text-center text-lg font-semibold text-blue-500">
                Ably Pub/Sub React Native
              </Text>
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </AblyProvider>
  );
}
```
</Code>

<Aside data-type='note'>
Keep the Realtime client initialization outside of any React component to prevent it from being recreated on re-renders, which could result in reaching your Ably connection limit.
</Aside>

### (Optional) Install Ably CLI

Use the [Ably CLI](https://github.com/ably/cli) as an additional client to quickly test Pub/Sub features. It can simulate other clients by publishing messages, subscribing to channels, and managing presence states.

1. Install the Ably CLI:

<Code>

#### Shell

```
npm install -g @ably/cli
```
</Code>

2. Run the following to log in to your Ably account and set the default app and API key:

<Code>

#### Shell

```
ably login
```
</Code>

<If loggedIn={false}>
  <Aside data-type='note'>
  The code examples in this guide include a demo API key. If you wish to interact with the Ably CLI and view outputs within your Ably account, ensure that you replace them with your own API key.
  </Aside>
</If>

## Step 1: Connect to Ably

<Aside data-type='note'>
Open the [dev console](https://ably.com/accounts/any/apps/any/console) of your app before proceeding so that you can see your connection.
</Aside>

Clients establish a connection with Ably when they instantiate an SDK instance. This enables them to send and receive messages in realtime across channels.

In the [Set up AblyProvider](#prerequisites-setup-ably-provider) section, you added the following code to create an Ably Realtime client:

<Code>

### React

```
const realtimeClient = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
  clientId: 'my-first-client',
});
```
</Code>

This code creates a new Realtime client instance, establishing a connection to Ably when your application starts. At the minimum you need to provide an authentication mechanism. While using an API key is fine for the purposes of this guide, you should use [token authentication](https://ably.com/docs/auth/token.md) in production environments. A [`clientId`](https://ably.com/docs/auth/identified-clients.md) ensures the client is identified, which is required to use certain features, such as presence.

To monitor the Ably connection state within your application, create a component that uses the `useConnectionStateListener()` hook provided by the Ably Pub/Sub SDK. This hook must be nested inside an `AblyProvider`, so the component must be placed within the `AblyProvider` in your application.

In your project, create a new file `components/ConnectionState.tsx` with the following content:

<Code>

### React

```
// components/ConnectionState.tsx

// React hooks are exported from the 'ably/react' path of the 'ably' package.
import { useAbly, useConnectionStateListener } from 'ably/react';
import { Text } from 'react-native';
import { useState } from 'react';

export function ConnectionState() {
  // The useAbly hook returns the Ably Realtime client instance provided by the AblyProvider
  const ably = useAbly();
  const [connectionState, setConnectionState] = useState(ably.connection.state);

  // useConnectionStateListener hook listens for changes in connection state
  useConnectionStateListener((stateChange) => {
    setConnectionState(stateChange.current);
  });

  return <Text className="mt-4 text-center">Connection: {connectionState}!</Text>;
}
```
</Code>

Update your `App` component in the `App.tsx` file to include the `ConnectionState` component:

<Code>

### React

```
// App.tsx

import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { ConnectionState } from './components/ConnectionState';

import './global.css';

// Create your Ably Realtime client
const realtimeClient = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
  clientId: 'my-first-client',
});

export default function App() {
  return (
    <AblyProvider client={realtimeClient}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="mt-8 w-full flex-1 items-center">
          <View className="w-[90%] max-w-[900px] rounded-lg border border-blue-500">
            <View className="w-full rounded-lg bg-gray-100 p-4">
              <Text className="text-center text-lg font-semibold text-blue-500">
                Ably Pub/Sub React Native
              </Text>
              {/* Add ConnectionState here */}
              <ConnectionState />
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </AblyProvider>
  );
}
```
</Code>

Now start your application by running:

<Code>

### Shell

```
npm run start
```
</Code>

Open your React Native app on a physical device by scanning the QR code in your console, or run it locally using the iOS Simulator, Android Emulator, or on the web by typing `i`, `a`, or `w` respectively in your console.

<Aside data-type='note'>
To run the React Native app in simulators, make sure your development environment is properly set up. Refer to the Expo documentation for guidance on configuring the [Android Emulator](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go) and the [iOS Simulator](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=expo-go).
</Aside>

You should see the connection state displayed in your UI (e.g., `Connection: connected!`). You can also inspect connection events in the [dev console](https://ably.com/accounts/any/apps/any/console) of your app.

## Step 2: Subscribe to a channel and publish a message

Messages contain the data that a client is communicating, such as a short 'hello' from a colleague, or a financial update being broadcast to subscribers from a server. Ably uses channels to separate messages into different topics, so that clients only ever receive messages on the channels they are subscribed to.

### ChannelProvider

Now that you're connected to Ably, you can create and manage channels using the `ChannelProvider` component from the Ably Pub/Sub SDK. This component must be nested within the [`AblyProvider`](#prerequisites-setup-ably-provider) described above.

<Aside data-type='note'>
`ChannelProvider` is required when using feature hooks such as `useChannel()` or `usePresence()` exposed by the Ably Pub/Sub SDK.
</Aside>

Update your main `App` component to include the `ChannelProvider`:

<Code>

#### React

```
// App.tsx

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { ConnectionState } from './components/ConnectionState';

import './global.css';

// Create your Ably Realtime client
const realtimeClient = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
  clientId: 'my-first-client',
});

export default function App() {
  return (
    <AblyProvider client={realtimeClient}>
      {/* Wrap components with ChannelProvider */}
      <ChannelProvider channelName="my-first-channel">
        ...
      </ChannelProvider>
    </AblyProvider>
  );
}
```
</Code>

### Subscribe to a channel

Use the `useChannel()` hook within the `ChannelProvider` component to subscribe to incoming messages on a channel. This hook also provides access to a `channel` instance and a `publish` method for sending messages.

In your project, create a new file called `components/Messages.tsx` and add new components called `Messages` and `MessageView`:

<Code>

#### React

```
// components/Messages.tsx

import type { Message } from 'ably';
import { useChannel } from 'ably/react';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

function MessageView({ message }: { message: Message }) {
  // Displays an individual message
  const isMine = message.clientId === 'my-first-client';
  return (
    <View className={`my-1 rounded px-2 py-1 shadow-sm ${isMine ? 'bg-green-100' : 'bg-blue-50'}`}>
      <Text className="text-gray-800">{message.data}</Text>
    </View>
  );
}

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);

  // The useChannel hook subscribes to messages on the channel
  useChannel('my-first-channel', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  return (
    <View className="h-[200px] w-full rounded-lg lg:h-[400px]">
      <ScrollView className="flex-1 p-4">
        {messages.map((msg: Message) => (
          <MessageView key={msg.id} message={msg} />
        ))}
      </ScrollView>
    </View>
  );
}
```
</Code>

Next, update your main `App` component in the `App.tsx` file to include the `Messages` component within the `ChannelProvider`:

<Code>

#### React

```
// App.tsx

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { ConnectionState } from './components/ConnectionState';
import { Messages } from './components/Messages';

import './global.css';

// Create your Ably Realtime client
const realtimeClient = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
  clientId: 'my-first-client',
});

export default function App() {
  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName="my-first-channel">
        <SafeAreaView className="flex-1 bg-white">
          <View className="mt-8 w-full flex-1 items-center">
            <View className="w-[90%] max-w-[900px] rounded-lg border border-blue-500">
              <View className="w-full rounded-lg bg-gray-100 p-4">
                <Text className="text-center text-lg font-semibold text-blue-500">
                  Ably Pub/Sub React Native
                </Text>
                <ConnectionState />
              </View>

              <View className="flex-column justify-evenly lg:flex-row">
                <View className="lg:w-3/4">
                  {/* Your Messages component should go here */}
                  <Messages />
                </View>
              </View>
            </View>
            <StatusBar style="auto" />
          </View>
        </SafeAreaView>
      </ChannelProvider>
    </AblyProvider>
  );
}
```
</Code>

You've successfully created a channel instance and set up a listener to receive messages. You can test this immediately by publishing messages using the Ably CLI:

<Code>

#### Shell

```
ably channels publish my-first-channel 'Hello from CLI!'
```
</Code>

### Publish a message

You can publish messages in your React Native app using the `publish` method provided by the `useChannel()` hook.

Update your `components/Messages.tsx` file to include message publishing:

<Code>

#### React

```
// components/Messages.tsx

import type { Message } from 'ably';
import { useChannel } from 'ably/react';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

function MessageView({ message }: { message: Message }) {
  // Displays an individual message
  const isMine = message.clientId === 'my-first-client';
  return (
    <View className={`my-1 rounded px-2 py-1 shadow-sm ${isMine ? 'bg-green-100' : 'bg-blue-50'}`}>
      <Text className="text-gray-800">{message.data}</Text>
    </View>
  );
}

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  // useChannel hook also provides a publish method
  const { publish } = useChannel('my-first-channel', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  // Function to handle publishing messages
  const handlePublish = () => {
    if (!inputValue.trim()) return;
    publish('my-first-messages', inputValue.trim()).catch((err) =>
      console.error('Error publishing message', err)
    );
    setInputValue('');
  };

  return (
    <View className="h-[200px] w-full rounded-lg lg:h-[400px]">
      <ScrollView className="flex-1 p-4">
        {messages.map((msg: Message) => (
          <MessageView key={msg.id} message={msg} />
        ))}
      </ScrollView>
      <View className="mb-2 mt-auto flex-row items-center border-t border-gray-200 p-2">
        <TextInput
          placeholder="Type your message..."
          className="flex-1 rounded border border-gray-400 bg-white p-2"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handlePublish}
        />
        <TouchableOpacity
          className="ml-2 items-center justify-center rounded bg-blue-500 px-4 py-2"
          onPress={handlePublish}>
          <Text className="text-white">Publish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```
</Code>

Your application now supports publishing realtime messages! Type a message and press "Publish" to see it appear in your UI. Open the app on a second device or simulator to see clients interacting with each other in realtime, or publish messages using the Ably CLI:

<Code>

#### Shell

```
ably channels publish my-first-channel 'Hello from CLI!'
```
</Code>

Messages from the CLI will appear in your UI in a different color to the ones you sent from the app.

## Step 3: Join the presence set

Presence enables clients to be aware of one another if they are present on the same channel. You can then show clients who else is online, provide a custom status update for each, and notify the channel when someone goes offline.

Use the `usePresence()` and `usePresenceListener()` hooks provided by the Ably Pub/Sub SDK to interact with the presence feature in your React Native application. The `usePresence()` hook enables a client to join the presence set on a channel and update their presence status. The `usePresenceListener()` hook lets you subscribe to presence changes on a channel.

The `usePresenceListener()` hook also returns an object containing the `presenceData` array, which holds current presence data on the channel.

Create a new file called `components/PresenceStatus.tsx` with the following content:

<Code>

### React

```
// components/PresenceStatus.tsx

// 'ably/react' exports hooks for working with presence on a channel
import { usePresence, usePresenceListener } from 'ably/react';
import { Text, View } from 'react-native';

export function PresenceStatus() {
  // Enter the current client into the presence set with an optional status
  usePresence('my-first-channel', { status: "I'm here!" });

  // Subscribe to presence updates on the channel
  const { presenceData } = usePresenceListener('my-first-channel');

  return (
    <View className="w-full bg-white px-4 py-2">
      <Text className="mb-2 border-b border-gray-200 pb-2 text-center text-green-700">
        Present: {presenceData.length}
      </Text>

      <View>
        {presenceData.map((member, idx) => (
          <View key={idx} className="mb-2 flex-row items-center">
            <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
            <Text className="text-gray-800">
              {member.clientId}
              {member.data?.status ? ` (${member.data.status})` : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
```
</Code>

Add the `PresenceStatus` component to your main `App` component in `App.tsx` as follows:

<Code>

### React

```
// App.tsx

// Add PresenceStatus import
import { PresenceStatus } from './components/PresenceStatus';

// Other imports and realtimeClient initialization

export default function App() {
  return (
    <AblyProvider client={realtimeClient}>
      <ChannelProvider channelName="my-first-channel">
        <SafeAreaView className="flex-1 bg-white">
          <View className="mt-8 w-full flex-1 items-center">
            <View className="w-[90%] max-w-[900px] rounded-lg border border-blue-500">
              <View className="w-full rounded-lg bg-gray-100 p-4">
                <Text className="text-center text-lg font-semibold text-blue-500">
                  Ably Pub/Sub React Native
                </Text>
                <ConnectionState />
              </View>
              <View className="flex-column justify-evenly lg:flex-row">
                <View className="border-blue-500 max-lg:border-b lg:w-1/4 lg:border-r">
                  {/* Your PresenceStatus component should go here */}
                  <PresenceStatus />
                </View>
                <View className="lg:w-3/4">
                  <Messages />
                </View>
              </View>
            </View>
            <StatusBar style="auto" />
          </View>
        </SafeAreaView>
      </ChannelProvider>
    </AblyProvider>
  );
}
```
</Code>

The application will now display a list of clients currently present on the channel. The `usePresence()` hook enters your client into the channel's presence set with an optional status, while the `usePresenceListener()` hook subscribes to presence updates. Your current client ID should appear in the list of online users.

You can have another client join the presence set using the Ably CLI:

<Code>

### Shell

```
ably channels presence enter my-first-channel --data '{"status":"From CLI"}'
```
</Code>

## Step 4: Retrieve message history

You can retrieve previously sent messages using the history feature. Ably stores all messages for 2 minutes by default in the event a client experiences network connectivity issues. You can [extend the storage period](https://ably.com/docs/storage-history/storage.md) of messages if required.

Although the Ably Pub/Sub SDK does not provide a specific hook for retrieving message history, you can use the `useChannel()` hook to get a [`RealtimeChannel`](https://ably.com/docs/sdk/js/v2.0/interfaces/ably.RealtimeChannel.html) instance and then call its [`history()`](https://ably.com/docs/sdk/js/v2.0/interfaces/ably.RealtimeChannel.html#history) method to retrieve messages recently published to the channel.

Update your `components/Messages.tsx` file to include the new `useEffect` within your existing `Messages` component:

<Code>

### React

```
// components/Messages.tsx

// Update your react import to have `useEffect` as well.
import { useState, useEffect } from 'react';

// MessageView component remains unchanged

export function Messages() {
  // State management remains the same

  // Include channel from useChannel hook
  const { channel, publish } = useChannel('my-first-channel', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  // handlePublish function remains unchanged

  useEffect(() => {
    async function loadHistory() {
      try {
        // Retrieve the last 5 messages from history
        const history = await channel.history({ limit: 5 });
        // History responses are returned in reverse chronological order (newest first)
        // Reverse the array to show the latest messages at the bottom in the UI
        const messagesFromHistory = history.items.reverse();
        // Update the state with retrieved messages
        setMessages(messagesFromHistory);
      } catch (error) {
        console.error('Error loading message history:', error);
      }
    }

    loadHistory();
  }, [channel]);

  // Return remains unchanged
  return ();
}
```
</Code>

Test this feature with the following steps:

1. Publish several messages using your application UI, or send messages from another client using the Ably CLI:

<Code>

### Shell

```
ably channels publish --count 5 my-first-channel "Message number {{.Count}}"
```
</Code>

2. Refresh the app. This will cause the `Messages` component to mount again and call the `channel.history()` method.
3. You should see the last 5 messages displayed in your UI, ordered from oldest to newest at the bottom:

<Code>

### Json

```
Message number 1
Message number 2
Message number 3
Message number 4
Message number 5
```
</Code>

## Next steps

Continue to explore the documentation with React as the selected language:

* Understand [token authentication](https://ably.com/docs/auth/token.md) before going to production.
* Understand how to effectively [manage connections](https://ably.com/docs/connect.md#close?lang=react).
* Explore more [advanced](https://ably.com/docs/pub-sub/advanced.md) Pub/Sub concepts.

You can also explore the [Ably CLI](https://www.npmjs.com/package/&#64;ably/cli) further, or visit the Pub/Sub [API references](https://ably.com/docs/api/realtime-sdk.md).

## Related Topics

- [Overview](https://ably.com/docs/getting-started.md): Getting started with Ably Pub/Sub in your language or framework of choice. Learn how to publish, subscribe, track presence, fetch message history, and manage realtime connections.
- [JavaScript](https://ably.com/docs/getting-started/javascript.md): Get started with Pub/Sub in vanilla JavaScript using Ably. Learn how to publish, subscribe, track presence, fetch message history, and manage realtime connections.
- [Node.js](https://ably.com/docs/getting-started/node.md): Get started with Pub/Sub in JavaScript using Ably. Learn how to publish, subscribe, track presence, fetch message history, and manage realtime connections.
- [React](https://ably.com/docs/getting-started/react.md): A getting started guide for Ably Pub/Sub React that steps through some of the key features using React and Vite.
- [Kotlin](https://ably.com/docs/getting-started/kotlin.md): Get started with Pub/Sub in Kotlin using Ably. Learn how to publish, subscribe, track presence, fetch message history, and manage realtime connections.
- [Swift](https://ably.com/docs/getting-started/swift.md): Get started with Pub/Sub in Swift using Ably. Learn how to publish, subscribe, track presence, fetch message history, and manage realtime connections.
- [Flutter](https://ably.com/docs/getting-started/flutter.md): A getting started guide for Ably Pub/Sub Flutter that steps through some of the key features using Flutter.
- [Java](https://ably.com/docs/getting-started/java.md): A getting started guide for Ably Pub/Sub Java that steps through some of the key features using Java.
- [Go](https://ably.com/docs/getting-started/go.md): Get started with Pub/Sub in Go using Ably. Learn how to publish, subscribe, track presence, fetch message history, and manage realtime connections.
- [Python](https://ably.com/docs/getting-started/python.md): A getting started guide for Ably Pub/Sub Python that steps through some of the key features using Python.
- [Ruby](https://ably.com/docs/getting-started/ruby.md): A getting started guide for Ably Pub/Sub Ruby that steps through some of the key features using Ruby.
- [C# .NET](https://ably.com/docs/getting-started/dotnet.md): A getting started guide for Ably Pub/Sub C# .NET that steps through some of the key features using C# and .NET.
- [Objective C](https://ably.com/docs/getting-started/objective-c.md): A getting started guide for Ably Pub/Sub Objective-C that steps through some of the key features using Objective-C.
- [PHP](https://ably.com/docs/getting-started/php.md): A getting started guide for Ably Pub/Sub PHP that steps through some of the key features using PHP.
- [Laravel](https://ably.com/docs/getting-started/laravel.md): A getting started guide for Ably Pub/Sub Laravel 12 that steps through some of the key features using Laravel.
- [Web Push](https://ably.com/docs/push/getting-started/web.md): Get started with Ably Push Notifications in JavaScript. Learn how to register a service worker, activate push on your client, handle incoming notifications, and send push messages from the browser.
- [APNs](https://ably.com/docs/push/getting-started/apns.md): Get started with Ably Push Notifications in Swift. Learn how to register for push notifications, activate push on your client, handle incoming notifications, and send push messages.
- [FCM](https://ably.com/docs/push/getting-started/fcm.md): Get started with Ably Push Notifications in Kotlin for Android. Learn how to register for push notifications with Firebase Cloud Messaging (FCM), activate push on your client, handle incoming notifications, and send push messages.

## Documentation Index

To discover additional Ably documentation:

1. Fetch [llms.txt](https://ably.com/llms.txt) for the canonical list of available pages.
2. Identify relevant URLs from that index.
3. Fetch target pages as needed.

Avoid using assumed or outdated documentation paths.
