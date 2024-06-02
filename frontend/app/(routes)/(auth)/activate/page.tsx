'use client'

import api from '@/app/_api/api'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Verify() {
  const [verificationError, setVerificationError] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const uid = searchParams.get('uid')

  useEffect(() => {
    let fetchApi = async () => {
      try {
        const { status } = await api.post(`/auth/users/activation`, {
          token,
          uid,
        })
        if (status >= 200 && status < 300) {
          router.push('/')
        }
      } catch (error: any) {
        setVerificationError(true)
      }
    }
    fetchApi()
  }, [router, token, uid])

  return (
    <div>
      {verificationError && (
        <div style={{ color: 'red' }}>
          The link is invalid and has likely expired, please try&nbsp;
          <Link href='/register'>resending the email.</Link>
        </div>
      )}
    </div>
  )
}
