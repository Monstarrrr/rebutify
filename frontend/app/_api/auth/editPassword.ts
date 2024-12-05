import api from '@/api/api'
import { AxiosResponse } from 'axios'

export const editPassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string
  newPassword: string
}): Promise<AxiosResponse> => {
  try {
    const res = await api.post(
      '/auth/edit-password',
      { requiresAuth: true },
      {
        data: { current_password: currentPassword, new_password: newPassword },
      },
    )
    return res
  } catch (error) {
    throw error
  }
}
