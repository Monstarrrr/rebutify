import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.MOCK_API_PORT || 3000
export const JWT_SECRET = process.env.MOCK_JWT_SECRET
export const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN
export const JWT_REFRESH_EXPIRES_IN = process.env.MOCK_JWT_REFRESH_EXPIRES_IN
export const corsHeaders = [
  { 'Access-Control-Allow-Origin': process.env.CLIENT_URL },
  { 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' },
  { 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
]
