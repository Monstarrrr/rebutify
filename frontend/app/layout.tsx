import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/globals.css'
import StoreProvider from '@/store/Provider'
import { Header, ClientInitializer } from '@/components'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  description: '',
  title: 'Rebutify',
}

type PropsType = Readonly<{
  children: ReactNode
}>

export default function RootLayout({ children }: PropsType) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <StoreProvider>
          <ClientInitializer />
          <Header />
          <div
            style={{
              padding: '32px',
              minHeight: `calc(100dvh - 54px - 24px)`,
            }}
          >
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
