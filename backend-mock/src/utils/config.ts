import * as dotenv from 'dotenv'
import swaggerJSDoc = require('swagger-jsdoc')
dotenv.config()

export const MOCK_SERVER_PORT = 3001
export const JWT_SECRET = process.env.MOCK_JWT_SECRET
export const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN
export const JWT_REFRESH_EXPIRES_IN = process.env.MOCK_JWT_REFRESH_EXPIRES_IN
export const corsHeaders = [
  { 'Access-Control-Allow-Origin': '*' },
  { 'Access-Control-Allow-Methods': '*' },
  { 'Access-Control-Allow-Headers': '*' },
]
