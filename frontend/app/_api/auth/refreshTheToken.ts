import api from '@/api/api'

export const refreshTheToken = async (refreshToken: string) => {
  try {
    const response = await api.post('/auth/jwt/refresh', {
      refresh: refreshToken,
    })
    return response.data.access
  } catch (error: any) {
    console.error(
      '# Refresh request failed: ',
      error?.response?.data?.detail ??
        error?.response?.data ??
        error?.response ??
        error,
    )
    throw error
  }
}
