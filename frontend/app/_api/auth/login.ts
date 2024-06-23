import { FormDataObj } from '@/types'
import api from '@/api/api'

export const login = async (formData: FormDataObj) => {
  try {
    // Request JWT access & refresh tokens
    const response = await api.post('/auth/jwt/create', {
      ...formData,
    })
    return response.data
  } catch (error) {
    console.error('# Login request failed: ', error)
    throw error
  }
}
