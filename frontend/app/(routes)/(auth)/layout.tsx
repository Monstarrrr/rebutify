import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100dvh - 51px - 24px - 48px - 24px)',
        background: '#1f1f1f',
      }}
    >
      {children}
    </div>
  )
}
