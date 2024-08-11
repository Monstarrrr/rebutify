import api from '@/api/api'

export const register = async (data: any) => {
  try {
    console.log('Register request started')
    const response = await api.post('/auth/users/', { ...data })
    console.log('Register request done')
    return response
  } catch (error: any) {
    console.error('# Register request failed: ', error.response.data ?? error)
    throw error
  }
}
