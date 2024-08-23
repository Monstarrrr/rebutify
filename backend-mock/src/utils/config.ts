import * as dotenv from 'dotenv'
import swaggerJSDoc = require('swagger-jsdoc')
dotenv.config()

export const MOCK_SERVER_PORT = 3001
export const CLIENT_PORT = 3000
export const corsHeaders = [
  { 'Access-Control-Allow-Origin': '*' },
  { 'Access-Control-Allow-Methods': '*' },
  { 'Access-Control-Allow-Headers': '*' },
]
