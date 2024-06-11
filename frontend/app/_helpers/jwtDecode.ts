type decodedJwt = {
  exp: number
  iat: number
  jti: string
  token_type: string
  user_id: number
}

export default function jwtDecode(token: string): decodedJwt {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
