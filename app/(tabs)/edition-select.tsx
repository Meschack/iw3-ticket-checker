import { authClient } from '@/lib/auth-client'
import { fetcher } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
  const { data: session, isPending } = authClient.useSession()
  const { edition } = useLocalSearchParams()
  const editions = useQuery<Edition[]>({ queryKey: ['editions'], queryFn: fetchEditions })

  useEffect(() => {
    if (isPending) return

    if (!session) {
      router.replace('/(tabs)/sign-in')
      return
    }
  }, [session, isPending, router])

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

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (editions.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (editions.error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Erreur lors du chargement des éditions</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez une édition</Text>
      <FlatList
        data={editions.data}
        keyExtractor={(item) => item.slug}
        renderItem={renderEdition}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 2, paddingBottom: 10 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 40
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f7f7f7',
    borderColor: '#bbb',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    width: 320
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  cardDate: { fontSize: 14, color: '#007AFF', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#444', marginBottom: 4 },
  cardLocation: { fontSize: 13, color: '#888' }
})

export default EditionSelectScreen
