import api from '@/api/api'

export const editEmail = async (formData: { email: string }) => {
  try {
    const response = await api.post(
      `users/email/edit/`,
      { email: formData },
      {
        withAuth: true,
      },
    )
    return response.data
  } catch (error: any) {
    console.error(
      `users/email/edit request failed: `,
      error.response.data ?? error,
    )
    throw error
  }
}
