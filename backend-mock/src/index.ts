import { AppDataSource } from './data-source'
import { User } from './entity/User'
import { PORT } from './utils/config'
import mockApi from './app'
import swaggerDocs from '@/utils/swagger'

// Load data
AppDataSource.initialize()
  .then(async () => {
    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log(users)
  })
  .catch((error) => console.log(error))

// Start the server
mockApi.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
  swaggerDocs(mockApi, PORT)
})
