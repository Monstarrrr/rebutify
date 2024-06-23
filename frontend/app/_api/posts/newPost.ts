import { FormDataObj } from '@/types'
import api from '@/api/api'

export const newPost = async (formData: FormDataObj) => {
  try {
    const response = await api.post('api/posts', {
      ...formData,
    })
    return response.data
  } catch (error) {
    console.error('# "New post" request failed: ', error)
    throw error
  }
}
