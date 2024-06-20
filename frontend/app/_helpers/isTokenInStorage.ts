import { Token } from '@/types'

export default function isTokenInStorage(tokenName: Token): Boolean {
  const token = localStorage.getItem(tokenName)
  return !!(token && token !== 'null' && token !== 'undefined')
}
