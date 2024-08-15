import { AppDataSource } from './data-source'
import { User } from './entity/User'
import { MOCK_SERVER_PORT } from './utils/config'
import mockApi from './app'
import swaggerDocs from 'routes/swagger'

// Load data
AppDataSource.initialize()
  .then(async () => {
    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
    console.log(users)
  })
  .catch((error) => console.log(error))

// Start the server
mockApi.listen(MOCK_SERVER_PORT, () => {
  console.log(`Server is running on ${MOCK_SERVER_PORT}`)
})
