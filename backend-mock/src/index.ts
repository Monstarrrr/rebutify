import mockApi from './app'
import { AppDataSource } from './data-source'
import { MOCK_SERVER_PORT } from '@/utils/config'
import { allEntities } from 'entity/allEntities'
import { createDefaultUsers } from './utils/createDefaultUsers'
import { setDefaultPosts } from './utils/setDefaultPosts'

// Load data
AppDataSource.initialize()
  .then(async () => {
    let databaseError = false
    console.log('⏳ Reseting database...')
    for (const entity of allEntities) {
      await AppDataSource.getRepository(entity).clear()

      // Check if data was cleared
      const count = await AppDataSource.getRepository(entity).count()
      if (count > 0) {
        databaseError = true
        console.error(`/!\\ Failed to clear data from entity: ${entity.name}.`)
      }
    }
    if (!databaseError) {
      console.log('✅ Database successfully cleared.')
      console.log('⏳ Creating default data...')
      await createDefaultUsers(AppDataSource.manager)
      await setDefaultPosts()
    }
  })
  .catch((error) => console.log(error))

// Start the server
mockApi.listen(MOCK_SERVER_PORT, () => {
  console.log(`🏁 Server is running on ${MOCK_SERVER_PORT}`)
})
