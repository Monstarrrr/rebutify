import api from '@/api/api'

export const getPosts = async (
  self: Boolean | undefined = false,
  id: number | undefined,
) => {
  try {
    const endpoint = self ? 'api/posts/' : 'api/posts'
    const response = await api.get(endpoint)
    return response.data
  } catch (error) {
    console.error('# "Get posts" request failed: ', error)
    throw error
  }
}
