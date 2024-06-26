import api from '@/api/api'

export const getPosts = async () => {
  try {
    const response = await api.get('api/posts')
    return response.data
  } catch (error) {
    console.error('# "Get posts" request failed: ', error)
    throw error
  }
}
