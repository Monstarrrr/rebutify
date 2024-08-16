import mockApi from './app'
import { AppDataSource } from './data-source'
import { MOCK_SERVER_PORT } from '@/utils/config'
import { createDefaultUsers } from '@/utils/createDefaultUsers'
import { createDefaultPosts } from '@/utils/createDefaultPosts'
import { allEntities } from '@/utils/allEntities'

// Load data
AppDataSource.initialize()
  .then(async () => {
    console.log('Deleting all data...')
    allEntities.forEach(async (entity) => {
      await AppDataSource.manager.clear(entity.name)
    })

    let isCleared = true
    allEntities.forEach(async (entity) => {
      const count = await AppDataSource.getRepository(entity).count()
      if (count > 0) {
        isCleared = false
        console.error(`Failed to clear data from entity: ${entity}`)
      }
    })

    if (isCleared) {
      console.log('Creating default data...')
      await createDefaultUsers(AppDataSource.manager)
      await createDefaultPosts(AppDataSource.manager)
    } else {
      console.error('Default data not created')
    }
  })
  .catch((error) => console.log(error))

// Start the server
mockApi.listen(MOCK_SERVER_PORT, () => {
  console.log(`Server is running on ${MOCK_SERVER_PORT}`)
})
