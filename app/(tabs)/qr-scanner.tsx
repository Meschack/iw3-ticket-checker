import { authClient } from '@/lib/auth-client'
import { ApplicationError, fetcher } from '@/lib/fetcher'
import { useIsFocused } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'

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
  const { edition } = useLocalSearchParams()
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
        params: { result: JSON.stringify(data), edition }
      })
    },
    onError: (error: ApplicationError<{ error: string }>) => {
      setState((prev) => ({ ...prev, error: error.info.error }))
    }
  })

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!state.scanned && edition) {
      if (mutation.error) mutation.reset()
      setState((prev) => ({ ...prev, scanned: true, qrValue: result.data }))
      mutation.mutate({ participant_id: result.data, edition_slug: edition as string })
    }
  }

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.replace('/(tabs)/sign-in')
    }
  }, [session, isPending, router])

  if (!edition) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Aucune édition sélectionnée !</Text>
        <Button
          title="Sélectionner une édition"
          onPress={() => router.replace('/(tabs)/edition-select')}
        />
      </View>
    )
  }

  if (isPending || !permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!session) {
    return null
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de votre permission pour afficher la caméra
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner un QR code</Text>
      <Text style={styles.edition}>Édition sélectionnée : {edition}</Text>
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
      </View>

      {mutation.isPending && <ActivityIndicator size="large" color="#007AFF" />}
      {state.error && mutation.error && <Text style={styles.errorMsg}>{state.error}</Text>}
      {state.scanned && (
        <Button
          title="Scanner un autre code"
          onPress={() => {
            setState((prev) => ({ ...prev, scanned: false, qrValue: null, error: undefined }))
          }}
        />
      )}

      <Button
        title="Changer d'édition"
        onPress={() => {
          setState((prev) => ({ ...prev, error: undefined, scanned: false, qrValue: null }))
          router.replace('/(tabs)/edition-select')
        }}
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
    padding: 24
  },
  message: { textAlign: 'center', paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  edition: { fontSize: 16, color: '#007AFF', marginBottom: 16 },
  cameraContainer: {
    width: 320,
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16
  },
  camera: { flex: 1 },
  qrText: { fontSize: 16, color: '#333', marginBottom: 12 },
  errorMsg: { color: 'red', marginBottom: 12, textAlign: 'center' },
  error: { color: 'red', marginBottom: 24, fontSize: 16 }
})

export default QRScannerScreen
