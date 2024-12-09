import { FormDataObj } from '@/types'
import api from '@/api/api'

export const createPost = async (
  formData: FormDataObj,
  type: 'argument' | 'rebuttal' | 'comment',
  parentId?: string,
) => {
  try {
    const title = type === 'argument' ? formData.title : 'Some Rebuttal title'
    const res = await api.post(
      'api/posts',
      {
        ...formData,
        title,
        type,
        parentId,
      },
      {
        requiresAuth: true,
      },
    )
    return res
  } catch (error: any) {
    console.error('# "New post" request failed: ', error.response.data ?? error)
    throw error
  }
}
