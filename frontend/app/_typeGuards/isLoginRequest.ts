import { LoginRequest } from '@/types/auth/LoginRequest'

export function isLoginRequestType(data: any): data is LoginRequest {
  return typeof data.username === 'string' && typeof data.password === 'string'
}
