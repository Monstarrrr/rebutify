import api from '@/api/api'

export const getPosts = async () => {
  try {
    const response = await api.get('api/posts/')
    return response.data
  } catch (error: any) {
    console.error(
      '# "Get posts" request failed: ',
      error.response?.data?.detail ??
        error.response?.data ??
        error.response ??
        error,
    )
    throw error
  }
}
