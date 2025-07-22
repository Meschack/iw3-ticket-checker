import { authClient } from '@/lib/auth-client'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'

const SplashScreen = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace('/(tabs)/sign-in')
    } else {
      const timeout = setTimeout(() => {
        router.replace('/(tabs)/edition-select')
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [router, session, isPending])

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 180, height: 180 }
})

export default SplashScreen
