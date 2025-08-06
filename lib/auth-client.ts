import { expoClient } from '@better-auth/expo/client'
import { createAuthClient } from 'better-auth/react'
import * as SecureStore from 'expo-secure-store'

const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: 'iw3ticketchecker',
      storagePrefix: 'iw3ticketchecker',
      storage: SecureStore
    })
  ]
})
