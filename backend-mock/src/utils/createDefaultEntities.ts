import { create } from 'domain'
import { Post } from 'entity/Post'
import { User } from 'entity/User'
import type { EntityManager } from 'typeorm'

export const createDefaultEntities = async (db: EntityManager) => {
  const createDefaultPosts = async (db: EntityManager) => {
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
  createDefaultPosts(db)

  const createDefaultUsers = async (db: EntityManager) => {
    try {
      const admin = new User()
      Object.assign(admin, {
        username: 'MockAdmin',
        email: 'admin@email.com',
        password: 'Password123!',
      })
      await db.save(admin)

      const user = new User()
      Object.assign(user, {
        username: 'JohnDoe',
        email: 'johndoe@email.com',
        password: 'Password123!',
      })
      await db.save(user)

      console.log('Default users created')
    } catch (error) {
      console.log('Error creating default users', error)
    }
  }
  createDefaultUsers(db)
}
