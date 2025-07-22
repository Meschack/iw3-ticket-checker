import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button, StyleSheet, Text, View } from 'react-native'

const ResultScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const result = params.result ? JSON.parse(params.result as string) : null
  const edition = params.edition as string

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Aucun résultat à afficher.</Text>
        <Button
          title="Retour au scan"
          onPress={() => router.replace({ pathname: '/(tabs)/qr-scanner', params: { edition } })}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.success}>✔️ Check-in réussi !</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.value}>{result.name}</Text>
        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{result.email}</Text>
        <Text style={styles.label}>Ticket :</Text>
        <Text style={styles.value}>{result.ticket}</Text>
        <Text style={styles.label}>Édition :</Text>
        <Text style={styles.value}>{result.edition}</Text>
        <Text style={styles.label}>Check-in à :</Text>
        <Text style={styles.value}>{result.checked_at}</Text>
      </View>
      <Button title="Scanner un autre code" onPress={() => router.navigate('/(tabs)/qr-scanner')} />
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
  success: { fontSize: 22, color: 'green', fontWeight: 'bold', marginBottom: 24 },
  infoBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  label: { fontWeight: 'bold', marginTop: 8 },
  value: { marginBottom: 8 },
  error: { color: 'red', marginBottom: 24, fontSize: 16 }
})

export default ResultScreen
