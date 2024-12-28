'use client'

import { ConfirmResetPassword } from '@/components'
import { Suspense } from 'react'

export default function ConfirmResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <ConfirmResetPassword />
    </Suspense>
  )
}
