import jwtDecode from '@/helpers/jwtDecode'

export default function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode(token)
  console.log('# decoded JWT :', decoded)
  // Assuming 'exp' is the claim for expiration time
  const currentTime = Date.now() / 1000
  console.log('# currentTime :', currentTime)
  return currentTime > decoded.exp
}
