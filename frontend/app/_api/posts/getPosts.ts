import api from '@/api/api'

export const getPosts = async (
  type: 'argument' | 'rebuttal' | 'comment',
  parentId?: string,
) => {
  try {
    if (type !== 'argument' && parentId === undefined) {
      throw new Error(`parentId is required for getting ${type}s`)
    }
    const response = await api.get(`api/posts/`, {
      params: {
        parentId,
        type,
      },
      withAuth: true,
    })
    return response.data.results
  } catch (error: any) {
    console.error(
      '# "Get posts" request failed: ',
      error.response?.data?.detail ??
        error.response?.data ??
        error.response ??
        error,
    )
    throw error
  }
}
