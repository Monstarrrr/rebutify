// isTokenExpired.ts compares the current time with the token expiration date

import { jwtDecode } from 'jwt-decode'

export default function isTokenExpired(token: string): boolean {
  const decoded = jwtDecode(token)
  const currentTime = Date.now() / 1000

  if (!decoded.exp) {
    throw new Error('Token has no expiration date')
  } else {
    // log only the minutes and seconds of the current date and the expiration date
    console.log(
      'Current time: ',
      new Date(currentTime * 1000).toISOString().substr(14, 5),
    )
    console.log(
      'Token expiration: ',
      new Date(decoded.exp * 1000).toISOString().substr(14, 5),
    )
  }
  return currentTime > decoded.exp
}
