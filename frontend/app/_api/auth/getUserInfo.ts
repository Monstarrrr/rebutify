import api from '@/api/api'

export const getUserInfo = async () => {
  const res = await api.get('/auth/users/me')
  return res.data
}
