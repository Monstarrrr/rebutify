import api from '@/api/api'
import { AxiosResponse } from 'axios'

export const register = async (data: any): Promise<AxiosResponse> => {
  try {
    const response = await api.post('/auth/users/', { ...data })
    return response
  } catch (error: any) {
    console.error('# Register request failed: ', error?.response ?? error)
    throw error?.response
  }
}
