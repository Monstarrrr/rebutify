import * as dotenv from 'dotenv'
import swaggerJSDoc = require('swagger-jsdoc')
import { version } from '../../package.json'
dotenv.config()

export const PORT = 3001
export const JWT_SECRET = process.env.MOCK_JWT_SECRET
export const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN
export const JWT_REFRESH_EXPIRES_IN = process.env.MOCK_JWT_REFRESH_EXPIRES_IN
export const corsHeaders = [
  { 'Access-Control-Allow-Origin': '*' },
  { 'Access-Control-Allow-Methods': '*' },
  { 'Access-Control-Allow-Headers': '*' },
]
export const swaggerOptions: swaggerJSDoc.Options = {
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
  apis: ['src/routes/*.ts', 'src/schema/*.ts', 'src/controllers/*.ts'],
}
