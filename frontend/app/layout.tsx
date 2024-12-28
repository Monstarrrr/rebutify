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

const LinkStyle = {
  marginLeft: '12px',
  color: '#fff',
  textDecoration: 'none',
}
const LinkLabel = { textDecoration: 'underline', fontStyle: 'normal' }

export default function RootLayout({ children }: PropsType) {
  return (
    <html lang='en'>
      <body className={inter.className} style={{ background: '#0f0f0f' }}>
        <StoreProvider>
          <ClientInitializer />
          <Header />
          <div className='mainPage-wrapper'>
            {children}
            <span
              style={{
                position: 'absolute',
                right: '12px',
                color: 'gray',
                fontStyle: 'italic',
                bottom: '0',
                display: 'contents',
              }}
            >
              Prototype (v0.1.0)
            </span>
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
            <div
              style={{
                opacity: 0.7,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              <span>Rebutify, {new Date().getFullYear()}.</span>

              <br />

              <Link
                style={LinkStyle}
                href='https://docs.google.com/document/d/1YD5JONwXirWWoSGQblhfEtk968Ux9Y2Sgw0Dd9XnpuI'
              >
                <span style={LinkLabel}>About</span>
              </Link>
              <Link style={LinkStyle} href='https://discord.gg/QHNutWjpHy'>
                <span style={LinkLabel}>Discord</span>
              </Link>
              <Link
                style={LinkStyle}
                href='https://github.com/Monstarrrr/rebutify'
              >
                <span style={LinkLabel}>Source Code</span>
              </Link>
              <Link style={LinkStyle} href='/privacy'>
                <span style={LinkLabel}>Privacy</span>
              </Link>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
