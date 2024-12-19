import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/globals.css'
import StoreProvider from '@/store/Provider'
import { Header, ClientInitializer } from '@/components'
import { ReactNode } from 'react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  description: '',
  title: 'Rebutify',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/logo-white.png',
        href: '/images/logo-white.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/logo-black.png',
        href: '/images/logo-black.png',
      },
    ],
  },
}

type PropsType = Readonly<{
  children: ReactNode
}>

export default function RootLayout({ children }: PropsType) {
  return (
    <html lang='en'>
      <body className={inter.className} style={{ background: '#0f0f0f' }}>
        <StoreProvider>
          <ClientInitializer />
          <Header />
          <div
            style={{
              minHeight: `calc(100dvh - 54px - 24px)`,
            }}
          >
            {children}
          </div>
          <footer
            style={{
              background: '#1f1f1f',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px 0',
            }}
          >
            <span
              style={{
                opacity: 0.7,
                fontStyle: 'italic',
                marginRight: '6px',
                pointerEvents: 'none',
                textAlign: 'center',
              }}
            >
              Rebutify, {new Date().getFullYear()}.<br />
              <Link style={{ marginLeft: '6px', color: '#fff' }} href='/about'>About</Link>
              <Link style={{ marginLeft: '6px', color: '#fff' }} href='/contact'>Contact</Link>
              <Link style={{ marginLeft: '6px', color: '#fff' }} href='/ToS'>Terms of Service</Link>
            </span>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
