import { CustomButton } from '@/components/ui/Button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native'

const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    if (session) {
      router.replace('/(tabs)/edition-select')
    }
  }, [session, isPending, router])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    try {
      const response = await authClient.signIn.email({ email, password })

      if (response.error) {
        console.log(response.error)
        setError(JSON.stringify({ ...response.error, url }) || 'Erreur lors de la connexion')
        return
      }

      router.replace('/(tabs)/edition-select')
    } catch (e: any) {
      setError(JSON.stringify({ e, url }) || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)

    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    try {
      const response = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/(tabs)/edition-select'
      })

      if (response.error) {
        console.log(response.error)
        setError(JSON.stringify({ ...response.error, url }) || 'Erreur Google Sign-In')
        return
      }

      router.replace('/(tabs)/edition-select')
    } catch (e: any) {
      setError(JSON.stringify({ e, url }) || 'Erreur Google Sign-In')
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (session) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <CustomButton
        title={loading ? 'Connexion...' : 'Connexion'}
        onPress={handleLogin}
        disabled={loading}
      />

      <View style={{ height: 10 }} />

      <CustomButton onPress={handleGoogle} title="Connexion avec Google" disabled={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 32 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
  error: { color: 'red', marginBottom: 12 }
})

export default SignInScreen
