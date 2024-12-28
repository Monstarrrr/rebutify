import api from '@/api/api'

export const requestPasswordReset = async (formData: { email: string }) => {
  try {
    const response = await api.post(
      '/auth/users/reset_password/',
      { email: formData.email },
      {
        requiresAuth: false,
      },
    )
    return response.data
  } catch (error: any) {
    console.error(
      `/auth/users/reset_password request failed: `,
      error.response?.data ?? error,
    )
    throw error
  }
}
