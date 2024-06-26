import { FormDataObj } from '@/types'
import api from '@/api/api'

export const createPost = async (formData: FormDataObj) => {
  try {
    const response = await api.post('api/posts', {
      ...formData,
      type: 'argument',
    })
    return response.data
  } catch (error) {
    console.error('# "New post" request failed: ', error)
    throw error
  }
}
