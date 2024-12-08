import api from '@/api/api'
import { AxiosResponse } from 'axios'

export const editPassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<AxiosResponse> => {
  try {
    const res = await api.post(
      '/auth/users/set_password',
      {
        new_password: newPassword,
        current_password: currentPassword,
      },
      {
        requiresAuth: true,
      },
    )
    return res
  } catch (error) {
    throw error
  }
}
