'use client'
import { AuthPageStyle } from '@/styles'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthPageStyle>{children}</AuthPageStyle>
}
