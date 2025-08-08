import { CustomButton } from '@/components/ui/Button'
import { Typography } from '@/constants/Typography'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const ResultScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const result = params.result ? JSON.parse(params.result as string) : null
  const edition = params.edition as string

  if (!result) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          <Text style={styles.error}>Aucun résultat à afficher.</Text>
          <CustomButton
            title="Retour au scan"
            onPress={() => router.replace({ pathname: '/(tabs)/qr-scanner', params: { edition } })}
            style={styles.button}
            icon={<Ionicons name="arrow-back" size={20} color="#fff" />}
          />
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.successHeader}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
        </View>
        <Text style={styles.success}>Check-in réussi !</Text>
        <Text style={styles.timestamp}>{result.checked_at}</Text>
      </View>

      <View style={styles.infoBox}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{result.name}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{result.email}</Text>
            </View>
          </View>
        </View>

        {/* Ticket Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du ticket</Text>
          <View style={styles.infoRow}>
            <Ionicons name="ticket-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Type de ticket</Text>
              <Text style={styles.value}>{result.ticket}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Édition</Text>
              <Text style={styles.value}>{result.edition}</Text>
            </View>
          </View>
          <View style={{ ...styles.infoRow, borderBottomWidth: 0 }}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Heure d'arrivée</Text>
              <Text style={styles.value}>{result.checked_at}</Text>
            </View>
          </View>
        </View>
      </View>

      <CustomButton
        title="Scanner un autre code"
        onPress={() => router.replace({ pathname: '/(tabs)/qr-scanner', params: { edition } })}
        style={styles.button}
        icon={<Ionicons name="scan-outline" size={20} color="#fff" />}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { flexGrow: 1, alignItems: 'center', paddingVertical: 24 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successHeader: { alignItems: 'center', marginBottom: 24 },
  successIconContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#E8F0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  success: {
    fontSize: Typography.sizes.xxxl,
    fontFamily: Typography.fonts.default,
    color: '#4CAF50',
    fontWeight: Typography.weights.bold
  },
  timestamp: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.default,
    color: '#666',
    marginTop: 8
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden'
  },
  section: { paddingVertical: 16 },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.default,
    fontWeight: Typography.weights.bold,
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  infoContent: { flex: 1, marginLeft: 12 },
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.default,
    color: '#666',
    marginBottom: 2
  },
  value: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fonts.default,
    color: '#333',
    fontWeight: Typography.weights.medium
  },
  error: {
    color: '#FF3B30',
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.default,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
    marginVertical: 16
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '90%',
    maxWidth: 400
  }
})

export default ResultScreen
