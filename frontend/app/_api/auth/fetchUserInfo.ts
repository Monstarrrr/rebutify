import api from '@/api/api'

export const fetchUserInfo = async () => {
  const res = await api.get('/auth/users/me', { requiresAuth: true })
  return res.data
}
