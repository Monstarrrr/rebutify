import api from '@/api/api'

// client side
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

// server side
export async function fetchPosts(type: string, query?: string) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/?type=${type}`
  if (query) {
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/arguments/search/?q=${query}`
  }
  console.log(`# url :`, url)
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      next: {
        tags: ['posts'],
      },
    })
    const data = await response.json()
    console.log(`# data :`, data)
    return data.results
  } catch (error: any) {
    console.error('❌ Error fetching posts: ', error)
  }
}
