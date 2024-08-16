import { Post } from 'entity/Post'
import type { EntityManager } from 'typeorm'

export const createDefaultPosts = async (db: EntityManager) => {
  try {
    const post = new Post()
    Object.assign(post, {
      type: 'ARGUMENT',
      isPrivate: false,
      body: 'This is a default post',
      title: 'Default Post',
      ownerUserId: 1,
      parentId: null,
    })
    await db.save(post)
    console.log('Default post created')
  } catch (error) {
    console.log('Error creating default posts', error)
  }
}
