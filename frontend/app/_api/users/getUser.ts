import api from '@/api/api'

export const getUser = async (id: string) => {
  try {
    const response = await api.get(`/auth/users/${id}`)
    return response.data
  } catch (error: any) {
    console.error(
      '# "Get user" request failed: ',
      error.response?.data?.detail ??
        error.response?.data ??
        error.response ??
        error,
    )
    throw error
  }
}
