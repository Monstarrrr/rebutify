import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/globals.css'
import StoreProvider from '@/store/Provider'
import { Header, ClientInitializer } from '@/components'
import { ReactNode } from 'react'
import Link from 'next/link'
import styles from './layout.module.css'

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
  margin: '0 6px',
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
          <div className={styles.mainPageWrapper}>{children}</div>
          <footer
            className={styles.footer}
            style={{
              background: '#1f1f1f',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              alignItems: 'end',
            }}
          >
            <div
              style={{
                order: 2,
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

            <div style={{ order: 3 }}>
              <span
                style={{
                  color: 'gray',
                  fontStyle: 'italic',
                }}
              >
                Prototype (v0.1.0)
              </span>
            </div>

            <div
              className={styles.versionMirror}
              style={{ order: 1, visibility: 'hidden' }}
            >
              <span>Prototype (v0.1.0)</span>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
