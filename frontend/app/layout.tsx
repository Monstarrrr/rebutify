import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/globals.css'
import StoreProvider from '@/store/Provider'
import { Header, ClientInitializer, Popup } from '@/components'
import { ReactNode } from 'react'
import Link from 'next/link'
// eslint-disable-next-line no-restricted-imports
import styles from './layout.module.scss'

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

const LinkLabel = { textDecoration: 'underline', fontStyle: 'normal' }

export default function RootLayout({ children }: PropsType) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <StoreProvider>
          <ClientInitializer />
          <Header />
          <Popup />
          <div className={styles.mainPageWrapper}>{children}</div>
          <footer className={styles.footer}>
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
                className={styles.link}
                href='https://docs.google.com/document/d/1YD5JONwXirWWoSGQblhfEtk968Ux9Y2Sgw0Dd9XnpuI'
              >
                <span style={LinkLabel}>About</span>
              </Link>
              <Link className={styles.link} href='https://discord.gg/NpUB93jsJy'>
                <span style={LinkLabel}>Discord</span>
              </Link>
              <Link
                className={styles.link}
                href='https://github.com/Monstarrrr/rebutify'
              >
                <span style={LinkLabel}>Source Code</span>
              </Link>
              <Link className={styles.link} href='/privacy'>
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
                Prototype (v0.1)
              </span>
            </div>

            <div
              className={styles.versionMirror}
              style={{ order: 1, visibility: 'hidden' }}
            >
              <span>Prototype (v0.1)</span>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  )
}
