import { authClient } from '@/lib/auth-client'
import { User } from '@/lib/types'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AccountScreen = () => {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.replace('/(tabs)/sign-in')
  }

  const openSocialLink = (url: string) => {
    Linking.openURL(url)
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={24} color="#666" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    )
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={48} color="#666" />
          <Text style={styles.errorText}>Non connecté</Text>
        </View>
      </View>
    )
  }

  const { user } = session
  const extendedUser = user as User

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={{ ...styles.avatarContainer, marginTop: 20 }}>
          {extendedUser.image ? (
            <Image source={{ uri: extendedUser.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
          )}
          {extendedUser.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{extendedUser.role}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{extendedUser.name}</Text>
        <Text style={styles.email}>{extendedUser.email}</Text>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <View style={styles.infoCard}>
          {extendedUser.first_name && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Prénom</Text>
                <Text style={styles.infoValue}>{extendedUser.first_name}</Text>
              </View>
            </View>
          )}
          {extendedUser.last_name && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nom</Text>
                <Text style={styles.infoValue}>{extendedUser.last_name}</Text>
              </View>
            </View>
          )}
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{extendedUser.email}</Text>
            </View>
          </View>
          <View style={{ ...styles.infoRow, borderBottomWidth: 0 }}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={extendedUser.emailVerified ? '#4CAF50' : '#FF9800'}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email vérifié</Text>
              <Text style={styles.infoValue}>{extendedUser.emailVerified ? 'Oui' : 'Non'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails du compte</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="id-card-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID utilisateur</Text>
              <Text style={styles.infoValue}>{extendedUser.id}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Créé le</Text>
              <Text style={styles.infoValue}>
                {new Date(extendedUser.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.infoRow, borderBottomWidth: 0 }}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Mis à jour le</Text>
              <Text style={styles.infoValue}>
                {new Date(extendedUser.updatedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description Section */}
      {extendedUser.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.infoCard}>
            <Text style={styles.descriptionText}>{extendedUser.description}</Text>
          </View>
        </View>
      )}

      {/* Social Links Section */}
      {extendedUser.socials && Object.keys(extendedUser.socials).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
          <View style={styles.infoCard}>
            {extendedUser.socials.facebook && (
              <TouchableOpacity
                style={styles.socialRow}
                onPress={() => openSocialLink(extendedUser.socials!.facebook!)}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
                <Ionicons name="open-outline" size={16} color="#666" />
              </TouchableOpacity>
            )}

            {extendedUser.socials.linkedin && (
              <TouchableOpacity
                style={styles.socialRow}
                onPress={() => openSocialLink(extendedUser.socials!.facebook!)}
              >
                <Ionicons name="logo-linkedin" size={24} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
                <Ionicons name="open-outline" size={16} color="#666" />
              </TouchableOpacity>
            )}

            {extendedUser.socials.instagram && (
              <TouchableOpacity
                style={styles.socialRow}
                onPress={() => openSocialLink(extendedUser.socials!.facebook!)}
              >
                <Ionicons name="logo-instagram" size={24} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
                <Ionicons name="open-outline" size={16} color="#666" />
              </TouchableOpacity>
            )}

            {extendedUser.socials.x && (
              <TouchableOpacity
                style={{ ...styles.socialRow, borderBottomWidth: 0 }}
                onPress={() => openSocialLink(extendedUser.socials!.x!)}
              >
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                <Text style={styles.socialText}>X (Twitter)</Text>
                <Ionicons name="open-outline" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Logout Section */}
      <View style={{ ...styles.section, marginBottom: 20 }}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', height: '100%' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  errorText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  roleBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff'
  },
  roleText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 16, color: '#666', marginBottom: 8 },
  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  infoContent: { flex: 1, marginLeft: 12 },
  infoLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  infoValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  descriptionText: { fontSize: 16, color: '#333', lineHeight: 24 },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  socialText: { flex: 1, fontSize: 16, color: '#333', marginLeft: 12 },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 }
})

export default AccountScreen
