import api from '@/api/api'

export const deleteSelfAccount = async (current_password: string) => {
  try {
    const response = await api.delete(`auth/users/me`, {
      data: { current_password },
      requiresAuth: true,
    })
    return response.data
  } catch (error) {
    throw error
  }
}
