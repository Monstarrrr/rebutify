'use client'
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const user = useAppSelector((state) => state.user.access)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])
  return (
    <>
      <h2>Welcome to Rebutify!</h2>
      <p></p>
    </>
  )
}
