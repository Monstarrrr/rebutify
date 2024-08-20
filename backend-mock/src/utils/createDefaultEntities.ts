import { create } from 'domain'
import { Post } from 'entity/Post'
import { User } from 'entity/User'
import type { EntityManager } from 'typeorm'
import * as bcrypt from 'bcrypt'

export const createDefaultEntities = async (db: EntityManager) => {
  const createDefaultUsers = async (db: EntityManager) => {
    try {
      // Create an admin user
      const adminUser = new User()
      Object.assign(adminUser, {
        username: 'MockAdmin',
        bio: 'I am an admin',
        avatar: 'https://example.com/avatar.png',
        reputation: 100,
        created: new Date(),
        email: 'admin@email.com',
        password: await bcrypt.hash('Passw0rd123!', 10),
        savedPosts: [{ id: 1 }],
      })
      await db.save(adminUser)

      // Create a regular user
      const regularUser = new User()
      Object.assign(regularUser, {
        username: 'JohnDoe',
        email: 'johndoe@email.com',
        password: await bcrypt.hash('Passw0rd123!', 10),
      })
      await db.save(regularUser)

      console.log('✅ Default users created.')
    } catch (error) {
      console.log('✖️ Error creating default users.', error)
    }
  }
  createDefaultUsers(db)
}
