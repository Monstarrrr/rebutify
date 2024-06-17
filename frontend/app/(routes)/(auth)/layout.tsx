import Header from '@/components/header'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      This is the auth layout :D ~
      <Header />
      <br />
      <br />
      {children}
    </div>
  )
}
