import { PostType } from '@/types'
import api from '@/api/api'

export const vote = async (
  type: PostType,
  postId: string,
  direction: 'up' | 'down',
) => {
  try {
    if (!type || !postId || !direction) {
      throw new Error(
        `Missing required parameters: id = ${postId}, type = ${type}, direction = ${direction}`,
      )
    }
    const directionName = direction === 'up' ? 'upvote' : 'downvote'
    const response = await api.post(`/${type}/${postId}/${directionName}`)
    return response.data
  } catch (error: any) {
    console.error('# Vote request failed: ', error.response.data ?? error)
    throw error
  }
}
