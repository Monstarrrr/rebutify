import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = 3002
export const JWT_SECRET = process.env.MOCK_JWT_SECRET
export const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN
export const JWT_REFRESH_EXPIRES_IN = process.env.MOCK_JWT_REFRESH_EXPIRES_IN
export const corsHeaders = [
  { 'Access-Control-Allow-Origin': '*' },
  { 'Access-Control-Allow-Methods': '*' },
  { 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
]
