import { User } from 'entity/User'
import type { EntityManager } from 'typeorm'
import * as bcrypt from 'bcrypt'

export const createDefaultEntities = async (db: EntityManager) => {
  const createDefaultUsers = async (db: EntityManager) => {
    try {
      // Create an admin user
      const adminUser = new User()
      Object.assign(adminUser, {
        avatar: 'https://example.com/avatar.png',
        accessToken: null,
        bio: 'I am an admin',
        created: new Date(),
        email: 'monstar@email.com',
        password: await bcrypt.hash('Passw0rd123!', 10),
        reputation: 100,
        refreshToken: null,
        savedPosts: [{ id: 1 }],
        username: 'MonstarAdmin',
        verified: true,
      })
      await db.save(adminUser)

      // Create a regular user
      const regularUser = new User()
      Object.assign(regularUser, {
        avatar: 'https://example.com/avatar.png',
        accessToken: null,
        bio: 'I am an admin',
        created: new Date(),
        email: 'johndoe@email.com',
        password: await bcrypt.hash('Passw0rd123!', 10),
        reputation: 100,
        refreshToken: null,
        savedPosts: [{ id: 1 }],
        username: 'JohnDoe',
        verified: true,
      })
      await db.save(regularUser)

      // Create an unverified user
      const unverifiedUser = new User()
      Object.assign(unverifiedUser, {
        username: 'JohnSmith',
        bio: 'I am unverified',
        avatar: 'https://example.com/avatar.png',
        reputation: 100,
        created: new Date(),
        email: 'johnsmith@email.com',
        password: await bcrypt.hash('Passw0rd123!', 10),
        savedPosts: [{ id: 1 }],
        verified: false,
      })
      await db.save(unverifiedUser)

      console.log('✅ Default users created.')
    } catch (error) {
      console.log('✖️ Error creating default users.', error)
    }
  }
  createDefaultUsers(db)
}
