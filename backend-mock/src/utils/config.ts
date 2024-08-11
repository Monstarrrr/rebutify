import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.MOCK_API_PORT || 3000
export const BASE_URL = `http://localhost:${PORT}`
export const JWT_SECRET = process.env.MOCK_JWT_SECRET || 'klas73oh534dd3a'
export const JWT_EXPIRES_IN = process.env.MOCK_JWT_EXPIRES_IN || '1d'
export const JWT_REFRESH_EXPIRES_IN =
  process.env.MOCK_JWT_REFRESH_EXPIRES_IN || '1d'
