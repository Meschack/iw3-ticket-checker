import { BASE_API_URL } from '@/constants/urls'

export interface ApplicationError<T = string> extends Error {
  info: T
  status: number
}

class Fetcher {
  static async get<T = any>(url: string, options?: RequestInit) {
    const response = await fetch(BASE_API_URL + url, { ...options })

    console.info(`[FETCHER:GET]: Request to ${BASE_API_URL + url}`)

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.') as ApplicationError
      const data = await response.json()

      error.info = await response.json()
      error.status = response.status

      throw error
    }

    return response.json() as T
  }

  static async post<T = any>(url: string, data: any, options?: RequestInit) {
    const response = await fetch(BASE_API_URL + url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    })

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.') as ApplicationError<T>

      error.info = await response.json()
      error.status = response.status

      throw error
    }

    console.info(`[FETCHER:POST]: Request to ${BASE_API_URL + url}`)

    return response.json() as T
  }
}

export { Fetcher as fetcher }
