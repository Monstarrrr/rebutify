'use client'

import { Activate } from '@/components'
import { Suspense } from 'react'

export default function Verify() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Activate />
    </Suspense>
  )
}
