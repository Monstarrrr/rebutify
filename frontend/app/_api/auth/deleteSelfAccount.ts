import api from '@/api/api'

export const deleteSelfAccount = async (password: string) => {
  try {
    const response = await api.delete('auth/users/me', {
      data: {
        current_password: password,
      },
      requiresAuth: true,
    })
    return response.data
  } catch (error) {
    console.error('# "Delete account" request failed: ', error)
    throw error
  }
}
