import api from '@/api/api'

export const deletePost = async (id?: string) => {
  try {
    const response = await api.delete(`api/posts/${id}`, {
      withAuth: true,
    })
    return response.data
  } catch (error: any) {
    console.error(
      '# "Delete post" request failed: ',
      error.response.data ?? error,
    )
    throw error
  }
}
