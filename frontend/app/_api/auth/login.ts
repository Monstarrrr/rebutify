import { FormDataObj } from '@/types'
import api from '@/api/api'

export const login = async (formData: FormDataObj) => {
  try {
    // Request JWT access & refresh tokens
    const response = await api.post('/auth/jwt/create', {
      ...formData,
    })
    return response.data
  } catch (error: any) {
    console.error('# Login request failed: ', error.response.data ?? error)
    throw error
  }
}
