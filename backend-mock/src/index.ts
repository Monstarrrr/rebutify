import mockApi from './app'
import { AppDataSource } from './data-source'
import { MOCK_SERVER_PORT } from '@/utils/config'
import { allEntities } from '@/utils/allEntities'
import { createDefaultEntities } from './utils/createDefaultEntities'

// Load data
AppDataSource.initialize()
  .then(async () => {
    console.log('Reset database...')
    allEntities.forEach(async (entity) => {
      await AppDataSource.manager.clear(entity.name)
    })

    let isCleared = true
    allEntities.forEach(async (entity) => {
      const count = await AppDataSource.getRepository(entity).count()
      if (count > 0) {
        isCleared = false
        console.error(`/!\\ Failed to clear data from entity: ${entity.name}`)
      }
    })

    if (isCleared) {
      console.log('Creating default data...')
      await createDefaultEntities(AppDataSource.manager)
    } else {
      console.error('Default data not created')
    }
  })
  .catch((error) => console.log(error))

// Start the server
mockApi.listen(MOCK_SERVER_PORT, () => {
  console.log(`Server is running on ${MOCK_SERVER_PORT}`)
})
