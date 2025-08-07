export interface User {
  id: string
  email: string
  emailVerified: boolean
  name: string
  first_name?: string
  last_name?: string
  role?: string
  description?: string
  image?: string | null
  createdAt: Date
  updatedAt: Date
  socials?: { facebook?: string; x?: string; [key: string]: string | undefined }
}
