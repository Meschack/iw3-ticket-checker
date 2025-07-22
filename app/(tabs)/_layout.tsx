import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({ ios: { position: 'absolute' }, default: {} })
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="sign-in" options={{ href: null }} />
      <Tabs.Screen name="result" options={{ href: null }} />
      <Tabs.Screen name="qr-scanner" options={{ href: null }} />
      <Tabs.Screen
        name="edition-select"
        options={{
          title: 'Éditions',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle.fill" color={color} />
          )
        }}
      />
    </Tabs>
  )
}
