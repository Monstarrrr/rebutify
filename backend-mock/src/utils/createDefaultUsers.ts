import { User } from 'entity/User'
import type { EntityManager } from 'typeorm'

export const createDefaultUsers = async (db: EntityManager) => {
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
