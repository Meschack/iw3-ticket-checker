import { Tabs } from 'expo-router'
import React from 'react'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Platform } from 'react-native'

import { FontAwesome } from '@expo/vector-icons'
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
          tabBarStyle: Platform.select({ ios: { position: 'absolute' } }),
          headerBackButtonDisplayMode: 'default',
          headerShadowVisible: false,
          headerBackgroundContainerStyle: { borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
          title: 'Impact Web 360',
          tabBarHideOnKeyboard: true,
          animation: 'fade'
        }}
      >
        <Tabs.Screen name="sign-in" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="result" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="qr-scanner" options={{ href: null, headerShown: false }} />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Éditions',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={18} name="calendar-check-o" color={color} />
            ),
            headerShown: true
            // tabBarAccessibilityLabel: 'Éditions'
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={20} name="person.crop.circle.fill" color={color} />
            ),
            headerShown: true
          }}
        />
      </Tabs>
    </QueryClientProvider>
  )
}
