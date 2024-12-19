import api from '@/api/api'

export const followPost = async (
  postId: string,
  postType: 'argument' | 'rebuttal',
  undo?: boolean,
) => {
  const endpoint = `api/${postType}s/${postId}/follow/${undo ? 'undo' : ''}`
  try {
    const response = await api.post(
      endpoint,
      {}, // no data sent
      {
        requiresAuth: true,
      },
    )
    return response.data
  } catch (error: any) {
    console.error(`${endpoint} request failed: `, error.response.data ?? error)
    throw error
  }
}
