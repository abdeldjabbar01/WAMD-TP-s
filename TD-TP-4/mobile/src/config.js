import { Platform } from 'react-native'
import Constants from 'expo-constants'

// Which address should the app use to reach the backend?
// 1) EXPO_PUBLIC_API_URL if you set it manually.
// 2) In Expo Go: the same computer that serves the app (Expo's own dev-server
//    address), so the correct Wi-Fi IP is used automatically.
// 3) Fallback: 10.0.2.2 (Android emulator) or localhost.
const BACKEND_PORT = 5000

function guessUrl() {
  const hostUri = Constants.expoConfig?.hostUri // e.g. "192.168.43.101:8081"
  const host = hostUri ? hostUri.split(':')[0] : null
  if (host) return `http://${host}:${BACKEND_PORT}/api`
  return Platform.OS === 'android'
    ? `http://10.0.2.2:${BACKEND_PORT}/api`
    : `http://localhost:${BACKEND_PORT}/api`
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL || guessUrl()
