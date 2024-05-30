import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      This is the auth layout :D ~ I am in every Auth pages
      <br />
      <br />
      {children}
    </div>
  )
}
