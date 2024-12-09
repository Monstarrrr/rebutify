import { AppDataSource } from 'data-source'
import { allPosts } from './allPosts'
import { defaultPostsAmount } from './config'

export const setDefaultPosts = async () => {
  try {
    console.log('⏳ Creating default posts...')
    const users = AppDataSource.getRepository('User')
    const johnAdmin = await users.findOne({ where: { username: 'JohnAdmin' } })
    const johnDoe = await users.findOne({ where: { username: 'JohnDoe' } })

    // Distribute the first 10 posts to be evenly owned by Monstar and JohnDoe
    allPosts.forEach(async (post, i) => {
      if (i < defaultPostsAmount) {
        if (i % 2 === 0) {
          post.ownerUserId = johnAdmin.id
        } else {
          post.ownerUserId = johnDoe.id
        }
      }
    })
    console.log('✅ Default posts created.')
  } catch (error) {
    console.log('✖️ Error setting default posts.', error)
  }
}
