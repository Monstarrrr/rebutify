import { FormDataObj } from '@/types'
import api from '@/api/api'

export const createPost = async (formData: FormDataObj) => {
  try {
    const response = await api.post(
      'api/posts',
      {
        ...formData,
        type: 'argument',
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
