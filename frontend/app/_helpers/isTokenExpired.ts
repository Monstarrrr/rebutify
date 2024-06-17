import { jwtDecode } from 'jwt-decode'

export default function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode(token)
  const currentTime = Date.now() / 1000
  if (!decoded.exp) {
    throw new Error('Token has no expiration date')
  }
  return currentTime > decoded.exp
}
