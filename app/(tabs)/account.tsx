import { authClient } from '@/lib/auth-client'
import { useRouter } from 'expo-router'
import { Button, Image, StyleSheet, Text, View } from 'react-native'

const AccountScreen = () => {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.replace('/(tabs)/sign-in')
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    )
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Non connecté</Text>
      </View>
    )
  }

  const { user } = session

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon compte</Text>
      {user.image && <Image source={{ uri: user.image }} style={styles.avatar} />}
      <Text style={styles.label}>Nom :</Text>
      <Text style={styles.value}>{user.name}</Text>
      <Text style={styles.label}>Email :</Text>
      <Text style={styles.value}>{user.email}</Text>
      <Button title="Déconnexion" onPress={handleLogout} />
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
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 24 },
  label: { fontWeight: 'bold', marginTop: 8 },
  value: { marginBottom: 8 }
})

export default AccountScreen
