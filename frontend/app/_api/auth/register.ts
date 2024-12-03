import api from '@/api/api'

export const register = async (data: any) => {
  try {
    const response = await api.post('/auth/users/', { ...data })
    return response
  } catch (error: any) {
    console.error('# Register request failed: ', error.response.data ?? error)
    throw error
  }
}
