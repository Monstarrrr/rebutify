'use client'
import React from 'react'
// eslint-disable-next-line no-restricted-imports
import styles from './layout.module.scss'

export default function ArgumentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={styles.container}>{children}</div>
}
