import api from '@/api/api'

export const getPosts = async (
  type?: 'argument' | 'rebuttal' | 'comment',
  parentId?: string,
) => {
  try {
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

export async function fetchPosts(type: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/?type=${type}`,
    )
    const data = await response.json()
    return data.results
  } catch (error: any) {
    console.error('❌ Error fetching posts: ', error)
  }
}
