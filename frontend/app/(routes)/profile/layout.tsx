import React from 'react'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        padding: '32px',
      }}
    >
      {children}
    </div>
  )
}
