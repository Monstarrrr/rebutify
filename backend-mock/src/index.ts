import { AppDataSource } from './data-source'
import { User } from './entity/User'
import { PORT } from './utils/config'
import mockApi from './app'

// Load data
AppDataSource.initialize()
  .then(async () => {
    console.log('Loading users from the database...')
    const users = await AppDataSource.manager.find(User)
  })
  .catch(error => console.log(error))

// Start the server
mockApi.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
