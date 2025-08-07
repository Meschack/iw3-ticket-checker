import { CustomButton } from '@/components/ui/Button'
import { authClient } from '@/lib/auth-client'
import { ApplicationError, fetcher } from '@/lib/fetcher'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'

interface State {
  scanned: boolean
  qrValue: string | null
  error?: string
}

type CheckInResponse =
  | {
      edition: string
      ticket: string
      created_at: string
      id: string
      name: string
      email: string
      phone: string | null
      is_checked_in: boolean
      checked_at: string
    }
  | { error: string }

interface CheckInParams {
  participant_id: string
  edition_slug: string
}

const checkIn = async ({ participant_id, edition_slug }: CheckInParams) => {
  const cookies = authClient.getCookie()

  const res = await fetcher.post<CheckInResponse>(
    '/check-in',
    { participant_id, edition_slug },
    { headers: { 'Content-Type': 'application/json', ...(cookies ? { Cookie: cookies } : {}) } }
  )

  return res
}

const QRScannerScreen = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [state, setState] = useState<State>({ scanned: false, qrValue: null })
  const cameraRef = useRef<CameraView | null>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const { slug, title } = useLocalSearchParams()
  const isFocused = useIsFocused()

  const mutation = useMutation({
    mutationFn: (params: CheckInParams) => checkIn(params),
    onSuccess: (data) => {
      if ('error' in data) {
        setState((prev) => ({ ...prev }))
      }
      setState({ scanned: false, qrValue: null })
      router.replace({
        pathname: '/(tabs)/result',
        params: { result: JSON.stringify(data), slug, title }
      })
    },
    onError: (error: ApplicationError<{ error: string }>) => {
      setState((prev) => ({ ...prev, error: error.info.error }))
    }
  })

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!state.scanned && slug) {
      if (mutation.error) mutation.reset()
      setState((prev) => ({ ...prev, scanned: true, qrValue: result.data }))
      mutation.mutate({ participant_id: result.data, edition_slug: slug as string })
    }
  }

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace('/(tabs)/sign-in')
    }
  }, [session, isPending, router])

  // No Edition Selected State
  if (!slug) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={64} color="#FF3B30" />
          </View>
          <Text style={styles.errorTitle}>Aucune édition sélectionnée</Text>
          <Text style={styles.errorText}>
            Veuillez sélectionner une édition pour commencer le scan
          </Text>
          <CustomButton
            title="Sélectionner une édition"
            onPress={() => router.replace('/(tabs)/edition-select')}
            style={styles.primaryButton}
            icon={<Ionicons name="calendar-outline" size={20} color="#fff" />}
          />
        </View>
      </View>
    )
  }

  // Loading State
  if (isPending || !permission) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator size="large" color="#183376" />
          </View>
          <Text style={styles.loadingText}>Chargement...</Text>
          <Text style={styles.loadingSubtext}>Vérification des permissions</Text>
        </View>
      </View>
    )
  }

  // Authentication Error State
  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="lock-closed" size={64} color="#FF3B30" />
          </View>
          <Text style={styles.errorTitle}>Accès restreint</Text>
          <Text style={styles.errorText}>Vous devez vous connecter pour accéder au scanner</Text>
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

  // Camera Permission Denied State
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="camera-outline" size={64} color="#FF9500" />
          </View>
          <Text style={styles.errorTitle}>Permission caméra requise</Text>
          <Text style={styles.errorText}>
            Nous avons besoin de votre permission pour accéder à la caméra et scanner les QR codes
          </Text>
          <CustomButton
            title="Autoriser la caméra"
            onPress={requestPermission}
            style={styles.retryButton}
            icon={<Ionicons name="camera" size={20} color="#fff" />}
          />
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Scanner un QR code</Text>
        <View style={styles.editionInfo}>
          <Ionicons name="calendar-outline" size={20} color="#183376" />
          <Text style={styles.edition}>{title}</Text>
        </View>
      </View>

      <View style={styles.cameraContainer}>
        {isFocused && (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onBarcodeScanned={state.scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        )}
        <View style={styles.cameraOverlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Positionnez le QR code dans le cadre</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {mutation.isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#183376" />
            <Text style={styles.processingText}>Traitement en cours...</Text>
          </View>
        )}

        {state.error && mutation.error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            <Text style={styles.errorMsg}>{state.error}</Text>
          </View>
        )}

        {state.scanned && (
          <CustomButton
            title="Scanner un autre code"
            onPress={() => {
              setState((prev) => ({ ...prev, scanned: false, qrValue: null, error: undefined }))
            }}
            style={styles.primaryButton}
            icon={<Ionicons name="scan-outline" size={20} color="#fff" />}
          />
        )}

        <CustomButton
          title="Changer d'édition"
          onPress={() => {
            setState((prev) => ({ ...prev, error: undefined, scanned: false, qrValue: null }))
            router.replace('/(tabs)/edition-select')
          }}
          style={styles.secondaryButton}
          icon={<Ionicons name="swap-horizontal-outline" size={20} color="#fff" />}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { flexGrow: 1, padding: 24 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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
  primaryButton: { backgroundColor: '#183376', width: '100%' },
  authButton: { backgroundColor: '#183376', width: '100%' },
  retryButton: { backgroundColor: '#FF9500', width: '100%' },
  secondaryButton: { backgroundColor: '#6B7280', width: '100%' },
  header: { alignItems: 'center', marginBottom: 24 },
  title: {
    fontSize: 24,
    paddingTop: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  editionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  edition: { fontSize: 16, fontWeight: '600', color: '#183376', marginLeft: 8 },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  camera: { flex: 1 },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#183376',
    borderRadius: 12,
    backgroundColor: 'transparent'
  },
  scanText: {
    position: 'absolute',
    bottom: -40,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  controlsContainer: { gap: 8, alignItems: 'center', width: '100%' },
  loadingContainer: { alignItems: 'center', paddingVertical: 16 },
  processingText: { marginTop: 8, fontSize: 14, color: '#666', textAlign: 'center' },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderColor: '#FF3B30',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: '100%',
    gap: 8
  },
  errorMsg: { color: '#FF3B30', fontSize: 14, fontWeight: '500' }
})

export default QRScannerScreen
