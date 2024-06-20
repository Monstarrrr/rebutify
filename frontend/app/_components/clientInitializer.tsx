'use client'
import { fetchUserInfo } from '@/api/auth'
import { useAppDispatch } from '@/store/hooks'
import { updateUser } from '@/store/slices/user'
import { useEffect } from 'react'

export default function ClientInitializer() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const handleFetchUserInfo = async () => {
      console.log('##### ClientInitializer')
      try {
        const userInfo = await fetchUserInfo()
        dispatch(updateUser(userInfo))
      } catch (error) {
        console.error('ClientInitializer error:', error)
      }
    }
    handleFetchUserInfo()
  }, [dispatch])
  return <></>
}
