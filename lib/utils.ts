import { BASE_API_URL } from '@/constants/urls'

interface ApplicationError extends Error {
  info: string
  status: number
}

export const fetcher = async (url: string) => {
  const res = await fetch(BASE_API_URL + url)

  console.info(`[FETCHER]: Request to ${BASE_API_URL + url}`)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as ApplicationError

    error.info = await res.json()
    error.status = res.status

    throw error
  }

  return res.json()
}
