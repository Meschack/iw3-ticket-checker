import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Platform } from 'react-native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({ ios: { position: 'absolute' } })
        }}
      >
        <Tabs.Screen name="index" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="sign-in" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="result" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="qr-scanner" options={{ href: null, headerShown: false }} />
        <Tabs.Screen
          name="edition-select"
          options={{
            title: 'Éditions',
            tabBarIcon: ({ color }) => <IconSymbol size={20} name="calendar" color={color} />,
            headerShown: false
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Compte',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={20} name="person.crop.circle.fill" color={color} />
            ),
            headerShown: false
          }}
        />
      </Tabs>
    </QueryClientProvider>
  )
}
