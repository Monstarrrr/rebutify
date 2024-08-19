import 'reflect-metadata'
import { DataSource } from 'typeorm'
import path = require('path')
import { allEntities } from './entity/allEntities'

// Pre-defined connection configuration to a database.
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database-mock.sqlite',
  synchronize: true,
  logging: false,
  // Load all entities from the entity directory.
  entities: allEntities,
  migrations: [],
  subscribers: [],
})
