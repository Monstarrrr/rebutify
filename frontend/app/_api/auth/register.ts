import api from '@/api/api'

export const register = async (data: any) => {
  const res = await api.post('/auth/users', {
    ...data,
  })
  return res.data
}
