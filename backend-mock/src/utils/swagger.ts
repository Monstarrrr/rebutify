import { Express, Request, Response } from 'express'
import swaggerJsdoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')
import { version } from '../../package.json'
import logger from './logger'
import { log } from 'console'

// Swagger options
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Mock API',
      // Version of the API from package.json
      version,
      description: 'A simple mock API for reference to the public API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Where the OpenAPI specs are located
  apis: ['src/routes/*.ts', 'src/schema/*.ts'],
}

// Initialize swagger-jsdoc with the options
const swaggerSpec = swaggerJsdoc(options)

// Export the swaggerDocs function
function swaggerDocs(mockApi: Express, port: number): void {
  // Swagger page
  mockApi.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Docs in JSON format
  mockApi.get('docs.json', (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  logger.info(
    `Swagger documentation is available at http://localhost:${port}/docs`,
  )
}

export default swaggerDocs
