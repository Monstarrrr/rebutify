// clientInitializer fetches the user info and updates the store

'use client'
import { fetchUserInfo } from '@/api/auth'
import { useAppDispatch } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import { useEffect } from 'react'

export default function ClientInitializer() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const handleFetchUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo()
        dispatch(updateUser(userInfo))
      } catch (error: any) {
        console.error(
          'ClientInitializer error:',
          error?.response?.data?.detail ??
            error?.response?.data ??
            error?.response ??
            error,
        )
      }
    }
    if (
      // We only want to fetch the user info if they have logged in
      localStorage.getItem('access_token') ||
      localStorage.getItem('refresh_token')
    ) {
      handleFetchUserInfo()
    }
  }, [dispatch])
  return <></>
}
