import { CustomButton } from '@/components/ui/Button'
import { authClient } from '@/lib/auth-client'
import { fetcher } from '@/lib/utils'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const API_URL = '/trpc/editions.calendar'

type Edition = {
  title: string
  start_date: string
  slug: string
  description: string
  location: string
}

const fetchEditions = async (): Promise<Edition[]> => {
  const res = await fetcher(API_URL)
  return res?.result?.data?.json || []
}

const EditionSelectScreen = () => {
  const router = useRouter()
  const { data: session, isPending, error } = authClient.useSession()
  const { edition } = useLocalSearchParams()
  const editions = useQuery<Edition[]>({ queryKey: ['editions'], queryFn: fetchEditions })

  useEffect(() => {
    if (edition) {
      router.replace({ pathname: '/(tabs)/qr-scanner', params: { edition: edition } })
    }
  }, [edition, router])

  const handleSelectEdition = (slug: string, title: string) => {
    router.replace({ pathname: '/(tabs)/qr-scanner', params: { slug, title } })
  }

  const renderEdition = ({ item }: { item: Edition }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectEdition(item.slug, item.title)}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.start_date}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <Text style={styles.cardLocation}>{item.location}</Text>
    </TouchableOpacity>
  )

  // Loading State
  if (isPending || editions.isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator size="large" color="#183376" />
          </View>
          <Text style={styles.loadingText}>Chargement des éditions...</Text>
          <Text style={styles.loadingSubtext}>Veuillez patienter un instant</Text>
        </View>
      </View>
    )
  }

  // Authentication Error State
  if (error || !session) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="lock-closed" size={64} color="#FF3B30" />
          </View>
          <Text style={styles.errorTitle}>Accès restreint</Text>
          <Text style={styles.errorText}>Vous devez vous connecter pour accéder aux éditions</Text>
          <CustomButton
            title="Se connecter"
            onPress={() => router.replace('/(tabs)/sign-in')}
            style={styles.authButton}
            icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
          />
        </View>
      </View>
    )
  }

  // API Error State
  if (editions.error) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="cloud-offline" size={64} color="#FF9500" />
          </View>
          <Text style={styles.errorTitle}>Erreur de connexion</Text>
          <Text style={styles.errorText}>
            Impossible de charger les éditions. Vérifiez votre connexion internet.
          </Text>
          <CustomButton
            title="Réessayer"
            onPress={() => editions.refetch()}
            style={styles.retryButton}
            icon={<Ionicons name="refresh" size={20} color="#fff" />}
          />
        </View>
      </View>
    )
  }

  // Empty State
  if (!editions.data || editions.data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="calendar-outline" size={64} color="#8E8E93" />
          </View>
          <Text style={styles.errorTitle}>Aucune édition disponible</Text>
          <Text style={styles.errorText}>Il n'y a actuellement aucune édition à afficher.</Text>
          <CustomButton
            title="Actualiser"
            onPress={() => editions.refetch()}
            style={styles.retryButton}
            icon={<Ionicons name="refresh" size={20} color="#fff" />}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sélectionnez une édition</Text>
        </View>

        <FlatList
          data={editions.data}
          keyExtractor={(item) => item.slug}
          renderItem={renderEdition}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune édition disponible</Text>
            </View>
          }
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  list: { paddingHorizontal: 24 },
  listContent: { flexGrow: 1, paddingVertical: 20, gap: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  fallbackContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center'
  },
  loadingSubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  authButton: { backgroundColor: '#183376', width: '80%', maxWidth: 300 },
  retryButton: { backgroundColor: '#FF9500', width: '80%', maxWidth: 300 },
  card: {
    backgroundColor: '#f7f7f7',
    borderColor: '#bbb',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    width: '100%'
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  cardDate: { fontSize: 14, color: '#183376', marginBottom: 4, fontWeight: '500' },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 4, lineHeight: 20 },
  cardLocation: { fontSize: 13, color: '#888', fontStyle: 'italic' }
})

export default EditionSelectScreen
