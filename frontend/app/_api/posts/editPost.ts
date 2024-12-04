import api from '@/api/api'

export const editPost = async (
  postType: 'argument' | 'rebuttal' | 'comment',
  postId: string,
  formData: { body: string; title?: string },
) => {
  try {
    const response = await api.post(`${postType}/${postId}/edit/`, formData, {
      requiresAuth: true,
    })
    return response.data
  } catch (error: any) {
    console.error('# "Edit post" request failed: ', error.response.data ?? error)
    throw error
  }
}
