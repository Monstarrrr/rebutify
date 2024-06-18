import { isLoginRequestType } from '@/typeGuards/isLoginRequest'
import api from '@/api/api'

export const login = async (formData: unknown) => {
  try {
    // Check if the formData is a LoginRequest type
    if (isLoginRequestType(formData)) {
      // Request JWT access & refresh tokens
      const response = await api.post('/auth/jwt/create', {
        ...formData,
      })
      return response.data
    } else {
      throw new Error('formData must be a LoginRequest type.')
    }
  } catch (error) {
    console.error('# Login request aborted: ', error)
    throw error
  }
}
