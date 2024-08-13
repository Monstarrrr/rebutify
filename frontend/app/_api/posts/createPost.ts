import { FormDataObj } from '@/types'
import api from '@/api/api'

export const createPost = async (
  formData: FormDataObj,
  type: 'argument' | 'rebuttal' | 'comment',
  parentId?: string,
) => {
  try {
    const title = type === 'argument' ? formData.title : 'Some title' // temp fix
    const response = await api.post(
      'api/posts',
      {
        title, // temp fix
        ...formData,
        type,
        parentId,
      },
      {
        requiresAuth: true,
      },
    )
    return response.data
  } catch (error: any) {
    console.error('# "New post" request failed: ', error.response.data ?? error)
    throw error
  }
}
