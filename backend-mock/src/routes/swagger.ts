import * as express from 'express'
import swaggerJsdoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')
import path = require('path')
import { version } from '../../package.json'

const swaggerRouter = express.Router()
console.log('here')
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
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  // Where the OpenAPI specs are located
  apis: ['src/controllers/*.ts'],
}

// Initialize swagger-jsdoc with the options
const swaggerSpec = swaggerJsdoc(options)

// Serve the Swagger UI
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default swaggerRouter
