import api from '@/api/api'
import { AxiosResponse } from 'axios'

const endpoint = '/auth/users/set_password'

export const editPassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<AxiosResponse> => {
  try {
    const res = await api.post(
      endpoint,
      {
        new_password: newPassword,
        current_password: currentPassword,
      },
      {
        withAuth: true,
      },
    )
    return res
  } catch (error: any) {
    console.error(
      `❌ ${endpoint} request failed: `,
      error?.response?.data ?? error?.response ?? error,
    )
    throw error
  }
}
