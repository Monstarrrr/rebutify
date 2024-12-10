'use client'
import React from 'react'

export default function ArgumentLayout({
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
